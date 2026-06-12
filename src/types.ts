export interface RawTransaction {
  transaction_id: string;
  date: string; // YYYY-MM-DD
  product_id: string;
  company_name: string;
  amount: number;
  region: string;
  sector: string;
  status: 'Completed' | 'Pending' | 'Failed';
  validation_status: 'Valid' | 'Warning' | 'Error';
  validation_logs: string[];
}

export interface ProductCatalog {
  product_id: string;
  name: string;
  category: string;
  unit_price: number;
  cogs_percentage: number; // Cost of Goods Sold %
}

export interface CustomerRegistry {
  customer_id: string;
  company_name: string;
  industry: string;
  acquisition_cost: number;
  contract_duration_months: number;
  region: string;
}

export interface EtlPipelineQuery {
  id: string;
  name: string;
  description: string;
  sql: string;
  tableHeaders: string[];
  explanation: string;
}

export interface AnomalyRecord {
  id: string;
  date: string;
  segment: string;
  actual_value: number;
  expected_value: number;
  deviation_percentage: number;
  z_score: number;
  risk_classification: 'High' | 'Medium' | 'Low';
  planning_impact: string;
  action_plan: string;
}

export interface ValidationRule {
  id: string;
  name: string;
  category: 'Schema' | 'Domain' | 'Referential' | 'Business Logic';
  description: string;
  enabled: boolean;
  severity: 'Warning' | 'Critical';
}

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  source: 'ETL' | 'VALIDATOR' | 'ANOMALY_ENGINE' | 'POWER_BI';
  message: string;
}
