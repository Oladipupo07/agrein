// Traceability Controller for Agrein
// Handles QR code generation and batch provenance tracking

const traceabilityController = {
  // Get batch traceability details
  async getBatchTrace(req, res) {
    try {
      const { batchId } = req.params;
      // In production: SELECT tb.*, json_agg(ts.*) as journey FROM traceability_batches tb LEFT JOIN traceability_steps ts ON tb.id = ts.batch_id WHERE tb.id = $1 GROUP BY tb.id
      res.json({
        success: true,
        data: {
          batchId,
          product: 'Yellow Maize (Grade A)',
          farm: 'Zaria Agro-Gold Farms',
          farmer: 'Mallam Ibrahim Bello',
          origin: 'Zaria, Kaduna State',
          harvestDate: '2026-08-01',
          weight: '10,000 kg',
          qualityGrade: 'A+',
          moistureContent: '12.5%',
          journey: [
            { step: 'Planted', date: '2026-04-15', location: 'Farm Plot A-12, Zaria', verified: true },
            { step: 'Harvested & Sun-Dried', date: '2026-08-01', location: 'Farm Drying Yard', verified: true },
            { step: 'Quality Inspection Passed', date: '2026-08-03', location: 'Agrein QA Hub, Kaduna', verified: true },
            { step: 'Packaged', date: '2026-08-04', location: 'Packaging Warehouse', verified: true },
            { step: 'Dispatched', date: '2026-08-09', location: 'Kaduna Logistics Hub', verified: true },
            { step: 'Delivered to Buyer', date: '2026-08-12 (Est.)', location: 'Apapa, Lagos', verified: false }
          ]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve batch trace', error: error.message });
    }
  },

  // Generate QR code for a batch
  async generateQRCode(req, res) {
    try {
      const { batchId, productId } = req.body;
      // In production, this would generate an actual QR code image using qrcode library
      const qrUrl = `https://agrein.ng/trace/${batchId}`;
      res.json({
        success: true,
        message: 'QR code generated successfully',
        data: {
          batchId,
          productId,
          qrUrl,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to generate QR code', error: error.message });
    }
  }
};

module.exports = traceabilityController;
