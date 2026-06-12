import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, AlertTriangle, Play, RefreshCw, Layers, CheckCircle2, 
  Settings, Database, HelpCircle, HardDriveDownload, Trash2, ShieldX, ChevronRight 
} from 'lucide-react';
import { ValidationRule, LogEntry, RawTransaction } from '../types';

interface DataValidationEngineProps {
  transactions: RawTransaction[];
  setTransactions: (txs: RawTransaction[]) => void;
  rules: ValidationRule[];
  setRules: (rules: ValidationRule[]) => void;
  accuracyScore: number;
  appendLog: (level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS', source: 'ETL' | 'VALIDATOR' | 'ANOMALY_ENGINE' | 'POWER_BI', message: string) => void;
  resetTransactionsBackup: () => void;
}

export default function DataValidationEngine({
  transactions,
  setTransactions,
  rules,
  setRules,
  accuracyScore,
  appendLog,
  resetTransactionsBackup
}: DataValidationEngineProps) {
  const [dirtyInjectedCount, setDirtyInjectedCount] = useState<number>(0);
  const [isProcessingScrub, setIsProcessingScrub] = useState<boolean>(false);

  // Toggle active rules
  const handleToggleRule = (id: string) => {
    const updated = rules.map(rule => {
      if (rule.id === id) {
        const nextState = !rule.enabled;
        appendLog(
          nextState ? 'INFO' : 'WARNING', 
          'VALIDATOR', 
          `Rule ${rule.name} has been ${nextState ? 'enabled' : 'disabled'} manually.`
        );
        return { ...rule, enabled: nextState };
      }
      return rule;
    });
    setRules(updated);
  };

  // Inject raw dirty data records to simulate validation quarantines
  const handleInjectDirtyData = () => {
    appendLog('WARNING', 'VALIDATOR', 'User injected 5 malformed financial records into the ETL ingestion queue.');
    
    const malformedRecords: RawTransaction[] = [
      {
        transaction_id: 'TX-ERR-501',
        date: '2026-06-30',
        product_id: '', // Blank product ID
        company_name: 'Starlight Tech Solutions',
        amount: 8000,
        region: 'EMEA',
        sector: 'Mid-Market',
        status: 'Completed',
        validation_status: 'Error',
        validation_logs: ['VAL-02: Blank column product_id. Empty fields rejected.']
      },
      {
        transaction_id: 'TX-ERR-502',
        date: '2025-11-15',
        product_id: 'PRD-01',
        company_name: 'Unknown Phantom Co', // Referential Integrity Failure
        amount: 15000,
        region: 'North America',
        sector: 'Enterprise',
        status: 'Completed',
        validation_status: 'Error',
        validation_logs: ['VAL-03: Company name Unknown Phantom Co is missing from Customer Registry. Key violation quarantined.']
      },
      {
        transaction_id: 'TX-ERR-503',
        date: '2026-03-24',
        product_id: 'PRD-03',
        company_name: 'BioGen Therapeutics',
        amount: -9500, // Negative amount
        region: 'EMEA',
        sector: 'Enterprise',
        status: 'Completed',
        validation_status: 'Error',
        validation_logs: ['VAL-05: Non-positive accounting amount detected. Quarantined.']
      },
      {
        transaction_id: 'TX-ERR-504',
        date: '2029-12-01', // Massive future date
        product_id: 'PRD-04',
        company_name: 'Acme Global Conglomerate',
        amount: 25000,
        region: 'North America',
        sector: 'Enterprise',
        status: 'Pending',
        validation_status: 'Warning',
        validation_logs: ['VAL-06: Date violates current business planning horizon boundaries. Warning issued.']
      },
      {
        transaction_id: 'TX-ERR-505',
        date: '2025-04-12',
        product_id: 'PRD-999', // Non-existent product ID
        company_name: 'Vortex Cloud Logistics',
        amount: 72000,
        region: 'APAC',
        sector: 'Enterprise',
        status: 'Completed',
        validation_status: 'Error',
        validation_logs: ['VAL-03: Mapped Product Code PRD-999 is missing from Catalog Schema definitions. Integrity fail.']
      }
    ];

    setTransactions([...transactions, ...malformedRecords]);
    setDirtyInjectedCount(prev => prev + 5);
    appendLog('ERROR', 'VALIDATOR', 'Lineage scanner identified raw integrity anomalies. 4 Records Quarantined. 1 Warning Issued.');
  };

  // Run scrub pipeline to restore data health
  const handleScrubAndProcess = () => {
    setIsProcessingScrub(true);
    appendLog('INFO', 'VALIDATOR', 'Initiated data cleaning loop. Scouring transactions dataset for quarantine rules...');
    
    setTimeout(() => {
      // Restore standard transactions backup
      resetTransactionsBackup();
      setDirtyInjectedCount(0);
      setIsProcessingScrub(false);
      appendLog('SUCCESS', 'VALIDATOR', 'Data Scrub fully resolved. Mismatched dimensions deleted, integrity ratios recovered to 100%. Data accuracy restored.');
    }, 800);
  };

  // Extract current violations lists
  const currentValidationIssues = useMemo(() => {
    const list: { id: string; txId: string; type: string; rule: string; log: string }[] = [];
    
    // Check normal dataset for warn triggers if certain rules are checked
    const ruleVal04 = rules.find(r => r.id === 'VAL-04');
    const ruleVal05 = rules.find(r => r.id === 'VAL-05');
    
    transactions.forEach(t => {
      // Collect inherent failures
      if (t.validation_logs && t.validation_logs.length > 0) {
        t.validation_logs.forEach(log => {
          list.push({
            id: `${t.transaction_id}-${log}`,
            txId: t.transaction_id,
            type: t.validation_status === 'Error' ? 'Critical Error' : 'Warning',
            rule: log.split(':')[0],
            log: log
          });
        });
      }
      
      // Look up standard discount violation
      if (t.transaction_id === 'TX-1024' && ruleVal05?.enabled) {
        list.push({
          id: 'TX-1024-discount',
          txId: 'TX-1024',
          type: 'Warning',
          rule: 'VAL-05',
          log: 'VAL-05: Out of bounds pricing drift. On-Prem unit pricing drops over 3 standard deviations from average list.'
        });
      }
    });

    return list;
  }, [transactions, rules]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT COLUMN: PIPELINE LINEAGE GRAPH */}
      <div className="lg:col-span-12 bg-paper border border-ink p-6 rounded-none shadow-none">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-ink pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-ink" />
              <h4 className="font-bold text-ink text-xs uppercase tracking-wider font-mono">End-to-End Data Quality Architecture</h4>
            </div>
            <p className="text-[10px] text-ink/75 font-mono mt-1">Data pipeline transformation stages enforcing logical rules for 95%+ dashboard SLA security.</p>
          </div>

          <div className="flex items-center gap-2 font-mono">
            {dirtyInjectedCount > 0 ? (
              <button
                onClick={handleScrubAndProcess}
                disabled={isProcessingScrub}
                className="flex items-center gap-1.5 bg-ink text-canvas hover:opacity-85 disabled:opacity-50 text-[10px] font-bold uppercase tracking-wider px-4 py-2 border border-ink rounded-none cursor-pointer transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessingScrub ? 'animate-spin' : ''}`} />
                Scrub & Recalculate
              </button>
            ) : (
              <button
                onClick={handleInjectDirtyData}
                className="flex items-center gap-1.5 bg-canvas hover:bg-paper border border-ink text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-none cursor-pointer transition"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-ink animate-pulse" />
                Inject Dirty Data Simulation
              </button>
            )}
          </div>
        </div>

        {/* LINEAGE FLOW VISUALIZER */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 relative items-center font-mono">
          
          {/* STEP 1 */}
          <div className="bg-canvas border border-ink p-4 text-center relative z-10 rounded-none">
            <span className="text-[9px] uppercase font-bold text-ink/65 block mb-1">Stage 01</span>
            <div className="w-8 h-8 bg-ink text-canvas flex items-center justify-center mx-auto mb-2 text-xs font-bold font-mono">CSV</div>
            <h5 className="font-bold text-ink text-xs uppercase font-bold">Raw Ingestion</h5>
            <p className="text-[10px] text-ink/75 mt-1">Extracts daily Salesforce billing files and CSV dumps.</p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex justify-center text-ink/40">
            <ChevronRight className="w-5 h-5 shrink-0" />
          </div>

          {/* STEP 2 */}
          <div className="bg-canvas border border-ink outline-[1.5px] outline-ink p-4 text-center relative z-10 rounded-none">
            <span className="text-[9px] uppercase font-bold text-ink block mb-1">Stage 02</span>
            <div className="w-8 h-8 bg-ink text-canvas flex items-center justify-center mx-auto mb-2"><Database className="w-4 h-4 text-canvas" /></div>
            <h5 className="font-bold text-ink text-xs uppercase font-bold">Schema Check</h5>
            <p className="text-[10px] text-ink/75 mt-1">Enforces non-null, correct typing, and matching columns.</p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex justify-center text-ink/40">
            <ChevronRight className="w-5 h-5 shrink-0" />
          </div>

          {/* STEP 3 */}
          <div className="bg-canvas border border-ink p-4 text-center relative z-10 rounded-none">
            <span className="text-[9px] uppercase font-bold text-ink/65 block mb-1">Stage 03</span>
            <div className="w-8 h-8 bg-ink text-canvas flex items-center justify-center mx-auto mb-2 font-mono text-xs font-bold font-bold">SQL</div>
            <h5 className="font-bold text-ink text-xs uppercase font-bold">ETL Transform</h5>
            <p className="text-[10px] text-ink/75 mt-1">Executes aggregates, product joins, and COGS calculations.</p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex justify-center text-ink/40">
            <ChevronRight className="w-5 h-5 shrink-0" />
          </div>

          {/* STEP 4 */}
          <div className="bg-canvas border border-ink p-4 text-center relative z-10 rounded-none">
            <span className="text-[9px] uppercase font-bold text-ink/65 block mb-1">Stage 04</span>
            <div className="w-8 h-8 bg-ink text-canvas flex items-center justify-center mx-auto mb-2"><Play className="w-3.5 h-3.5 translate-x-[1px] text-canvas" /></div>
            <h5 className="font-bold text-ink text-xs uppercase font-bold">Outliers Scan</h5>
            <p className="text-[10px] text-ink/75 mt-1">Calculates rolling mean variance and z-score constraints.</p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex justify-center text-ink/40">
            <ChevronRight className="w-5 h-5 shrink-0" />
          </div>

          {/* STEP 5 */}
          <div className="bg-ink text-canvas border border-ink p-4 text-center relative z-10 rounded-none">
            <span className="text-[9px] uppercase font-bold text-canvas/80 block mb-1">Stage 05</span>
            <div className="w-8 h-8 bg-canvas text-ink flex items-center justify-center mx-auto mb-2"><ShieldCheck className="w-4 h-4 text-ink" /></div>
            <h5 className="font-bold text-canvas text-xs uppercase font-bold">BI Cache</h5>
            <p className="text-[10px] text-[#D9D8D5] mt-1">Populates fully reactive dashboard reports with 95%+ accuracy.</p>
          </div>

        </div>

      </div>

      {/* RULES CHECKLIST SETTINGS */}
      <div className="lg:col-span-5 bg-paper border border-ink p-5 shadow-none space-y-4 rounded-none font-mono text-ink">
        
        <div className="flex items-center gap-2 border-b border-ink pb-3 justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-ink" />
            <h4 className="font-bold text-xs uppercase tracking-wider">Ingestion Rules Config</h4>
          </div>
          <span className="bg-ink text-canvas border border-ink text-[10px] px-2 py-0.5 font-bold">
            6 Checks Enforced
          </span>
        </div>

        <div className="space-y-3">
          {rules.map(rule => (
            <div 
              key={rule.id}
              className={`p-3 border transition rounded-none ${
                rule.enabled 
                  ? 'bg-canvas border-ink' 
                  : 'bg-paper/40 border-ink/25 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-1.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-bold px-1.5 py-0.2 border border-ink bg-ink text-canvas">
                      {rule.category}
                    </span>
                    <span className="text-xs font-bold text-ink">{rule.name}</span>
                  </div>
                  <p className="text-[10px] text-ink/80 leading-normal">{rule.description}</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => handleToggleRule(rule.id)}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-paper border border-ink peer-checked:after:translate-x-full peer-checked:after:border-ink after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-ink after:rounded-none after:h-3 after:w-3 after:transition-all peer-checked:bg-ink"></div>
                </label>
              </div>

              {/* Sub-label showing severity alert */}
              <div className="flex justify-between items-center text-[9px] text-ink/65 font-mono mt-2 pt-1.5 border-t border-ink/20">
                <span>Rule Index: {rule.id}</span>
                <span className={rule.severity === 'Critical' ? "text-red-755 font-bold" : "text-ink/80"}>
                  Action: {rule.severity === 'Critical' ? "Quarantine Row" : "Log Warning"}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* REAL-TIME VALIDATION VIOLATIONS REPORT */}
      <div className="lg:col-span-7 bg-paper border border-ink p-5 shadow-none flex flex-col min-h-[440px] rounded-none">
        
        <div className="flex justify-between items-center border-b border-ink pb-3 mb-4 font-mono text-ink">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-ink" />
            <h4 className="font-bold text-xs uppercase tracking-wider">ETL Automated Violations & Quarantine</h4>
          </div>
          
          <span className="bg-ink text-canvas font-mono text-[10px] font-bold px-2.5 py-0.5 border border-ink">
            Global Accuracy: {accuracyScore}%
          </span>
        </div>

        {/* Violations List container */}
        <div className="flex-1 overflow-y-auto max-h-[360px] space-y-2 pr-1 font-mono text-ink">
          {currentValidationIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-ink/75 text-center py-20">
              <CheckCircle2 className="w-8 h-8 text-ink mb-2 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">No Quarantine Violations Surfaced</span>
              <p className="text-[10px] opacity-70 mt-1 max-w-xs leading-relaxed">
                End-to-end schemas are fully validated. To run a trial drill, click &ldquo;Inject Dirty Data Simulation&rdquo; above.
              </p>
            </div>
          ) : (
            currentValidationIssues.map(issue => (
              <div 
                key={issue.id}
                className={`p-3 border flex gap-3 text-xs justify-between rounded-none ${
                  issue.type === 'Critical Error'
                    ? 'bg-paper border-ink'
                    : 'bg-canvas border-ink/65'
                }`}
              >
                <div className="flex gap-2.5 items-start">
                  {issue.type === 'Critical Error' ? (
                    <ShieldX className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                  )}
                  
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] font-bold uppercase px-1.5 ${
                        issue.type === 'Critical Error' 
                          ? 'bg-ink text-canvas border border-ink' 
                          : 'bg-canvas text-ink border border-ink'
                      }`}>
                        {issue.type}
                      </span>
                      <span className="font-bold text-ink text-[11px]">Tx Ref: #{issue.txId}</span>
                    </div>
                    <p className="text-[10px] text-ink/85 mt-1 leading-relaxed">{issue.log}</p>
                  </div>
                </div>

                <div className="text-right text-[10px] text-ink/50 whitespace-nowrap shrink-0">
                  Rule: {issue.rule}
                </div>
              </div>
            ))
          )}
        </div>

        {/* BOTTOM REPROCESS BANNER */}
        {dirtyInjectedCount > 0 && (
          <div className="mt-4 bg-[#111111] text-canvas p-3.5 flex justify-between items-center flex-wrap gap-2.5 rounded-none border border-ink font-mono shadow-xs">
            <div className="space-y-0.5 text-xs text-left">
              <span className="font-bold text-canvas uppercase block tracking-wider">Dirty Buffer Detected</span>
              <p className="text-[10px] text-[#D9D8D5]/80 leading-normal">Anomaly records entered pipeline logs. Core financial matrix accuracy is vulnerable.</p>
            </div>
            
            <button
              onClick={handleScrubAndProcess}
              disabled={isProcessingScrub}
              className="bg-canvas text-ink font-bold hover:opacity-85 text-[10px] font-mono uppercase tracking-wider py-1.5 px-3 border border-ink rounded-none cursor-pointer"
            >
              Scrub Financial Matrix
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
