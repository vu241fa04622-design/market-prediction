# AgriPrice AI – System Architecture & Technical Specification

## 1. System Overview
AgriPrice AI is a full-stack, distributed AI decision support platform designed to bridge information asymmetries for Indian farmers. The system processes official agricultural market price feeds from the AGMARKNET and e-NAM platforms, extracts chronological lag and rolling features, executes machine learning time-series regression algorithms, and renders actionable selling advisories through responsive web dashboards with bilingual localization (English & Telugu).

## 2. Multi-Tier Architecture

```
[ CLIENT TIER (Farmer / Admin / Data Manager Web Browsers) ]
   |
   |-- HTTPS / REST Calls
   v
[ API GATEWAY & APPLICATION SERVER (Node/Express & FastAPI) ]
   |
   |-- [Authentication & RBAC Middleware (JWT / Session Tokens)]
   |-- [Crops & Mandis Catalog API]
   |-- [Spot & Historical Prices API]
   |-- [Multi-Mandi Freight Arbitrage Routing Engine]
   |-- [Dataset Ingestion & Outlier Validation Pipeline]
   v
[ MACHINE LEARNING FORECASTING PIPELINE ]
   |
   |-- [Chronological Feature Engineering (Lags, MA7, MA30, Volatility)]
   |-- [Arrival Pressure Ratio Calculator]
   |-- [Seasonal Fourier Harmonics Engine]
   |-- [Model Ensemble: XGBoost Regressor, Random Forest, Ridge Linear]
   |-- [95% Gaussian Confidence Envelope (sqrt(t) uncertainty)]
   v
[ SMART SELLING DECISION ADVISORY ENGINE ]
   |
   |-- [Crop Shelf Life Clamping (Tomato 6d vs Paddy 360d)]
   |-- [Net Payout Optimizer (Modal Price - Road Transit Freight)]
   |-- [Farmer-Centric Advisory Rules: HOLD / SELL / STAGGER / DIVERSIFY]
   v
[ DATA WAREHOUSE & PERSISTENCE TIER (MongoDB) ]
   |-- Collections: users, crops, markets, market_prices, predictions, datasets, model_metrics
```

## 3. Data Flow Diagram (DFD Level 0 & Level 1)

### Level 0 Context Diagram:
1. **Farmer User** inputs crop, location, and prediction horizon (7, 15, 30 days).
2. **AgriPrice AI Platform** queries AGMARKNET database, executes ML model, computes road freight, and returns predicted prices, interactive trajectory graphs, and smart selling recommendations.
3. **Data Manager** uploads bulk APMC CSV records; system validates, deduplicates, and ingests into MongoDB.
4. **Admin** inspects model benchmarks (MAE, RMSE, R²) and triggers walk-forward retraining.

### Level 1 Decomposition:
- **Process 1.0 (Auth & Access):** JWT token verification, role permissions.
- **Process 2.0 (Price Ingestion):** Schema validation, outlier clamping, non-trading day imputation.
- **Process 3.0 (Feature Extraction):** Recursive calculation of lag-1, lag-7, lag-30, rolling MA7/MA30, and arrival elasticity.
- **Process 4.0 (Inference & Uncertainty):** Multi-step recursive forecasting with error propagation: $\pm 1.96 \cdot \sigma \sqrt{t}$.
- **Process 5.0 (Decision Support):** Rules engine linking perishability, holding cost, and net freight arbitrage.
- **Process 6.0 (Reporting):** Client-side PDF compilation via jsPDF and CSV generation.
