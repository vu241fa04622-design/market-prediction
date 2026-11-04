/**
 * AgriPrice AI - Report Generator (PDF & CSV)
 * Generates downloadable reports for farmers, agricultural officers, and academic evaluation.
 */

import { jsPDF } from 'jspdf';
import { PredictionResult, HistoricalPriceRecord, CropInfo, MandiInfo } from '../types';

export function downloadPredictionPdf(
  prediction: PredictionResult,
  crop: CropInfo,
  mandi: MandiInfo
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(22, 101, 52); // Forest Green (#166534)
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('AgriPrice AI – Crop Price Forecast Report', 14, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Official Decision Support System for Indian Farmers | AGMARKNET Verified Engine', 14, 20);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, pageWidth - 14, 20, { align: 'right' });

  // Crop & Market Overview Card
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1. MARKET & COMMODITY SPECIFICATION', 14, 38);

  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 42, pageWidth - 28, 32, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  doc.text(`Crop Name: ${prediction.cropName} (${crop.teluguName})`, 18, 50);
  doc.text(`Variety: ${prediction.variety}`, 18, 56);
  doc.text(`Market / Mandi: ${mandi.name}`, 18, 62);
  doc.text(`District / State: ${mandi.district}, ${mandi.state}`, 18, 68);

  doc.text(`Current Modal Price: Rs. ${prediction.currentModalPrice} / Quintal`, 110, 50);
  doc.text(`Government MSP: ${crop.mspPrice > 0 ? `Rs. ${crop.mspPrice} / Quintal` : 'Not Applicable (Free Market)'}`, 110, 56);
  doc.text(`Reporting Date: ${prediction.currentDate}`, 110, 62);
  doc.text(`Forecast Horizon: Next ${prediction.forecastHorizon} Days`, 110, 68);

  // Model & Validation Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. MACHINE LEARNING ENGINE EVALUATION (WALK-FORWARD)', 14, 84);

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, 88, pageWidth - 28, 20, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Algorithm: ${prediction.modelUsed.toUpperCase()} (Hybrid Ensemble v2.4)`, 18, 95);
  doc.text(`R² Accuracy Score: ${(prediction.modelMetrics.r2Score * 100).toFixed(1)}%`, 18, 101);
  doc.text(`Mean Absolute Error (MAE): Rs. ${prediction.modelMetrics.mae.toFixed(1)}/q`, 85, 95);
  doc.text(`Root Mean Squared Error (RMSE): Rs. ${prediction.modelMetrics.rmse.toFixed(1)}/q`, 85, 101);
  doc.text(`Confidence Score: ${prediction.summary.confidenceScore}%`, 150, 95);
  doc.text(`Trend: ${prediction.summary.trend.toUpperCase()}`, 150, 101);

  // Forecast Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('3. DAY-WISE PRICE FORECAST & UNCERTAINTY BOUNDS', 14, 118);

  // Table header
  doc.setFillColor(22, 101, 52);
  doc.rect(14, 122, pageWidth - 28, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('Forecast Date', 18, 127);
  doc.text('Day', 48, 127);
  doc.text('Expected Arrival', 72, 127);
  doc.text('Predicted Price (Rs./q)', 110, 127);
  doc.text('95% Confidence Interval [Min – Max]', 150, 127);

  // Table rows
  doc.setTextColor(30, 41, 59);
  let yPos = 135;
  const displayLimit = Math.min(prediction.forecast.length, 15);

  for (let i = 0; i < displayLimit; i++) {
    const pt = prediction.forecast[i];
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, yPos - 5, pageWidth - 28, 6.5, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.text(pt.date, 18, yPos);
    doc.text(pt.dayName, 48, yPos);
    doc.text(`${pt.expectedArrivalQuantity} qtls`, 72, yPos);

    doc.setFont('helvetica', 'bold');
    doc.text(`Rs. ${pt.predictedPrice}`, 110, yPos);

    doc.setFont('helvetica', 'normal');
    doc.text(`Rs. ${pt.lowerConfidenceBound} - Rs. ${pt.upperConfidenceBound}`, 150, yPos);

    yPos += 6.5;
  }

  // Summary box
  yPos += 4;
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, yPos, pageWidth - 28, 26, 2, 2, 'FD');

  doc.setTextColor(21, 128, 61);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('4. SMART SELLING ADVISORY SUMMARY', 18, yPos + 6);

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const changePrefix = prediction.summary.priceChangePercentage >= 0 ? '+' : '';
  doc.text(`Projected Horizon Change: ${changePrefix}${prediction.summary.priceChangePercentage}% (Rs. ${prediction.summary.priceChangeAbsolute}/quintal).`, 18, yPos + 12);
  doc.text(`Average Projected Price: Rs. ${prediction.summary.avgPredictedPrice} / q | Min: Rs. ${prediction.summary.minPredictedPrice} | Max: Rs. ${prediction.summary.maxPredictedPrice}`, 18, yPos + 17);
  doc.text(`Recommendation: Check latest physical arrivals at APMC gate before booking freight vehicles.`, 18, yPos + 22);

  // Disclaimer footer
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.text('ACADEMIC DISCLAIMER: This prediction report is compiled using historical AGMARKNET time-series modeling for academic evaluation (B.Tech CSE Major Project).', 14, 280);
  doc.text('Actual market transactions depend on physical commodity quality inspection, moisture content, and intra-day APMC spot bidding.', 14, 284);

  // Save the PDF
  const filename = `AgriPrice_Report_${prediction.cropName.replace(/\s+/g, '_')}_${prediction.mandi.replace(/\s+/g, '_')}_${prediction.currentDate}.pdf`;
  doc.save(filename);
}

export function downloadPredictionCsv(prediction: PredictionResult) {
  const headers = ['Date', 'Day', 'Crop', 'Mandi', 'Predicted_Price_INR_Quintal', 'Lower_Bound_95', 'Upper_Bound_95', 'Expected_Arrival_Quintals'];
  const rows = prediction.forecast.map(f => [
    f.date,
    f.dayName,
    prediction.cropName,
    prediction.mandi,
    f.predictedPrice,
    f.lowerConfidenceBound,
    f.upperConfidenceBound,
    f.expectedArrivalQuantity
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `AgriPrice_Forecast_${prediction.cropName}_${prediction.forecastHorizon}d_${prediction.currentDate}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadHistoricalPricesCsv(records: HistoricalPriceRecord[], cropName: string, mandiName: string) {
  const headers = ['Date', 'State', 'District', 'Market', 'Commodity', 'Variety', 'Min_Price_INR_Q', 'Max_Price_INR_Q', 'Modal_Price_INR_Q', 'Arrival_Quintals'];
  const rows = records.map(r => [
    r.date,
    `"${r.state}"`,
    `"${r.district}"`,
    `"${r.market}"`,
    `"${r.commodity}"`,
    `"${r.variety}"`,
    r.minPrice,
    r.maxPrice,
    r.modalPrice,
    r.arrivalQuantity
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `AGMARKNET_Historical_${cropName}_${mandiName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
