export interface CalorieGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  source: 'ai' | 'manual';
  time: string; // ISO string
  date: string; // YYYY-MM-DD
}

export interface QuickAddOption {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodAnalysisResult {
  dish_name: string;
  serving_estimate: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  confidence: 'high' | 'medium' | 'low';
  notes: string;
}
