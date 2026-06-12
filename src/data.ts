import { RawTransaction, ProductCatalog, CustomerRegistry, EtlPipelineQuery, ValidationRule, AnomalyRecord, LogEntry } from './types';

export const INITIAL_PRODUCTS: ProductCatalog[] = [
  { product_id: 'PRD-01', name: 'SaaS Cloud Suite', category: 'SaaS', unit_price: 15000, cogs_percentage: 12 },
  { product_id: 'PRD-02', name: 'Enterprise On-Prem License', category: 'On-Prem', unit_price: 45000, cogs_percentage: 25 },
  { product_id: 'PRD-03', name: 'Technical Support Elite', category: 'Support', unit_price: 8000, cogs_percentage: 45 },
  { product_id: 'PRD-04', name: 'BI Consulting Services', category: 'Consulting', unit_price: 25000, cogs_percentage: 60 },
  { product_id: 'PRD-05', name: 'Security Add-on module', category: 'SaaS', unit_price: 5000, cogs_percentage: 8 }
];

export const INITIAL_CUSTOMERS: CustomerRegistry[] = [
  { customer_id: 'CST-101', company_name: 'Acme Global Conglomerate', industry: 'Finance', acquisition_cost: 12000, contract_duration_months: 24, region: 'North America' },
  { customer_id: 'CST-102', company_name: 'Vortex Cloud Logistics', industry: 'Logistics', acquisition_cost: 8500, contract_duration_months: 12, region: 'APAC' },
  { customer_id: 'CST-103', company_name: 'Starlight Tech Solutions', industry: 'Technology', acquisition_cost: 4000, contract_duration_months: 12, region: 'EMEA' },
  { customer_id: 'CST-104', company_name: 'Aether Energy Networks', industry: 'Energy', acquisition_cost: 22000, contract_duration_months: 36, region: 'North America' },
  { customer_id: 'CST-105', company_name: 'BioGen Therapeutics', industry: 'Healthcare', acquisition_cost: 15000, contract_duration_months: 24, region: 'EMEA' },
  { customer_id: 'CST-106', company_name: 'Pinnacle Retail Corp', industry: 'Retail', acquisition_cost: 6200, contract_duration_months: 12, region: 'LATAM' },
  { customer_id: 'CST-107', company_name: 'Nova Media Group', industry: 'Entertainment', acquisition_cost: 9000, contract_duration_months: 18, region: 'LATAM' },
  { customer_id: 'CST-108', company_name: 'Frontier FinTech Inc', industry: 'Finance', acquisition_cost: 11000, contract_duration_months: 12, region: 'APAC' }
];

// Seed transactions (Jan 2025 to May 2026) -> contains preloader with anomaly drops/spikes
export const INITIAL_TRANSACTIONS: RawTransaction[] = [
  // 2025 Q1
  { transaction_id: 'TX-1001', date: '2025-01-10', product_id: 'PRD-01', company_name: 'Acme Global Conglomerate', amount: 15000, region: 'North America', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1002', date: '2025-01-15', product_id: 'PRD-03', company_name: 'Starlight Tech Solutions', amount: 8000, region: 'EMEA', sector: 'Mid-Market', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1003', date: '2025-01-28', product_id: 'PRD-04', company_name: 'Acme Global Conglomerate', amount: 25000, region: 'North America', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1004', date: '2025-02-05', product_id: 'PRD-01', company_name: 'BioGen Therapeutics', amount: 15000, region: 'EMEA', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1005', date: '2025-02-18', product_id: 'PRD-02', company_name: 'Vortex Cloud Logistics', amount: 45000, region: 'APAC', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1006', date: '2025-02-22', product_id: 'PRD-05', company_name: 'Pinnacle Retail Corp', amount: 5000, region: 'LATAM', sector: 'Mid-Market', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1007', date: '2025-03-02', product_id: 'PRD-01', company_name: 'Aether Energy Networks', amount: 15000, region: 'North America', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1008', date: '2025-03-12', product_id: 'PRD-04', company_name: 'Nova Media Group', amount: 25000, region: 'LATAM', sector: 'Mid-Market', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1009', date: '2025-03-15', product_id: 'PRD-05', company_name: 'Frontier FinTech Inc', amount: 5000, region: 'APAC', sector: 'SMB', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1010', date: '2025-03-25', product_id: 'PRD-03', company_name: 'Acme Global Conglomerate', amount: 8000, region: 'North America', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  
  // 2025 Q2
  { transaction_id: 'TX-1011', date: '2025-04-05', product_id: 'PRD-01', company_name: 'Vortex Cloud Logistics', amount: 15000, region: 'APAC', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1012', date: '2025-04-14', product_id: 'PRD-02', company_name: 'Aether Energy Networks', amount: 45000, region: 'North America', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1013', date: '2025-04-20', product_id: 'PRD-04', company_name: 'Starlight Tech Solutions', amount: 25000, region: 'EMEA', sector: 'Mid-Market', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1014', date: '2025-05-02', product_id: 'PRD-01', company_name: 'Acme Global Conglomerate', amount: 15000, region: 'North America', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  // SPIKE ANOMALY in May (Huge Consulting work in North America Enterprise)
  { transaction_id: 'TX-1015', date: '2025-05-18', product_id: 'PRD-04', company_name: 'Aether Energy Networks', amount: 125000, region: 'North America', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1016', date: '2025-05-24', product_id: 'PRD-03', company_name: 'BioGen Therapeutics', amount: 8000, region: 'EMEA', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1017', date: '2025-06-05', product_id: 'PRD-01', company_name: 'Nova Media Group', amount: 15000, region: 'LATAM', sector: 'Mid-Market', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1018', date: '2025-06-18', product_id: 'PRD-02', company_name: 'BioGen Therapeutics', amount: 45000, region: 'EMEA', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1019', date: '2025-06-29', product_id: 'PRD-05', company_name: 'Starlight Tech Solutions', amount: 5000, region: 'EMEA', sector: 'Mid-Market', status: 'Completed', validation_status: 'Valid', validation_logs: [] },

  // 2025 Q3 - Contains a major DIP Anomaly in August (Failed batch, zero revenue from critical product due to billing systems, leading to a massive outlier)
  { transaction_id: 'TX-1020', date: '2025-07-08', product_id: 'PRD-01', company_name: 'Acme Global Conglomerate', amount: 15000, region: 'North America', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1021', date: '2025-07-15', product_id: 'PRD-04', company_name: 'Vortex Cloud Logistics', amount: 25000, region: 'APAC', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1022', date: '2025-07-22', product_id: 'PRD-03', company_name: 'Pinnacle Retail Corp', amount: 8000, region: 'LATAM', sector: 'Mid-Market', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1023', date: '2025-08-05', product_id: 'PRD-03', company_name: 'Nova Media Group', amount: 8000, region: 'LATAM', sector: 'Mid-Market', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  // DIP ANOMALY: A standard Enterprise On-Prem License that was transacted for only $1,500 instead of $45,000 due to severe pricing input error! (96.6% pricing discount - data error anomaly)
  { transaction_id: 'TX-1024', date: '2025-08-12', product_id: 'PRD-02', company_name: 'Aether Energy Networks', amount: 1500, region: 'North America', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1025', date: '2025-08-25', product_id: 'PRD-05', company_name: 'Frontier FinTech Inc', amount: 5000, region: 'APAC', sector: 'SMB', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1026', date: '2025-09-08', product_id: 'PRD-01', company_name: 'Starlight Tech Solutions', amount: 15000, region: 'EMEA', sector: 'Mid-Market', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1027', date: '2025-09-18', product_id: 'PRD-04', company_name: 'BioGen Therapeutics', amount: 25000, region: 'EMEA', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1028', date: '2025-09-24', product_id: 'PRD-03', company_name: 'Vortex Cloud Logistics', amount: 8000, region: 'APAC', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },

  // 2025 Q4 - Normal high-volume quarter
  { transaction_id: 'TX-1029', date: '2025-10-02', product_id: 'PRD-01', company_name: 'Acme Global Conglomerate', amount: 15000, region: 'North America', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1030', date: '2025-10-12', product_id: 'PRD-02', company_name: 'Pinnacle Retail Corp', amount: 45000, region: 'LATAM', sector: 'Mid-Market', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1031', date: '2025-10-19', product_id: 'PRD-04', company_name: 'Frontier FinTech Inc', amount: 25000, region: 'APAC', sector: 'SMB', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1032', date: '2025-11-05', product_id: 'PRD-01', company_name: 'Starlight Tech Solutions', amount: 15000, region: 'EMEA', sector: 'Mid-Market', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1033', date: '2025-11-15', product_id: 'PRD-02', company_name: 'Vortex Cloud Logistics', amount: 45000, region: 'APAC', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1034', date: '2025-11-20', product_id: 'PRD-05', company_name: 'Acme Global Conglomerate', amount: 5000, region: 'North America', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1035', date: '2025-12-08', product_id: 'PRD-01', company_name: 'BioGen Therapeutics', amount: 15000, region: 'EMEA', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1036', date: '2025-12-18', product_id: 'PRD-04', company_name: 'Aether Energy Networks', amount: 25000, region: 'North America', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1037', date: '2025-12-28', product_id: 'PRD-03', company_name: 'Frontier FinTech Inc', amount: 8000, region: 'APAC', sector: 'SMB', status: 'Completed', validation_status: 'Valid', validation_logs: [] },

  // 2026 Q1 - Growing Volume
  { transaction_id: 'TX-1038', date: '2026-01-05', product_id: 'PRD-01', company_name: 'Acme Global Conglomerate', amount: 15000, region: 'North America', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1039', date: '2026-01-18', product_id: 'PRD-04', company_name: 'Starlight Tech Solutions', amount: 25000, region: 'EMEA', sector: 'Mid-Market', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1040', date: '2026-01-22', product_id: 'PRD-03', company_name: 'Nova Media Group', amount: 8000, region: 'LATAM', sector: 'Mid-Market', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1041', date: '2026-02-05', product_id: 'PRD-01', company_name: 'BioGen Therapeutics', amount: 15000, region: 'EMEA', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1042', date: '2026-02-14', product_id: 'PRD-02', company_name: 'Aether Energy Networks', amount: 45000, region: 'North America', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1043', date: '2026-02-28', product_id: 'PRD-05', company_name: 'Acme Global Conglomerate', amount: 5000, region: 'North America', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1044', date: '2026-03-08', product_id: 'PRD-01', company_name: 'Vortex Cloud Logistics', amount: 15000, region: 'APAC', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  // SPIKE IN MARCH (End-of-quarter push Services in APAC)
  { transaction_id: 'TX-1045', date: '2026-03-12', product_id: 'PRD-04', company_name: 'Frontier FinTech Inc', amount: 95000, region: 'APAC', sector: 'SMB', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1046', date: '2026-03-26', product_id: 'PRD-03', company_name: 'Pinnacle Retail Corp', amount: 8000, region: 'LATAM', sector: 'Mid-Market', status: 'Completed', validation_status: 'Valid', validation_logs: [] },

  // 2026 Q2 - Recent Data
  { transaction_id: 'TX-1047', date: '2026-04-06', product_id: 'PRD-01', company_name: 'Acme Global Conglomerate', amount: 15000, region: 'North America', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1048', date: '2026-04-18', product_id: 'PRD-02', company_name: 'Starlight Tech Solutions', amount: 45000, region: 'EMEA', sector: 'Mid-Market', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1049', date: '2026-04-29', product_id: 'PRD-05', company_name: 'Vortex Cloud Logistics', amount: 5000, region: 'APAC', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1050', date: '2026-05-10', product_id: 'PRD-01', company_name: 'BioGen Therapeutics', amount: 15000, region: 'EMEA', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] },
  { transaction_id: 'TX-1051', date: '2026-05-24', product_id: 'PRD-04', company_name: 'Aether Energy Networks', amount: 25000, region: 'North America', sector: 'Enterprise', status: 'Completed', validation_status: 'Valid', validation_logs: [] }
];

export const INITIAL_VALIDATION_RULES: ValidationRule[] = [
  { id: 'VAL-01', name: 'Transaction Format Consistency', category: 'Schema', description: 'Ensures transaction ID follows the "TX-XXXX" pattern and all dates match YYYY-MM-DD schema.', enabled: true, severity: 'Critical' },
  { id: 'VAL-02', name: 'Non-Null Financial Attributes', category: 'Schema', description: 'Rejects transactions where revenue amount, product_id, or company name is blank or null.', enabled: true, severity: 'Critical' },
  { id: 'VAL-03', name: 'Referential Integrity Constraint', category: 'Referential', description: 'Verifies product_id maps to an active product catalog code, and customer maps to register.', enabled: true, severity: 'Critical' },
  { id: 'VAL-04', name: 'Standard Margin Range Boundary', category: 'Business Logic', description: 'Checks if gross margin percentages align between 10% and 95% depending on unit COGS.', enabled: true, severity: 'Warning' },
  { id: 'VAL-05', name: 'Transaction Amount Sanity', category: 'Domain', description: 'Validates that amount is strictly positive (> $100) and within a 3-standard-deviation window from product mean.', enabled: true, severity: 'Warning' },
  { id: 'VAL-06', name: 'Temporal Logical Alignment', category: 'Business Logic', description: 'Rejects transactions dated in the future or which precede the active company registry contract date.', enabled: true, severity: 'Critical' }
];

export const INITIAL_ANOMALIES: AnomalyRecord[] = [
  {
    id: 'ANM-01',
    date: '2025-05-18',
    segment: 'North America / Services',
    actual_value: 125000,
    expected_value: 25000,
    deviation_percentage: 400,
    z_score: 3.42,
    risk_classification: 'High',
    planning_impact: 'Temporary cash flow spike. Skews monthly budget projections and resource allocation pipelines.',
    action_plan: 'Determine if this consulting contract is a recurring milestone format or a single isolated engagement. Adjust H2 operational forecasts accordingly.'
  },
  {
    id: 'ANM-02',
    date: '2025-08-12',
    segment: 'North America / On-Prem License',
    actual_value: 1500,
    expected_value: 45000,
    deviation_percentage: -96.6,
    z_score: -2.87,
    risk_classification: 'High',
    planning_impact: 'Revenue Leakage. Drastic drop in anticipated software license value. Distorts gross margin index.',
    action_plan: 'Flag to QA & Account Management. Verify if the billing system dropped items on import. Triggering immediate manual reconciliation flow.'
  },
  {
    id: 'ANM-03',
    date: '2026-03-12',
    segment: 'APAC / Services Consulting',
    actual_value: 95000,
    expected_value: 25000,
    deviation_percentage: 280,
    z_score: 2.95,
    risk_classification: 'Medium',
    planning_impact: 'Consulting capacity strain. High consulting load demands immediate partner service onboarding.',
    action_plan: 'Coordinate with APAC delivery desk to balance workload constraints and prevent delivery delays.'
  }
];

export const ETL_PIPELINES: EtlPipelineQuery[] = [
  {
    id: 'etl_pipeline_1',
    name: 'Unified Revenue Aggregator (Monthly)',
    description: 'Executes comprehensive inner joins between transactional records, product margins, and customer registries. Aggregates monthly recurring gross profit metrics.',
    sql: `SELECT \n  strftime('%Y-%m', t.date) AS billing_month,\n  p.category AS product_type,\n  SUM(t.amount) AS total_revenue,\n  SUM(t.amount * (100 - p.cogs_percentage) / 100) AS gross_margin_usd,\n  COUNT(t.transaction_id) AS billing_events\nFROM raw_transactions t\nINNER JOIN product_catalog p \n  ON t.product_id = p.product_id\nINNER JOIN customer_registry c \n  ON t.company_name = c.company_name\nWHERE t.status = 'Completed'\nGROUP BY 1, 2\nORDER BY billing_month DESC, total_revenue DESC;`,
    tableHeaders: ['billing_month', 'product_type', 'total_revenue', 'gross_margin_usd', 'billing_events'],
    explanation: 'Combines finance and ops registry schemas. Uses strftime to convert system-level timestamp keys, aggregates with standard multipliers to obtain reliable revenue and high-accuracy COGS reporting.'
  },
  {
    id: 'etl_pipeline_2',
    name: 'Customer CAC Payback & Value Analysis',
    description: 'Enforces cross-table relational links to measure Customer Acquisition Cost (CAC) vs aggregated lifetime invoice value, segmented by market tier.',
    sql: `SELECT \n  c.company_name,\n  c.region,\n  t.sector,\n  c.acquisition_cost AS cac_usd,\n  SUM(t.amount) AS lifetime_value_usd,\n  ROUND(SUM(t.amount) / c.acquisition_cost, 2) AS ltv_to_cac_ratio\nFROM customer_registry c\nLEFT JOIN raw_transactions t \n  ON c.company_name = t.company_name\nGROUP BY c.customer_id\nHAVING ltv_to_cac_ratio > 1.0\nORDER BY ltv_to_cac_ratio DESC;`,
    tableHeaders: ['company_name', 'region', 'sector', 'cac_usd', 'lifetime_value_usd', 'ltv_to_cac_ratio'],
    explanation: 'Uses a LEFT JOIN on customer registries containing CAC metrics. Aggregates values on invoices to help executives monitor critical sales velocity profiles.'
  },
  {
    id: 'etl_pipeline_3',
    name: 'Outlier & Discrepency Isolation Pipeline',
    description: 'Analyzes anomalies across sectors by isolating queries where invoice ratios drift heavily from standard list rates.',
    sql: `SELECT \n  t.transaction_id,\n  t.date,\n  p.name AS product_name,\n  t.amount AS transaction_amount,\n  p.unit_price AS catalog_list_price,\n  ROUND((t.amount / p.unit_price) * 100, 1) AS percent_of_list\nFROM raw_transactions t\nJOIN product_catalog p \n  ON t.product_id = p.product_id\nWHERE ABS((t.amount / p.unit_price) - 1.0) > 0.25\nORDER BY percent_of_list ASC;`,
    tableHeaders: ['transaction_id', 'date', 'product_name', 'transaction_amount', 'catalog_list_price', 'percent_of_list'],
    explanation: 'Instantly surfaces extreme contract deviations (over 25% drift from unit price). This query helps controllers catch data corruption and severe discount leakage.'
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  { timestamp: '11:00:01', level: 'SUCCESS', source: 'ETL', message: 'Initialized metadata engine schema loading successfully' },
  { timestamp: '11:00:04', level: 'INFO', source: 'VALIDATOR', message: 'Validating seed transactional blocks (length: 51)' },
  { timestamp: '11:00:05', level: 'WARNING', source: 'VALIDATOR', message: 'Validation Alert: Transaction TX-1024 has -96.6% pricing discount on product PRD-02. Flagged as Warning.' },
  { timestamp: '11:00:12', level: 'SUCCESS', source: 'VALIDATOR', message: 'Verification completed. Loaded 50 Valid items, 1 Warning, 0 Blocked Errors. Validation Accuracy calculated: 97.4%' },
  { timestamp: '11:00:15', level: 'INFO', source: 'ANOMALY_ENGINE', message: 'Running Python Outlier detection script zscore_v2.py (Threshold: 2.75)' },
  { timestamp: '11:00:17', level: 'WARNING', source: 'ANOMALY_ENGINE', message: 'Outlier isolated at 2025-05-18: Region NA Enterprise. Value: $125k (Z-score: 3.42).' },
  { timestamp: '11:00:18', level: 'WARNING', source: 'ANOMALY_ENGINE', message: 'Outlier isolated at 2025-08-12: Region NA Enteprise. Value: $1.5k (Z-score: -2.87).' },
  { timestamp: '11:00:20', level: 'SUCCESS', source: 'POWER_BI', message: 'Financial visuals refresh triggered. Cache update successful.' }
];

export function executeSimpleMockSql(sql: string, transactions: RawTransaction[], catalog: ProductCatalog[], registry: CustomerRegistry[]): any[] {
  try {
    const trimmed = sql.toLowerCase().replace(/\s+/g, ' ');
    
    if (trimmed.includes('unified revenue aggregator') || trimmed.includes('billing_month') || trimmed.includes('product_type')) {
      // Execute mock Monthly Recur Aggregator
      const monthlyData: { [key: string]: { rev: number; margin: number; count: number } } = {};
      
      transactions.forEach(t => {
        if (t.status !== 'Completed') return;
        const month = t.date.substring(0, 7); // YYYY-MM
        const product = catalog.find(p => p.product_id === t.product_id);
        const pType = product ? product.category : 'Unknown';
        const key = `${month}|${pType}`;
        const cogsPct = product ? product.cogs_percentage : 20;
        
        if (!monthlyData[key]) {
          monthlyData[key] = { rev: 0, margin: 0, count: 0 };
        }
        monthlyData[key].rev += t.amount;
        monthlyData[key].margin += t.amount * (100 - cogsPct) / 100;
        monthlyData[key].count += 1;
      });

      return Object.keys(monthlyData).map(k => {
        const [month, type] = k.split('|');
        return {
          billing_month: month,
          product_type: type,
          total_revenue: monthlyData[k].rev,
          gross_margin_usd: Math.round(monthlyData[k].margin),
          billing_events: monthlyData[k].count
        };
      }).sort((a, b) => b.billing_month.localeCompare(a.billing_month) || b.total_revenue - a.total_revenue);

    } else if (trimmed.includes('cac payback') || trimmed.includes('ltv_to_cac_ratio') || trimmed.includes('customer_registry')) {
      // Execute mock LTV-to-CAC Ratio Analyzer
      return registry.map(c => {
        const matchingTx = transactions.filter(t => t.company_name === c.company_name);
        const ltv = matchingTx.reduce((sum, t) => sum + t.amount, 0);
        const ratio = parseFloat((ltv / c.acquisition_cost).toFixed(2));
        const firstTx = matchingTx[0];
        
        return {
          company_name: c.company_name,
          region: c.region,
          sector: firstTx ? firstTx.sector : 'Enterprise',
          cac_usd: c.acquisition_cost,
          lifetime_value_usd: ltv,
          ltv_to_cac_ratio: ratio
        };
      }).sort((a, b) => b.ltv_to_cac_ratio - a.ltv_to_cac_ratio);

    } else if (trimmed.includes('outlier & discrepency') || trimmed.includes('percent_of_list') || trimmed.includes('unit_price')) {
      // Execute Outlier drift
      const result: any[] = [];
      transactions.forEach(t => {
        const prod = catalog.find(p => p.product_id === t.product_id);
        if (!prod) return;
        const driftRatio = t.amount / prod.unit_price;
        if (Math.abs(driftRatio - 1.0) > 0.25) {
          result.push({
            transaction_id: t.transaction_id,
            date: t.date,
            product_name: prod.name,
            transaction_amount: t.amount,
            catalog_list_price: prod.unit_price,
            percent_of_list: parseFloat((driftRatio * 100).toFixed(1))
          });
        }
      });
      return result.sort((a, b) => a.percent_of_list - b.percent_of_list);
    }

    // Default Fallback: Simple transactional select mock parser
    let filteredTxs = [...transactions];
    if (trimmed.includes("whereregion = 'emea'")) {
      filteredTxs = filteredTxs.filter(t => t.region === 'EMEA');
    } else if (trimmed.includes("where region = 'north america'")) {
      filteredTxs = filteredTxs.filter(t => t.region === 'North America');
    }
    
    return filteredTxs.slice(0, 10).map(t => {
      const prod = catalog.find(p => p.product_id === t.product_id);
      return {
        transaction_id: t.transaction_id,
        date: t.date,
        company_name: t.company_name,
        amount: t.amount,
        region: t.region,
        product: prod ? prod.name : t.product_id
      };
    });
  } catch (err) {
    return [{ error_message: 'SQL Syntax Error parsing constraints. Check line aggregates.' }];
  }
}
