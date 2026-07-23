import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { PRODUCTS } from './src/data/products';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client on server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System prompt with bakery product knowledge
const BAKERY_SYSTEM_PROMPT = `You are "Chef Camille", the master AI pastry assistant for SweetSpot, an artisanal luxury bakery and confectionery.
You assist customers with:
- Cake flavor profiles, ingredients, and allergen info (gluten, nuts, dairy, egg-free options).
- Price inquiries and product details.
- Custom cake pre-orders and celebratory pairings (e.g. coffee, tea, wine pairings).
- Recommending bakery delights for specific occasions (birthdays, anniversaries, corporate gifts, afternoon tea).

Here is the current active menu at SweetSpot:
${JSON.stringify(PRODUCTS.map(p => ({ id: p.id, name: p.name, category: p.category, price: `$${p.price.toFixed(2)}`, description: p.description, features: p.features, allergens: p.allergens })), null, 2)}

Instructions:
1. Always maintain a warm, elegant, and appetizing tone.
2. If asked about prices or ingredients, give exact figures from the menu.
3. Recommend relevant items from the menu and explicitly include their name and exact price.
4. Keep answers clear, engaging, and concise.`;

// AI Assistant Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback friendly AI response if key is missing
      return res.json({
        reply: `Hello! I am Chef Camille from SweetSpot. I can help you choose the perfect dessert or custom cake. Our top recommendation today is the ${PRODUCTS[0].name} ($${PRODUCTS[0].price.toFixed(2)}) or our ${PRODUCTS[3].name} ($${PRODUCTS[3].price.toFixed(2)}). How may I sweeten your day?`
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      config: {
        systemInstruction: BAKERY_SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I'd be delighted to assist you with your sweet selection!";
    return res.json({ reply });

  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      reply: "Chef Camille is currently baking fresh treats! In the meantime, I highly recommend exploring our Signature Macaron Box ($24.00) or Dark Velvet Ganache ($38.00)."
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SweetSpot Bakery server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
