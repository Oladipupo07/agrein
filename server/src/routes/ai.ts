import { Router, Request, Response } from 'express';

export const aiRouter = Router();

// Commodity price intelligence database
const commodityPricesData = [
  { commodity: 'Maize (White)', unit: 'Bag (50kg)', currentPrice: 48000, previousPrice: 45000, change: '+6.6%', trend: 'up', forecastNextMonth: 52000, recommendation: 'Hold stock for 2 weeks. Prices expected to rise due to delayed rains in North Central.' },
  { commodity: 'Rice (Foreign/Local)', unit: 'Bag (50kg)', currentPrice: 85000, previousPrice: 88000, change: '-3.4%', trend: 'down', forecastNextMonth: 82000, recommendation: 'Optimal sell window active. Harvest arrival from Kebbi cluster increasing market supply.' },
  { commodity: 'Tomatoes (Plum)', unit: 'Basket (25kg)', currentPrice: 32000, previousPrice: 28000, change: '+14.2%', trend: 'up', forecastNextMonth: 38000, recommendation: 'High demand in Southern urban hubs (Lagos/PH). Projected 15% price spike next month.' },
  { commodity: 'Cassava Tubers', unit: 'Ton', currentPrice: 180000, previousPrice: 175000, change: '+2.8%', trend: 'up', forecastNextMonth: 195000, recommendation: 'Steady industrial processing demand from ethanol factories.' },
  { commodity: 'Cocoa (Raw Beans)', unit: 'Ton', currentPrice: 11200000, previousPrice: 10800000, change: '+3.7%', trend: 'up', forecastNextMonth: 12000000, recommendation: 'Global export futures bullish. Favorable exchange rate yield for verified exporters.' }
];

/**
 * GET /api/ai/commodity-prices
 */
aiRouter.get('/commodity-prices', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: commodityPricesData,
    lastUpdated: new Date().toISOString(),
  });
});

/**
 * POST /api/ai/diagnose-crop
 * Crop Disease & Pest Diagnosis using AI Computer Vision simulation
 */
aiRouter.post('/diagnose-crop', (req: Request, res: Response) => {
  const { cropType, notes, imageUrl } = req.body;

  // Simulate AI Computer Vision Diagnostic analysis
  const diagnosticResults = [
    {
      diseaseName: 'Tomato Late Blight (Phytophthora infestans)',
      confidence: 0.94,
      severity: 'Moderate to High',
      symptomsIdentified: ['Water-soaked dark lesions on leaf margins', 'White fungal growth under humid canopy', 'Stem browning'],
      recommendedTreatment: [
        'Apply Copper-based Fungicide (e.g. Mancozeb or Ridomil Gold) immediately at 50g per 20L sprayer.',
        'Improve field drainage and prune lower affected leaves to increase air circulation.',
        'Avoid overhead sprinkler irrigation during high humidity hours.'
      ],
      estimatedYieldImpact: 'Without intervention, 35-50% crop loss within 10 days.',
    },
    {
      diseaseName: 'Maize Fall Armyworm (Spodoptera frugiperda)',
      confidence: 0.91,
      severity: 'Severe',
      symptomsIdentified: ['Ragged holes in whorl leaves', 'Sawdust-like frass inside corn whorls'],
      recommendedTreatment: [
        'Spray Emamectin Benzoate or Chlorantraniliprole targeted directly into leaf whorls.',
        'Deploy neem-oil organic extract for small-scale containment.'
      ],
      estimatedYieldImpact: 'High potential damage to grain fill if untreated during tassel stage.'
    }
  ];

  const result = cropType?.toLowerCase().includes('maize') ? diagnosticResults[1] : diagnosticResults[0];

  res.json({
    success: true,
    message: 'AI Crop Diagnostic complete',
    data: {
      cropType: cropType || 'Tomato',
      analyzedAt: new Date().toISOString(),
      result,
    }
  });
});

/**
 * POST /api/ai/assistant-chat
 * Agricultural Advisory Assistant Chatbot
 */
aiRouter.post('/assistant-chat', (req: Request, res: Response) => {
  const { query } = req.body;
  const q = String(query || '').toLowerCase();

  let reply = "Hello! I am Agrein AI, your digital agronomy & market intelligence assistant. How can I help you optimize your farm output or pricing today?";

  if (q.includes('fertilizer') || q.includes('urea') || q.includes('npk')) {
    reply = "For optimal yield in North/South soils, apply NPK 15:15:15 at planting (200kg/ha), followed by Urea top-dressing at 4 weeks post-germination (100kg/ha). Always test your soil pH first!";
  } else if (q.includes('price') || q.includes('tomato') || q.includes('market')) {
    reply = "Tomato prices are projected to rise by 15% in Lagos over the next 3 weeks due to rain-induced transport bottlenecks in Plateau and Kaduna. We advise locking in forward delivery contracts now!";
  } else if (q.includes('interswitch') || q.includes('escrow') || q.includes('payment')) {
    reply = "Agrein uses Interswitch Escrow! When a buyer orders, funds are locked in Interswitch holding. The money is automatically credited to your Agrein Wallet as soon as the buyer confirms delivery.";
  }

  res.json({
    success: true,
    reply,
    timestamp: new Date().toISOString()
  });
});
