import { Icon } from "./Icons";

const TABS = [
  { id: "home", en: "Home", ar: "الرئيسية" },
  { id: "scan", en: "Scan", ar: "مسح" },
  { id: "report", en: "Report", ar: "التقرير" },
  { id: "garages", en: "Garages", ar: "المراكز" },
  { id: "profile", en: "Profile", ar: "الملف" },
];

export function Navbar({ tab, setTab, ar, setAr }) {
  return (
    <header className="nav">
      <div className="container">
        <div className="nav-top">
          <button className="brand" onClick={() => setTab("home")} aria-label="AutoScan AI home">
            <span className="brand-mark">
              <Icon name="logo" size={20} />
            </span>
            <span className="brand-name">
              AutoScan <span className="brand-ai">AI</span>
            </span>
          </button>

          <div className="segment lang" role="group" aria-label="Language">
            {[{ l: "EN", v: false }, { l: "ع", v: true }].map((opt) => (
              <button
                key={opt.l}
                className={ar === opt.v ? "active" : ""}
                onClick={() => setAr(opt.v)}
                aria-pressed={ar === opt.v}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>

        <nav className="nav-tabs" aria-label="Primary">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                className={`tab${active ? " active" : ""}`}
                onClick={() => setTab(t.id)}
                aria-current={active ? "page" : undefined}
              >
                <span className="tab-ico">
                  <Icon name={t.id} size={20} strokeWidth={active ? 2 : 1.7} />
                </span>
                <span className="tab-label">{ar ? t.ar : t.en}</span>
                {active && <span className="tab-bar" />}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
