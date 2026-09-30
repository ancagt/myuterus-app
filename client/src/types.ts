export interface Condition {
  id: string;
  name: string;
  category: string;
  affectsFertility: boolean;
  summary: string;
  symptoms: string[];
  fertilityImpact: string;
}

export interface Symptom {
  name: string;
  conditions: string[];
}