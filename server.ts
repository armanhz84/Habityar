/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize OpenAI SDK with GapGPT configuration
const gapGptApiKey = process.env.GAPGPT_API_KEY || '';
const gapGptBaseUrl = process.env.GAPGPT_BASE_URL || 'https://api.gapgpt.app/v1';
const model = process.env.GAPGPT_MODEL || 'gpt-4o-mini';

const openai = new OpenAI({
  baseURL: gapGptBaseUrl,
  apiKey: gapGptApiKey,
});

console.log('OpenAI / GapGPT AI Client successfully initialized.');

// Active endpoints supporting OpenAI
const aiCoachHandler = async (req: express.Request, res: express.Response) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'آرایه پیام‌ها ارسال نشده است.' });
  }

  try {
    // Standardized message mapping for OpenAI completions
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role || (msg.sender === 'user' ? 'user' : 'assistant'),
      content: msg.content || msg.text || '',
    }));

    // Inject system routing or default coach personality if missing
    if (!formattedMessages.some((msg) => msg.role === 'system')) {
      formattedMessages.unshift({
        role: 'system',
        content: `شما یک مربی هوشمند و با انگیزه در اپلیکیشن عادتیار (HabitYar) هستید. لحن شما باید بسیار الهام‌بخش، دوستانه، همدلانه و متمرکز بر بهبود مستمر با گام‌های کوچک باشد. از زبان فارسی روان، جذاب و صمیمانه استفاده کنید. به کاربر انگیزه بدهید و به سوالات برنامه‌ریزی و عادات او به زیبایی پاسخ دهید. از بکار بردن کلماتی مثل ربات خودداری کنید.`
      });
    }

    const response = await openai.chat.completions.create({
      model: model,
      messages: formattedMessages,
      temperature: 0.7,
    });

    const assistantReply = response.choices?.[0]?.message?.content || '';

    if (assistantReply && assistantReply.trim() !== '') {
      res.json({ text: assistantReply });
    } else {
      throw new Error('openai empty response choices');
    }
  } catch (error: any) {
    console.error('Error invoking OpenAI chat completions:', error);
    res.json({
      text: 'متأسفانه در حال حاضر امکان دریافت پاسخ زنده از مربی هوشمند برقرار نیست. لطفاً اتصال اینترنت خود را مجدداً بررسی کنید یا بعداً تلاش کنید.'
    });
  }
};

// Map both /api/coach and /api/gemini/coach to the same robust OpenAI handler
app.post('/api/coach', aiCoachHandler);
app.post('/api/gemini/coach', aiCoachHandler);

// Mock api for Zarinpal Iran payment gateway to simulate premium activation
app.post('/api/payment/zarinpal', (req, res) => {
  const { amount, planName, userName } = req.body;
  console.log(`Zarinpal Gateway request for ${userName} on plan ${planName} for ${amount} Tomans.`);
  
  // Simulate successful Iran bank gateway callback authorization token
  const authority = `A${Math.floor(Math.random() * 90000000 + 10000000)}`;
  res.json({
    status: 'ok',
    redirectUrl: `https://zarinpal.com/pg/StartPay/${authority}`,
    authority
  });
});

// Configure Vite middleware and static servers
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
    console.log(`HabitYar Full-Stack server is successfully active on port ${PORT}`);
  });
}

startServer();
