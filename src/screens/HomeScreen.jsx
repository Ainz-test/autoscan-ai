import { HERO_VIDEO } from "../lib/constants";
import { Reveal } from "../components/Reveal";
import { Icon } from "../components/Icons";

const FEATURES = [
  { icon: "ocr", en: "AI-Powered OCR", ar: "تعرف بصري ذكي", sub: "Reads every Arabic & English mark on your inspection sheet", subAr: "يقرأ جميع العلامات بالعربية والإنجليزية" },
  { icon: "report", en: "Complete Diagnosis", ar: "تشخيص شامل", sub: "Every fault listed with severity, cost & repair steps", subAr: "كل عطل بدرجة الخطورة والتكلفة وخطوات الإصلاح" },
  { icon: "map", en: "Visual Mapping", ar: "تخطيط مرئي", sub: "See exactly where each fault is located on your vehicle", subAr: "شاهد موقع كل عطل على سيارتك" },
  { icon: "pin", en: "Garage Locator", ar: "مراكز التصليح", sub: "Find trusted repair shops in Qatar & the GCC", subAr: "اعثر على مراكز موثوقة في قطر والخليج" },
];

const STEPS = [
  { n: "01", en: "Select your vehicle", ar: "اختر مركبتك", subEn: "Make, model and year", subAr: "الصانع والموديل والسنة" },
  { n: "02", en: "Scan the sheet", ar: "امسح الورقة", subEn: "Upload a photo or use your camera", subAr: "ارفع صورة أو استخدم الكاميرا" },
  { n: "03", en: "Read the diagnosis", ar: "اقرأ التشخيص", subEn: "Severity, costs and repair steps", subAr: "الخطورة والتكلفة وخطوات الإصلاح" },
];

export function HomeScreen({ setTab, ar, faults }) {
  const high = faults.filter((f) => f.severity === "high").length;
  const med = faults.filter((f) => f.severity === "medium").length;
  const low = faults.filter((f) => f.severity === "low").length;
  const hasData = faults.length > 0;

  const tiles = [
    { count: high, label: ar ? "حرج" : "Critical", cls: "sev-high" },
    { count: med, label: ar ? "متوسط" : "Moderate", cls: "sev-medium" },
    { count: low, label: ar ? "منخفض" : "Minor", cls: "sev-low" },
  ];

  return (
    <div className="home">
      {/* ── Cinematic video hero ── */}
      <section className="hero">
        <video className="hero-video" src={HERO_VIDEO} autoPlay loop muted playsInline aria-hidden="true" />
        <div className="hero-scrim" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="pill anim-in">
            <span className="pill-dot" />
            {ar ? "تشخيص مدعوم بالذكاء الاصطناعي" : "AI-Powered Diagnostics"}
          </div>
          <h1 className="hero-title anim-up">
            {ar ? "سيارتك" : "Your vehicle,"}
            <span className="hero-accent">{ar ? " تحت المجهر فوراً" : " read instantly."}</span>
          </h1>
          <p className="hero-sub anim-up d1">
            {ar
              ? "ارفع صورة ورقة الفحص واحصل على تشخيص كامل بالذكاء الاصطناعي مع التكاليف وخطوات الإصلاح خلال ثوانٍ."
              : "Upload your inspection sheet and get a complete AI diagnosis — severity, costs and repair steps — in seconds."}
          </p>
          <div className="hero-actions anim-up d2">
            <button className="btn btn-primary btn-lg" onClick={() => setTab("scan")}>
              <Icon name="scan" size={18} strokeWidth={2.2} />
              {ar ? "ابدأ المسح" : "Start a scan"}
            </button>
            {hasData && (
              <button className="btn btn-ghost btn-lg" onClick={() => setTab("report")}>
                {ar ? "عرض التقرير" : "View report"}
              </button>
            )}
          </div>
          <div className="hero-trust anim-up d3">
            <span><Icon name="shield" size={15} /> {ar ? "خاص وآمن" : "Private & secure"}</span>
            <span className="dot" />
            <span><Icon name="globe" size={15} /> {ar ? "عربي / إنجليزي" : "Arabic / English"}</span>
            <span className="dot" />
            <span><Icon name="spark" size={15} /> {ar ? "نتائج فورية" : "Instant results"}</span>
          </div>
        </div>
      </section>

      <div className="container home-body">
        {/* ── Last report summary ── */}
        {hasData && (
          <Reveal className="block">
            <div className="eyebrow">{ar ? "آخر تقرير" : "Last report"}</div>
            <div className="card card-pad hud-line summary">
              <div className="stat-row">
                {tiles.map((t) => (
                  <div key={t.label} className={`stat ${t.cls}`} style={{ background: "var(--surface-2)" }}>
                    <div className="num">{t.count}</div>
                    <div className="lbl">{t.label}</div>
                  </div>
                ))}
              </div>
              {high > 0 && (
                <div className="alert alert-crit">
                  <Icon name="alert" size={18} />
                  <span>
                    {ar
                      ? high + " عطل حرج — لا تقد السيارة"
                      : high + " critical fault(s) detected — do not drive."}
                  </span>
                </div>
              )}
              <button className="btn btn-primary btn-block" onClick={() => setTab("report")}>
                {ar ? "عرض التقرير الكامل" : "View full report"}
                <Icon name="arrow" size={16} />
              </button>
            </div>
          </Reveal>
        )}

        {/* ── How it works ── */}
        <div className="block">
          <div className="eyebrow">{ar ? "كيف يعمل" : "How it works"}</div>
          <div className="steps">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 90} className="step">
                <div className="step-num">{s.n}</div>
                <div>
                  <div className="step-title">{ar ? s.ar : s.en}</div>
                  <div className="step-sub">{ar ? s.subAr : s.subEn}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── Features ── */}
        <div className="block">
          <div className="eyebrow">{ar ? "الميزات" : "Capabilities"}</div>
          <div className="features">
            {FEATURES.map((f, i) => (
              <Reveal key={f.en} delay={i * 80} className="card card-pad card-hover feature">
                <span className="feature-ico">
                  <Icon name={f.icon} size={22} />
                </span>
                <div className="feature-title">{ar ? f.ar : f.en}</div>
                <div className="feature-sub">{ar ? f.subAr : f.sub}</div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── CTA banner ── */}
        <Reveal className="cta">
          <div className="cta-inner">
            <h2 className="cta-title">
              {ar ? "جاهز لفحص سيارتك؟" : "Ready to diagnose your car?"}
            </h2>
            <p className="cta-sub">
              {ar
                ? "حمّل ورقة الفحص ودع الذكاء الاصطناعي يقوم بالباقي."
                : "Upload your inspection sheet and let the AI do the rest."}
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => setTab("scan")}>
              <Icon name="scan" size={18} strokeWidth={2.2} />
              {ar ? "ابدأ الآن" : "Scan now"}
            </button>
          </div>
        </Reveal>

        <footer className="foot">
          <div className="foot-brand">
            <span className="brand-mark"><Icon name="logo" size={18} /></span>
            <span className="brand-name">AutoScan <span className="brand-ai">AI</span></span>
          </div>
          <p>{ar ? "تشخيص السيارات بالذكاء الاصطناعي — الدوحة، قطر" : "AI vehicle diagnostics — Doha, Qatar"}</p>
          <p className="foot-fine">{ar ? "صورك تبقى خاصة ولا يتم تخزينها." : "Your images stay private and are never stored."}</p>
        </footer>
      </div>
    </div>
  );
}
