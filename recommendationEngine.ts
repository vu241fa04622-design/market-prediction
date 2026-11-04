/**
 * AgriPrice AI - Smart Farmer Selling Recommendation Engine
 * Analyzes market arrivals, price trends, shelf life, and mandi arbitrage to generate
 * actionable, farmer-friendly decision advice in English and Telugu.
 */

import { PredictionResult, SmartSellingRecommendation, MandiComparisonItem } from '../types';
import { CROPS_CATALOG, MANDIS_CATALOG } from '../data/agmarknetData';

export function generateSmartSellingRecommendation(
  prediction: PredictionResult,
  comparisonItems?: MandiComparisonItem[]
): SmartSellingRecommendation {
  const crop = CROPS_CATALOG.find(c => c.name === prediction.cropName) || CROPS_CATALOG[0];
  const mandi = MANDIS_CATALOG.find(m => m.name === prediction.mandi) || MANDIS_CATALOG[0];

  const pct = prediction.summary.priceChangePercentage;
  const isPerishable = crop.perishable;
  const isDurable = !crop.perishable;
  const currentPrice = prediction.currentModalPrice;

  // Check if any nearby mandi has a significantly higher net price after freight
  let alternateMandiSuggestion: SmartSellingRecommendation['alternateMarketsSuggestion'] = undefined;

  if (comparisonItems && comparisonItems.length > 1) {
    const sortedByNet = [...comparisonItems].sort((a, b) => b.netRealizablePrice - a.netRealizablePrice);
    const bestAlt = sortedByNet[0];

    if (bestAlt.mandiName !== prediction.mandi && bestAlt.netRealizablePrice > currentPrice + 80) {
      const netGain = Math.round(bestAlt.netRealizablePrice - currentPrice);
      alternateMandiSuggestion = {
        mandi: bestAlt.mandiName,
        distanceKm: bestAlt.distanceKm,
        currentPrice: bestAlt.modalPrice,
        transportCostPerQuintal: bestAlt.estimatedFreightPerQuintal,
        netGainPerQuintal: netGain
      };
    }
  }

  // 1. DIVERSIFY_MANDI if nearby mandi gives strong net gain
  if (alternateMandiSuggestion && alternateMandiSuggestion.netGainPerQuintal >= 150) {
    return {
      cropName: crop.name,
      mandi: mandi.name,
      action: 'DIVERSIFY_MANDI',
      title: `Sell at ${alternateMandiSuggestion.mandi} for Higher Net Return`,
      titleTelugu: `${alternateMandiSuggestion.mandi} మార్కెట్‌లో విక్రయిస్తే అధిక నికర లాభం లభిస్తుంది`,
      summary: `${alternateMandiSuggestion.mandi} is reporting ₹${alternateMandiSuggestion.currentPrice}/q. After deducting estimated road transport of ₹${alternateMandiSuggestion.transportCostPerQuintal}/q (${alternateMandiSuggestion.distanceKm} km), your net gain is ₹${alternateMandiSuggestion.netGainPerQuintal} per quintal over ${mandi.name}.`,
      summaryTelugu: `${alternateMandiSuggestion.mandi} వద్ద ధర ₹${alternateMandiSuggestion.currentPrice}/క్వింటాల్ ఉంది. రవాణా ఖర్చు ₹${alternateMandiSuggestion.transportCostPerQuintal}/క్వింటాల్ పోను, మీకు అదనంగా ₹${alternateMandiSuggestion.netGainPerQuintal} నికర లాభం లభిస్తుంది.`,
      recommendedTimeframe: 'Next 2 to 3 days',
      expectedNetBenefit: `+₹${alternateMandiSuggestion.netGainPerQuintal}/quintal net gain`,
      confidence: 'High',
      factors: [
        {
          name: 'Regional Price Arbitrage',
          impact: 'positive',
          description: `Demand premium at ${alternateMandiSuggestion.mandi} exceeds roundtrip freight cost.`
        },
        {
          name: 'Transport Distance',
          impact: 'neutral',
          description: `${alternateMandiSuggestion.distanceKm} km transit manageable within half-day window.`
        },
        {
          name: 'Local Mandi Saturation',
          impact: 'negative',
          description: `${mandi.name} has heavy arrivals dampening local bids.`
        }
      ],
      alternateMarketsSuggestion: alternateMandiSuggestion,
      disclaimer: 'Verify current gate entry and live auction rates with the destination mandi commission agent before dispatch.'
    };
  }

  // 2. HOLD if prices are projected to rise and crop is durable or has adequate shelf life
  if (pct >= 4.0 && (isDurable || (isPerishable && crop.shelfLifeDays >= 30))) {
    const upsideVal = Math.round(prediction.summary.priceChangeAbsolute);
    return {
      cropName: crop.name,
      mandi: mandi.name,
      action: 'HOLD',
      title: `Hold Stock for ${prediction.forecastHorizon <= 7 ? '5–7 Days' : '10–14 Days'} for Upward Price Realization`,
      titleTelugu: `ధరలు పెరిగే అవకాశం ఉన్నందున మరికొన్ని రోజులు నిల్వ ఉంచడం మంచిది`,
      summary: `Our AI ensemble model predicts an upward rally of +${pct}% (approx +₹${upsideVal}/quintal) over the next ${prediction.forecastHorizon} days due to declining mandi arrivals and seasonal festive consumption.`,
      summaryTelugu: `రాబోయే ${prediction.forecastHorizon} రోజుల్లో ధర +${pct}% (+₹${upsideVal}/క్వింటాల్) పెరిగే అవకాశం ఉందని మోడల్ అంచనా వేస్తోంది. సరఫరా తగ్గడం వల్ల ధరలు పుంజుకుంటాయి.`,
      recommendedTimeframe: prediction.forecastHorizon <= 7 ? '5 to 7 days' : '10 to 14 days',
      expectedNetBenefit: `+₹${upsideVal}/quintal estimated upside`,
      confidence: prediction.summary.confidenceScore > 80 ? 'High' : 'Medium',
      factors: [
        {
          name: 'Forecasted Upward Trend',
          impact: 'positive',
          description: `Continuous buying demand with positive momentum of +${pct}%.`
        },
        {
          name: 'Crop Storage Durability',
          impact: 'positive',
          description: `${crop.name} has a safe shelf-life of ~${crop.shelfLifeDays} days with negligible weight loss.`
        },
        {
          name: 'Arrival Tightness',
          impact: 'positive',
          description: 'Mandi inflows are expected to taper off by 12–18%.'
        }
      ],
      alternateMarketsSuggestion: alternateMandiSuggestion,
      disclaimer: 'Ensure dry warehouse storage with moisture levels below 12% to prevent quality degradation.'
    };
  }

  // 3. SELL_IMMEDIATELY if sharp downward trend forecasted or highly perishable crop
  if (pct <= -3.0 || (isPerishable && crop.shelfLifeDays <= 10)) {
    const dropVal = Math.abs(Math.round(prediction.summary.priceChangeAbsolute));
    return {
      cropName: crop.name,
      mandi: mandi.name,
      action: 'SELL_IMMEDIATELY',
      title: isPerishable 
        ? 'Sell Produce Immediately (High Perishability & Supply Pressure)'
        : 'Sell Current Harvest in the Next 48 Hours to Avoid Price Drop',
      titleTelugu: isPerishable 
        ? 'వెంటనే మార్కెట్‌లో విక్రయించండి (త్వరగా పాడయ్యే పంట)'
        : 'ధరలు తగ్గే అవకాశం ఉన్నందున వెంటనే విక్రయించడం మంచిది',
      summary: isPerishable
        ? `${crop.name} has limited shelf life (${crop.shelfLifeDays} days). Holding exposes produce to spoilage, weight loss, and an estimated price softening of -${Math.abs(pct)}% (₹${dropVal}/q).`
        : `Model detects heavy upcoming harvest arrivals resulting in a forecasted price decline of -${Math.abs(pct)}% (-₹${dropVal}/q). Liquidate stock to lock in current ₹${currentPrice}/q.`,
      summaryTelugu: isPerishable
        ? `${crop.name} పంట నిల్వ సామర్థ్యం తక్కువ. ఆలస్యం చేస్తే బరువు తగ్గి ధర -${Math.abs(pct)}% తగ్గే ప్రమాదం ఉంది.`
        : `భారీగా కొత్త పంట మార్కెట్ కు రావడం వల్ల ధరలు -${Math.abs(pct)}% పడిపోయే అవకాశం ఉంది. ప్రస్తుత ధర ₹${currentPrice} వద్ద విక్రయించండి.`,
      recommendedTimeframe: 'Immediate 24 to 48 hours',
      expectedNetBenefit: `Avert projected loss of -₹${dropVal}/quintal`,
      confidence: 'High',
      factors: [
        {
          name: 'Arrival Glut Risk',
          impact: 'negative',
          description: 'Fresh harvesting in neighboring districts is increasing daily market arrivals.'
        },
        {
          name: 'Perishability / Shelf-Life',
          impact: isPerishable ? 'negative' : 'neutral',
          description: isPerishable ? 'High storage decay risk without cold-chain infrastructure.' : 'Safe storage available but holding costs exceed projected gains.'
        },
        {
          name: 'Market Price Momentum',
          impact: 'negative',
          description: `Price trajectory is bearish (-${Math.abs(pct)}% projected).`
        }
      ],
      alternateMarketsSuggestion: alternateMandiSuggestion,
      disclaimer: 'Harvest produce in early morning hours and transport during cool transit periods to maximize grade rating.'
    };
  }

  // 4. SPLIT_SELL (Staggered selling strategy) for moderate/neutral trends
  return {
    cropName: crop.name,
    mandi: mandi.name,
    action: 'SPLIT_SELL',
    title: 'Adopt Staggered Selling: Sell 50% Now, Retain 50% for 2 Weeks',
    titleTelugu: 'విడతలవారీ విక్రయం: 50% ఇప్పుడు విక్రయించి, 50% నిల్వ ఉంచండి',
    summary: `Market prices are moderately range-bound (${pct >= 0 ? '+' : ''}${pct}% projected). Selling 50% now at ₹${currentPrice}/q secures cash flow to meet input expenses, while holding 50% shields you if unexpected festive demand drives prices higher.`,
    summaryTelugu: `మార్కెట్ ధరలు స్థిరంగా ఉన్నాయి. 50% పంటను ప్రస్తుత ₹${currentPrice} ధరకు అమ్మి, మిగిలిన 50% 2 వారాలపాటు నిల్వ ఉంచి మంచి ధరకు విక్రయించవచ్చు.`,
    recommendedTimeframe: '50% within 3 days, 50% after 12–15 days',
    expectedNetBenefit: 'Balanced risk mitigation and cash liquidity',
    confidence: 'Medium',
    factors: [
      {
        name: 'Price Stability',
        impact: 'neutral',
        description: `Prices forecasted within a narrow band of ${pct >= 0 ? '+' : ''}${pct}%.`
      },
      {
        name: 'Farmer Cash Flow Security',
        impact: 'positive',
        description: 'Immediate partial sale funds family and agricultural working capital.'
      },
      {
        name: 'Upside Optionality',
        impact: 'positive',
        description: 'Remaining stock retains participation in potential spot rallies.'
      }
    ],
    alternateMarketsSuggestion: alternateMandiSuggestion,
    disclaimer: 'Regularly monitor daily APMC arrivals and weather reports during the holding interval.'
  };
}
