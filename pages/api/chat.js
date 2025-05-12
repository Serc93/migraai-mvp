import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const systemPrompts = {
  de: "Du bist MigraAI, ein hilfreicher KI-Assistent für Migrant:innen in Deutschland. Antworte kurz und einfach.",
  tr: "Sen MigraAI’sın, Almanya’daki göçmenler için yardımcı bir yapay zeka asistanısın. Kısa ve basit cevap ver.",
  ar: "أنت MigraAI، مساعد ذكاء اصطناعي مفيد للمهاجرين في ألمانيا. أجب بإيجاز وبلغة بسيطة."
};

export default async function handler(req, res) {
  const { messages, lang } = req.body;
  const system = systemPrompts[lang] || systemPrompts.de;
  const chat = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: system },
      ...messages.filter(m => m.role !== 'system')
    ]
  });
  res.status(200).json({ reply: chat.choices[0].message.content });
}
