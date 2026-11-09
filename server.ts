# Complete corrected `server.ts`

Replace your entire existing `server.ts` with this code:

```tsx
import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  CROPS_CATALOG,
  MANDIS_CATALOG,
  generateRealisticHistoricalSeries,
  DATASET_REGISTRY,
  INITIAL_MODEL_METRICS
} from './agmarknetData.ts';

import { runPricePrediction } from './mlEngine.ts';

import type {
  ForecastHorizon,
  MLModelType,
  MandiComparisonItem
} from './index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '15mb' }));

  // In-memory application data
  let datasetsState = [...DATASET_REGISTRY];
  let modelMetricsState = [...INITIAL_MODEL_METRICS];
  let serverPredictionsLog: any[] = [];

  // Seed initial prediction history
  const initialHistoryPaddy =
    generateRealisticHistoricalSeries(
      'crop_paddy',
      'mandi_warangal',
      90
    );

  const seedPred1 = runPricePrediction(
    initialHistoryPaddy,
    'crop_paddy',
    'mandi_warangal',
    'BPT 5204',
    7,
    'xgboost',
    'usr_farmer_01'
  );

  serverPredictionsLog.push(seedPred1);

  // ---------------------------------------
  // Authentication APIs
  // ---------------------------------------

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, role } = req.body;

    const token = `jwt_mock_${Date.now()}_${Buffer.from(
      email || 'farmer'
    ).toString('base64')}`;

    res.json({
      success: true,
      token,
      user: {
        id: `usr_${Date.now().toString(36)}`,
        email: email || 'farmer@agriprice.in',
        name: email ? email.split('@')[0] : 'Farmer User',
        role: role || 'farmer',
        state: 'Telangana',
        district: 'Warangal'
      }
    });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, phone, state, district } = req.body;

    const token = `jwt_mock_${Date.now()}_${Buffer.from(
      email || 'new'
    ).toString('base64')}`;

    res.json({
      success: true,
      token,
      user: {
        id: `usr_${Date.now().toString(36)}`,
        name,
        email,
        phone,
        role: 'farmer',
        state,
        district
      }
    });
  });

  app.get('/api/admin/users', (_req: Request, res: Response) => {
    res.json({
      success: true,
      users: [
        {
          id: 'usr_01',
          name: 'Deepika',
          role: 'farmer',
          state: 'Telangana',
          district: 'Warangal',
          activePredictions: 14,
          lastActive: '10 mins ago'
        },
        {
          id: 'usr_02',
          name: 'Mallesh Goud',
          role: 'farmer',
          state: 'Telangana',
          district: 'Khammam',
          activePredictions: 8,
          lastActive: '2 hours ago'
        },
        {
          id: 'usr_03',
          name: 'Venkat Rao',
          role: 'farmer',
          state: 'Andhra Pradesh',
          district: 'Guntur',
          activePredictions: 22,
          lastActive: '1 day ago'
        },
        {
          id: 'usr_04',
          name: 'Dr. Ananya Sharma',
          role: 'admin',
          state: 'Telangana',
          district: 'Hyderabad',
          activePredictions: 45,
          lastActive: 'Active Now'
        },
        {
          id: 'usr_05',
          name: 'Rajesh Patel',
          role: 'data_manager',
          state: 'Maharashtra',
          district: 'Nashik',
          activePredictions: 31,
          lastActive: 'Active Now'
        }
      ]
    });
  });

  // ---------------------------------------
  // Crops and Markets APIs
  // ---------------------------------------

  app.get('/api/crops', (_req: Request, res: Response) => {
    res.json({
      success: true,
      crops: CROPS_CATALOG
    });
  });

  app.get('/api/crops/:id', (req: Request, res: Response) => {
    const crop = CROPS_CATALOG.find(
      c => c.id === req.params.id
    );

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    res.json({
      success: true,
      crop
    });
  });

  app.get('/api/markets', (req: Request, res: Response) => {
    const { state } = req.query;

    let mandis = MANDIS_CATALOG;

    if (state && typeof state === 'string') {
      mandis = mandis.filter(
        m => m.state.toLowerCase() === state.toLowerCase()
      );
    }

    res.json({
      success: true,
      mandis
    });
  });

  // ---------------------------------------
  // Market Prices APIs
  // ---------------------------------------

  app.get('/api/prices/latest', (req: Request, res: Response) => {
    const { cropId, mandiId } = req.query;

    const targetCrop =
      (typeof cropId === 'string' && cropId) || 'crop_paddy';

    const targetMandi =
      (typeof mandiId === 'string' && mandiId) || 'mandi_warangal';

    const history = generateRealisticHistoricalSeries(
      targetCrop,
      targetMandi,
      7
    );

    const latest = history[history.length - 1];

    res.json({
      success: true,
      latestPrice: latest,
      recent7Days: history
    });
  });

  app.get('/api/prices/history', (req: Request, res: Response) => {
    const { cropId, mandiId, days } = req.query;

    const targetCrop =
      (typeof cropId === 'string' && cropId) || 'crop_paddy';

    const targetMandi =
      (typeof mandiId === 'string' && mandiId) || 'mandi_warangal';

    const daysCount = Math.min(
      Math.max(Number(days) || 120, 1),
      365
    );

    const records = generateRealisticHistoricalSeries(
      targetCrop,
      targetMandi,
      daysCount
    );

    res.json({
      success: true,
      cropId: targetCrop,
      mandiId: targetMandi,
      totalRecords: records.length,
      records
    });
  });

  // ---------------------------------------
  // Mandi Comparison API
  // ---------------------------------------

  app.get('/api/markets/compare', (req: Request, res: Response) => {
    const { cropId, referenceMandiId } = req.query;

    const targetCrop =
      (typeof cropId === 'string' && cropId) || 'crop_paddy';

    const refMandi =
      (typeof referenceMandiId === 'string' && referenceMandiId) ||
      'mandi_warangal';

    const cropObj =
      CROPS_CATALOG.find(c => c.id === targetCrop) ||
      CROPS_CATALOG[0];

    const mandisToCompare = MANDIS_CATALOG.slice(0, 5);

    const comparison: MandiComparisonItem[] =
      mandisToCompare.map(mandi => {
        const history = generateRealisticHistoricalSeries(
          cropObj.id,
          mandi.id,
          10
        );

        const latest = history[history.length - 1];

        const distance =
          mandi.id === refMandi ? 0 : mandi.distanceKm;

        const freightPerQuintal =
          distance === 0 ? 0 : Math.round(distance * 0.95 + 40);

        const predicted7DayPrice =
          Math.round(latest.modalPrice * 1.03);

        const netRealizablePrice =
          latest.modalPrice - freightPerQuintal;

        return {
          mandiId: mandi.id,
          mandiName: mandi.name,
          district: mandi.district,
          state: mandi.state,
          distanceKm: distance,
          latestReportedDate: latest.date,
          minPrice: latest.minPrice,
          maxPrice: latest.maxPrice,
          modalPrice: latest.modalPrice,
          arrivalQuantityQuintals: latest.arrivalQuantity,
          predicted7DayPrice,
          estimatedFreightPerQuintal: freightPerQuintal,
          netRealizablePrice,
          ratingScore: mandi.facilities.length >= 3 ? 4.8 : 4.2
        };
      });

    res.json({
      success: true,
      crop: cropObj,
      referenceMandi: refMandi,
      comparison
    });
  });

  // ---------------------------------------
  // AI Price Prediction API
  // ---------------------------------------

  app.post('/api/predict', (req: Request, res: Response) => {
    try {
      const {
        cropId = 'crop_paddy',
        mandiId = 'mandi_warangal',
        variety = 'Common',
        forecastHorizon = 7,
        modelType = 'xgboost',
        userId = 'usr_farmer_01'
      } = req.body;

      const historical = generateRealisticHistoricalSeries(
        cropId,
        mandiId,
        120
      );

      const prediction = runPricePrediction(
        historical,
        cropId,
        mandiId,
        variety,
        Number(forecastHorizon) as ForecastHorizon,
        modelType as MLModelType,
        userId
      );

      serverPredictionsLog.unshift(prediction);

      if (serverPredictionsLog.length > 50) {
        serverPredictionsLog.pop();
      }

      res.json({
        success: true,
        prediction
      });
    } catch (error) {
      console.error('Prediction error:', error);

      res.status(500).json({
        success: false,
        message: 'Unable to generate prediction'
      });
    }
  });

  app.get('/api/predictions/history', (_req: Request, res: Response) => {
    res.json({
      success: true,
      predictions: serverPredictionsLog
    });
  });

  // ---------------------------------------
  // Admin Dataset APIs
  // ---------------------------------------

  app.get('/api/admin/datasets', (_req: Request, res: Response) => {
    res.json({
      success: true,
      datasets: datasetsState
    });
  });

  app.post('/api/admin/upload-dataset', (req: Request, res: Response) => {
    const {
      datasetName,
      source,
      recordCount,
      fileSizeMb
    } = req.body;

    const newDs = {
      id: `ds_${Date.now()}`,
      name: datasetName || 'Uploaded Mandi Price CSV Batch',
      source: source || 'Custom Mandi CSV Upload',
      totalRecords: Number(recordCount) || 12450,
      startDate: '2026-01-01',
      endDate: '2026-11-03',
      uploadedBy: 'Rajesh Patel (Data Manager)',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Validated' as const,
      fileSizeMb: Number(fileSizeMb) || 4.2,
      statesCovered: 4,
      commoditiesCovered: 18
    };

    datasetsState.unshift(newDs);

    res.json({
      success: true,
      message: 'Dataset successfully validated',
      dataset: newDs
    });
  });

  app.get('/api/admin/model-metrics', (_req: Request, res: Response) => {
    res.json({
      success: true,
      metrics: modelMetricsState
    });
  });

  app.post('/api/admin/retrain', (_req: Request, res: Response) => {
    modelMetricsState = modelMetricsState.map(m => {
      const improvement = Math.random() * 0.4 + 0.1;

      return {
        ...m,
        mae: Math.max(
          35,
          Math.round((m.mae - improvement) * 10) / 10
        ),
        rmse: Math.max(
          52,
          Math.round((m.rmse - improvement * 1.3) * 10) / 10
        ),
        r2: Math.min(
          0.965,
          Math.round((m.r2 + 0.003) * 1000) / 1000
        ),
        trainingTimeSec:
          Math.round((m.trainingTimeSec + 0.2) * 10) / 10
      };
    });

    res.json({
      success: true,
      message: 'Model metrics updated',
      metrics: modelMetricsState
    });
  });

  // ---------------------------------------
  // Health Check
  // ---------------------------------------

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      app: 'AgriPrice AI',
      version: '2.4.0',
      datasetRecords: 278010,
      activeModels: 4,
      timestamp: new Date().toISOString()
    });
  });

  // ---------------------------------------
  // Frontend Serving
  // ---------------------------------------

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, 'dist');

    app.use(express.static(distPath));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true'
      },
      appType: 'spa'
    });

    app.use(vite.middlewares);
  }

  // ---------------------------------------
  // Start Server
  // ---------------------------------------

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `[AgriPrice AI] Server running on port ${PORT}`
    );
  });
}

startServer().catch(error => {
  console.error('Failed to start AgriPrice AI server:', error);
  process.exit(1);
});
```

