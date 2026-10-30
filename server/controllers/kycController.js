// Interswitch KYC & Identity Verification Controller (NIN & CAC)
const interswitchService = require('../services/interswitchService');

const kycController = {
  // POST /api/kyc/verify-nin
  async verifyNin(req, res) {
    try {
      const { nin, fullName, dateOfBirth, phone, gender } = req.body;

      if (!nin) {
        return res.status(400).json({
          success: false,
          verified: false,
          message: 'NIN is required.'
        });
      }

      const result = await interswitchService.verifyNIN(nin, {
        fullName,
        dateOfBirth,
        phone,
        gender
      });

      if (!result.valid) {
        return res.status(422).json({
          success: false,
          verified: false,
          message: result.message || 'NIN validation failed.'
        });
      }

      return res.json({
        success: true,
        verified: true,
        message: 'NIN identity successfully verified via Interswitch NIMC gateway.',
        data: result
      });
    } catch (err) {
      console.error('[kycController.verifyNin] error:', err);
      return res.status(500).json({
        success: false,
        verified: false,
        message: err.message || 'Interswitch verification service error.'
      });
    }
  },

  // POST /api/kyc/verify-cac
  async verifyCac(req, res) {
    try {
      const { cacNumber, companyName } = req.body;

      if (!cacNumber) {
        return res.status(400).json({
          success: false,
          verified: false,
          message: 'CAC registration number is required.'
        });
      }

      const result = await interswitchService.verifyCAC(cacNumber, {
        companyName
      });

      if (!result.valid) {
        return res.status(422).json({
          success: false,
          verified: false,
          message: result.message || 'CAC validation failed.'
        });
      }

      return res.json({
        success: true,
        verified: true,
        message: 'CAC corporate registry successfully verified via Interswitch gateway.',
        data: result
      });
    } catch (err) {
      console.error('[kycController.verifyCac] error:', err);
      return res.status(500).json({
        success: false,
        verified: false,
        message: err.message || 'Interswitch CAC verification service error.'
      });
    }
  },

  // GET /api/kyc/status
  async getStatus(req, res) {
    return res.json({
      success: true,
      provider: 'Interswitch Identity Services',
      env: interswitchService.env,
      credentials_configured: interswitchService.hasValidCredentials(),
      services: {
        nin_verification: 'active',
        cac_verification: 'active',
        gateway: 'Interswitch NIMC / CAC Gateway'
      }
    });
  }
};

module.exports = kycController;

