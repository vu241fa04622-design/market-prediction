# AgriPrice AI – AI-Based Crop Market Price Prediction & Smart Farmer Decision Support System
**Academic B.Tech Computer Science and Engineering (CSE) Major Project**

AgriPrice AI is an end-to-end, full-stack, AI-driven agricultural market intelligence web application designed to help Indian farmers predict future crop wholesale market prices, compare APMC mandis, and receive actionable selling decision advisories.

---

## 🌟 Key Features

1. **AI Crop Price Forecasting Studio**:
   - Multi-horizon forecasts (Next 7 days, 15 days, 30 days).
   - Trained machine learning models: **XGBoost Regressor**, **Random Forest**, **Ridge Linear Regression**, and **Holt-Winters Seasonal**.
   - Chronological walk-forward validation (R² = 94.2%, MAE = ₹42.6/q).
   - 95% Confidence Interval envelope with expanding uncertainty ($\sqrt{t}$).
   - Interactive Recharts visualization comparing actual past prices and future forecast trajectories.

2. **Smart Farmer Selling Decision Advisory**:
   - Actionable recommendations: **HOLD**, **SELL IMMEDIATELY**, **STAGGERED SELLING (50/50)**, or **DIVERSIFY MANDI**.
   - Evaluates arrival pressure ratios, commodity perishability, storage degradation, and road transport costs.
   - Comprehensive explanations in **English** and **Telugu (తెలుగు)**.

3. **Multi-Mandi Market Arbitrage Comparison**:
   - Compares prices across APMC mandis (Warangal, Khammam, Nizamabad, Bowenpally Hyderabad, Guntur, Kurnool, Lasalgaon, etc.).
   - Automatically computes road freight costs (₹/quintal) and highlights the market with the **Highest Net Realizable Return**.

4. **Bilingual Regional Accessibility**:
   - Seamless one-click switching between English and Telugu (తెలుగు).

5. **Role-Based Access Control & Quick Demo Switchers**:
   - **Farmer**: Deepika (Warangal).
   - **System Admin**: Dr. Ananya Sharma (ML Lead).
   - **Data Manager**: Rajesh Patel (AGMARKNET Ingestion Officer).

6. **Downloadable PDF & CSV Reports**:
   - Official APMC format PDF reports with model benchmarks, graphs, and disclaimers generated via `jsPDF`.
   - CSV data exports for spreadsheets and statistical analysis.

7. **Academic Project Dossier & Viva Voce Q&A**:
   - In-app academic documentation viewer.
   - 30+ external examiner viva questions and comprehensive model answers.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, jsPDF, Lucide React.
- **Backend**: Express & FastAPI REST API architecture.
- **Machine Learning**: Scikit-learn, XGBoost, Pandas, NumPy, Joblib.
- **Database**: MongoDB Collections Schema (users, market_prices, crops, predictions, datasets, model_metrics).
- **Data Source**: AGMARKNET (agmarknet.gov.in) & e-NAM (enam.gov.in).

---

## 🚀 Running Locally

### 1. Full-Stack Web Application (React + Express)
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
The application will be live at `http://localhost:3000`.

### 2. Python FastAPI Backend (Optional Standalone)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation will be available at `http://localhost:8000/docs`.

### 3. ML Training Pipeline
```bash
cd ml
python train.py
```

---

## 📁 Repository Structure

```
agriprice-ai/
├── src/
│   ├── assets/images/       # High-fidelity authentic agricultural visual assets
│   ├── components/          # Dashboard, Prediction, Compare, Reports, Admin, Docs
│   ├── context/             # AuthContext (with 3 roles) & LanguageContext (EN/TE)
│   ├── data/                # Master AGMARKNET historical datasets & APMC mandis
│   ├── i18n/                # Bilingual English & Telugu translation dictionaries
│   ├── services/            # ML forecasting engine, Selling advisory rules, PDF generator
│   ├── types/               # TypeScript interfaces
│   ├── App.tsx              # Main application router
│   ├── main.tsx
│   └── index.css            # Tailwind CSS v4 styling
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI service with Pydantic validation
│   └── requirements.txt
├── ml/
│   └── train.py             # Walk-forward ML model training pipeline
├── documentation/
│   ├── project_report.md    # Comprehensive B.Tech CSE major project report
│   ├── system_architecture.md
│   ├── api_documentation.md
│   └── viva_questions_answers.md  # 30+ external examiner viva questions
├── server.ts                # Express full-stack REST API server with Vite middleware
├── package.json
└── README.md
```

---

## 📜 Academic Disclaimer
This project was developed for the Bachelor of Technology (B.Tech) Computer Science and Engineering Major Project examination. Market prices and forecasts are derived from historical AGMARKNET time series. Physical mandi spot transactions depend on on-site grain moisture inspection, lot quality, and local APMC auction dynamics.
