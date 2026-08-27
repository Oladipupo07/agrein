// AI Customer Support & Assistance Controller for Agrein
// Integrates Google Gemini API, OpenAI API, and an embedded Agrein Platform Knowledge Engine.

const https = require('https');

const AGREIN_SYSTEM_PROMPT = `You are "AgriBot", the official AI Support & Agricultural Assistant for Agrein (Nigeria's premier digital agricultural technology marketplace).

Your mission: Provide fast, friendly, accurate, and professional assistance to smallholder farmers, wholesale commodity buyers, retailers, and cooperative leaders.

Key Agrein Platform Knowledge:
1. Platform Core: Agrein connects Nigerian farmers directly with wholesale and retail buyers, cutting out exploitative middlemen and ensuring fair farmgate prices.
2. Escrow Protection: All buyer payments are held securely in escrow (Interswitch powered) and only disbursed to the farmer after the buyer inspects and confirms produce quality upon delivery.
3. Farmer Verification (KYC):
   - To sell on Agrein and receive the "Golden Verified Farmer Badge", farmers must complete a 4-pillar verification (Personal Info, Farm Operations, Physical Address with GPS Satellite Coordinates, and Mandatory Documents: Government ID [NIN/Voter's Card/Driver's License], Farm Photo, and Profile Photo).
   - Once submitted, the SuperAdmin reviews the dossier within 24 hours.
4. Logistics & Cold Chain: Agrein partners with verified agro-logistics fleets providing GPS tracking, temperature-controlled reefers, and transit insurance.
5. Dispute Resolution: If produce arrives damaged, incomplete, or below grade, buyers can open a dispute in their Buyer Dashboard within 48 hours for immediate admin mediation and full refund if warranted.
6. Communication & Currency: All transactions are in Nigerian Naira (₦ / NGN). You can communicate in English, Nigerian Pidgin, Hausa, Yoruba, or Igbo when addressed in those languages.
7. Support Channels: For human escalation, direct users to email support@agrein.ng or phone +234-800-AGREIN-NG.

Style: Be polite, warm, concise, and structured with bullet points or step-by-step guidance when explaining workflows.`;

// Comprehensive Agrein Knowledge Base Engine (Fallback & Instant Engine)
function generateKnowledgeEngineResponse(message, history = []) {
  const q = (message || '').toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|good day|good morning|good afternoon|good evening|how far|kedu|sannu|bawo)/i.test(q)) {
    return `Hello! 👋 Welcome to **Agrein Support**. I'm **AgriBot**, your 24/7 AI Agricultural Assistant. 

How can I help you today? You can ask me about:
• 🌾 **Farmer Verification & KYC**
• 🛡️ **Escrow & Safe Payments**
• 🚚 **Logistics & Order Tracking**
• ⚖️ **Dispute Resolution & Refunds**
• 🛒 **Buying or Listing Farm Produce**`;
  }

  // Farmer Verification & KYC
  if (/verif|kyc|badge|approval|pending approval|nin|bvn|documents|upload/i.test(q)) {
    return `### 🌾 Farmer Verification & KYC Process

To earn the **Golden Verified Farmer Badge** and start selling on Agrein, please complete the 4 compulsory sections on the **Farm Verification Page**:

1. **Personal Information**: Full Name, Phone, Email, Residential Address, State & LGA.
2. **Farm Profile**: Farm Name, Type (Crop, Livestock, Poultry, etc.), Farm Size (Acres), Experience, and Crops Produced.
3. **Location & GPS**: Physical Farm Address + auto-detected GPS Satellite Coordinates.
4. **Mandatory Documents**:
   - Government ID (NIN Slip, Voter's Card, or Driver's License)
   - Farm Overview Photograph
   - Farmer Profile Headshot

*Once all 18 compulsory items are 100% complete, click **Submit Verification Application**. Our team reviews dossiers within **24 hours**!*`;
  }

  // Escrow & Payment
  if (/escrow|payment|pay|money|bank|interswitch|wallet|safe|refund|withdraw/i.test(q)) {
    return `### 🛡️ How Agrein Escrow Protection Works

Agrein protects both farmers and buyers with our **Guaranteed Escrow System**:

1. **Buyer Orders**: When a buyer places an order, funds are held securely in an Interswitch escrow vault.
2. **Farmer Ships**: The farmer receives notification to harvest and dispatch the fresh produce via our logistics network.
3. **Inspection & Confirmation**: The buyer inspects produce upon arrival (checking weight and grade).
4. **Automatic Payout**: Once the buyer clicks **"Confirm Delivery"**, funds are instantly transferred into the farmer's Digital Wallet for direct withdrawal to any Nigerian bank.`;
  }

  // Logistics & Delivery
  if (/logistic|delivery|shipping|transport|dispatch|track|driver|temperature|truck/i.test(q)) {
    return `### 🚚 Smart Logistics & Cold Chain Delivery

• **Real-Time Tracking**: Every active shipment is monitored with live GPS from farmgate to buyer warehouse.
• **Refrigerated Transport**: Perishable commodities (tomatoes, vegetables, dairy) are routed via temperature-controlled reefers.
• **Transit Insurance**: All produce in transit is covered against accidental loss or damage.
• You can track delivery status directly in your **Farmer Dashboard** or **Buyer Dashboard**.`;
  }

  // Disputes & Damaged Produce
  if (/dispute|damage|spoiled|bad produce|complain|return|reject order|not delivered/i.test(q)) {
    return `### ⚖️ Dispute Resolution & Buyer Guarantee

If your order arrived damaged, below standard, or wasn't delivered:
1. Go to your **Buyer Dashboard** -> **Order History**.
2. Click **"File Dispute"** within 48 hours of delivery.
3. Upload photos of the damaged produce and describe the issue.
4. An Agrein SuperAdmin will review the case within **12 hours** to mediate, arrange a replacement, or issue a **100% Escrow Refund**.`;
  }

  // Account / Login / OTP
  if (/otp|login|register|password|reset password|email verification|sign in/i.test(q)) {
    return `### 🔐 Account & Security Help

• **Email OTP**: When creating an account, a 6-digit OTP code is sent to your email. Check your Inbox and Spam/Junk folder.
• **Forgot Password**: Click "Forgot Password?" on the login popup to receive a secure reset link.
• **Change Password**: Go to **Account Settings** in your dashboard to update credentials at any time.`;
  }

  // Buying Produce
  if (/buy|order|purchase|checkout|cart|price|marketplace/i.test(q)) {
    return `### 🛒 How to Buy Farm Produce on Agrein

1. Browse the **Marketplace** to discover fresh farm produce, grains, and livestock.
2. Filter by crop type, location, price, or minimum order quantity.
3. Add items to your cart and proceed to **Checkout**.
4. Pay securely via Debit Card, Bank Transfer, or USSD (backed by Interswitch Escrow).`;
  }

  // Default Fallback
  return `Thank you for your question! 😊

**AgriBot AI** is here to support you with everything on **Agrein**:
• **Farmer Verification**: Complete 100% of compulsory items & upload your Government ID.
• **Escrow & Safe Payments**: 100% money-back guarantee on all orders until delivery confirmation.
• **Logistics**: Direct farm-to-door delivery with real-time GPS tracking.

If you need dedicated human support, please contact:
📧 **Email**: support@agrein.ng
📞 **Phone**: +234-800-AGREIN-NG (Mon - Sat, 8am - 6pm)`;
}

// Call Google Gemini API
function callGeminiApi(apiKey, userMessage, history = []) {
  return new Promise((resolve, reject) => {
    const contents = [];
    
    // Add history
    if (Array.isArray(history)) {
      history.slice(-6).forEach(h => {
        if (h.sender === 'you' || h.role === 'user') {
          contents.push({ role: 'user', parts: [{ text: h.text || h.content || '' }] });
        } else if (h.sender === 'bot' || h.role === 'model') {
          contents.push({ role: 'model', parts: [{ text: h.text || h.content || '' }] });
        }
      });
    }

    contents.push({ role: 'user', parts: [{ text: userMessage }] });

    const postData = JSON.stringify({
      systemInstruction: {
        parts: [{ text: AGREIN_SYSTEM_PROMPT }]
      },
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600
      }
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const parsedUrl = new URL(url);

    const req = https.request({
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.candidates && json.candidates[0] && json.candidates[0].content && json.candidates[0].content.parts) {
            const reply = json.candidates[0].content.parts.map(p => p.text).join('\n');
            resolve(reply);
          } else if (json.error) {
            reject(new Error(json.error.message || 'Gemini API Error'));
          } else {
            resolve(generateKnowledgeEngineResponse(userMessage, history));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Gemini API Timeout'));
    });

    req.write(postData);
    req.end();
  });
}

// Call OpenAI API
function callOpenAiApi(apiKey, userMessage, history = []) {
  return new Promise((resolve, reject) => {
    const messages = [{ role: 'system', content: AGREIN_SYSTEM_PROMPT }];

    if (Array.isArray(history)) {
      history.slice(-6).forEach(h => {
        const role = (h.sender === 'you' || h.role === 'user') ? 'user' : 'assistant';
        messages.push({ role, content: h.text || h.content || '' });
      });
    }

    messages.push({ role: 'user', content: userMessage });

    const postData = JSON.stringify({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    });

    const req = https.request({
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.choices && json.choices[0] && json.choices[0].message) {
            resolve(json.choices[0].message.content);
          } else if (json.error) {
            reject(new Error(json.error.message || 'OpenAI API Error'));
          } else {
            resolve(generateKnowledgeEngineResponse(userMessage, history));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('OpenAI API Timeout'));
    });

    req.write(postData);
    req.end();
  });
}

const aiSupportController = {
  async handleSupportChat(req, res) {
    try {
      const { message, prompt, history } = req.body || {};
      const userMessage = (message || prompt || '').trim();

      if (!userMessage) {
        return res.status(400).json({
          success: false,
          message: 'Message cannot be empty.'
        });
      }

      const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_KEY;
      const openaiKey = process.env.OPENAI_API_KEY;

      let replyText = '';
      let source = 'knowledge_base';

      // 1. Try Gemini API if key is present
      if (geminiKey) {
        try {
          replyText = await callGeminiApi(geminiKey, userMessage, history);
          source = 'gemini-1.5-flash';
        } catch (geminiErr) {
          console.warn('[aiSupportController] Gemini fallback:', geminiErr.message);
        }
      }

      // 2. Try OpenAI API if no Gemini reply
      if (!replyText && openaiKey) {
        try {
          replyText = await callOpenAiApi(openaiKey, userMessage, history);
          source = 'gpt-4o-mini';
        } catch (openAiErr) {
          console.warn('[aiSupportController] OpenAI fallback:', openAiErr.message);
        }
      }

      // 3. Fallback to resilient built-in Agrein Knowledge Engine
      if (!replyText) {
        replyText = generateKnowledgeEngineResponse(userMessage, history);
        source = 'agrein-knowledge-engine';
      }

      return res.json({
        success: true,
        reply: replyText,
        source: source,
        timestamp: new Date().toISOString()
      });

    } catch (err) {
      console.error('[aiSupportController] Error:', err.message);
      return res.json({
        success: true,
        reply: generateKnowledgeEngineResponse(req.body?.message || '', req.body?.history || []),
        source: 'agrein-knowledge-fallback',
        timestamp: new Date().toISOString()
      });
    }
  },

  getSuggestions(req, res) {
    return res.json({
      success: true,
      suggestions: [
        'How does the Escrow Payment guarantee work?',
        'How do I get the Golden Verified Farmer Badge?',
        'What documents are compulsory for farm verification?',
        'How do I track my produce shipment delivery?',
        'How do I file a dispute for damaged produce?'
      ]
    });
  }
};

module.exports = aiSupportController;
