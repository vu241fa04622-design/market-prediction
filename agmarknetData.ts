/**
 * AgriPrice AI - Master Agricultural Data & AGMARKNET Historical Price Repository
 * Modeled on official datasets from AGMARKNET (agmarknet.gov.in) & Open Government Data (data.gov.in)
 */

import { CropInfo, MandiInfo, HistoricalPriceRecord, DatasetMeta, ModelPerformanceMetric } from '../types';

export const CROPS_CATALOG: CropInfo[] = [
  {
    id: 'crop_paddy',
    name: 'Paddy (Dhan)',
    teluguName: 'వరి (ధాన్యం)',
    category: 'Cereal',
    varietyList: ['Common', 'Grade A', 'Basmati', 'Sona Masuri', 'BPT 5204', 'IR 64'],
    shelfLifeDays: 360,
    perishable: false,
    standardUnit: '₹/Quintal',
    season: 'Kharif',
    mspPrice: 2300,
    description: 'Major staple grain harvested extensively across Telangana, Andhra Pradesh, Punjab, and Haryana.'
  },
  {
    id: 'crop_rice',
    name: 'Rice',
    teluguName: 'బియ్యం',
    category: 'Cereal',
    varietyList: ['Raw Sona Masuri', 'Boiled Rice', 'Super Fine', 'Broken', 'Basmati Extra'],
    shelfLifeDays: 360,
    perishable: false,
    standardUnit: '₹/Quintal',
    season: 'All Season',
    mspPrice: 3200,
    description: 'Milled cereal grain with steady non-perishable wholesale demand across national APMC terminals.'
  },
  {
    id: 'crop_wheat',
    name: 'Wheat',
    teluguName: 'గోధుమలు',
    category: 'Cereal',
    varietyList: ['Sharbati', 'Lokwan', 'Desi Standard', 'Kalyan Sona', 'Mill Quality'],
    shelfLifeDays: 300,
    perishable: false,
    standardUnit: '₹/Quintal',
    season: 'Rabi',
    mspPrice: 2425,
    description: 'Principal winter cereal crop with peak arrivals in March-May across northern and central mandis.'
  },
  {
    id: 'crop_tomato',
    name: 'Tomato',
    teluguName: 'టమోటా',
    category: 'Vegetable',
    varietyList: ['Hybrid Round', 'Desi Local', 'Vaishali', 'Sahu', 'Abhinav'],
    shelfLifeDays: 6,
    perishable: true,
    standardUnit: '₹/Quintal',
    season: 'All Season',
    mspPrice: 0,
    description: 'Highly perishable vegetable prone to sharp seasonal volatility, gluts, and supply crunches.'
  },
  {
    id: 'crop_onion',
    name: 'Onion',
    teluguName: 'ఉల్లిపాయ',
    category: 'Vegetable',
    varietyList: ['Nashik Red', 'Garwa (Late Kharif)', 'White Onion', 'Bellary Local', 'Kurnool Red'],
    shelfLifeDays: 45,
    perishable: true,
    standardUnit: '₹/Quintal',
    season: 'Kharif',
    mspPrice: 0,
    description: 'Semi-perishable commercial bulb crop with strong price surges during monsoon and festive seasons.'
  },
  {
    id: 'crop_potato',
    name: 'Potato',
    teluguName: 'బంగాళాదుంప',
    category: 'Vegetable',
    varietyList: ['Jyoti', 'Kufri Bahar', 'Chandramukhi', 'Desi Red', 'Chipsona'],
    shelfLifeDays: 90,
    perishable: true,
    standardUnit: '₹/Quintal',
    season: 'Rabi',
    mspPrice: 0,
    description: 'Key tuber crop preserved in cold storages; prices fluctuate with post-harvest cold storage releases.'
  },
  {
    id: 'crop_cotton',
    name: 'Cotton (Kapas)',
    teluguName: 'ప్రత్తి',
    category: 'Cash Crop',
    varietyList: ['Medium Staple', 'Long Staple (H-4)', 'Bt Cotton Shankar-6', 'Bunny', 'DCH-32'],
    shelfLifeDays: 180,
    perishable: false,
    standardUnit: '₹/Quintal',
    season: 'Kharif',
    mspPrice: 7521,
    description: 'White gold commercial cash crop heavily traded in Warangal, Adilabad, Rajkot, and Vidarbha.'
  },
  {
    id: 'crop_chilli',
    name: 'Red Chilli (Dry)',
    teluguName: 'ఎండు మిరపకాయ',
    category: 'Spice',
    varietyList: ['Teja', 'Guntur Sannam (S4)', 'Byadgi', 'Fatki', 'Wonder Hot', 'Deccan'],
    shelfLifeDays: 240,
    perishable: false,
    standardUnit: '₹/Quintal',
    season: 'Rabi',
    mspPrice: 0,
    description: 'High-value commercial spice with international export demand anchored at Guntur & Khammam mandis.'
  },
  {
    id: 'crop_turmeric',
    name: 'Turmeric (Haldi)',
    teluguName: 'పసుపు',
    category: 'Spice',
    varietyList: ['Nizamabad Finger', 'Duggirala', 'Salem', 'Rajapuri', 'Bulb / Gatta'],
    shelfLifeDays: 360,
    perishable: false,
    standardUnit: '₹/Quintal',
    season: 'Rabi',
    mspPrice: 0,
    description: 'Golden spice with multi-year cyclical price patterns traded heavily in Nizamabad & Sangli.'
  },
  {
    id: 'crop_maize',
    name: 'Maize (Corn)',
    teluguName: 'మొక్కజొన్న',
    category: 'Cereal',
    varietyList: ['Yellow Hybrid', 'White Desi', 'Poultry Feed Grade', 'Sweet Corn Stalk'],
    shelfLifeDays: 210,
    perishable: false,
    standardUnit: '₹/Quintal',
    season: 'Kharif',
    mspPrice: 2225,
    description: 'Dual-use food and feed crop with steady industrial poultry and starch processing demand.'
  },
  {
    id: 'crop_groundnut',
    name: 'Groundnut (Peanut Pods)',
    teluguName: 'వేరుశనగ',
    category: 'Oilseed',
    varietyList: ['Bold Pods', 'Java', 'TMV-2', 'Kadiri-6', 'Spanish'],
    shelfLifeDays: 180,
    perishable: false,
    standardUnit: '₹/Quintal',
    season: 'Kharif',
    mspPrice: 6783,
    description: 'Major oilseed crop in Andhra Pradesh, Gujarat, and Karnataka traded in raw unshelled pods.'
  },
  {
    id: 'crop_bengal_gram',
    name: 'Bengal Gram (Chana)',
    teluguName: 'శనగలు',
    category: 'Pulse',
    varietyList: ['Desi Chana', 'Kabuli Bold', 'Gulabi', 'Annegiri', 'JG-11'],
    shelfLifeDays: 270,
    perishable: false,
    standardUnit: '₹/Quintal',
    season: 'Rabi',
    mspPrice: 5650,
    description: 'Major rabi pulse crucial for protein security; prices closely track government buffer procurement.'
  }
];

export const MANDIS_CATALOG: MandiInfo[] = [
  // Telangana
  {
    id: 'mandi_warangal',
    name: 'Warangal APMC Yard',
    teluguName: 'వరంగల్ వ్యవసాయ మార్కెట్ యార్డ్',
    state: 'Telangana',
    district: 'Warangal',
    code: 'TS_WGL_01',
    distanceKm: 28,
    lat: 17.9689,
    lng: 79.5941,
    avgDailyArrivalTonnes: 450,
    facilities: ['Electronic Weighbridge', 'Cold Storage Unit', 'Assaying Lab', 'e-NAM Integrated']
  },
  {
    id: 'mandi_khammam',
    name: 'Khammam Agricultural Market',
    teluguName: 'ఖమ్మం వ్యవసాయ మార్కెట్',
    state: 'Telangana',
    district: 'Khammam',
    code: 'TS_KMM_02',
    distanceKm: 85,
    lat: 17.2473,
    lng: 80.1514,
    avgDailyArrivalTonnes: 380,
    facilities: ['Covered Sheds', 'Drying Yards', 'e-Payment Facility', 'Farmer Rest House']
  },
  {
    id: 'mandi_nizamabad',
    name: 'Nizamabad Market Yard',
    teluguName: 'నిజామాబాద్ వ్యవసాయ మార్కెట్',
    state: 'Telangana',
    district: 'Nizamabad',
    code: 'TS_NZB_03',
    distanceKm: 140,
    lat: 18.6725,
    lng: 78.0941,
    avgDailyArrivalTonnes: 520,
    facilities: ['Turmeric Polishing Yard', 'Quality Testing Lab', 'e-NAM Clearing Hub']
  },
  {
    id: 'mandi_bowenpally',
    name: 'Hyderabad Bowenpally Terminal',
    teluguName: 'హైదరాబాద్ బోయిన్‌పల్లి టెర్మినల్',
    state: 'Telangana',
    district: 'Hyderabad',
    code: 'TS_HYD_04',
    distanceKm: 165,
    lat: 17.4721,
    lng: 78.4842,
    avgDailyArrivalTonnes: 850,
    facilities: ['Biogas Power Plant', '24x7 Unloading', 'Major Urban Consumption Hub']
  },
  {
    id: 'mandi_suryapet',
    name: 'Suryapet Market Committee',
    teluguName: 'సూర్యాపేట మార్కెట్ కమిటీ',
    state: 'Telangana',
    district: 'Suryapet',
    code: 'TS_SRP_05',
    distanceKm: 95,
    lat: 17.1439,
    lng: 79.6239,
    avgDailyArrivalTonnes: 290,
    facilities: ['Paddy Storage Sheds', 'Weighbridges']
  },

  // Andhra Pradesh
  {
    id: 'mandi_guntur',
    name: 'Guntur Mirchi Yard',
    teluguName: 'గుంటూరు మిర్చి యార్డ్ (ఆసియా అతిపెద్దది)',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    code: 'AP_GTR_01',
    distanceKm: 180,
    lat: 16.3067,
    lng: 80.4365,
    avgDailyArrivalTonnes: 1200,
    facilities: ['Cold Storage Hub (50k Tonnes)', 'Export Assaying Lab', 'e-NAM National Hub']
  },
  {
    id: 'mandi_kurnool',
    name: 'Kurnool APMC Market',
    teluguName: 'కర్నూలు వ్యవసాయ మార్కెట్',
    state: 'Andhra Pradesh',
    district: 'Kurnool',
    code: 'AP_KNL_02',
    distanceKm: 210,
    lat: 15.8281,
    lng: 78.0373,
    avgDailyArrivalTonnes: 410,
    facilities: ['Onion Grading Unit', 'Electronic Auction Halls']
  },
  {
    id: 'mandi_madanapalle',
    name: 'Madanapalle Tomato Yard',
    teluguName: 'మదనపల్లె టమోటా మార్కెట్',
    state: 'Andhra Pradesh',
    district: 'Annamayya',
    code: 'AP_MDP_03',
    distanceKm: 340,
    lat: 13.5500,
    lng: 78.5000,
    avgDailyArrivalTonnes: 900,
    facilities: ['Perishable Rapid Clearance', 'Reefer Truck Bays']
  },

  // Maharashtra
  {
    id: 'mandi_lasalgaon',
    name: 'Lasalgaon Onion APMC',
    teluguName: 'లసల్‌గావ్ ఉల్లి మార్కెట్ (మహారాష్ట్ర)',
    state: 'Maharashtra',
    district: 'Nashik',
    code: 'MH_NSK_01',
    distanceKm: 580,
    lat: 20.1472,
    lng: 74.2272,
    avgDailyArrivalTonnes: 1800,
    facilities: ['Asia Benchmark Onion Yard', 'Railway Siding Loading']
  },
  {
    id: 'mandi_nagpur',
    name: 'Nagpur Cotton & Orange Mandi',
    teluguName: 'నాగపూర్ కాటన్ & ధాన్య మార్కెట్',
    state: 'Maharashtra',
    district: 'Nagpur',
    code: 'MH_NGP_02',
    distanceKm: 310,
    lat: 21.1458,
    lng: 79.0882,
    avgDailyArrivalTonnes: 620,
    facilities: ['Cotton Ginning Linkage', 'Central Logistics Hub']
  },

  // Punjab & Central
  {
    id: 'mandi_khanna',
    name: 'Khanna Grain Market',
    teluguName: 'ఖన్నా ధాన్య మార్కెట్ (పంజాబ్)',
    state: 'Punjab',
    district: 'Ludhiana',
    code: 'PB_LDH_01',
    distanceKm: 1450,
    lat: 30.7071,
    lng: 76.2166,
    avgDailyArrivalTonnes: 2800,
    facilities: ['Asia Largest Grain Yard', 'Automated Cleaning & Bagging']
  },
  {
    id: 'mandi_indore',
    name: 'Indore Malwa Mandi',
    teluguName: 'ఇండోర్ వ్యవసాయ మార్కెట్',
    state: 'Madhya Pradesh',
    district: 'Indore',
    code: 'MP_IND_01',
    distanceKm: 620,
    lat: 22.7196,
    lng: 75.8577,
    avgDailyArrivalTonnes: 750,
    facilities: ['Soybean & Wheat Center', 'Direct Processor Procurement']
  }
];

// Helper to generate realistic historical AGMARKNET time-series price data
export function generateRealisticHistoricalSeries(
  cropId: string,
  mandiId: string,
  daysCount: number = 120
): HistoricalPriceRecord[] {
  const crop = CROPS_CATALOG.find(c => c.id === cropId) || CROPS_CATALOG[0];
  const mandi = MANDIS_CATALOG.find(m => m.id === mandiId) || MANDIS_CATALOG[0];

  // Base modal price per quintal by crop
  const basePrices: Record<string, number> = {
    crop_paddy: 2380,
    crop_rice: 3450,
    crop_wheat: 2540,
    crop_tomato: 1950,
    crop_onion: 2480,
    crop_potato: 1620,
    crop_cotton: 7420,
    crop_chilli: 19400,
    crop_turmeric: 13800,
    crop_maize: 2310,
    crop_groundnut: 6920,
    crop_bengal_gram: 5880
  };

  // Base arrival quantity by crop (in quintals)
  const baseArrivals: Record<string, number> = {
    crop_paddy: 3800,
    crop_rice: 1200,
    crop_wheat: 2900,
    crop_tomato: 5400,
    crop_onion: 4800,
    crop_potato: 4200,
    crop_cotton: 2100,
    crop_chilli: 1400,
    crop_turmeric: 1100,
    crop_maize: 3100,
    crop_groundnut: 1600,
    crop_bengal_gram: 1850
  };

  const baseP = basePrices[crop.id] || 2500;
  const baseA = baseArrivals[crop.id] || 2000;

  // Mandi price differential factor (e.g. Bowenpally has urban retail premium; Guntur has Chilli premium)
  let mandiFactor = 1.0;
  if (mandi.id === 'mandi_bowenpally') mandiFactor = 1.06;
  if (mandi.id === 'mandi_guntur' && crop.id === 'crop_chilli') mandiFactor = 1.08;
  if (mandi.id === 'mandi_lasalgaon' && crop.id === 'crop_onion') mandiFactor = 0.96; // Origin hub, lower prices
  if (mandi.id === 'mandi_nizamabad' && crop.id === 'crop_turmeric') mandiFactor = 1.05;

  const records: HistoricalPriceRecord[] = [];
  const today = new Date();

  // Synthetic deterministic random generator with fixed seed per crop/mandi for consistent reproducibility
  let seed = crop.id.length * 37 + mandi.id.length * 19;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  let currentPrice = baseP * mandiFactor;

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Day of week cycle: Sunday mandi closed or low arrival; Monday high arrivals
    const dayOfWeek = d.getDay();
    const dayArrivalMultiplier = dayOfWeek === 0 ? 0.35 : dayOfWeek === 1 ? 1.3 : 1.0;

    // Macro seasonal oscillation: sine wave representing harvest season cycles
    const seasonalWave = Math.sin((d.getMonth() * 30 + d.getDate()) / 58) * (crop.perishable ? 0.18 : 0.07);
    
    // Daily noise & mean reversion to basePrice
    const drift = (baseP * mandiFactor - currentPrice) * 0.04;
    const volatility = crop.perishable ? 0.045 : 0.015;
    const dailyShock = (pseudoRandom() - 0.49) * 2 * volatility * currentPrice;

    currentPrice = Math.max(crop.mspPrice * 0.7 || 500, Math.round(currentPrice + drift + dailyShock + (seasonalWave * baseP * 0.02)));

    // Min and Max prices spread around modal price
    const spread = Math.round(currentPrice * (0.04 + pseudoRandom() * 0.04));
    const minP = currentPrice - spread;
    const maxP = currentPrice + Math.round(spread * 1.15);

    // Arrival quantity with inverse price pressure correlation
    const arrivalNoise = (pseudoRandom() - 0.5) * 0.25;
    const arrivalQty = Math.max(120, Math.round(baseA * dayArrivalMultiplier * (1 + arrivalNoise - (dailyShock / currentPrice) * 2)));

    records.push({
      id: `rec_${crop.id}_${mandi.id}_${dateStr}`,
      date: dateStr,
      state: mandi.state,
      district: mandi.district,
      market: mandi.name,
      commodity: crop.name,
      variety: crop.varietyList[0] || 'Standard',
      minPrice: minP,
      maxPrice: maxP,
      modalPrice: currentPrice,
      arrivalQuantity: arrivalQty
    });
  }

  return records;
}

export const DATASET_REGISTRY: DatasetMeta[] = [
  {
    id: 'ds_agmarknet_2026',
    name: 'AGMARKNET Daily Mandi Wholesale Price Index (FY 2025-2026)',
    source: 'agmarknet.gov.in / Ministry of Agriculture & Farmers Welfare',
    totalRecords: 142850,
    startDate: '2025-04-01',
    endDate: '2026-11-03',
    uploadedBy: 'Rajesh Patel (Data Manager)',
    uploadDate: '2026-11-01',
    status: 'Validated',
    fileSizeMb: 42.8,
    statesCovered: 24,
    commoditiesCovered: 168
  },
  {
    id: 'ds_telangana_crop_arrivals',
    name: 'Telangana APMC Real-Time Arrivals & Modal Prices',
    source: 'Directorate of Agricultural Marketing, Govt of Telangana',
    totalRecords: 48920,
    startDate: '2025-06-01',
    endDate: '2026-11-02',
    uploadedBy: 'Rajesh Patel (Data Manager)',
    uploadDate: '2026-11-02',
    status: 'Validated',
    fileSizeMb: 14.6,
    statesCovered: 1,
    commoditiesCovered: 38
  },
  {
    id: 'ds_enam_national_trans',
    name: 'e-NAM National Agriculture Market Unified Spot Cleared Records',
    source: 'National Agriculture Market (enam.gov.in)',
    totalRecords: 86240,
    startDate: '2025-01-01',
    endDate: '2026-10-31',
    uploadedBy: 'Dr. Ananya Sharma (Admin)',
    uploadDate: '2026-10-31',
    status: 'Validated',
    fileSizeMb: 28.1,
    statesCovered: 18,
    commoditiesCovered: 94
  }
];

export const INITIAL_MODEL_METRICS: ModelPerformanceMetric[] = [
  {
    modelType: 'xgboost',
    modelName: 'XGBoost Regressor (Gradient Boosted Trees)',
    algorithm: 'Extreme Gradient Boosting with Lag & Rolling Arrival Features',
    mae: 42.6,
    rmse: 64.8,
    r2: 0.942,
    smape: 3.18,
    trainingTimeSec: 4.8,
    status: 'Production Active',
    bestFor: 'Non-linear spikes, perishable commodities (Tomato, Onion) and arrival glut interactions'
  },
  {
    modelType: 'random_forest',
    modelName: 'Random Forest Regressor (Ensemble Trees)',
    algorithm: '100 Bootstrap Decision Trees with Out-Of-Bag Error Estimation',
    mae: 46.2,
    rmse: 71.4,
    r2: 0.928,
    smape: 3.52,
    trainingTimeSec: 6.2,
    status: 'Candidate',
    bestFor: 'Stable durable cash crops (Cotton, Paddy, Wheat) with robust outlier resistance'
  },
  {
    modelType: 'linear_regression',
    modelName: 'Ridge Linear Regression (L2 Regularized)',
    algorithm: 'Ordinary Least Squares with L2 shrinkage penalty',
    mae: 78.4,
    rmse: 112.5,
    r2: 0.841,
    smape: 5.86,
    trainingTimeSec: 0.4,
    status: 'Benchmark Baseline',
    bestFor: 'Rapid trend baseline and macro economic index tracking'
  },
  {
    modelType: 'time_series_baseline',
    modelName: 'Holt-Winters Seasonal Smoothing (Triple Exp)',
    algorithm: 'Level, Trend and Multiplicative 7-Day & 30-Day Seasonal Harmonics',
    mae: 69.8,
    rmse: 98.2,
    r2: 0.864,
    smape: 4.95,
    trainingTimeSec: 0.8,
    status: 'Benchmark Baseline',
    bestFor: 'Short 7-day walk-forward univariate projections without external regressor inputs'
  }
];
