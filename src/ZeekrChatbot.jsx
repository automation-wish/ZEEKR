import { useState, useRef, useEffect } from "react";
import logoText from "./assets/zeekr-text-logo.png";
import logo      from "./assets/zeekr-logo.png";
import carImage  from "./assets/zeekr-car.png";
import sendIcon  from "./assets/send-icon.png";

export default function ZeekrChatbot() {
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const messagesEnd = useRef(null);
  const sessionId   = useRef(crypto.randomUUID());

  // גלילה אוטומטית
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // שליחת הודעה
  async function handleSend() {
    const text = input.trim();
    if (!text) return;

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(process.env.REACT_APP_ZEEKR_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId.current,
          text,
        }),
      });
      const { output } = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: output }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "⚠️ שגיאת שרת – נסו שוב." },
      ]);
    }
    setLoading(false);
  }

  const handleKeyPress = (e) => e.key === "Enter" && handleSend();

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row font-sans rtl text-right">
      {/* פס עליון */}
      <div className="absolute top-0 left-0 w-full bg-white flex items-center justify-center md:justify-start px-6 py-4 shadow z-10">
        <img src={logoText} alt="ZEEKR" className="h-6 w-auto" />
      </div>

      {/* חצי שמאלי – תמונת רכב */}
      <div className="md:w-1/2 w-full h-screen hidden md:block">
        <img src={carImage} alt="zeekr car" className="w-full h-full object-cover" />
      </div>

      {/* חצי ימני – צ'אט */}
      <div className="md:w-1/2 w-full h-screen flex flex-col items-center justify-between bg-gradient-to-b from-white to-gray-100 pt-20 px-4 pb-6">
        <header className="flex flex-col items-center gap-2">
          <div className="h-20 w-20 rounded-full bg-white p-3 shadow flex items-center justify-center">
            <img src={logo} alt="icon" className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold">ZEEKR CHATBOT</h2>
          <p className="text-sm text-gray-600">אנחנו כאן לשירותך 24/7</p>
        </header>

        {/* תיבת הצ'אט */}
        <main
          className="w-full max-w-md flex-1 overflow-y-auto scroll-smooth mt-6 mb-4 space-y-2 px-4"
          style={{ minHeight: 0 }}
        >
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div
                key={i}
                dir="rtl"
                style={{ unicodeBidi: "plaintext" }}
                className="bg-[#E6F0FF] text-[#003399] ml-auto max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words"
              >
                {m.content}
              </div>
            ) : (
              <div
                key={i}
                dir="rtl"
                className="w-full text-base text-gray-900 leading-relaxed whitespace-pre-wrap break-words my-3 px-1"
                style={{ background: "none", boxShadow: "none", marginRight: 0 }}
              >
                {m.content}
              </div>
            )
          )}
          {loading && (
            <div
              dir="rtl"
              className="w-full text-base text-gray-500 leading-relaxed whitespace-pre-wrap break-words my-3 px-1"
            >
              הבוט מקליד...
            </div>
          )}
          <div ref={messagesEnd} />
        </main>

       {/* אזור קלט + כפתור שליחה */}
       <footer className="w-full max-w-md flex flex-col gap-1 mt-auto">
          <div className="flex items-center gap-2 flex-row-reverse">
            <input
              type="text"
              dir="rtl"
              style={{ unicodeBidi: "plaintext" }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="איך אפשר לעזור לך?"
              className="flex-1 text-sm border border-gray-300 rounded-[8px] px-4 py-2 focus:outline-none focus:ring focus:border-[#003399] text-right"
            />
            <button onClick={handleSend} className="shrink-0">
              <img src={sendIcon} alt="send" className="w-[56px] h-[56px]" />
            </button>
          </div>

          {/* טקסט תנאי שימוש */}
          <p className="text-[10px] text-gray-500 text-right pt-1 pr-1">
            התכתבות עם הצ׳אטבוט מהווה הסכמה עם{' '}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#003399] underline hover:no-underline"
            >
              תנאי השימוש
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
