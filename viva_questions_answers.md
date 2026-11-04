# AgriPrice AI – Comprehensive External Examiner Viva Voce Q&A
**Course**: B.Tech Computer Science and Engineering (CSE) Major Project  
**Project Title**: AgriPrice AI – AI-Based Crop Market Price Prediction and Smart Farmer Decision Support System  

---

### Category 1: Problem Domain, AGMARKNET & Agriculture Economics

#### Q1. What is the fundamental problem your project solves for Indian farmers?
**Answer:** Indian farmers face severe market price volatility, information asymmetries, and post-harvest distress selling. During peak harvest seasons, market arrivals surge, causing sudden localized price drops at nearby Agricultural Produce Market Committees (APMCs). Farmers lack forecasting tools to know whether holding produce for 7–15 days or traveling to an adjacent mandi with a higher clearing price would yield better net returns after transport costs. AgriPrice AI provides econometric price forecasting, multi-mandi freight arbitrage, and smart selling decision support.

#### Q2. Why is Modal Price used as the primary target instead of Average Price or Maximum Price?
**Answer:** Modal Price is the statistical mode — the exact price point at which the highest transaction volume occurred on that trading day. The simple average (Mean) is easily skewed by extreme outliers (such as damaged substandard crop lots sold very cheaply or premium organic lots sold at high premiums). Modal price represents the true clearing market price received by the vast majority of farmers.

#### Q3. What is the difference between AGMARKNET and e-NAM?
**Answer:**
- **AGMARKNET** (Agricultural Marketing Information Network) is a government portal launched by the Directorate of Marketing and Inspection (DMI) that collects daily wholesale arrival volumes and minimum, maximum, and modal prices across 3,000+ regulated APMC mandis.
- **e-NAM** (National Agriculture Market) is an electronic trading platform launched in 2016 to create a unified national digital market where buyers and commission agents across India can bid remotely on assayed physical agricultural commodities.

#### Q4. What is MSP (Minimum Support Price) and how does it relate to your ML model?
**Answer:** MSP is the guaranteed floor price announced by the Government of India for 23 mandated agricultural crops (including Paddy, Wheat, Cotton, Maize, and Bengal Gram) prior to the sowing season. In our ML forecasting engine, MSP acts as a realistic statistical lower support boundary: when predicted prices approach or fall below MSP, government procurement intervention historically slows down further price erosion.

---

### Category 2: Machine Learning, Time Series & Feature Engineering

#### Q5. Why is standard K-Fold Cross-Validation strictly forbidden for time-series forecasting?
**Answer:** Standard K-Fold cross-validation randomly shuffles dataset rows into k folds. In time-series data, random shuffling causes **data leakage** (also known as lookahead bias), where future price information is leaked into the training set to predict past prices. This artificially inflates R² scores during training but causes catastrophic failure in live deployment. We strictly implemented **chronological walk-forward validation**, where the training split always precedes the test split in time.

#### Q6. What features did you engineer from raw AGMARKNET records?
**Answer:**
1. **Price Lag Features:** Lag-1 day, Lag-7 days (weekly cycle), and Lag-30 days (monthly baseline).
2. **Rolling Window Averages:** 7-Day Moving Average (MA7) and 30-Day Moving Average (MA30) to decouple short-term auction noise from underlying trends.
3. **Price Volatility:** 7-day rolling standard deviation of modal prices.
4. **Arrival Pressure Ratio:** Current day arrival quantity divided by the 30-day moving average arrival quantity.
5. **Calendar Harmonics:** Sine and Cosine Fourier harmonics of the day-of-year to capture seasonal harvest waves (Kharif, Rabi, and Zaid).
6. **Day of Week:** Categorical index (0 to 6) capturing Sunday mandi closures and Monday liquidity peaks.

#### Q7. Why did XGBoost Regressor outperform Linear Regression and Random Forest?
**Answer:**
Agricultural spot markets exhibit **non-linear threshold phenomena**. For instance, price elasticity of supply is asymmetric: when market arrivals increase by 10%, price might drop by 2%, but when arrivals exceed 140% of normal capacity (a harvest glut), prices drop precipitously. Linear Regression assumes a strictly constant linear slope. Random Forest handles non-linearity via independent decision trees, but XGBoost sequentially trains trees to minimize the residual gradients of previous trees, capturing complex interactions between arrival shocks and seasonal cycles with superior precision (R² = 94.2% vs 84.1% for Linear Regression).

#### Q8. What evaluation metrics did you compute and why?
**Answer:**
- **MAE (Mean Absolute Error):** Direct, interpretable measure of average error in Indian Rupees per quintal (₹/q).
- **RMSE (Root Mean Squared Error):** Penalizes large outlier forecast errors heavily by squaring the deviations before taking the root.
- **R² Score (Coefficient of Determination):** Proportion of variance in crop modal prices explained by the engineered feature set (0.942 for XGBoost).
- **sMAPE (Symmetric Mean Absolute Percentage Error):** Normalized percentage error bound between 0% and 200%, avoiding division-by-zero anomalies.

#### Q9. How do you generate the 95% Confidence Interval for future prices?
**Answer:** We compute confidence intervals using walk-forward forecast uncertainty expansion:
$$\text{CI}_{95\%} = \hat{y}_t \pm 1.96 \cdot \sigma_t$$
where $\sigma_t = \sigma_{\text{base}} \cdot \sqrt{t}$, meaning the uncertainty envelope expands proportionally with the square root of the forecast horizon step $t$ (from day 1 to day 30), reflecting compounding econometric uncertainty over time.

---

### Category 3: System Architecture, Database & Decision Support

#### Q10. What is the role of the Smart Selling Recommendation Engine?
**Answer:** A pure price forecast (e.g. "Price will be ₹2,450/q in 10 days") is insufficient for a farmer. The Smart Selling Recommendation Engine translates numerical predictions into actionable operational directives:
1. **HOLD:** Recommended when projected price appreciation exceeds warehouse holding costs and produce shelf-life is adequate.
2. **SELL IMMEDIATELY:** Triggered during imminent arrival gluts or for perishable commodities (like Tomatoes with a 6-day shelf-life) where storage decay exceeds price gains.
3. **STAGGERED SELLING (50/50):** Risk-hedging strategy for range-bound markets to ensure immediate cash flow while retaining participation in upside potential.
4. **DIVERSIFY MANDI:** Recommended when an adjacent mandi offers a price premium exceeding roundtrip road freight costs.

#### Q11. How is road freight calculated for Mandi Comparison?
**Answer:** We model commercial agricultural transport costs based on rural Indian freight rates:
$$\text{Freight (₹/quintal)} = (\text{Distance in km} \times \text{Rate per km per quintal}) + \text{Loading/Unloading Cess}$$
Typically ₹1.8–₹2.2 per km per quintal + ₹35/q handling charge. The system computes Net Realizable Price = Reported Modal Price - Freight.

#### Q12. How does the application support local Indian languages?
**Answer:** AgriPrice AI features a native bilingual localization architecture supporting English and Telugu (తెలుగు), the primary regional language of Telangana and Andhra Pradesh. All agricultural terms, crop names (వరి, ప్రత్తి, మిర్చి, టమోటా), market yards, and farmer recommendations are translated with native agricultural terminology.

#### Q13. Describe your tech stack and role-based access control.
**Answer:**
- **Frontend:** React 19, Vite, Tailwind CSS v4, Recharts, and jsPDF.
- **Backend:** Express & FastAPI REST API architecture with Pydantic validation.
- **Database:** MongoDB schema with collections for users, crops, markets, market_prices, predictions, datasets, and model_metrics.
- **Roles:**
  - *Farmer:* View spot prices, run forecasts, compare mandis, view selling advisories, download PDF/CSV reports.
  - *Admin:* User management, model benchmarking, triggering walk-forward model retraining.
  - *Data Manager:* Ingest official CSV datasets, validate schema, remove duplicate records, and monitor data cleanliness.
