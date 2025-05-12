import { useState } from 'react';

const prompts = {
  de: "Du bist MigraAI, ein hilfreicher KI-Assistent für Migrant:innen in Deutschland. Antworte kurz und einfach.",
  tr: "Sen MigraAI’sın, Almanya’daki göçmenler için yardımcı bir yapay zeka asistanısın. Kısa ve basit cevap ver.",
  ar: "أنت MigraAI، مساعد ذكاء اصطناعي مفيد للمهاجرين في ألمانيا. أجب بإيجاز وبلغة بسيطة."
};

export default function Home() {
  const [lang, setLang] = useState('');
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');

  const start = (l) => {
    setLang(l);
    setMsgs([{ role: 'system', content: prompts[l] }]);
  };

  const send = async () => {
    if (!input) return;
    const userMsg = { role: 'user', content: input };
    const all = [...msgs, userMsg];
    setMsgs(all);
    setInput('');
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: all, lang })
    });
    const { reply } = await res.json();
    setMsgs([...all, { role: 'assistant', content: reply }]);
  };

  if (!lang) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <h1>MigraAI</h1>
        <p>Sprache wählen:</p>
        <button onClick={() => start('de')}>Deutsch</button>{' '}
        <button onClick={() => start('tr')}>Türkçe</button>{' '}
        <button onClick={() => start('ar')}>العربية</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      <h1>MigraAI</h1>
      <div style={{ height: 300, overflowY: 'auto', border: '1px solid #ccc', padding: 10 }}>
        {msgs.map((m, i) => (
          <p key={i}>
            <strong>{m.role === 'user' ? 'Du' : 'AI'}:</strong> {m.content}
          </p>
        ))}
      </div>
      <input
        style={{ width: '80%' }}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && send()}
      />
      <button onClick={send}>Senden</button>
    </div>
  );
}
