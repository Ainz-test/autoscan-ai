import { useState, useEffect, useRef } from "react";
import { MAKES, MODELS, YEARS } from "../lib/constants";
import { runDiagnosis } from "../lib/diagnose";
import { Icon } from "../components/Icons";

export function ScanScreen({ setTab, ar, setFaults }) {
  const [step, setStep] = useState("vehicle");
  const [make, setMake] = useState("Toyota");
  const [model, setModel] = useState("Land Cruiser");
  const [year, setYear] = useState(2006);
  const [progress, setProgress] = useState(0);
  const [subStep, setSubStep] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const galleryRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const tickRef = useRef(null);

  const STAGES = [
    ar ? "استخراج النص عبر OCR..." : "Extracting text via OCR...",
    ar ? "تشغيل نموذج الذكاء الاصطناعي..." : "Running AI diagnosis...",
    ar ? "تحديد مواقع الأعطال..." : "Mapping fault locations...",
  ];

  // ── Camera ──
  function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg(ar ? "الكاميرا غير مدعومة. استخدم رفع الصورة." : "Camera not supported. Use Upload Photo.");
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((s) => {
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play();
        }
      })
      .catch(() => setErrorMsg(ar ? "تعذّر الوصول للكاميرا. استخدم رفع الصورة." : "Camera access denied. Use Upload Photo."));
  }
  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }
  useEffect(() => {
    if (step === "camera") startCamera();
    return stopCamera;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function capturePhoto() {
    const v = videoRef.current;
    if (!v) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth || 640;
    c.height = v.videoHeight || 480;
    c.getContext("2d").drawImage(v, 0, 0);
    c.toBlob(
      (blob) => {
        setPreviewUrl(URL.createObjectURL(blob));
        stopCamera();
        runPipeline(blob);
      },
      "image/jpeg",
      0.92
    );
  }

  function handleGallery(e) {
    const file = e.target.files[0];
    if (!file) return;
    const ok = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
    if (ok.indexOf(file.type) === -1 && file.type !== "") {
      fail(ar ? "نوع الملف غير مدعوم. استخدم JPEG أو PNG." : "Invalid file type. Use JPEG or PNG.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      fail(ar ? "حجم الملف كبير جداً. الحد الأقصى 25 ميغابايت." : "File too large. Max 25MB.");
      return;
    }
    e.target.value = "";
    setPreviewUrl(URL.createObjectURL(file));
    runPipeline(file);
  }

  function fail(msg) {
    if (tickRef.current) clearInterval(tickRef.current);
    setErrorMsg(msg);
    setStep("error");
  }

  function runPipeline(imageFile) {
    setStep("processing");
    setProgress(0);
    setSubStep(0);
    setErrorMsg(null);
    let p = 0;
    tickRef.current = setInterval(() => {
      p += 1;
      if (p >= 90) clearInterval(tickRef.current);
      setProgress(p);
      if (p === 28) setSubStep(1);
      if (p === 62) setSubStep(2);
    }, 80);

    runDiagnosis({
      imageFile,
      make,
      model,
      year,
      ar,
      onError: (msg) => fail(msg),
      onDone: (faults) => {
        clearInterval(tickRef.current);
        setProgress(100);
        setFaults(faults);
        setTimeout(() => setStep("done"), 300);
      },
    });
  }

  // ── Error screen ──
  if (step === "error")
    return (
      <div className="scan-wrap">
        {previewUrl && <img src={previewUrl || "/placeholder.svg"} alt="scan" className="scan-preview dim" />}
        <div className="card card-pad result-card crit">
          <div className="result-head">
            <span className="result-ico crit"><Icon name="alert" size={22} /></span>
            <h3>{ar ? "فشل التحليل" : "Analysis Failed"}</h3>
          </div>
          <div className="error-box">
            {(errorMsg || "Unknown error").split("\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="tips">
            {[
              ar ? "تأكد من وجود api/diagnose.js في GitHub" : "Ensure api/diagnose.js exists in GitHub repo",
              ar ? "تحقق من ANTHROPIC_API_KEY في Vercel" : "Verify ANTHROPIC_API_KEY in Vercel",
              ar ? "تأكد من وجود رصيد في console.anthropic.com" : "Check billing credit at console.anthropic.com",
              ar ? "أعد النشر في Vercel بعد أي تغيير" : "Redeploy on Vercel after changes",
            ].map((tip, i) => (
              <div key={i} className="tip">
                <span className="tip-n">{i + 1}</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
          <div className="btn-pair">
            <button className="btn btn-danger btn-block" onClick={() => { setErrorMsg(null); setStep("choose"); }}>
              {ar ? "حاول مجدداً" : "Try Again"}
            </button>
            <button className="btn btn-outline btn-block" onClick={() => { setErrorMsg(null); setStep("vehicle"); }}>
              {ar ? "مسح جديد" : "New Scan"}
            </button>
          </div>
        </div>
      </div>
    );

  // ── Done screen ──
  if (step === "done")
    return (
      <div className="scan-wrap centered">
        {previewUrl && <img src={previewUrl || "/placeholder.svg"} alt="scan" className="scan-preview shadow" />}
        <span className="result-ico minor big"><Icon name="check" size={34} /></span>
        <div>
          <h2 className="done-title">{ar ? "اكتمل التحليل!" : "Analysis Complete!"}</h2>
          <p className="done-sub">{ar ? "تم تحليل ورقة الفحص بنجاح" : "Inspection sheet analyzed successfully"}</p>
        </div>
        <div className="hero-actions" style={{ justifyContent: "center", marginBottom: 0 }}>
          <button className="btn btn-primary btn-lg" onClick={() => { setTab("report"); setStep("vehicle"); }}>
            {ar ? "عرض التقرير" : "View Report"}
            <Icon name="arrow" size={16} />
          </button>
          <button className="btn btn-outline btn-lg" onClick={() => { setStep("vehicle"); setPreviewUrl(null); }}>
            {ar ? "مسح جديد" : "New Scan"}
          </button>
        </div>
      </div>
    );

  // ── Processing screen ──
  if (step === "processing") {
    const R = 44;
    const dash = (2 * Math.PI * R * progress) / 100;
    return (
      <div className="scan-wrap centered">
        {previewUrl && <img src={previewUrl || "/placeholder.svg"} alt="scan" className="scan-preview dim shadow" />}
        <div className="ring">
          <svg width="104" height="104" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={R} fill="none" stroke="var(--border)" strokeWidth="7" />
            <circle
              cx="50" cy="50" r={R} fill="none" stroke="var(--accent)" strokeWidth="7"
              strokeDasharray={dash + " 999"} strokeLinecap="round" transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dasharray .12s", filter: "drop-shadow(0 0 6px var(--accent-glow))" }}
            />
          </svg>
          <div className="ring-pct">{progress}%</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <h3 className="done-title" style={{ fontSize: 18 }}>{ar ? "جارٍ التحليل..." : "Analyzing..."}</h3>
          <p style={{ color: "var(--accent)", fontWeight: 600, fontSize: 13, margin: 0 }}>{STAGES[subStep]}</p>
        </div>
        <div className="stages">
          {STAGES.map((s, i) => {
            const past = i < subStep;
            const cur = i === subStep;
            return (
              <div key={i} className={`stage${i > subStep ? " future" : ""}`}>
                <span className={`stage-dot${past ? " past" : cur ? " cur" : ""}`}>
                  {past ? <Icon name="check" size={12} strokeWidth={3} /> : i + 1}
                </span>
                <span className={cur ? "stage-cur" : ""}>{s}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Main scan UI (vehicle / choose / camera) ──
  const stepIndex = step === "vehicle" ? 0 : 1;
  const fields = [
    { label: ar ? "الصانع" : "Make", value: make, opts: MAKES, onChange: (v) => { setMake(v); setModel((MODELS[v] || [])[0] || ""); } },
    { label: ar ? "الموديل" : "Model", value: model, opts: MODELS[make] || [], onChange: (v) => setModel(v) },
    { label: ar ? "السنة" : "Year", value: year, opts: YEARS, onChange: (v) => setYear(Number(v)) },
  ];

  return (
    <div className="scan-wrap">
      {/* Step indicator */}
      <div className="step-indicator">
        {[ar ? "المركبة" : "Vehicle", ar ? "المصدر" : "Source", ar ? "التحليل" : "Analysis"].map((s, i) => {
          const cur = stepIndex === i;
          const past = i < stepIndex;
          return (
            <div key={s} className="si">
              <span className={`si-dot${past ? " past" : cur ? " cur" : ""}`}>
                {past ? <Icon name="check" size={13} strokeWidth={3} /> : i + 1}
              </span>
              <span className={`si-label${cur ? " cur" : ""}`}>{s}</span>
              {i < 2 && <span className="si-line" />}
            </div>
          );
        })}
      </div>

      {/* Vehicle step */}
      {step === "vehicle" && (
        <div className="anim-up">
          <h2 className="scan-title">{ar ? "اختر مركبتك" : "Select your vehicle"}</h2>
          <p className="scan-lead">{ar ? "نخصص التشخيص حسب طراز سيارتك." : "We tailor the diagnosis to your exact model."}</p>
          {fields.map((field) => (
            <div key={field.label} className="form-row">
              <label className="field-label">{field.label}</label>
              <div className="select-wrap">
                <select className="field" value={field.value} onChange={(e) => field.onChange(e.target.value)}>
                  {field.opts.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <span className="chev"><Icon name="chev" size={16} /></span>
              </div>
            </div>
          ))}
          <button className="btn btn-primary btn-block btn-lg" onClick={() => setStep("choose")}>
            {ar ? "التالي" : "Continue"}
            <Icon name="arrow" size={16} />
          </button>
        </div>
      )}

      {/* Choose source step */}
      {step === "choose" && (
        <div className="anim-up">
          <h2 className="scan-title">{ar ? "كيف تريد إضافة الصورة؟" : "How would you like to add the sheet?"}</h2>
          <p className="scan-lead">{ar ? "اختر طريقة إضافة ورقة الفحص" : "Choose how to add your inspection sheet"}</p>
          <div className="source-list">
            <button className="source primary" onClick={() => galleryRef.current && galleryRef.current.click()}>
              <span className="source-ico"><Icon name="image" size={26} /></span>
              <span className="source-text">
                <span className="source-title">{ar ? "رفع صورة من الهاتف" : "Upload a photo"}</span>
                <span className="source-sub">{ar ? "اختر من معرض الصور أو الملفات" : "Choose from gallery or files"}</span>
              </span>
              <Icon name="arrow" size={18} />
            </button>
            <button className="source" onClick={() => setStep("camera")}>
              <span className="source-ico ghost"><Icon name="camera" size={26} /></span>
              <span className="source-text">
                <span className="source-title">{ar ? "التقاط بالكاميرا" : "Use the camera"}</span>
                <span className="source-sub">{ar ? "افتح الكاميرا مباشرة" : "Open the live camera"}</span>
              </span>
              <Icon name="arrow" size={18} />
            </button>
          </div>
          <input ref={galleryRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" onChange={handleGallery} hidden />
          <button className="btn-link back" onClick={() => setStep("vehicle")}>
            <Icon name="back" size={15} /> {ar ? "العودة" : "Back"}
          </button>
        </div>
      )}

      {/* Camera step */}
      {step === "camera" && (
        <div className="anim-up">
          <h2 className="scan-title">{ar ? "التقاط ورقة الفحص" : "Capture the sheet"}</h2>
          {errorMsg && <div className="alert alert-crit" style={{ color: "var(--crit)" }}>{errorMsg}</div>}
          <div className="camera-view">
            <video ref={videoRef} autoPlay playsInline muted />
            <span className="camera-hint">{ar ? "وجّه الكاميرا نحو الورقة" : "Point the camera at the sheet"}</span>
            <span className="camera-frame" />
          </div>
          <button className="btn btn-primary btn-block btn-lg" onClick={capturePhoto}>
            <Icon name="camera" size={18} /> {ar ? "التقاط الصورة" : "Capture photo"}
          </button>
          <input ref={galleryRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" onChange={handleGallery} hidden />
          <button className="btn-link back" onClick={() => { setStep("choose"); setErrorMsg(null); }}>
            <Icon name="back" size={15} /> {ar ? "العودة" : "Back"}
          </button>
        </div>
      )}
    </div>
  );
}
