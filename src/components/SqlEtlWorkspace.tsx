import React, { useState } from 'react';
import { Database, Play, Code, CheckCircle2, Terminal, Info, ChevronDown, ListFilter, RefreshCw } from 'lucide-react';
import { RawTransaction, ProductCatalog, CustomerRegistry, EtlPipelineQuery, LogEntry } from '../types';
import { ETL_PIPELINES, executeSimpleMockSql } from '../data';

interface SqlEtlWorkspaceProps {
  transactions: RawTransaction[];
  products: ProductCatalog[];
  customers: CustomerRegistry[];
  onTriggerDashboardUpdate: (updatedData: RawTransaction[]) => void;
  appendLog: (level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS', source: 'ETL' | 'VALIDATOR' | 'ANOMALY_ENGINE' | 'POWER_BI', message: string) => void;
}

export default function SqlEtlWorkspace({
  transactions,
  products,
  customers,
  onTriggerDashboardUpdate,
  appendLog
}: SqlEtlWorkspaceProps) {
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>(ETL_PIPELINES[0].id);
  const [sqlEditorText, setSqlEditorText] = useState<string>(ETL_PIPELINES[0].sql);
  const [queryOutputs, setQueryOutputs] = useState<any[]>([]);
  const [outputColumns, setOutputColumns] = useState<string[]>(ETL_PIPELINES[0].tableHeaders);
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasExecutedSuccessfully, setHasExecutedSuccessfully] = useState(false);
  const [activeSchemaTab, setActiveSchemaTab] = useState<'transactions' | 'products' | 'customers'>('transactions');

  // Load pipeline text
  const handleSelectPipeline = (pipeline: EtlPipelineQuery) => {
    setSelectedPipelineId(pipeline.id);
    setSqlEditorText(pipeline.sql);
    setOutputColumns(pipeline.tableHeaders);
    setQueryOutputs([]);
    setHasExecutedSuccessfully(false);
  };

  // Run mock query
  const handleRunSql = () => {
    setIsExecuting(true);
    appendLog('INFO', 'ETL', `Triggering extraction phase for ${activeSchemaTab} references...`);
    
    setTimeout(() => {
      // Execute simple mock parser on the SQL text
      const parsedResults = executeSimpleMockSql(sqlEditorText, transactions, products, customers);
      setQueryOutputs(parsedResults);
      
      // Attempt to infer columns dynamically
      if (parsedResults && parsedResults.length > 0 && !parsedResults[0].error_message) {
        setOutputColumns(Object.keys(parsedResults[0]));
        setHasExecutedSuccessfully(true);
        appendLog('SUCCESS', 'ETL', `Transformed ${parsedResults.length} rows using custom aggregate query.`);
        
        // Simulating data sync back to parent if specified
        if (sqlEditorText.toLowerCase().includes('raw_transactions') && !sqlEditorText.toLowerCase().includes('group by')) {
          onTriggerDashboardUpdate(transactions);
        }
      } else if (parsedResults && parsedResults[0]?.error_message) {
        appendLog('ERROR', 'ETL', `Syntax failure executing compilation: ${parsedResults[0].error_message}`);
        setHasExecutedSuccessfully(false);
      } else {
        setOutputColumns([]);
        setHasExecutedSuccessfully(true);
        appendLog('SUCCESS', 'ETL', 'SQL parsed successfully. Output set is empty.');
      }
      setIsExecuting(false);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT COLUMN: ETL PIPELINES PRESETS & METADATA */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* PIPELINE PRESET CARD */}
        <div className="bg-paper border border-ink p-5 rounded-none shadow-none">
          <div className="flex items-center gap-2 mb-4 border-b border-ink pb-3">
            <Database className="w-4 h-4 text-ink" />
            <h4 className="font-bold text-ink text-xs uppercase tracking-wider font-mono">SQL ETL Catalog</h4>
          </div>
          
          <div className="space-y-3">
            {ETL_PIPELINES.map(pipe => (
              <button
                key={pipe.id}
                onClick={() => handleSelectPipeline(pipe)}
                className={`w-full text-left p-3 rounded-none border border-ink text-xs transition ${
                  selectedPipelineId === pipe.id
                    ? 'bg-ink border-ink text-canvas font-bold'
                    : 'bg-canvas border-ink text-ink hover:opacity-85'
                }`}
              >
                <div className="font-bold font-mono mb-1 flex items-center justify-between">
                  <span>{pipe.name}</span>
                  {selectedPipelineId === pipe.id && <span className="bg-canvas w-1.5 h-1.5 rounded-full" />}
                </div>
                <p className="text-[11px] font-serif-italic opacity-70 leading-relaxed truncate">{pipe.description}</p>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-ink text-[11px] font-mono text-ink/90 leading-normal">
            <div className="flex items-start gap-1.5">
              <Info className="w-4 h-4 text-ink shrink-0" />
              <span>
                These ETL pipelines automate extraction of raw records, joining CRM directories and serving aggregate metrics directly to report visuals.
              </span>
            </div>
          </div>
        </div>

        {/* METADATA DATABASE SCHEMA EXPLORER */}
        <div className="bg-paper border border-ink p-5 rounded-none">
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-4 h-4 text-ink" />
            <h4 className="font-bold text-ink text-xs uppercase tracking-wider font-mono">Raw Schema Explorer</h4>
          </div>
          
          {/* Tabs for schema */}
          <div className="grid grid-cols-3 gap-1 bg-canvas p-1 border border-ink mb-4 text-center">
            {(['transactions', 'products', 'customers'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSchemaTab(tab)}
                className={`text-[10px] py-1.5 font-mono font-bold uppercase transition ${
                  activeSchemaTab === tab
                    ? 'bg-ink text-canvas'
                    : 'text-ink/65 hover:text-ink'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Schema structures */}
          {activeSchemaTab === 'transactions' && (
            <div className="space-y-2.5 font-mono">
              <span className="text-[11px] font-bold text-ink block">Table: <code className="text-ink font-bold">raw_transactions</code></span>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <div className="flex justify-between text-[11px] py-1 border-b border-ink/10"><code className="font-bold text-ink">transaction_id</code> <span className="opacity-60">VARCHAR(16) PK</span></div>
                <div className="flex justify-between text-[11px] py-1 border-b border-ink/10"><code className="font-bold text-ink">date</code> <span className="opacity-60">DATE</span></div>
                <div className="flex justify-between text-[11px] py-1 border-b border-ink/10"><code className="font-bold text-ink">product_id</code> <span className="opacity-60">VARCHAR(16) FK</span></div>
                <div className="flex justify-between text-[11px] py-1 border-b border-ink/10"><code className="font-bold text-ink">company_name</code> <span className="opacity-60">VARCHAR(64) FK</span></div>
                <div className="flex justify-between text-[11px] py-1 border-b border-ink/10"><code className="font-bold text-ink">amount</code> <span className="opacity-60">NUMERIC(12,2)</span></div>
                <div className="flex justify-between text-[11px] py-1 border-b border-ink/10"><code className="font-bold text-ink">region</code> <span className="opacity-60">VARCHAR(32)</span></div>
                <div className="flex justify-between text-[11px] py-1 border-b border-ink/10"><code className="font-bold text-ink">sector</code> <span className="opacity-60">VARCHAR(16)</span></div>
                <div className="flex justify-between text-[11px] py-1 border-b border-ink/10"><code className="font-bold text-ink">status</code> <span className="opacity-60">VARCHAR(12)</span></div>
              </div>
            </div>
          )}

          {activeSchemaTab === 'products' && (
            <div className="space-y-2.5 font-mono">
              <span className="text-[11px] font-bold text-ink block">Table: <code className="text-ink font-bold">product_catalog</code></span>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] py-1 border-b border-ink/10"><code className="font-bold text-ink">product_id</code> <span className="opacity-60">VARCHAR(16) PK</span></div>
                <div className="flex justify-between text-[11px] py-1 border-b border-ink/10"><code className="font-bold text-ink">name</code> <span className="opacity-60">VARCHAR(64)</span></div>
                <div className="flex justify-between text-[11px] py-1 border-b border-ink/10"><code className="font-bold text-ink">category</code> <span className="opacity-60">VARCHAR(24)</span></div>
                <div className="flex justify-between text-[11px] py-1 border-b border-ink/10"><code className="font-bold text-ink">unit_price</code> <span className="opacity-60">NUMERIC(10,2)</span></div>
                <div className="flex justify-between text-[11px] py-1 border-b border-ink/10"><code className="font-bold text-ink">cogs_percentage</code> <span className="opacity-60">INTEGER</span></div>
              </div>
            </div>
          )}

          {activeSchemaTab === 'customers' && (
            <div className="space-y-2.5 font-mono">
              <span className="text-[11px] font-bold text-ink block">Table: <code className="text-ink font-bold">customer_registry</code></span>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] py-1 border-b border-ink/10"><code className="font-bold text-ink">customer_id</code> <span className="opacity-60">VARCHAR(16) PK</span></div>
                <div className="flex justify-between text-[11px] py-1 border-b border-ink/10"><code className="font-bold text-ink">company_name</code> <span className="opacity-60">VARCHAR(64) UK</span></div>
                <div className="flex justify-between text-[11px] py-1 border-b border-ink/10"><code className="font-bold text-ink">industry</code> <span className="opacity-60">VARCHAR(32)</span></div>
                <div className="flex justify-between text-[11px] py-1 border-b border-ink/10"><code className="font-bold text-ink">acquisition_cost</code> <span className="opacity-60">NUMERIC(8,2)</span></div>
                <div className="flex justify-between text-[11px] py-1 border-b border-ink/10"><code className="font-bold text-ink">contract_months</code> <span className="opacity-60">INTEGER</span></div>
                <div className="flex justify-between text-[11px] py-1 border-b border-ink/10"><code className="font-bold text-ink">region</code> <span className="opacity-60">VARCHAR(32)</span></div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* RIGHT COLUMN: SQL CODE EDITOR & RESULTS */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* EDITOR */}
        <div className="bg-ink rounded-none overflow-hidden border border-ink">
          
          {/* Header */}
          <div className="bg-ink px-4 py-3 border-b border-canvas/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-canvas" />
                <span className="w-2 h-2 bg-canvas/60" />
                <span className="w-2 h-2 bg-canvas/30" />
              </div>
              <span className="text-xs font-mono text-[#E4E3E0] font-bold pl-2">pipeline_engine.sql</span>
            </div>
            
            <button
              onClick={handleRunSql}
              disabled={isExecuting}
              className="flex items-center gap-2 bg-canvas border border-ink hover:opacity-80 disabled:opacity-50 text-ink text-[11px] font-bold font-mono px-4 py-1 rounded-none transition duration-150 cursor-pointer uppercase"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>EXTRACTING...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute SLA Transform</span>
                </>
              )}
            </button>
          </div>

          {/* Text Area Code Body */}
          <div className="flex">
            {/* Simulated Line numbers */}
            <div className="bg-ink text-canvas/45 text-right pr-3 pl-4 py-4 select-none font-mono text-xs border-r border-[#1c1c1c] leading-relaxed w-10">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              value={sqlEditorText}
              onChange={(e) => setSqlEditorText(e.target.value)}
              className="w-full bg-ink border-none text-canvas font-mono text-xs px-4 py-4 focus:ring-0 focus:outline-hidden min-h-[220px] resize-y leading-relaxed outline-hidden"
              spellCheck={false}
              placeholder="-- Input query here..."
            />
          </div>

          {/* Explanation bar below editor */}
          <div className="bg-[#1c1c1c] px-4 py-3 border-t border-canvas/10 flex items-start gap-2.5 text-xs text-[#D9D8D5] font-mono">
            <Info className="w-4 h-4 text-canvas mt-0.5 shrink-0" />
            <div className="leading-relaxed">
              <span className="font-bold text-canvas block mb-0.5">Pipeline Logic:</span>
              <span>{ETL_PIPELINES.find(p => p.id === selectedPipelineId)?.explanation || "Evaluates aggregate financial groupings from linked tables."}</span>
            </div>
          </div>

        </div>

        {/* COMPILATION OUTPUT PANEL / TABLE PREVIEW */}
        <div className="bg-paper border border-ink rounded-none overflow-hidden">
          <div className="bg-canvas px-4 py-3 border-b border-ink flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-ink inline" />
              <h5 className="font-bold text-ink text-xs uppercase tracking-wider font-mono">Transform Query Results Log</h5>
            </div>
            {hasExecutedSuccessfully && (
              <span className="bg-ink text-canvas text-[10px] font-bold font-mono uppercase border border-ink px-2 py-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-canvas" />
                Pipeline Success
              </span>
            )}
          </div>

          <div className="p-4 overflow-x-auto min-h-[200px] bg-canvas text-ink">
            {queryOutputs.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-ink/50 text-center min-h-[170px] font-mono">
                <Database className="w-10 h-10 opacity-30 mb-2 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">Transform Output Cache Empty</span>
                <p className="text-[10px] opacity-70 mt-1 max-w-sm">
                  Click &ldquo;Execute SLA Transform&rdquo; above to fire joins, trigger database compilations, and load tabular results.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-ink text-ink uppercase font-bold text-[10px] tracking-wider bg-paper">
                    {outputColumns.map(col => (
                      <th key={col} className="px-3 py-2.5 font-mono">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="font-mono text-ink">
                  {queryOutputs.map((row, idx) => (
                    <tr key={idx} className="border-b border-ink/10 hover:bg-paper/40 transition-colors">
                      {outputColumns.map(col => {
                        const val = row[col];
                        let renderedVal = val;
                        // Beautifully format financial columns and values
                        if (typeof val === 'number') {
                          if (col.includes('revenue') || col.includes('usd') || col.includes('cac')) {
                            renderedVal = `$${val.toLocaleString()}`;
                          } else if (col.includes('ratio')) {
                            renderedVal = `${val}x`;
                          } else {
                            renderedVal = val.toLocaleString();
                          }
                        }
                        return (
                          <td key={col} className="px-3 py-2.5 whitespace-nowrap">
                            {col.includes('discrepency') ? (
                              <span className="text-red-700 font-bold">{renderedVal}</span>
                            ) : renderedVal}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-canvas border-t border-ink px-4 py-2.5 text-[11px] font-mono text-ink/80 flex justify-between items-center">
            <span>Result Columns: {outputColumns.length}</span>
            <span>Rows Processed: {queryOutputs.length}</span>
          </div>

        </div>

      </div>

    </div>
  );
}
