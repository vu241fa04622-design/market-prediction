/**
 * AgriPrice AI - Core Data Types & Interfaces
 */

export type UserRole = 'farmer' | 'admin' | 'data_manager';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  state: string;
  district: string;
  preferredMandi?: string;
  avatarUrl?: string;
  favoriteCrops?: string[];
  createdAt: string;
}

export interface CropInfo {
  id: string;
  name: string;
  teluguName: string;
  category: 'Cereal' | 'Pulse' | 'Vegetable' | 'Spice' | 'Cash Crop' | 'Oilseed';
  varietyList: string[];
  shelfLifeDays: number;
  perishable: boolean;
  standardUnit: '₹/Quintal';
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'All Season';
  mspPrice: number; // Minimum Support Price in ₹/quintal
  description: string;
}

export interface MandiInfo {
  id: string;
  name: string;
  teluguName: string;
  state: string;
  district: string;
  code: string;
  distanceKm: number; // Base reference distance
  lat: number;
  lng: number;
  avgDailyArrivalTonnes: number;
  facilities: string[];
}

export interface HistoricalPriceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalQuantity: number; // Quintals
}

export type ForecastHorizon = 7 | 15 | 30;

export type MLModelType = 'random_forest' | 'xgboost' | 'linear_regression' | 'time_series_baseline';

export interface DailyForecastPoint {
  date: string;
  dayName: string;
  predictedPrice: number;
  lowerConfidenceBound: number;
  upperConfidenceBound: number;
  expectedArrivalQuantity: number;
}

export interface PredictionResult {
  id: string;
  userId: string;
  cropName: string;
  variety: string;
  state: string;
  district: string;
  mandi: string;
  currentModalPrice: number;
  currentDate: string;
  forecastHorizon: ForecastHorizon;
  modelUsed: MLModelType;
  modelVersion: string;
  forecast: DailyForecastPoint[];
  summary: {
    avgPredictedPrice: number;
    minPredictedPrice: number;
    maxPredictedPrice: number;
    priceChangeAbsolute: number;
    priceChangePercentage: number;
    trend: 'Strong Bullish' | 'Moderate Bullish' | 'Stable' | 'Moderate Bearish' | 'Strong Bearish';
    confidenceScore: number; // 0 to 100%
  };
  modelMetrics: {
    mae: number;
    rmse: number;
    r2Score: number;
    smape: number;
  };
  featureImportance: {
    feature: string;
    importancePercentage: number;
  }[];
  createdAt: string;
}

export interface SmartSellingRecommendation {
  cropName: string;
  mandi: string;
  action: 'HOLD' | 'SELL_IMMEDIATELY' | 'SPLIT_SELL' | 'DIVERSIFY_MANDI';
  title: string;
  titleTelugu: string;
  summary: string;
  summaryTelugu: string;
  recommendedTimeframe: string;
  expectedNetBenefit: string;
  confidence: 'High' | 'Medium' | 'Cautious';
  factors: {
    name: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];
  alternateMarketsSuggestion?: {
    mandi: string;
    distanceKm: number;
    currentPrice: number;
    transportCostPerQuintal: number;
    netGainPerQuintal: number;
  };
  disclaimer: string;
}

export interface MandiComparisonItem {
  mandiId: string;
  mandiName: string;
  district: string;
  state: string;
  distanceKm: number;
  latestReportedDate: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalQuantityQuintals: number;
  predicted7DayPrice: number;
  estimatedFreightPerQuintal: number;
  netRealizablePrice: number;
  ratingScore: number;
}

export interface DatasetMeta {
  id: string;
  name: string;
  source: string;
  totalRecords: number;
  startDate: string;
  endDate: string;
  uploadedBy: string;
  uploadDate: string;
  status: 'Validated' | 'Processing' | 'Warning' | 'Error';
  fileSizeMb: number;
  statesCovered: number;
  commoditiesCovered: number;
}

export interface ModelPerformanceMetric {
  modelType: MLModelType;
  modelName: string;
  algorithm: string;
  mae: number;
  rmse: number;
  r2: number;
  smape: number;
  trainingTimeSec: number;
  status: 'Production Active' | 'Benchmark Baseline' | 'Candidate';
  bestFor: string;
}
