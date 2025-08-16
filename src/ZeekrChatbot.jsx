import { useState, useRef, useEffect } from "react";
import logoText   from "./assets/zeekr-text-logo.png";
import logo       from "./assets/zeekr-logo.png";
import heroImage  from "./assets/Zeekr_FamilyShot_300x600.jpg"; // תמונת ההירו (רבע מסך)
import sendIcon   from "./assets/send-icon.png";

export default function ZeekrChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const messagesEnd = useRef(null);
  const sessionId = useRef(crypto.randomUUID());

  // הודעת פתיחה
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content:
          "היי! אני הצ'אטבוט של זיקר!\nאשמח לקבל את מספר הרכב שלך כדי שאוכל לזהות אותך",
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
      const res = await fetch(process.env.REACT_APP_ZEEKR_API, {
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

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row font-sans rtl text-right">
      {/* פס עליון */}
      <div className="absolute top-0 left-0 w-full bg-white flex items-center justify-center md:justify-start px-6 py-4 shadow z-10">
        <img src={logoText} alt="ZEEKR" className="h-6 w-auto" />
      </div>

      {/* תמונה – רבע מסך בדסקטופ */}
      <div className="hidden md:block w-full h-screen md:w-1/4 lg:w-1/4 xl:w-1/4">
        <img src={heroImage} alt="Zeekr models" className="w-full h-full object-cover" />
      </div>

      {/* צד הצ'אט – שלושה־רבעי מסך, תוכן ממורכז */}
      <div className="w-full h-screen md:w-3/4 lg:w-3/4 xl:w-3/4 flex flex-col items-center justify-between bg-gradient-to-b from-white to-gray-100 pt-20 px-6 pb-6">

        {/* Header ממורכז */}
        <header className="w-full max-w-3xl xl:max-w-4xl mx-auto flex flex-col items-center gap-2">
          <div className="h-20 w-20 rounded-full bg-white p-3 shadow flex items-center justify-center">
            <img src={logo} alt="icon" className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold">ZEEKR CHATBOT</h2>
          <p className="text-sm text-gray-600">אנחנו כאן לשירותך 24/7</p>
          <p dir="rtl" className="text-xs text-gray-500 leading-5 max-w-2xl text-center mt-1">
            ZEEKR הוא רכב חדשני שמתעדכן מעת לעת, לעתים אף מהר יותר ממני.<br />
            לכן, במענה שלי ייתכנו טעויות או ופערים, אשמח ואודה לכם אם תעדכנו אותי כאן בצ׳אט
            במקרה של מידע שנראה לא מדויק או שגוי.
          </p>
        </header>

        {/* Main ממורכז – אזור ההודעות */}
        <main
          className="w-full max-w-3xl xl:max-w-4xl mx-auto flex-1 overflow-y-auto scroll-smooth mt-6 mb-4 space-y-3 px-2"
          style={{ minHeight: 0 }}
        >
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div
                key={i}
                dir="rtl"
                style={{ unicodeBidi: "plaintext" }}
                className="bg-[#E6F0FF] text-[#003399] ml-auto max-w-[95%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words"
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
            <div dir="rtl" className="w-full text-base text-gray-500 leading-relaxed whitespace-pre-wrap break-words my-3 px-1">
              אני חושב…
            </div>
          )}
          <div ref={messagesEnd} />
        </main>

        {/* Footer ממורכז – שורת קלט */}
        <footer className="w-full max-w-3xl xl:max-w-4xl mx-auto flex flex-col gap-1 mt-auto">
          <div className="flex items-center gap-2 flex-row-reverse">
            <input
              type="text"
              dir="rtl"
              style={{ unicodeBidi: "plaintext" }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="איך אפשר לעזור לך?"
              className="flex-1 border border-gray-300 rounded-[8px] px-4 py-2 focus:outline-none focus:ring focus:border-[#003399] text-right text-[16px]"
            />
            <button onClick={handleSend} className="shrink-0" aria-label="שלח">
              <img src={sendIcon} alt="send" className="w-[56px] h-[56px]" />
            </button>
          </div>

          {/* טקסט תנאי שימוש */}
          <p dir="rtl" style={{ unicodeBidi: "plaintext" }} className="text-[10px] text-gray-500 text-right pt-1 pr-1">
            התכתבות עם הצ׳אטבוט מהווה הסכמה עם{" "}
            <button type="button" onClick={() => setShowTerms(true)} className="text-[#003399] underline hover:no-underline">
              תנאי השימוש
            </button>
          </p>
        </footer>
      </div>

      {/* פופ-אפ תנאי שימוש */}
      {showTerms && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowTerms(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto rtl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 left-2 text-gray-500 hover:text-gray-700 text-lg"
              onClick={() => setShowTerms(false)}
              aria-label="סגור"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4 text-center">תנאי שימוש</h3>
            <ol dir="rtl" className="list-decimal list-inside space-y-2 text-sm leading-relaxed text-gray-800">
              <li>
                <strong>הגבלת אחריות על תוכן התשובות –</strong> התשובות ניתנות לצרכים אינפורמטיביים בלבד ואינן מחליפות ייעוץ מקצועי.
              </li>
              <li>
                <strong>טעויות ובאגים טכנולוגיים –</strong> ייתכנו טעויות או אי-דיוקים בתשובות ותקלות מערכת/רשת.
              </li>
              <li>
                <strong>זמינות השירות –</strong> השירות עשוי להיות לא זמין מעת לעת.
              </li>
              <li>
                <strong>אחריות המשתמש –</strong> השימוש בשירות באחריות המשתמש; מומלץ לאמת מידע חשוב לפני פעולה.
              </li>
              <li>
                <strong>מקור המידע ועדכניותו –</strong> מבוסס על מקורות רשמיים, אך ייתכנו פערים ועדכונים שלא הוטמעו.
              </li>
              <li>
                <strong>פרטיות ושמירת מידע –</strong> מידע יכול להישמר לצורך שיפור השירות בהתאם למדיניות הפרטיות.
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
