import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '@/env';

const geminiClient = new GoogleGenerativeAI(
  env.GEMINI_API_KEY
);
const model = geminiClient.getGenerativeModel({
  model: "gemini-2.0-flash",
});

export default model;
