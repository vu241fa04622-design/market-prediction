/**
 * AgriPrice AI - Bilingual Translations (English & Telugu)
 * Provides native terminology for Indian farmers and academic evaluation.
 */

export type Language = 'en' | 'te';

export const TRANSLATIONS = {
  en: {
    appTitle: 'AgriPrice AI',
    appSubtitle: 'Crop Market Price Prediction & Smart Farmer Decision Support System',
    tagline: 'Empowering Indian Farmers with Machine Learning & AGMARKNET Market Intelligence',

    // Nav
    navHome: 'Home',
    navDashboard: 'Dashboard',
    navCrops: 'Crop Selection',
    navCurrentPrices: 'Mandi Prices',
    navPrediction: 'AI Prediction',
    navCompare: 'Compare Mandis',
    navRecommendation: 'Selling Advisory',
    navTrends: 'Historical Trends',
    navHistory: 'Prediction Log',
    navReports: 'Reports & Export',
    navAdmin: 'Admin Console',
    navDataManager: 'Dataset Manager',
    navAcademic: 'Academic Docs & Viva',

    // Auth
    roleFarmer: 'Farmer',
    roleAdmin: 'System Admin',
    roleDataManager: 'Data Manager',
    login: 'Log In',
    register: 'Farmer Registration',
    logout: 'Log Out',
    demoUserSwitch: 'Switch Demo Persona',
    farmerPersona: 'Deepika (Farmer, Warangal)',
    adminPersona: 'Dr. Ananya Sharma (Admin / ML Lead)',
    dataManagerPersona: 'Rajesh Patel (AGMARKNET Data Officer)',

    // Dashboard Cards
    totalCrops: 'Monitored Crops',
    activeMandis: 'APMC Mandis',
    modelAccuracy: 'Model R² Accuracy',
    latestReportingDate: 'Latest AGMARKNET Date',
    savedFavorites: 'Favorite Crops',
    quickPredict: 'Generate New Forecast',
    viewAllPrices: 'View All Mandi Prices',

    // Prediction module
    selectCrop: 'Select Crop',
    selectState: 'Select State',
    selectDistrict: 'Select District',
    selectMandi: 'Select Mandi (Market Yard)',
    selectVariety: 'Crop Variety',
    forecastHorizon: 'Prediction Horizon',
    days7: 'Next 7 Days',
    days15: 'Next 15 Days',
    days30: 'Next 30 Days',
    modelSelector: 'Forecasting Algorithm',
    btnPredict: 'Run AI Price Prediction',
    predicting: 'Running ML Walk-Forward Inference...',

    // Forecast Results
    currentModalPrice: 'Current Modal Price',
    predictedAverage: 'Predicted Average',
    expectedRange: 'Expected Price Range',
    confidenceInterval: '95% Confidence Interval',
    priceTrend: 'Projected Trend',
    percentChange: 'Expected Price Change',
    perQuintal: '₹/quintal',
    actualHistorical: 'Actual Historical Prices',
    aiPredicted: 'AI Forecasted Trajectory',
    upperConfidence: 'Upper Bound (95%)',
    lowerConfidence: 'Lower Bound (95%)',

    // Selling Decision Support
    decisionTitle: 'Smart Selling Decision Support',
    recommendedAction: 'Recommended Farmer Action',
    timeframe: 'Recommended Window',
    netBenefit: 'Estimated Net Realization',
    keyFactors: 'Influencing Market Drivers',
    actionHold: 'Hold Stock',
    actionSellNow: 'Sell Immediately',
    actionSplit: 'Staggered Selling (50/50)',
    actionDiversify: 'Explore Alternative Mandi',

    // Mandi Comparison
    compareTitle: 'Multi-Mandi Price & Freight Arbitrage',
    compareSubtitle: 'Compare local vs regional wholesale markets with transport cost deduction',
    mandiName: 'Mandi Name',
    distance: 'Distance',
    modalPrice: 'Reported Modal Price',
    arrivalQty: 'Daily Arrival',
    freightCost: 'Transport Cost',
    netPrice: 'Net Realizable Price',
    recommendBest: 'Highest Net Realization',

    // Common
    loading: 'Loading data...',
    downloadPdf: 'Download PDF Report',
    downloadCsv: 'Download CSV Data',
    retrainModel: 'Retrain ML Pipeline',
    status: 'Status',
    date: 'Date',
    actions: 'Actions',
    academicDisclaimer: 'Academic Project Disclaimer: Predictions are computed from historical AGMARKNET datasets using walk-forward machine learning algorithms for B.Tech Major Project research.'
  },

  te: {
    appTitle: 'అగ్రిప్రైస్ ఏఐ (AgriPrice AI)',
    appSubtitle: 'పంట మార్కెట్ ధర అంచనా మరియు రైతు నిర్ణయ మద్దతు వ్యవస్థ',
    tagline: 'భారతీయ రైతులకు మెషిన్ లెర్నింగ్ మరియు మార్కెట్ సమాచారంతో సాధికారత',

    // Nav
    navHome: 'హోమ్',
    navDashboard: 'రైతు డ్యాష్‌బోర్డ్',
    navCrops: 'పంట ఎంపిక',
    navCurrentPrices: 'మార్కెట్ ధరలు',
    navPrediction: 'ధర అంచనా (AI)',
    navCompare: 'మార్కెట్ల పోలిక',
    navRecommendation: 'విక్రయ సిఫార్సు',
    navTrends: 'ధరల సరళి విశ్లేషణ',
    navHistory: 'అంచనా చరిత్ర',
    navReports: 'నివేదికలు (Reports)',
    navAdmin: 'అడ్మిన్ విభాగం',
    navDataManager: 'డేటా మేనేజర్',
    navAcademic: 'ప్రాజెక్ట్ డాక్యుమెంటేషన్',

    // Auth
    roleFarmer: 'రైతు',
    roleAdmin: 'అడ్మినిస్ట్రేటర్',
    roleDataManager: 'డేటా మేనేజర్',
    login: 'లాగిన్ అవ్వండి',
    register: 'రైతు నమోదు (రిజిస్ట్రేషన్)',
    logout: 'లాగౌట్',
    demoUserSwitch: 'వినియోగదారుని మార్చండి',
    farmerPersona: 'దీపిక (రైతు, వరంగల్)',
    adminPersona: 'డాక్టర్ అనన్య శర్మ (అడ్మిన్)',
    dataManagerPersona: 'రాజేష్ పటేల్ (డేటా మేనేజర్)',

    // Dashboard Cards
    totalCrops: 'మొత్తం పంటలు',
    activeMandis: 'అందుబాటులో ఉన్న మార్కెట్లు',
    modelAccuracy: 'మోడల్ కచ్చితత్వం (R²)',
    latestReportingDate: 'తాజా మార్కెట్ తేదీ',
    savedFavorites: 'ఇష్టమైన పంటలు',
    quickPredict: 'కొత్త ధర అంచనా వేయండి',
    viewAllPrices: 'మార్కెట్ ధరలు చూడండి',

    // Prediction module
    selectCrop: 'పంటను ఎంచుకోండి',
    selectState: 'రాష్ట్రం ఎంచుకోండి',
    selectDistrict: 'జిల్లా ఎంచుకోండి',
    selectMandi: 'మార్కెట్ యార్డ్ (మండి) ఎంచుకోండి',
    selectVariety: 'పంట రకం (వెరైటీ)',
    forecastHorizon: 'అంచనా వేసే వ్యవధి',
    days7: 'రాబోయే 7 రోజులు',
    days15: 'రాబోయే 15 రోజులు',
    days30: 'రాబోయే 30 రోజులు',
    modelSelector: 'AI అల్గారిథమ్ ఎంపిక',
    btnPredict: 'భవిష్యత్ ధరను అంచనా వేయండి',
    predicting: 'ధరను లెక్కించడం జరుగుతోంది...',

    // Forecast Results
    currentModalPrice: 'ప్రస్తుత మార్కెట్ మోడల్ ధర',
    predictedAverage: 'అంచనా సగటు ధర',
    expectedRange: 'అంచనా ధర పరిధి',
    confidenceInterval: '95% నమ్మక పరిధి',
    priceTrend: 'ధర పెరుగుదల/తగ్గుదల ట్రెండ్',
    percentChange: 'ధర మార్పు శాతం',
    perQuintal: '₹/క్వింటాల్',
    actualHistorical: 'గత అసలు ధరలు',
    aiPredicted: 'భవిష్యత్ అంచనా ధర',
    upperConfidence: 'గరిష్ట అంచనా పరిమితి',
    lowerConfidence: 'కనిష్ట అంచనా పరిమితి',

    // Selling Decision Support
    decisionTitle: 'రైతుకు స్మార్ట్ విక్రయ సిఫార్సు',
    recommendedAction: 'రైతు చేయవలసిన సిఫార్సు చర్య',
    timeframe: 'సిఫార్సు చేసిన సమయం',
    netBenefit: 'ఆశించే నికర లాభం',
    keyFactors: 'ప్రభావితం చేసే మార్కెట్ అంశాలు',
    actionHold: 'నిల్వ ఉంచండి (ధర పెరుగుతుంది)',
    actionSellNow: 'వెంటనే విక్రయించండి',
    actionSplit: 'విడతలవారీగా విక్రయించండి (50/50)',
    actionDiversify: 'మరొక మార్కెట్ లో అమ్మండి',

    // Mandi Comparison
    compareTitle: 'వివిధ మార్కెట్ల ధరలు & రవాణా ఖర్చుల పోలిక',
    compareSubtitle: 'రవాణా ఖర్చు తీసివేసిన తర్వాత మీకు లభించే నికర ఆదాయాన్ని సరిపోల్చుకోండి',
    mandiName: 'మార్కెట్ పేరు',
    distance: 'దూరం (కి.మీ)',
    modalPrice: 'ప్రస్తుత మోడల్ ధర',
    arrivalQty: 'రోజువారీ రాక (క్వింటాళ్ళు)',
    freightCost: 'రవాణా ఖర్చు',
    netPrice: 'నికర ఆదాయం (ఖర్చు పోను)',
    recommendBest: 'అత్యధిక నికర లాభం ఇచ్చే మార్కెట్',

    // Common
    loading: 'డేటా లోడ్ అవుతోంది...',
    downloadPdf: 'PDF రిపోర్ట్ డౌన్‌లోడ్ చేసుకోండి',
    downloadCsv: 'CSV డేటా డౌన్‌లోడ్ చేసుకోండి',
    retrainModel: 'మోడల్ ను అప్డేట్ చేయండి',
    status: 'స్థితి',
    date: 'తేదీ',
    actions: 'చర్యలు',
    academicDisclaimer: 'గమనిక: ఈ అంచనాలు గత ప్రభుత్వ అగ్మార్క్‌నెట్ (AGMARKNET) డేటా ఆధారంగా మెషిన్ లెర్నింగ్ మోడల్స్ ద్వారా గణించబడ్డాయి. మార్కెట్ కు వెళ్లే ముందు స్థానిక మార్కెట్ యార్డ్ ధరలను సరిచూసుకోండి.'
  }
};
