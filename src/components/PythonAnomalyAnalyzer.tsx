import React, { useState, useMemo } from 'react';
import { Terminal, Sliders, ShieldAlert, Cpu, CheckCircle2, ChevronRight, Info, AlertOctagon, HelpCircle } from 'lucide-react';
import { AnomalyRecord, LogEntry, RawTransaction } from '../types';
import { INITIAL_ANOMALIES } from '../data';

interface PythonAnomalyAnalyzerProps {
  transactions: RawTransaction[];
  anomalyThresholdZ: number;
  setAnomalyThresholdZ: (val: number) => void;
  appendLog: (level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS', source: 'ETL' | 'VALIDATOR' | 'ANOMALY_ENGINE' | 'POWER_BI', message: string) => void;
}

export default function PythonAnomalyAnalyzer({
  transactions,
  anomalyThresholdZ,
  setAnomalyThresholdZ,
  appendLog
}: PythonAnomalyAnalyzerProps) {
  const [movingAveragePeriod, setMovingAveragePeriod] = useState<number>(3);
  const [isRunningScript, setIsRunningScript] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [notebookExecuted, setNotebookExecuted] = useState(true);

  // Dynamically calculate anomalies based on Z-score threshold
  const computedAnomalies = useMemo(() => {
    // We compute live anomalies from the transactions array
    // Let's model a simple statistical model on the client side:
    // 1. Group transactions by month
    const monthlySummary: { [month: string]: number } = {};
    transactions.forEach(t => {
      if (t.status === 'Completed') {
        const m = t.date.substring(0, 7);
        monthlySummary[m] = (monthlySummary[m] || 0) + t.amount;
      }
    });

    const months = Object.keys(monthlySummary).sort();
    const values = months.map(m => monthlySummary[m]);
    
    // Calculate mean and std dev
    const n = values.length;
    if (n === 0) return [];
    
    const mean = values.reduce((s, v) => s + v, 0) / n;
    const variance = values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    // Filter against threshold
    const anomalies: AnomalyRecord[] = [];
    
    // Add seed historical contextual descriptions
    months.forEach((m, idx) => {
      const val = monthlySummary[m];
      const diff = val - mean;
      const z = stdDev > 0 ? diff / stdDev : 0;
      
      if (Math.abs(z) >= anomalyThresholdZ) {
        // Build beautiful dynamic descriptive models
        const pctDiff = parseFloat(((diff / mean) * 100).toFixed(1));
        const isSpike = diff > 0;
        
        let segmentName = isSpike ? "Global / Multi-channel Billing Growth" : "Corporate / Invoicing Core Drop";
        let planImpact = isSpike 
          ? "Unanticipated aggregate billing spike. Over-leveraging this period leads to optimistic margin estimates."
          : "Severe pricing leakage or transaction drop. Undermines standard forecasting and violates SLA contracts.";
        let actionPlan = isSpike
          ? "Establish if contract represents recurring or isolated consulting services. Isolate from standard sales run-rate forecasts."
          : "Trigger automatic pipeline integrity checks. Review CRM databases for mismatched invoice records.";
        
        // Match specific known anomalies for detailed seed text
        if (m === '2025-05') {
          segmentName = "North America / Enterprise Services";
          planImpact = "Isolated cash flow spike. May 2025 features an extreme Enterprise billing push that skews H2 projection calculations.";
          actionPlan = "Investigate contract terms. Confirm recurring vs professional service hours split for revenue recognition.";
        } else if (m === '2025-08') {
          segmentName = "North America / On-Prem License";
          planImpact = "Extreme discount leakage detected under TX-1024. Standard license transacted at 96.6% below list values.";
          actionPlan = "Audit pricing engine parameters. Re-establish automated ceiling constraints for direct discount approvals.";
        } else if (m === '2026-03') {
          segmentName = "APAC / SMB Consulting";
          planImpact = "Capacity bottlenecks: high Consulting hours load requires immediate partner onboarding.";
          actionPlan = "Coordinate contract allocations. Adjust future sales forecasts for regional service deliveries.";
        }

        anomalies.push({
          id: `DYN-ANM-${idx}`,
          date: `${m}-15`, // midpoint representations
          segment: segmentName,
          actual_value: val,
          expected_value: Math.round(mean),
          deviation_percentage: pctDiff,
          z_score: parseFloat(z.toFixed(2)),
          risk_classification: Math.abs(z) > 2.8 ? 'High' : 'Medium',
          planning_impact: planImpact,
          action_plan: actionPlan
        });
      }
    });

    return anomalies.sort((a,b) => b.date.localeCompare(a.date));
  }, [transactions, anomalyThresholdZ]);

  const handleRunPythonAnalysis = () => {
    setIsRunningScript(true);
    appendLog('INFO', 'ANOMALY_ENGINE', `Recalculating outlier models with alpha z-score threshold: ${anomalyThresholdZ}...`);
    
    const logs = [
      `>>> import pandas as pd`,
      `>>> import numpy as np`,
      `>>> df = pd.DataFrame(load_pipeline_cache())`,
      `>>> # Calculating rolling moving average (Period: ${movingAveragePeriod} months)`,
      `>>> df['moving_avg'] = df['revenue'].rolling(window=${movingAveragePeriod}, min_periods=1).mean()`,
      `>>> # Running Z-Score outlier detection at threshold constraints (Alpha: ${anomalyThresholdZ})`,
      `>>> mean_rev, std_rev = df['revenue'].mean(), df['revenue'].std()`,
      `>>> df['z_score'] = (df['revenue'] - mean_rev) / std_rev`,
      `>>> outliers = df[df['z_score'].abs() >= ${anomalyThresholdZ}]`,
      `>>> print(f"Found {len(outliers)} statistical deviations in current timeseries.")`
    ];

    setConsoleOutput([]);
    let i = 0;
    
    // Staggered output simulation
    const interval = setInterval(() => {
      if (i < logs.length) {
        setConsoleOutput(prev => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setIsRunningScript(false);
        setNotebookExecuted(true);
        appendLog('SUCCESS', 'ANOMALY_ENGINE', `Isolated ${computedAnomalies.length} outliers using Python dynamic model.`);
      }
    }, 150);
  };

  const pythonNotebookCode = `import pandas as pd
import numpy as np

def detect_revenue_anomalies(df_transactions, z_threshold=${anomalyThresholdZ}):
    """
    Enforces statistical Z-Score thresholding to identify
    contract value drops, pricing leakages, or unpredicted contract spikes.
    """
    # 1. Monthly consolidation
    df_transactions['month'] = pd.to_datetime(df_transactions['date']).dt.to_period('M')
    monthly_sales = df_transactions.groupby('month')['amount'].sum().reset_index()
    
    # 2. Compute normal variance profile
    mean_sales = monthly_sales['amount'].mean()
    std_sales = monthly_sales['amount'].std()
    
    monthly_sales['z_score'] = (monthly_sales['amount'] - mean_sales) / std_sales
    
    # 3. Filter outliers
    anomalies = monthly_sales[monthly_sales['z_score'].abs() >= z_threshold]
    return anomalies, mean_sales, std_sales`;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      
      {/* LEFT COLUMN: INTERACTIVE STATISTICAL CONTROL PANEL */}
      <div className="xl:col-span-4 bg-paper border border-ink p-5 shadow-none space-y-6 height-fit rounded-none">
        
        <div className="flex items-center gap-2 border-b border-ink pb-3">
          <Sliders className="w-4 h-4 text-ink" />
          <h4 className="font-bold text-ink text-xs uppercase tracking-wider font-mono">Outlier Sensitivity Slate</h4>
        </div>

        {/* Z-SCORE RANGE CONTROL */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold font-mono tracking-wider text-ink/70 flex items-center gap-1">
              Z-Score Threshold (α)
              <HelpCircle className="w-3.5 h-3.5 text-ink/65 cursor-help" title="Standard deviations away from the historical mean revenue. Lower values increase trigger sensitivity." />
            </span>
            <span className="font-mono text-xs font-bold bg-ink text-canvas px-2 py-0.5 border border-ink">
              {anomalyThresholdZ.toFixed(2)}
            </span>
          </div>
          
          <input
            type="range"
            min="1.5"
            max="3.5"
            step="0.10"
            value={anomalyThresholdZ}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setAnomalyThresholdZ(val);
              setNotebookExecuted(false);
            }}
            className="w-full h-1 bg-ink appearance-none cursor-pointer accent-ink"
          />

          {/* Explanation dynamics */}
          <div className="bg-canvas border border-ink p-3 rounded-none text-[11px] leading-relaxed text-ink/90 font-mono">
            <div className="font-bold text-ink mb-1">
              {anomalyThresholdZ < 2.0 ? (
                <span className="text-amber-700 flex items-center gap-1">⚠️ High-Sensitivity Mode</span>
              ) : anomalyThresholdZ > 3.0 ? (
                <span className="text-slate-800 flex items-center gap-1">🛡️ Ultra-Conservative Mode</span>
              ) : (
                <span className="text-slate-800 flex items-center gap-1">✅ Standard Statistical Balance</span>
              )}
            </div>
            {anomalyThresholdZ < 2.0 && "Catches marginal fluctuations. Highly proactive but risks flagged warnings for ordinary seasonal variation."}
            {anomalyThresholdZ >= 2.0 && anomalyThresholdZ <= 3.0 && "Balanced configuration mapping 95.5% probability boundaries. Recommended setup for SLA audits."}
            {anomalyThresholdZ > 3.0 && "Surfaces only catastrophic pricing drops or massive enterprise account transitions (> 99% probability index)."}
          </div>
        </div>

        {/* PERIOD WINDOW RATIO CONTROL */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Rolling Period Window</span>
            <span className="font-mono text-xs font-bold text-slate-700">
              {movingAveragePeriod} Months
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-200/60 rounded-lg">
            {[3, 6, 9, 12].map(per => (
              <button
                key={per}
                onClick={() => {
                  setMovingAveragePeriod(per);
                  setNotebookExecuted(false);
                }}
                className={`text-[10px] py-1 rounded font-semibold transition ${
                  movingAveragePeriod === per
                    ? 'bg-white text-slate-900 shadow-3xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {per}M
              </button>
            ))}
          </div>
        </div>

        {/* PROCESS IMPROVEMENT TRIGGER BUTTON */}
        <button
          onClick={handleRunPythonAnalysis}
          disabled={isRunningScript}
          className="w-full flex items-center justify-center gap-2 bg-ink hover:opacity-85 text-canvas font-bold font-mono py-2.5 px-4 text-xs transition uppercase border border-ink rounded-none cursor-pointer"
        >
          <Cpu className="w-4 h-4 text-canvas" />
          <span>Execute Python Notebook</span>
        </button>

        {/* LOGICAL SLA ASSURANCE */}
        <div className="border border-ink p-3 text-[11px] text-ink/90 leading-normal bg-canvas font-mono">
          <div className="flex gap-2">
            <ShieldAlert className="w-4 h-4 text-ink shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-ink block">Proactive Risk Mitigation</span>
              <p className="text-[10px] text-ink/85 leading-relaxed">
                By programmatically flagging z-score anomalies, the business reduces manual bookkeeping review hours from 24h per cycle down to instant dashboard notifications.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: JUPYTER CELL WORKSPACE & FLAG REPORT */}
      <div className="xl:col-span-8 space-y-6">
        
        {/* JUPYTER CODE NOTEBOOK */}
        <div className="bg-ink border border-ink rounded-none overflow-hidden text-canvas">
          
          <div className="bg-ink px-4 py-3 border-b border-canvas/20 flex items-center justify-between font-mono">
            <div className="flex items-center gap-2">
              <span className="border border-canvas text-canvas text-[9px] font-bold px-1 uppercase">ipynb</span>
              <h5 className="font-bold text-canvas text-xs uppercase tracking-wider">revenue_anomaly_models.ipynb</h5>
            </div>
            
            <span className="text-[10px] text-canvas/70 font-mono">Kernel: Python 3.10 (Pandas/NumPy)</span>
          </div>

          <div className="p-5 space-y-4">
            
            {/* CELL 1 INPUT */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-canvas/50">In [14]:</div>
              <div className="relative bg-ink/80 p-4 font-mono text-[11px] text-canvas overflow-x-auto leading-relaxed border border-canvas/15 select-all rounded-none">
                <pre>{pythonNotebookCode}</pre>
              </div>
            </div>

            {/* CELL 1 OUTPUT / TERMINAL CONSOLE */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-canvas/50">Out [14]:</div>
              <div className="bg-[#141414] font-mono text-xs p-4 rounded-none border border-canvas/15 border-l-[3px] border-l-canvas text-[#D9D8D5]">
                {consoleOutput.length === 0 ? (
                  <div className="text-[#D9D8D5]/50 italic select-none">
                    {notebookExecuted ? (
                      <div>
                        <span className="text-canvas font-bold">✔ Output cache active. Outliers identified: {computedAnomalies.length} entries.</span>
                        <div className="text-canvas/70 mt-1">Adjust sensitivity sliders and click &ldquo;Execute Python Notebook&rdquo; to re-compile statistical kernels.</div>
                      </div>
                    ) : (
                      "Notebook state is dirty. Re-run cell to compile models."
                    )}
                  </div>
                ) : (
                  <div className="space-y-1 text-slate-200 text-left">
                    {consoleOutput.map((l, idx) => (
                      <div key={idx} className={l.startsWith('>>>') ? "text-slate-400" : "text-canvas font-bold"}>
                        {l}
                      </div>
                    ))}
                    {isRunningScript && <div className="text-canvas animate-pulse mt-1">&bull;&bull;&bull; Running Outlier Calculations...</div>}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* ISOLATED ANOMALIES & PLANNING RECOMMENDATIONS */}
        <div className="bg-paper border border-ink rounded-none overflow-hidden">
          
          <div className="bg-canvas px-4 py-3 border-b border-ink flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-ink">
              <AlertOctagon className="w-4 h-4 text-ink inline" />
              <h5 className="font-bold text-xs uppercase tracking-wider">Flagged Revenue Outliers & Remediation Actions</h5>
            </div>
            
            <span className="text-[10px] bg-ink text-canvas font-bold font-mono px-2 py-0.5 border border-ink">
              {computedAnomalies.length} Flags Detected
            </span>
          </div>

          <div className="p-4 space-y-4 max-h-[360px] overflow-y-auto bg-canvas text-ink">
            {computedAnomalies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-ink/50 font-mono">
                <CheckCircle2 className="w-8 h-8 text-ink mb-2 animate-pulse" />
                <span className="text-xs font-bold uppercase">Zero Anomaly Outliers Found</span>
                <p className="text-[10px] opacity-70 mt-1">
                  Current Z-score threshold is highly conservative. Lower it to catch more granular fluctuations.
                </p>
              </div>
            ) : (
              computedAnomalies.map(anom => (
                <div key={anom.id} className="border border-ink rounded-none bg-paper text-ink mb-2 overflow-hidden">
                  
                  {/* Top Bar item */}
                  <div className="bg-canvas px-4 py-3 border-b border-ink/45 flex flex-wrap items-center justify-between gap-2.5 font-mono text-xs font-bold text-ink">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 ${anom.risk_classification === 'High' ? 'bg-red-650' : 'bg-ink'}`} />
                      <span>{anom.date.substring(0,7)} Segment:</span>
                      <span className="opacity-80 font-bold">{anom.segment}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-canvas text-ink font-bold font-mono px-2 py-0.5 border border-ink">
                        {anom.risk_classification} Risk
                      </span>
                      <span className="font-mono text-xs font-bold text-ink">
                        {anom.deviation_percentage > 0 ? `+${anom.deviation_percentage}%` : `${anom.deviation_percentage}%`}
                      </span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    
                    {/* Column 1: Financial & planning impact */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-ink/75 uppercase tracking-wider block">Corporate Planning Impact</span>
                      <p className="text-ink/95 leading-relaxed bg-canvas border border-ink/30 p-2.5 rounded-none min-h-[50px] text-[11px]">
                        {anom.planning_impact || 'No immediate planning risks flagged.'}
                      </p>
                    </div>

                    {/* Column 2: Remediative Action Map */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-ink/75 uppercase tracking-wider block">Proactive Mitigation Steps</span>
                      <p className="text-ink/95 leading-relaxed bg-canvas border border-ink/30 p-2.5 rounded-none min-h-[50px] text-[11px]">
                        {anom.action_plan || 'Verify CRM database log entry fields manually.'}
                      </p>
                    </div>

                  </div>

                  {/* Bottom metrics */}
                  <div className="bg-paper border-t border-ink/20 px-4 py-2 flex justify-between items-center text-[10px] font-mono text-ink/65">
                    <span>Processed Value: ${anom.actual_value.toLocaleString()} (Mean: ${anom.expected_value.toLocaleString()})</span>
                    <span>Computed Z-Score: {anom.z_score}</span>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
