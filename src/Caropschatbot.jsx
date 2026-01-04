import { useState, useRef, useEffect } from "react";

// אייקון רכב פשוט כ-SVG inline
const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
  </svg>
);

// אייקון שליחה
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
);

// אייקון חזרה
const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
  </svg>
);

export default function CarOpsChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);
  const sessionId = useRef(crypto.randomUUID());

  // תמונות רקע - החלף ב-URLs אמיתיים
  const backgroundImages = [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80", // פנים רכב
    "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&q=80", // כביש מפותל
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", // מוסך
  ];

  // הודעת פתיחה
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: "שלום! אני הבוט התפעולי שלך.\nאיך אוכל לעזור היום?\nבדוק לחץ אוויר, קבע טיפול, או דווח על תקלה.",
      },
    ]);
  }, []);

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
      const res = await fetch(process.env.REACT_APP_API_URL || "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId.current, text }),
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

  // פונקציה לבחירת תמונת רקע לפי אינדקס ההודעה
  const getBackgroundImage = (index) => {
    return backgroundImages[index % backgroundImages.length];
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-md border-b border-white/10 shrink-0">
        <button className="p-2 text-white/80 hover:text-white transition-colors">
          <BackIcon />
        </button>
        <h1 className="text-white font-semibold text-lg tracking-wide">Car Ops Bot</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto relative">
        {/* רקע תמונות מתחלפות */}
        <div className="absolute inset-0 z-0">
          {messages.map((_, i) => (
            <div
              key={i}
              className="h-[33.33vh] bg-cover bg-center relative"
              style={{
                backgroundImage: `url(${getBackgroundImage(i)})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
            </div>
          ))}
          {/* תמונת רקע נוספת אם יש loading */}
          {loading && (
            <div
              className="h-[33.33vh] bg-cover bg-center relative"
              style={{
                backgroundImage: `url(${getBackgroundImage(messages.length)})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
            </div>
          )}
        </div>

        {/* הודעות */}
        <div className="relative z-10 p-4 space-y-4 min-h-full">
          {messages.map((m, i) =>
            m.role === "assistant" ? (
              /* הודעת בוט */
              <div key={i} className="flex items-start gap-3 max-w-[85%]" dir="rtl">
                <div className="shrink-0 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 shadow-lg">
                  <CarIcon />
                </div>
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl rounded-tr-sm px-4 py-3 shadow-xl">
                  <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                    {m.content}
                  </p>
                </div>
              </div>
            ) : (
              /* הודעת משתמש */
              <div key={i} className="flex justify-start mr-auto max-w-[85%]" dir="rtl">
                <div className="bg-blue-100/95 backdrop-blur-sm rounded-2xl rounded-tl-sm px-4 py-3 shadow-xl mr-13">
                  <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                    {m.content}
                  </p>
                </div>
              </div>
            )
          )}
          
          {/* Loading indicator */}
          {loading && (
            <div className="flex items-start gap-3 max-w-[85%]" dir="rtl">
              <div className="shrink-0 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 shadow-lg">
                <CarIcon />
              </div>
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl rounded-tr-sm px-4 py-3 shadow-xl">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEnd} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="shrink-0 p-4 bg-black/60 backdrop-blur-md border-t border-white/10">
        <div className="flex items-center gap-3 max-w-2xl mx-auto" dir="rtl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="הקלד הודעה..."
            className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all text-right text-[16px]"
            style={{ unicodeBidi: "plaintext" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="shrink-0 w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            aria-label="שלח"
          >
            <SendIcon />
          </button>
        </div>
      </footer>
    </div>
  );
}
