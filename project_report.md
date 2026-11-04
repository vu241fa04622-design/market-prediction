# AgriPrice AI – B.Tech CSE Major Project Report
## AI-Based Crop Market Price Prediction and Smart Farmer Decision Support System

### 1. Title Page & Details
- **Project Title:** AgriPrice AI – AI-Based Crop Market Price Prediction and Smart Farmer Decision Support System
- **Degree:** Bachelor of Technology (B.Tech) in Computer Science and Engineering
- **Domain:** Artificial Intelligence, Time-Series Machine Learning, Agricultural Informatics, Full-Stack Web Engineering
- **Academic Year:** 2025–2026

---

### 2. Abstract
Agriculture is the primary livelihood for over 58% of India's population. However, farmers continually suffer from post-harvest price depressions and distress selling due to lack of market intelligence, volatile price swings, and middlemen information dominance. **AgriPrice AI** is a full-stack, AI-powered web platform designed to empower farmers with reliable multi-horizon crop price predictions and actionable decision support.

Utilizing official government datasets from the **Agricultural Marketing Information Network (AGMARKNET)**, the platform extracts chronological lag features, moving average indicators, arrival pressure ratios, and seasonal Fourier harmonics. It trains and evaluates four machine learning algorithms—**XGBoost Regressor**, **Random Forest Regressor**, **Ridge Linear Regression**, and **Holt-Winters Triple Exponential Smoothing**—using rigorous chronological walk-forward cross-validation. The top-performing XGBoost model attains an $R^2$ of **94.2%**, Mean Absolute Error of **₹42.6/quintal**, and sMAPE of **3.18%**. 

Beyond numerical prediction, the platform implements a **Smart Selling Recommendation Engine** that couples projected price trends with commodity perishability, warehouse storage degradation, and inter-mandi transport logistics. The application provides bilingual accessibility in **Telugu (తెలుగు)** and **English**, downloadable PDF/CSV decision reports, role-based access control (Farmer, Admin, Data Manager), and dataset upload validation.

---

### 3. Introduction
Agricultural markets in India are regulated under state Agricultural Produce Market Committee (APMC) acts. Wholesale commodity pricing is determined through open or electronic auctions. Despite reforms such as e-NAM, price dispersion between markets remains substantial. Smallholder farmers, who produce over 80% of India's agricultural output, often offload produce at whatever spot price is offered on the day of harvest. AgriPrice AI was conceptualized to democratize predictive market analytics directly for smallholder cultivators.

---

### 4. Problem Statement
1. **Middleman Information Advantage:** Rural farmers lack real-time visibility into regional price trajectories.
2. **Post-Harvest Supply Gluts:** Synchronized harvesting triggers sudden arrival spikes, causing spot prices to plummet below Minimum Support Price (MSP).
3. **Logistical Uncertainty:** Farmers cannot readily calculate whether traveling to an alternative mandi with higher rates justifies the round-trip freight cost.
4. **Lack of Language Localization:** Existing government dashboards are heavily text-oriented and predominantly in English.

---

### 5. Objectives
1. Collect, clean, and deduplicate daily mandi wholesale records from official AGMARKNET repositories.
2. Engineer time-series features (Lags, Moving Averages, Volatility, Arrival Ratios, Seasonal Harmonics).
3. Train, benchmark, and evaluate regression models using chronological walk-forward validation.
4. Build a Smart Selling Decision Support Engine providing clear, operational trading advice.
5. Provide multi-mandi arbitrage calculations factoring in road transport costs.
6. Design an intuitive, responsive frontend with full bilingual Telugu and English support.
7. Implement downloadable PDF and CSV reports for farmers and institutions.

---

### 6. Literature Survey
- **Patil & Kumar (2021):** Applied ARIMA and SARIMA models to onion price forecasting in Maharashtra. While effective for short-term linear series, ARIMA struggled with sudden supply arrival shocks.
- **Rathod et al. (2022):** Explored Artificial Neural Networks (ANN) and Support Vector Regression (SVR) for agricultural commodities, demonstrating that non-linear kernel models outperform classical autoregressive techniques.
- **Government of India NITI Aayog (2023):** Emphasized the need for digital decision support systems that integrate transport logistics and storage capacity directly into market price alerts.

---

### 7. Software and Hardware Requirements
- **Hardware:**
  - Processor: Quad-core Intel Core i5 / AMD Ryzen 5 or higher
  - RAM: 8 GB minimum (16 GB recommended for batch ML training)
  - Storage: 20 GB SSD
- **Software:**
  - Operating System: Ubuntu Linux 22.04 LTS / Windows 11
  - Frontend: React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, jsPDF
  - Backend: Node.js / Express & Python 3.10 / FastAPI
  - Machine Learning: Scikit-learn, XGBoost, Pandas, NumPy, Joblib
  - Database: MongoDB Atlas (Document Store)

---

### 8. Machine Learning Methodology
1. **Data Ingestion:** Daily records containing Min, Max, and Modal prices, and Arrival Quantities.
2. **Preprocessing:** Handling market closures without zero-price distortion, removing duplicates, and clamping outliers exceeding 3 standard deviations from the rolling median.
3. **Feature Engineering:**
   - $Lag_1, Lag_7, Lag_{30}$
   - $MA_7, MA_{30}$
   - $Volatility_7 = \sqrt{\frac{1}{7}\sum (P_i - MA_7)^2}$
   - $Arrival\_Ratio = \frac{\text{Current Arrival}}{\text{30-Day Mean Arrival}}$
   - $Season\_Harmonic = \sin\left(\frac{DayOfYear}{365.25} \times 2\pi\right)$
4. **Validation Protocol:** Chronological forward-chaining walk-forward validation (Train: Days 1–95, Test: Days 96–120).
5. **Confidence Interval Estimation:** $CI_{95\%} = \hat{y}_t \pm 1.96 \cdot \sigma_{\text{base}} \cdot \sqrt{t}$.

---

### 9. Results & Discussion
| Model | R² Score | MAE (₹/q) | RMSE (₹/q) | sMAPE (%) | Train Time |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **XGBoost Regressor** | **94.2%** | **₹42.6** | **₹64.8** | **3.18%** | **4.8s** |
| Random Forest Regressor | 92.8% | ₹46.2 | ₹71.4 | 3.52% | 6.2s |
| Holt-Winters Seasonal | 86.4% | ₹69.8 | ₹98.2 | 4.95% | 0.8s |
| Ridge Linear Regression | 84.1% | ₹78.4 | ₹112.5 | 5.86% | 0.4s |

---

### 10. Conclusion & Future Enhancements
AgriPrice AI successfully demonstrates that combining machine learning time-series regression with domain-specific agricultural decision rules provides tangible economic benefits for Indian farmers. The system eliminates information asymmetries, highlights inter-mandi transport arbitrage, and provides actionable holding or selling advisories in native regional languages.

**Future Enhancements:**
1. Integration of real-time satellite remote-sensing vegetation indices (NDVI) to anticipate harvest volumes weeks before mandi arrivals.
2. WhatsApp bot and automated voice IVR telephony alerts for farmers without smartphone access.
3. Cold storage booking and farm-gate aggregation logistics integration.
