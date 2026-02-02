import { useState } from "react";
import "./chat.css";
import logo from "./assets/logo.png";

type SearchLink = {
  site: string;
  url: string;
  description?: string;
};

type BotResult = {
  city?: string;
  rooms?: number;
  priceTo?: number;
  withoutAgent?: boolean;
  links: SearchLink[];
};

type Message =
  | { from: "user"; text: string }
  | { from: "bot"; result: BotResult };

export default function Chat() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

async function send() {
  if (!text.trim()) return;

  setLoading(true);

  const userMessage: Message = {
    from: "user",
    text,
  };

  try {
    const response = await fetch("https://api.piqo.co.il/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data: BotResult = await response.json();

    const botMessage: Message = {
      from: "bot",
      result: data,
    };

    // ✅ ВАЖНО: перезаписываем, а не добавляем
    setMessages([userMessage, botMessage]);
  } catch {
    alert("Ошибка соединения с сервером");
  }

  setLoading(false);
  setText("");
}


  return (
    <div className="chat-container">
         <div className="chat-title">
          <img src={logo} alt="logo" className="chat-logo" />
           <span>Поиск квартир</span>
         </div>

      {messages.map((m, i) => (
        <div key={i}>
          {m.from === "user" && (
            <div className="message-user">🧑 {m.text}</div>
          )}

          {m.from === "bot" && (
            <div className="bot-card">
              <div className="bot-info">
                {m.result.city && <p>📍 Город: {m.result.city}</p>}
                {m.result.rooms && <p>🛏 Комнаты: {m.result.rooms}</p>}
                {m.result.priceTo && (
                  <p>💰 Цена до: {m.result.priceTo} ₪</p>
                )}
                <p>
                  🚫 Без маклера:{" "}
                  {m.result.withoutAgent ? "да" : "не важно"}
                </p>
              </div>

              <div className="buttons">
                {m.result.links.map((l, idx) => {
                  const site = l.site.toLowerCase();

                  return (
                    <a
                      key={idx}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`btn ${site}`}
                    >
                      {site === "madlan" ? "📊" : "🔗"} {l.site}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}

    <div className="input-area">
  <input
    value={text}
    onChange={(e) => setText(e.target.value)}
    placeholder="Напиши, что ищешь..."
    onKeyDown={(e) => e.key === "Enter" && send()}
  />

  <button onClick={send} disabled={loading}>
    {loading ? "..." : "Найти"}
  </button>
</div>

<div
  className="search-hint"
  onClick={() =>
    setText("2 комнаты Хайфа до 4500 без маклера")
  }
>
  💡 например: <b>2 комнаты Хайфа до 4500 без маклера</b>
</div>
    </div>
  );
}
