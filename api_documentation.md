# AgriPrice AI – REST API Documentation

Base URL: `http://localhost:3000/api` or `http://localhost:8000/api`

## 1. Authentication Endpoints

### `POST /api/auth/login`
Authenticates a user and returns a session token.
- **Request Body**:
  ```json
  {
    "email": "deepika.farmer@agriprice.in",
    "password": "password123",
    "role": "farmer"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "token": "jwt_mock_...",
    "user": {
      "id": "usr_01",
      "name": "Deepika",
      "role": "farmer",
      "state": "Telangana",
      "district": "Warangal"
    }
  }
  ```

---

## 2. Crops & Markets Catalog

### `GET /api/crops`
Returns all registered agricultural commodities with MSP and varieties.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "crops": [
      {
        "id": "crop_paddy",
        "name": "Paddy (Dhan)",
        "teluguName": "వరి (ధాన్యం)",
        "category": "Cereal",
        "varietyList": ["Common", "Grade A", "Basmati", "Sona Masuri", "BPT 5204"],
        "shelfLifeDays": 360,
        "perishable": false,
        "mspPrice": 2300
      }
    ]
  }
  ```

### `GET /api/markets`
Returns all registered APMC mandis. Filterable by `state`.

---

## 3. Prices & Historical Series

### `GET /api/prices/latest?cropId=crop_paddy&mandiId=mandi_warangal`
Returns the latest reported spot modal, minimum, and maximum prices, plus arrival volume.

### `GET /api/prices/history?cropId=crop_paddy&mandiId=mandi_warangal&days=90`
Returns chronological daily time-series records from the AGMARKNET repository.

---

## 4. Machine Learning Prediction

### `POST /api/predict`
Runs chronological time-series inference for a target crop, mandi, and horizon.
- **Request Body**:
  ```json
  {
    "cropId": "crop_paddy",
    "mandiId": "mandi_warangal",
    "variety": "BPT 5204",
    "forecastHorizon": 15,
    "modelType": "xgboost"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "prediction": {
      "cropName": "Paddy (Dhan)",
      "mandi": "Warangal APMC Yard",
      "currentModalPrice": 2380,
      "forecastHorizon": 15,
      "modelUsed": "xgboost",
      "summary": {
        "avgPredictedPrice": 2490,
        "priceChangePercentage": 4.6,
        "trend": "Moderate Bullish",
        "confidenceScore": 92
      },
      "forecast": [
        {
          "date": "2026-11-04",
          "dayName": "Wed",
          "predictedPrice": 2395,
          "lowerConfidenceBound": 2320,
          "upperConfidenceBound": 2470,
          "expectedArrivalQuantity": 1950
        }
      ],
      "modelMetrics": {
        "mae": 42.6,
        "rmse": 64.8,
        "r2Score": 0.942,
        "smape": 3.18
      }
    }
  }
  ```

---

## 5. Market Comparison & Logistics

### `GET /api/markets/compare?cropId=crop_paddy&referenceMandiId=mandi_warangal`
Returns multi-mandi modal prices, road distances, freight costs, and net realizable returns.

---

## 6. Admin & Datasets

### `POST /api/admin/upload-dataset`
Validates and ingests official APMC CSV datasets into the MongoDB data lake.

### `POST /api/admin/retrain`
Triggers walk-forward re-training and updates benchmark metrics across all models.
