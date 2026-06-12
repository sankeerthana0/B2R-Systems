import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart2, Database, Cpu, ShieldCheck, Terminal, Clock, User, 
  ChevronDown, ChevronUp, BellRing, Settings, RefreshCw, Layers 
} from 'lucide-react';
import { RawTransaction, ProductCatalog, CustomerRegistry, ValidationRule, LogEntry } from './types';
import { 
  INITIAL_TRANSACTIONS, 
  INITIAL_PRODUCTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_VALIDATION_RULES, 
  INITIAL_LOGS 
} from './data';

import BiDashboard from './components/BiDashboard';
import SqlEtlWorkspace from './components/SqlEtlWorkspace';
import PythonAnomalyAnalyzer from './components/PythonAnomalyAnalyzer';
import DataValidationEngine from './components/DataValidationEngine';

export default function App() {
  // Global React state containing dataset references
  const [transactions, setTransactions] = useState<RawTransaction[]>(INITIAL_TRANSACTIONS);
  const [rules, setRules] = useState<ValidationRule[]>(INITIAL_VALIDATION_RULES);
  const [anomalyThresholdZ, setAnomalyThresholdZ] = useState<number>(2.75);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  
  // Tab control state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'etl' | 'python' | 'validation'>('dashboard');
  
  // Collapsible Console panel state
  const [isConsoleExpanded, setIsConsoleExpanded] = useState<boolean>(false);
  const [systemAlertCount, setSystemAlertCount] = useState<number>(3);

  // Auto-scroller for console logs
  useEffect(() => {
    if (isConsoleExpanded) {
      const el = document.getElementById('console-log-scroll');
      if (el) el.scrollTop = el.scrollHeight;
    }
  }, [logs, isConsoleExpanded]);

  // Append logs function
  const appendLog = (
    level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS', 
    source: 'ETL' | 'VALIDATOR' | 'ANOMALY_ENGINE' | 'POWER_BI', 
    message: string
  ) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const newLog: LogEntry = { timestamp, level, source, message };
    setLogs(prev => [...prev, newLog]);
    
    // Increment alerts if warning or error
    if (level === 'WARNING' || level === 'ERROR') {
      setSystemAlertCount(c => c + 1);
    }
  };

  // Reset transactions backup
  const resetTransactionsBackup = () => {
    setTransactions(INITIAL_TRANSACTIONS);
  };

  // Dynamic Validation Accuracy Index calculation
  const accuracyScore = useMemo(() => {
    const totalCount = transactions.length;
    if (totalCount === 0) return 100.0;
    
    const validCount = transactions.filter(t => t.validation_status === 'Valid').length;
    const rawAccuracy = (validCount / totalCount) * 100;
    
    // Penalty representing disabled checks
    const disabledChecks = rules.filter(r => !r.enabled).length;
    const penaltyValue = disabledChecks * 1.5;
    
    return parseFloat(Math.max(10, Math.min(100, rawAccuracy - penaltyValue)).toFixed(1));
  }, [transactions, rules]);

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between font-sans selection:bg-ink selection:text-canvas">
      
      {/* 1. MASTER SITE HEADER */}
      <header id="site-header" className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-4 border-b border-ink bg-canvas sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-ink flex items-center justify-center shrink-0">
            <div className="w-4 h-4 bg-canvas"></div>
          </div>
          <div>
            <h1 className="text-xs font-bold uppercase tracking-widest text-ink">Business Reporting & Revenue Analytics System</h1>
            <p className="text-[10px] font-serif-italic text-ink/75">v2.4.0 // SQL ETL Pipeline Active</p>
          </div>
        </div>
        <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-8 text-right mt-3 md:mt-0">
          <div className="border-l border-ink pl-4 text-left">
            <p className="text-[9px] uppercase opacity-50 font-bold">Data Accuracy</p>
            <p className="font-mono text-base md:text-lg font-bold">{accuracyScore}%</p>
          </div>
          <div className="border-l border-ink pl-4 text-left font-mono">
            <p className="text-[9px] uppercase opacity-50 font-bold">Pipeline Health</p>
            <p className="text-base md:text-lg font-bold">OPTIMAL</p>
          </div>
          <div className="border-l border-ink pl-4 text-left">
            <p className="text-[9px] uppercase opacity-50 font-bold">System Date</p>
            <p className="font-mono text-base md:text-lg uppercase">12 JUN 2026</p>
          </div>
        </div>
      </header>

      {/* 2. TAB CONTROL NAVIGATION */}
      <nav id="site-navigation" className="border-b border-ink bg-paper select-none">
        <div className="flex flex-wrap items-stretch overflow-x-auto">
          
          <button
            id="tab-dashboard"
            onClick={() => {
              setActiveTab('dashboard');
              appendLog('INFO', 'POWER_BI', 'Report Splicer changed workspace focus to Master visualizations.');
            }}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-mono border-r border-b md:border-b-0 border-ink transition duration-150 whitespace-nowrap cursor-pointer uppercase tracking-wider ${
              activeTab === 'dashboard'
                ? 'bg-ink text-canvas font-bold'
                : 'text-ink hover:bg-ink/10 font-bold'
            }`}
          >
            📊 PBI Report Mockup
          </button>

          <button
            id="tab-etl"
            onClick={() => {
              setActiveTab('etl');
              appendLog('INFO', 'ETL', 'Workspace focus changed to SQL Pipeline query panel.');
            }}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-mono border-r border-b md:border-b-0 border-ink transition duration-150 whitespace-nowrap cursor-pointer uppercase tracking-wider ${
              activeTab === 'etl'
                ? 'bg-ink text-canvas font-bold'
                : 'text-ink hover:bg-ink/10 font-bold'
            }`}
          >
            🛢️ SQL ETL Workspace
          </button>

          <button
            id="tab-python"
            onClick={() => {
              setActiveTab('python');
              appendLog('INFO', 'ANOMALY_ENGINE', 'Workspace focus changed to Jupyter Anomaly Jupyter Notebook.');
            }}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-mono border-r border-b md:border-b-0 border-ink transition duration-150 whitespace-nowrap cursor-pointer uppercase tracking-wider ${
              activeTab === 'python'
                ? 'bg-ink text-canvas font-bold'
                : 'text-ink hover:bg-ink/10 font-bold'
            }`}
          >
            🐍 Python Outlier Notebook
          </button>

          <button
            id="tab-validation"
            onClick={() => {
              setActiveTab('validation');
              appendLog('INFO', 'VALIDATOR', 'Workspace focus changed to Lineage Integrity rules.');
            }}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-mono border-r border-ink transition duration-150 whitespace-nowrap cursor-pointer uppercase tracking-wider ${
              activeTab === 'validation'
                ? 'bg-ink text-canvas font-bold'
                : 'text-ink hover:bg-ink/10 font-bold'
            }`}
          >
            ✅ Ingestion Rules & Validation
          </button>

        </div>
      </nav>

      {/* 3. CORE CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-24">
        
        {activeTab === 'dashboard' && (
          <BiDashboard 
            transactions={transactions} 
            products={INITIAL_PRODUCTS} 
            customers={INITIAL_CUSTOMERS} 
            accuracyScore={accuracyScore}
            anomalyThresholdZ={anomalyThresholdZ}
          />
        )}

        {activeTab === 'etl' && (
          <SqlEtlWorkspace 
            transactions={transactions}
            products={INITIAL_PRODUCTS}
            customers={INITIAL_CUSTOMERS}
            onTriggerDashboardUpdate={(updated) => {
              setTransactions(updated);
              appendLog('SUCCESS', 'POWER_BI', 'Loaded unified ETL tables view models into dashboard reports cache.');
            }}
            appendLog={appendLog}
          />
        )}

        {activeTab === 'python' && (
          <PythonAnomalyAnalyzer 
            transactions={transactions}
            anomalyThresholdZ={anomalyThresholdZ}
            setAnomalyThresholdZ={setAnomalyThresholdZ}
            appendLog={appendLog}
          />
        )}

        {activeTab === 'validation' && (
          <DataValidationEngine 
            transactions={transactions}
            setTransactions={setTransactions}
            rules={rules}
            setRules={setRules}
            accuracyScore={accuracyScore}
            appendLog={appendLog}
            resetTransactionsBackup={resetTransactionsBackup}
          />
        )}

      </main>

      {/* 4. REAL-TIME COLLAPSIBLE SYSTEM LOG TERMINAL BAR */}
      <footer className="fixed bottom-0 left-0 right-0 bg-ink border-t border-ink text-canvas z-40 transition-all duration-300">
        
        {/* Toggle Head bar */}
        <div 
          onClick={() => setIsConsoleExpanded(!isConsoleExpanded)}
          className="bg-ink px-6 py-2.5 flex items-center justify-between text-[11px] cursor-pointer select-none border-b border-canvas/20"
        >
          <div className="flex items-center gap-3 font-mono">
            <Terminal className="w-4 h-4 text-canvas shrink-0" />
            <span className="font-bold tracking-widest text-[#E4E3E0]">ACTIVE PIPELINE TRANSFORMATION SHELL</span>
            <span className="h-2 w-2 rounded-full bg-canvas animate-pulse" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-bold text-canvas">
              <span>SLA Health Index:</span>
              <span className="font-mono px-2 py-0.5 border border-canvas text-[11px] bg-canvas text-ink font-bold">
                {accuracyScore}%
              </span>
            </div>

            <div className="text-canvas hover:opacity-80 transition">
              {isConsoleExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Console Logs panel drawer */}
        {isConsoleExpanded && (
          <div className="bg-ink p-4 font-mono text-[10px] leading-relaxed select-all">
            <div className="flex justify-between items-center text-canvas/50 border-b border-canvas/10 pb-2 mb-2">
              <span>Standard Diagnostics (STD_OUT)</span>
              <span>Scroll Log History</span>
            </div>
            
            <div id="console-log-scroll" className="max-h-40 overflow-y-auto space-y-1 text-left pr-1 scroll-smooth">
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-canvas/50">[{log.timestamp}]</span>
                  <span className="font-bold truncate max-w-[120px] text-canvas">
                    [{log.source}]
                  </span>
                  <span className="font-extrabold px-1 border border-canvas/30 text-[9px] text-canvas">
                    {log.level}
                  </span>
                  <span className="text-canvas/80 font-mono">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* High Density footer metadata row */}
        <div className="h-8 border-t border-canvas/20 flex items-center px-6 justify-between bg-ink text-canvas/80 font-mono text-[9px] uppercase tracking-[0.2em]">
          <span>Server Status: Operational</span>
          <span>Auth: keerthiverneni@gmail.com</span>
          <span className="hidden sm:inline">Session Time: 04:22:12</span>
        </div>

      </footer>

    </div>
  );
}
