import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

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

// 🔤 авто-детект языка по тексту
function detectLanguage(text: string) {
  if (/[א-ת]/.test(text)) return "he";
  if (/[a-zA-Z]/.test(text)) return "en";
  return "ru";
}

export default function Chat() {
  const { t } = useTranslation();

  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // RTL / LTR
  useEffect(() => {
    document.documentElement.dir = i18n.language === "he" ? "rtl" : "ltr";
  }, [i18n.language]);

  // 📊 tracking визита (1 раз при заходе)
  useEffect(() => {
    fetch("https://api.piqo.co.il/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: window.location.pathname,
        referrer: document.referrer,
        screen: `${window.screen.width}x${window.screen.height}`,
        language: i18n.language,
      }),
    }).catch(() => {
      // тихо игнорируем ошибки
    });
  }, []);

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

      // 1 запрос = 1 ответ
      setMessages([userMessage, botMessage]);
    } catch {
      alert("Ошибка соединения с сервером");
    }

    setLoading(false);
    setText("");
  }

  return (
    <div className="chat-container">
      {/* HEADER */}
      <div className="chat-title">
        <img src={logo} alt="logo" className="chat-logo" />
        <span>{t("title")}</span>
      </div>

      {/* MESSAGES */}
      {messages.map((m, i) => (
        <div key={i}>
          {m.from === "user" && (
            <div className="message-user">🧑 {m.text}</div>
          )}

          {m.from === "bot" && (
            <div className="bot-card">
              <div className="bot-info">
                {m.result.city && (
                  <p>
                    📍 {t("city")}: {m.result.city}
                  </p>
                )}

                {m.result.rooms && (
                  <p>
                    🛏 {t("rooms")}: {m.result.rooms}
                  </p>
                )}

                {m.result.priceTo && (
                  <p>
                    💰 {t("price")}: {m.result.priceTo} ₪
                  </p>
                )}

                <p>
                  🚫 {t("noAgent")}:{" "}
                  {m.result.withoutAgent ? t("yes") : t("any")}
                </p>
              </div>

              <div className="buttons">
                {m.result.links.map((l, idx) => (
                  <a
                    key={idx}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`btn ${l.site.toLowerCase()}`}
                  >
                    {l.site === "Madlan" ? "📊" : "🔗"} {l.site}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* INPUT */}
      <div className="input-area">
        <input
          value={text}
          onChange={(e) => {
            const val = e.target.value;
            setText(val);

            // 🧠 авто-переключение языка
            const lang = detectLanguage(val);
            i18n.changeLanguage(lang);
          }}
          placeholder={t("placeholder")}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />

        <button onClick={send} disabled={loading}>
          {loading ? t("loading") : t("search")}
        </button>
      </div>

      {/* EXAMPLES */}
      <div className="search-hint">
        💡
        <div
          className="example-item"
          onClick={() => setText(t("example"))}
        >
          🏠 {t("example")}
        </div>
        <div
          className="example-item"
          onClick={() => setText(t("exampleCar"))}
        >
          🚗 {t("exampleCar")}
        </div>
      </div>
    </div>
  );
}
