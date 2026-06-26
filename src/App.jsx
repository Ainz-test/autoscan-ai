import { useState, useRef, useEffect } from "react";

// ── Design Tokens ─────────────────────────────────────────────────────────────
const T = {
  navy:    "#0D1B2A",
  navyMid: "#1F3A5F",
  red:     "#E63946",
  redDeep: "#C0392B",
  amber:   "#F4A261",
  teal:    "#2A9D8F",
  bg:      "#F0F4F8",
  card:    "#FFFFFF",
  border:  "#DDE3EC",
  textPri: "#0D1B2A",
  textSec: "#5A6A7E",
  textMut: "#9AA5B4",
  critBg:  "#FDECEC",
  medBg:   "#FEF3E2",
  lowBg:   "#E8F7F5",
};

const sevColor = (s) => s==="high" ? T.redDeep : s==="medium" ? "#E67E22" : T.teal;
const sevBg    = (s) => s==="high" ? T.critBg  : s==="medium" ? T.medBg   : T.lowBg;
const sevLabel = (s, ar) => ar
  ? (s==="high"?"حرج":s==="medium"?"متوسط":"منخفض")
  : (s==="high"?"Critical":s==="medium"?"Moderate":"Minor");

const MAKES  = ["Toyota","Nissan","Ford","Lexus","GMC","Chevrolet","Hyundai","Kia","BMW","Mercedes-Benz","Land Rover","Mitsubishi","Honda","Mazda","Jeep"];
const MODELS = { Toyota:["Land Cruiser","Camry","Corolla","Hilux","Prado","RAV4","Fortuner"], Nissan:["Patrol","Altima","Sunny","Pathfinder","X-Trail","Navara"], Ford:["F-150","Explorer","Edge","Expedition","Ranger"], Lexus:["LX 600","GX 460","ES 350","RX 350"], GMC:["Yukon","Tahoe","Sierra","Terrain"], Chevrolet:["Tahoe","Silverado","Traverse","Equinox"], Hyundai:["Tucson","Santa Fe","Elantra","Sonata"], Kia:["Sportage","Sorento","Telluride","Carnival"], BMW:["X5","X7","5 Series","7 Series"], "Mercedes-Benz":["GLE","S-Class","E-Class","GLS"], "Land Rover":["Defender","Discovery","Range Rover","Freelander"], Mitsubishi:["Pajero","Eclipse Cross","Outlander"], Honda:["Accord","Civic","CR-V","Pilot"], Mazda:["CX-5","CX-9","Mazda3","Mazda6"], Jeep:["Wrangler","Grand Cherokee","Cherokee","Compass"] };
const YEARS  = Array.from({length:35},(_,i)=>2024-i);

// ── SVG Schematic Zones ───────────────────────────────────────────────────────
const ZONES = {
  engine_bay:         { type:"rect",   x:72,  y:88,  w:96, h:52 },
  front_left_wheel:   { type:"circle", cx:52, cy:158, r:20 },
  front_right_wheel:  { type:"circle", cx:188,cy:158, r:20 },
  rear_left_wheel:    { type:"circle", cx:52, cy:214, r:20 },
  rear_right_wheel:   { type:"circle", cx:188,cy:214, r:20 },
  underbody_front:    { type:"rect",   x:82,  y:150, w:76, h:24 },
  underbody_rear:     { type:"rect",   x:82,  y:196, w:76, h:24 },
  cabin_dashboard:    { type:"rect",   x:76,  y:88,  w:88, h:62 },
  battery_electrical: { type:"rect",   x:156, y:92,  w:28, h:28 },
  fuel_system:        { type:"rect",   x:100, y:196, w:40, h:24 },
};

// ── Shared Components ─────────────────────────────────────────────────────────
function SevBadge({ sev, ar }) {
  return (
    <span style={{ background:sevBg(sev), color:sevColor(sev), fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20, textTransform:"uppercase", whiteSpace:"nowrap" }}>
      {sevLabel(sev, ar)}
    </span>
  );
}

function Card({ children, style={} }) {
  return <div style={{ background:T.card, borderRadius:16, border:`1px solid ${T.border}`, boxShadow:"0 2px 12px rgba(0,0,0,0.06)", ...style }}>{children}</div>;
}

// ── Top Navbar (persistent across all screens) ────────────────────────────────
function Navbar({ ar, setAr, tab, setTab }) {
  const tabs = [
    { id:"home",    icon:"⌂",  en:"Home",    ar:"الرئيسية" },
    { id:"scan",    icon:"◎",  en:"Scan",    ar:"مسح" },
    { id:"report",  icon:"📋", en:"Report",  ar:"التقرير" },
    { id:"garages", icon:"📍", en:"Garages", ar:"المراكز" },
    { id:"profile", icon:"◉",  en:"Profile", ar:"الملف" },
  ];
  return (
    <header style={{ background:`linear-gradient(135deg, ${T.navy}, ${T.navyMid})`, padding:"14px 20px 0", position:"sticky", top:0, zIndex:100 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:20 }}>🔧</span>
          <span style={{ color:"#fff", fontSize:17, fontWeight:800 }}>AutoScan AI</span>
        </div>
        {/* Language toggle  -  always visible */}
        <div style={{ display:"flex", background:"rgba(255,255,255,0.12)", borderRadius:20, padding:3, gap:2 }}>
          {[{l:"EN",v:false},{l:"ع",v:true}].map(opt=>(
            <button key={opt.l} onClick={()=>setAr(opt.v)} style={{ padding:"5px 12px", borderRadius:16, border:"none", cursor:"pointer", background:ar===opt.v?"#fff":"transparent", color:ar===opt.v?T.navy:"rgba(255,255,255,0.7)", fontSize:12, fontWeight:700, transition:"all .2s" }}>
              {opt.l}
            </button>
          ))}
        </div>
      </div>
      {/* Tab bar inside header */}
      <div style={{ display:"flex", borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:2 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, padding:"8px 4px 10px" }}>
            <span style={{ fontSize:18 }}>{t.icon}</span>
            <span style={{ fontSize:10, fontWeight:tab===t.id?700:400, color:tab===t.id?"#fff":"rgba(255,255,255,0.5)" }}>{ar?t.ar:t.en}</span>
            {tab===t.id && <div style={{ width:20, height:2, background:T.red, borderRadius:1, marginTop:1 }}/>}
          </button>
        ))}
      </div>
    </header>
  );
}

// ── SVG Schematic ─────────────────────────────────────────────────────────────
function VehicleSchematic({ faults, selectedZone, onZoneClick }) {
  const zoneSev = {};
  faults.forEach(f => {
    if (!zoneSev[f.zone] || f.severity==="high" || (f.severity==="medium" && zoneSev[f.zone]==="low"))
      zoneSev[f.zone] = f.severity;
  });
  return (
    <svg viewBox="0 0 240 290" style={{ width:"100%", maxHeight:260, display:"block" }}>
      <path d="M32,168 L32,238 L208,238 L208,168 L185,102 L160,82 L80,82 L55,102 Z" fill="#E8ECF0" stroke={T.border} strokeWidth="1.5"/>
      <path d="M80,82 L90,52 L150,52 L160,82 Z" fill="#D0D8E4" stroke={T.border} strokeWidth="1"/>
      <path d="M95,80 L102,56 L138,56 L145,80 Z" fill="#B8C8DC" stroke={T.border} strokeWidth="0.8"/>
      <path d="M88,150 L152,150 L155,162 L85,162 Z" fill="#B8C8DC" stroke={T.border} strokeWidth="0.8"/>
      {Object.entries(ZONES).map(([zone, shape]) => {
        const sev = zoneSev[zone];
        if (!sev) return null;
        const col = sevColor(sev);
        const isSel = selectedZone === zone;
        const fill = col + (isSel ? "55" : "28");
        const sw = isSel ? 2.5 : 1.5;
        return (
          <g key={zone} onClick={() => onZoneClick(zone)} style={{ cursor:"pointer" }}>
            {shape.type==="circle"
              ? <circle cx={shape.cx} cy={shape.cy} r={shape.r} fill={fill} stroke={col} strokeWidth={sw}/>
              : <rect x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={4} fill={fill} stroke={col} strokeWidth={sw}/>}
          </g>
        );
      })}
      {[{c:T.redDeep,l:"Critical"},{c:"#E67E22",l:"Moderate"},{c:T.teal,l:"Minor"}].map((item,i)=>(
        <g key={i} transform={`translate(${8+i*78},282)`}>
          <circle cx={5} cy={-1} r={4.5} fill={item.c}/>
          <text x={13} y={3} fontSize={9} fill={T.textSec} fontFamily="system-ui">{item.l}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Fault Card ────────────────────────────────────────────────────────────────
function FaultCard({ fault, expanded, onToggle, ar }) {
  return (
    <div style={{ background:expanded?sevBg(fault.severity):T.card, borderRadius:16, border:`1px solid ${expanded?sevColor(fault.severity)+"55":T.border}`, marginBottom:10, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
      <div onClick={onToggle} style={{ padding:"14px", cursor:"pointer" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <SevBadge sev={fault.severity} ar={ar}/>
          {fault.code && <span style={{ fontSize:11, fontWeight:700, background:"#EEF2F7", color:T.navyMid, padding:"2px 8px", borderRadius:6 }}>{fault.code}</span>}
        </div>
        <div style={{ fontSize:14, fontWeight:700, color:T.navy, marginBottom:4 }}>{ar?fault.nameAr:fault.nameEn}</div>
        <div style={{ fontSize:12, color:T.textSec, lineHeight:1.4, marginBottom:6 }}>{fault.fn}</div>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontSize:11, color:T.textMut }}>{ar?"التكلفة:":"Est. cost:"} <strong style={{color:T.navy}}>{fault.cost}</strong></span>
          <span style={{ fontSize:11, color:expanded?T.red:T.textMut }}>{expanded?"▲":"▼"} {ar?"التفاصيل":"Details"}</span>
        </div>
      </div>
      {expanded && (
        <div style={{ padding:"0 14px 14px", borderTop:`1px solid ${T.border}` }}>
          {[
            { icon:"⚠️", color:T.redDeep, title:ar?"الخطر الفوري":"Immediate Risk", body:fault.immediate },
            { icon:"📈", color:"#E67E22",  title:ar?"العواقب طويلة المدى":"Long-term", body:fault.longterm },
          ].map(row=>(
            <div key={row.title} style={{ marginTop:12 }}>
              <div style={{ fontSize:12, fontWeight:700, color:row.color, marginBottom:4 }}>{row.icon} {row.title}</div>
              <div style={{ fontSize:12, color:T.textSec, lineHeight:1.5 }}>{row.body}</div>
            </div>
          ))}
          <div style={{ marginTop:12 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.teal, marginBottom:6 }}>🔧 {ar?"خطوات الإصلاح":"Repair Steps"}</div>
            {fault.steps.map((s,i)=>(
              <div key={i} style={{ display:"flex", gap:8, marginBottom:5, alignItems:"flex-start" }}>
                <div style={{ width:18, height:18, borderRadius:9, background:T.teal, color:"#fff", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</div>
                <span style={{ fontSize:12, color:T.textSec, lineHeight:1.4 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── HOME SCREEN ───────────────────────────────────────────────────────────────
function HomeScreen({ setTab, ar, faults }) {
  const hasScanned = faults.length > 0;
  const high = faults.filter(f=>f.severity==="high").length;
  const med  = faults.filter(f=>f.severity==="medium").length;
  const low  = faults.filter(f=>f.severity==="low").length;

  return (
    <div style={{ padding:"24px 20px", maxWidth:640, margin:"0 auto" }}>
      {/* Welcome */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:13, color:T.textMut, marginBottom:4 }}>{ar?"مرحباً،":"Welcome back,"}</div>
        <div style={{ fontSize:24, fontWeight:800, color:T.navy }}>{ar?"مساعدك في تشخيص السيارة":"Your Car Diagnostic Assistant"}</div>
      </div>

      {/* CTA */}
      <button onClick={()=>setTab("scan")} style={{ width:"100%", background:`linear-gradient(135deg, ${T.red}, ${T.redDeep})`, color:"#fff", border:"none", borderRadius:18, padding:"20px", fontSize:17, fontWeight:800, cursor:"pointer", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"center", gap:12, boxShadow:`0 8px 24px rgba(230,57,70,0.35)` }}>
        <span style={{ fontSize:24 }}>◎</span>
        {ar?"مسح ورقة الفحص الآن":"Scan Inspection Sheet"}
      </button>

      {/* Last report or empty state */}
      {!hasScanned ? (
        <Card style={{ padding:32, textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
          <div style={{ fontSize:16, fontWeight:700, color:T.navy, marginBottom:8 }}>{ar?"لا يوجد تقرير بعد":"No report yet"}</div>
          <div style={{ fontSize:13, color:T.textSec, lineHeight:1.6 }}>{ar?"امسح ورقة فحص سيارتك لتحصل على تشخيص فوري بالذكاء الاصطناعي":"Scan your vehicle inspection sheet to get an instant AI diagnosis"}</div>
        </Card>
      ) : (
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:T.textSec, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:12 }}>{ar?"آخر تقرير":"Last Report"}</div>
          <Card style={{ padding:16 }}>
            <div style={{ display:"flex", gap:10, marginBottom:16 }}>
              {[{count:high,label:ar?"حرج":"Critical",c:T.redDeep,bg:T.critBg},{count:med,label:ar?"متوسط":"Moderate",c:"#E67E22",bg:T.medBg},{count:low,label:ar?"منخفض":"Minor",c:T.teal,bg:T.lowBg}].map(item=>(
                <div key={item.label} style={{ flex:1, background:item.bg, borderRadius:12, padding:"12px 6px", textAlign:"center" }}>
                  <div style={{ fontSize:26, fontWeight:900, color:item.c }}>{item.count}</div>
                  <div style={{ fontSize:11, color:item.c, fontWeight:600 }}>{item.label}</div>
                </div>
              ))}
            </div>
            <button onClick={()=>setTab("report")} style={{ width:"100%", background:T.navy, color:"#fff", border:"none", borderRadius:12, padding:"13px", fontSize:14, fontWeight:700, cursor:"pointer" }}>
              {ar?"عرض التقرير الكامل →":"View Full Report →"}
            </button>
          </Card>
          {high > 0 && (
            <div style={{ background:T.critBg, borderRadius:16, padding:14, border:`1px solid ${T.redDeep}33`, marginTop:16 }}>
              <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:20 }}>⚠️</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:T.navyMid, marginBottom:4 }}>{ar?"تنبيه عاجل":"Urgent Alert"}</div>
                  <div style={{ fontSize:12, color:T.textSec, lineHeight:1.5 }}>{ar?`${high} عطل حرج  -  لا تقد السيارة حتى تتم المعالجة.`:`${high} critical fault(s) detected. Avoid driving until resolved.`}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── SCAN SCREEN ───────────────────────────────────────────────────────────────
function ScanScreen({ setTab, ar, setFaults }) {
  // Steps: vehicle -> choose -> camera OR upload -> processing -> done
  const [step, setStep]             = useState("vehicle");
  const [make, setMake]             = useState("Toyota");
  const [model, setModel]           = useState("Land Cruiser");
  const [year, setYear]             = useState(2006);
  const [progress, setProgress]     = useState(0);
  const [subStep, setSubStep]       = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMsg, setErrorMsg]     = useState(null);

  // Only one ref needed - gallery. Camera uses getUserMedia directly.
  const galleryInputRef = useRef();
  const videoRef        = useRef();
  const streamRef       = useRef(null);

  const stages = [
    ar?"جارٍ استخراج النص...":"Extracting text via OCR...",
    ar?"جارٍ تشغيل نموذج الذكاء الاصطناعي...":"Running AI diagnosis...",
    ar?"جارٍ تحديد مواقع الأعطال...":"Mapping fault locations...",
  ];

  // Camera only starts when step === "camera" - never for upload path
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:"environment" }, audio:false });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
    } catch {
      setErrorMsg(ar?"تعذر الوصول الى الكاميرا. استخدم زر رفع الصورة.":"Camera access denied. Please use the Upload Photo button instead.");
    }
  }

  function stopCamera() {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t=>t.stop()); streamRef.current=null; }
  }

  // ONLY fires for camera step - upload step never triggers this
  useEffect(()=>{
    if (step==="camera") startCamera();
    return ()=>stopCamera();
  }, [step]);

  function captureFromCamera() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(blob=>{
      setPreviewUrl(URL.createObjectURL(blob));
      stopCamera();
      runPipeline(blob);
    }, "image/jpeg", 0.9);
  }

  // Upload handler - completely independent, never touches camera
  function handleGalleryInput(e) {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    setPreviewUrl(URL.createObjectURL(file));
    runPipeline(file);
  }

  function openGallery() {
    galleryInputRef.current.click();
  }

  async function runPipeline(imageFile) {
    setStep("processing");
    setProgress(0);
    setSubStep(0);
    setErrorMsg(null);

    let p = 0;
    const tick = setInterval(()=>{
      p += 1;
      if (p >= 90) clearInterval(tick);
      setProgress(p);
      if (p===30) setSubStep(1);
      if (p===65) setSubStep(2);
    }, 80);

    try {
      const base64 = await new Promise((resolve,reject)=>{
        const reader = new FileReader();
        reader.onload = ()=>resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      const mediaType = imageFile.type || "image/jpeg";

      const prompt = `You are an expert automotive diagnostic engineer specializing in GCC-market vehicles.

Analyze this vehicle inspection sheet image carefully. Read ALL text, fault codes, checked boxes, handwritten notes, and any marks indicating problems.

Return ONLY a valid JSON array  -  no preamble, no markdown fences, no explanation. Raw JSON only.

Each object must follow this schema exactly:
{
  "id": "F001",
  "severity": "high",
  "zone": "engine_bay",
  "code": "P0171",
  "nameEn": "Fuel System Lean Mixture Bank 1",
  "nameAr": "نظام الوقود خليط فقير بنك 1",
  "fn": "Controls air-to-fuel ratio entering combustion chamber.",
  "immediate": "Engine misfires and rough idle.",
  "longterm": "Catalytic converter damage costing over $1200.",
  "steps": ["Check MAF sensor", "Inspect vacuum hoses", "Test fuel injectors"],
  "cost": "$180-$420"
}

Valid zone values: engine_bay, front_left_wheel, front_right_wheel, rear_left_wheel, rear_right_wheel, underbody_front, underbody_rear, cabin_dashboard, battery_electrical, fuel_system

Severity: high = safety risk do not drive | medium = repair within 2-4 weeks | low = minor repair within 3-6 months

Vehicle: ${make} ${model} ${year}

If the image is not a vehicle inspection sheet or no faults are visible, return an empty array: []`;

      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              { type:"image", source:{ type:"base64", media_type:mediaType, data:base64 } },
              { type:"text",  text:prompt }
            ]
          }]
        })
      });

      clearInterval(tick);
      setProgress(100);

      if (!response.ok) throw new Error(`API error ${response.status}`);

      const data = await response.json();
      const raw  = data.content?.[0]?.text || "[]";
      const clean = raw.replace(/```json|```/g,"").trim();

      let faults = [];
      try {
        const parsed = JSON.parse(clean);
        faults = Array.isArray(parsed) ? parsed : (parsed.faults || []);
      } catch {
        throw new Error("Could not parse AI response");
      }

      const order = {high:0,medium:1,low:2};
      faults.sort((a,b)=>order[a.severity]-order[b.severity]);
      setFaults(faults);
      setTimeout(()=>setStep("done"), 300);

    } catch(err) {
      clearInterval(tick);
      setErrorMsg(ar?`فشل التحليل: ${err.message}`:`Analysis failed: ${err.message}`);
      setTimeout(()=>setStep("choose"), 2000);
    }
  }

  // ── Done state ────────────────────────────────────────────────────────────
  if (step==="done") return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, gap:20, maxWidth:480, margin:"0 auto" }}>
      {previewUrl && <img src={previewUrl} alt="scan" style={{ width:"100%", maxHeight:200, objectFit:"cover", borderRadius:16 }}/>}
      <div style={{ width:72, height:72, borderRadius:36, background:T.lowBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36 }}>✓</div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:22, fontWeight:800, color:T.navy, marginBottom:8 }}>{ar?"اكتمل التحليل!":"Analysis Complete!"}</div>
        <div style={{ fontSize:14, color:T.textSec }}>{ar?"تم تحليل ورقة الفحص بنجاح":"Inspection sheet analyzed successfully"}</div>
      </div>
      <button onClick={()=>{setTab("report");setStep("vehicle");}} style={{ background:T.red, color:"#fff", border:"none", borderRadius:16, padding:"16px 40px", fontSize:16, fontWeight:800, cursor:"pointer", boxShadow:`0 6px 20px rgba(230,57,70,0.4)` }}>
        {ar?"عرض التقرير":"View Report"}
      </button>
      <button onClick={()=>setStep("vehicle")} style={{ background:"none", border:"none", color:T.textSec, fontSize:14, cursor:"pointer" }}>
        {ar?"مسح جديد":"New Scan"}
      </button>
    </div>
  );

  // ── Processing state ──────────────────────────────────────────────────────
  if (step==="processing") return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, gap:24, maxWidth:480, margin:"0 auto" }}>
      {previewUrl && <img src={previewUrl} alt="scan" style={{ width:"100%", maxHeight:180, objectFit:"cover", borderRadius:16 }}/>}
      <div style={{ position:"relative", width:100, height:100 }}>
        <svg width={100} height={100} viewBox="0 0 100 100">
          <circle cx={50} cy={50} r={44} fill="none" stroke={T.border} strokeWidth={8}/>
          <circle cx={50} cy={50} r={44} fill="none" stroke={T.red} strokeWidth={8}
            strokeDasharray={`${2*Math.PI*44*progress/100} 999`} strokeLinecap="round"
            transform="rotate(-90 50 50)" style={{ transition:"stroke-dasharray 0.1s" }}/>
        </svg>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:18, fontWeight:800, color:T.navy }}>{progress}%</div>
      </div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:17, fontWeight:700, color:T.navy, marginBottom:6 }}>{ar?"جارٍ التحليل...":"Analyzing..."}</div>
        <div style={{ fontSize:13, color:T.red, fontWeight:600 }}>{stages[subStep]}</div>
      </div>
      <div style={{ width:"100%", maxWidth:360, display:"flex", flexDirection:"column", gap:8 }}>
        {stages.map((s,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, opacity:i>subStep?0.35:1 }}>
            <div style={{ width:22, height:22, borderRadius:11, background:i<subStep?T.teal:i===subStep?T.red:T.border, color:"#fff", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {i<subStep?"✓":i+1}
            </div>
            <span style={{ fontSize:13, color:i===subStep?T.navy:T.textSec, fontWeight:i===subStep?600:400 }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Main scan UI ──────────────────────────────────────────────────────────
  return (
    <div style={{ padding:"24px 20px", maxWidth:640, margin:"0 auto" }}>
      {/* Step indicator */}
      <div style={{ display:"flex", gap:6, marginBottom:24 }}>
        {[ar?"المركبة":"Vehicle", ar?"المصدر":"Source", ar?"التحليل":"Analysis"].map((s,i)=>{
          const isCur  = (step==="vehicle"&&i===0)||(step==="choose"&&i===1)||(step==="camera"&&i===1);
          const isPast = (i===0&&step!=="vehicle")||(i===1&&(step==="processing"||step==="done"))||(i===2&&step==="done");
          return (
            <div key={s} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ width:28, height:28, borderRadius:14, background:isPast?T.teal:isCur?T.red:T.border, color:"#fff", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {isPast?"✓":i+1}
              </div>
              <div style={{ fontSize:11, color:isCur?T.navy:T.textMut, fontWeight:isCur?600:400 }}>{s}</div>
            </div>
          );
        })}
      </div>

      {/* Vehicle selection */}
      {step==="vehicle" && (
        <div>
          <div style={{ fontSize:18, fontWeight:800, color:T.navy, marginBottom:20 }}>{ar?"اختر مركبتك":"Select Your Vehicle"}</div>
          {[
            { label:ar?"الصانع":"Make", value:make, opts:MAKES, onChange:v=>{setMake(v);setModel(MODELS[v]?.[0]||"");} },
            { label:ar?"الموديل":"Model", value:model, opts:MODELS[make]||[], onChange:v=>setModel(v) },
            { label:ar?"السنة":"Year", value:year, opts:YEARS, onChange:v=>setYear(Number(v)) },
          ].map(field=>(
            <div key={field.label} style={{ marginBottom:16 }}>
              <div style={{ fontSize:13, fontWeight:600, color:T.textSec, marginBottom:6 }}>{field.label}</div>
              <div style={{ position:"relative" }}>
                <select value={field.value} onChange={e=>field.onChange(e.target.value)} style={{ width:"100%", padding:"13px 16px", borderRadius:12, border:`1.5px solid ${T.border}`, fontSize:15, color:T.textPri, background:T.card, WebkitAppearance:"none", appearance:"none" }}>
                  {field.opts.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
                <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:T.textMut, fontSize:12 }}>▼</span>
              </div>
            </div>
          ))}
          <button onClick={()=>setStep("choose")} style={{ width:"100%", background:T.navy, color:"#fff", border:"none", borderRadius:14, padding:"15px", fontSize:15, fontWeight:700, cursor:"pointer", marginTop:8 }}>
            {ar?"التالي":"Next →"}
          </button>
        </div>
      )}

      {/* Step 2: Choose source */}
      {step==="choose" && (
        <div>
          <div style={{ fontSize:18, fontWeight:800, color:T.navy, marginBottom:8 }}>{ar?"كيف تريد إضافة الصورة؟":"How would you like to add the image?"}</div>
          <div style={{ fontSize:13, color:T.textSec, marginBottom:24 }}>{ar?"اختر طريقة إضافة ورقة الفحص":"Choose how to add your inspection sheet"}</div>

          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {/* Upload from gallery - primary option */}
            <button onClick={openGallery} style={{ background:T.navy, color:"#fff", border:"none", borderRadius:16, padding:"20px", fontSize:16, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:14, boxShadow:`0 6px 20px rgba(13,27,42,0.25)` }}>
              <span style={{ fontSize:32 }}>🖼️</span>
              <div style={{ textAlign:"left" }}>
                <div>{ar?"رفع صورة من الهاتف":"Upload Photo from Phone"}</div>
                <div style={{ fontSize:12, fontWeight:400, opacity:0.75, marginTop:2 }}>{ar?"اختر صورة من معرض الصور":"Choose an image from your gallery"}</div>
              </div>
            </button>

            {/* Camera option */}
            <button onClick={()=>setStep("camera")} style={{ background:T.card, color:T.navy, border:`2px solid ${T.border}`, borderRadius:16, padding:"20px", fontSize:16, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:14 }}>
              <span style={{ fontSize:32 }}>📷</span>
              <div style={{ textAlign:"left" }}>
                <div>{ar?"التقاط بالكاميرا":"Take Photo with Camera"}</div>
                <div style={{ fontSize:12, fontWeight:400, color:T.textMut, marginTop:2 }}>{ar?"افتح الكاميرا مباشرة":"Open camera directly"}</div>
              </div>
            </button>
          </div>

          {/* Hidden file input  -  NO capture attribute at all */}
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            onChange={handleGalleryInput}
            style={{ display:"none" }}
          />

          <div style={{ textAlign:"center", marginTop:20 }}>
            <button onClick={()=>setStep("vehicle")} style={{ background:"none", border:"none", color:T.textMut, fontSize:13, cursor:"pointer" }}>
              {ar?"العودة":"← Back"}
            </button>
          </div>
        </div>
      )}

      {/* Step 2b: Camera capture */}
      {step==="camera" && (
        <div>
          <div style={{ fontSize:18, fontWeight:800, color:T.navy, marginBottom:16 }}>{ar?"التقط ورقة الفحص":"Capture Inspection Sheet"}</div>

          {errorMsg && (
            <div style={{ background:T.critBg, border:`1px solid ${T.redDeep}44`, borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:13, color:T.redDeep, lineHeight:1.5 }}>
              {errorMsg}
              <div style={{ marginTop:8 }}>
                <button onClick={openGallery} style={{ background:T.navy, color:"#fff", border:"none", borderRadius:10, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  {ar?"رفع صورة بدلاً من ذلك":"Upload Photo Instead"}
                </button>
              </div>
            </div>
          )}

          <div style={{ background:"#000", borderRadius:18, overflow:"hidden", marginBottom:16, position:"relative", aspectRatio:"4/3" }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
            <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} viewBox="0 0 100 75">
              {["M15,8 L8,8 L8,15","M85,8 L92,8 L92,15","M15,67 L8,67 L8,60","M85,67 L92,67 L92,60"].map((d,i)=>(
                <path key={i} d={d} stroke={T.red} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              ))}
            </svg>
            <div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)", color:"rgba(255,255,255,0.8)", fontSize:12, whiteSpace:"nowrap", background:"rgba(0,0,0,0.5)", padding:"4px 12px", borderRadius:20 }}>
              {ar?"وجّه الكاميرا نحو الورقة":"Point camera at the inspection sheet"}
            </div>
          </div>

          <button onClick={captureFromCamera} style={{ width:"100%", background:T.red, color:"#fff", border:"none", borderRadius:14, padding:"16px", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:`0 6px 18px rgba(230,57,70,0.4)`, marginBottom:10 }}>
            📷 {ar?"التقاط الصورة":"Capture Photo"}
          </button>

          <div style={{ textAlign:"center" }}>
            <button onClick={()=>setStep("choose")} style={{ background:"none", border:"none", color:T.textMut, fontSize:13, cursor:"pointer" }}>
              {ar?"العودة":"← Back"}
            </button>
          </div>

          {/* Gallery input also available from camera screen */}
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            onChange={handleGalleryInput}
            style={{ display:"none" }}
          />
        </div>
      )}
    </div>
  );
}

// ── REPORT SCREEN ─────────────────────────────────────────────────────────────
function ReportScreen({ ar, faults }) {
  const [view, setView]         = useState("schematic");
  const [selZone, setSelZone]   = useState(null);
  const [expanded, setExpanded] = useState(null);

  if (faults.length === 0) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:48, gap:16, textAlign:"center", minHeight:400 }}>
      <div style={{ fontSize:56 }}>📋</div>
      <div style={{ fontSize:18, fontWeight:700, color:T.navy }}>{ar?"لا يوجد تقرير بعد":"No report yet"}</div>
      <div style={{ fontSize:14, color:T.textSec, lineHeight:1.6, maxWidth:300 }}>{ar?"امسح ورقة فحص سيارتك أولاً للحصول على تقرير التشخيص":"Scan an inspection sheet first to generate your diagnostic report"}</div>
    </div>
  );

  const grouped = [
    { sev:"high",   label:ar?"حرج":"Critical",  faults:faults.filter(f=>f.severity==="high")   },
    { sev:"medium", label:ar?"متوسط":"Moderate", faults:faults.filter(f=>f.severity==="medium") },
    { sev:"low",    label:ar?"منخفض":"Minor",    faults:faults.filter(f=>f.severity==="low")    },
  ].filter(g=>g.faults.length>0);

  return (
    <div style={{ maxWidth:720, margin:"0 auto" }}>
      {/* Summary bar */}
      <div style={{ background:`linear-gradient(135deg, ${T.navy}, ${T.navyMid})`, padding:"16px 20px" }}>
        <div style={{ color:"#fff", fontSize:16, fontWeight:800, marginBottom:10 }}>{ar?"تقرير التشخيص":"Diagnostic Report"}</div>
        <div style={{ display:"flex", gap:10 }}>
          {[{n:faults.filter(f=>f.severity==="high").length,l:ar?"حرج":"Critical",c:T.redDeep},{n:faults.filter(f=>f.severity==="medium").length,l:ar?"متوسط":"Moderate",c:T.amber},{n:faults.filter(f=>f.severity==="low").length,l:ar?"منخفض":"Minor",c:T.teal}].map(item=>(
            <div key={item.l} style={{ flex:1, background:"rgba(255,255,255,0.1)", borderRadius:10, padding:"8px 4px", textAlign:"center" }}>
              <div style={{ fontSize:20, fontWeight:900, color:item.c }}>{item.n}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)" }}>{item.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab toggle */}
      <div style={{ display:"flex", margin:"12px 16px 0", background:T.border, borderRadius:12, padding:3 }}>
        {[{id:"schematic",en:"Schematic",ar:"المخطط"},{id:"list",en:"Fault List",ar:"قائمة الأعطال"}].map(v=>(
          <button key={v.id} onClick={()=>setView(v.id)} style={{ flex:1, padding:"9px", border:"none", borderRadius:10, cursor:"pointer", background:view===v.id?T.card:"transparent", color:view===v.id?T.navy:T.textSec, fontWeight:view===v.id?700:500, fontSize:13 }}>
            {ar?v.ar:v.en}
          </button>
        ))}
      </div>

      <div style={{ padding:"12px 16px 40px" }}>
        {view==="schematic" ? (
          <>
            <Card style={{ padding:14, marginBottom:12 }}>
              <div style={{ fontSize:12, color:T.textSec, textAlign:"center", marginBottom:8 }}>{ar?"اضغط على المنطقة الملونة لعرض العطل":"Tap a highlighted zone to see faults"}</div>
              <VehicleSchematic faults={faults} selectedZone={selZone} onZoneClick={z=>setSelZone(selZone===z?null:z)}/>
            </Card>
            {selZone ? faults.filter(f=>f.zone===selZone).map(fault=>(
              <FaultCard key={fault.id} fault={fault} expanded={expanded===fault.id} onToggle={()=>setExpanded(expanded===fault.id?null:fault.id)} ar={ar}/>
            )) : (
              <div style={{ textAlign:"center", color:T.textMut, fontSize:13, padding:"20px 0" }}>{ar?"اضغط على منطقة ملونة أعلاه":"Tap a highlighted zone above"}</div>
            )}
          </>
        ) : (
          grouped.map(group=>(
            <div key={group.sev} style={{ marginBottom:18 }}>
              <div style={{ fontSize:12, fontWeight:700, color:sevColor(group.sev), marginBottom:8, display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:8, height:8, borderRadius:4, background:sevColor(group.sev) }}/>
                {group.label} ({group.faults.length})
              </div>
              {group.faults.map(fault=>(
                <FaultCard key={fault.id} fault={fault} expanded={expanded===fault.id} onToggle={()=>setExpanded(expanded===fault.id?null:fault.id)} ar={ar}/>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── GARAGES SCREEN ────────────────────────────────────────────────────────────
function GaragesScreen({ ar }) {
  const [sel, setSel] = useState(null);
  const garages = [
    { id:1, nameEn:"Al-Mana Auto Service Center", nameAr:"مركز المانع لخدمة السيارات", dist:"1.2 km", rating:4.8, reviews:312, tags:["Engine","Electrical","Tyres"], open:true,  phone:"+974 4444 0001" },
    { id:2, nameEn:"Qatar Motors Garage",          nameAr:"جراج قطر موتورز",            dist:"2.7 km", rating:4.6, reviews:187, tags:["Engine","Transmission","AC"], open:true,  phone:"+974 4444 0002" },
    { id:3, nameEn:"Gulf Auto Repair",             nameAr:"خليج لإصلاح السيارات",       dist:"3.5 km", rating:4.4, reviews:94,  tags:["General","Tyres","Battery"],   open:false, phone:"+974 4444 0003" },
  ];
  return (
    <div style={{ maxWidth:640, margin:"0 auto" }}>
      <div style={{ background:`linear-gradient(135deg, ${T.navy}, ${T.navyMid})`, padding:"16px 20px" }}>
        <div style={{ color:"#fff", fontSize:16, fontWeight:800 }}>{ar?"مراكز الإصلاح القريبة":"Nearby Repair Shops"}</div>
        <div style={{ color:"rgba(155,189,224,0.85)", fontSize:13, marginTop:2 }}>{ar?"الدوحة، قطر":"Doha, Qatar"}</div>
      </div>
      <div style={{ padding:"16px" }}>
        {garages.map((g,i)=>(
          <div key={g.id} onClick={()=>setSel(sel===i?null:i)} style={{ background:T.card, borderRadius:18, marginBottom:12, border:`1.5px solid ${sel===i?T.red:T.border}`, cursor:"pointer", overflow:"hidden", boxShadow:sel===i?`0 4px 16px rgba(230,57,70,0.15)`:"0 2px 8px rgba(0,0,0,0.05)" }}>
            <div style={{ padding:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:T.navy, marginBottom:3 }}>{ar?g.nameAr:g.nameEn}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ color:"#F1C40F", fontSize:12 }}>★</span>
                    <span style={{ fontSize:12, fontWeight:700, color:T.navy }}>{g.rating}</span>
                    <span style={{ fontSize:12, color:T.textMut }}>({g.reviews})</span>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.navyMid }}>{g.dist}</div>
                  <div style={{ fontSize:11, fontWeight:600, color:g.open?T.teal:T.redDeep, marginTop:2 }}>{g.open?(ar?"مفتوح":"Open"):(ar?"مغلق":"Closed")}</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {g.tags.map(t=><span key={t} style={{ background:"#EEF2F7", color:T.navyMid, fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20 }}>{t}</span>)}
              </div>
            </div>
            {sel===i && (
              <div style={{ display:"flex", gap:8, padding:"0 12px 12px" }}>
                <button onClick={e=>{e.stopPropagation();window.open(`https://maps.google.com/?q=${g.nameEn}`,"_blank");}} style={{ flex:1, background:T.navy, color:"#fff", border:"none", borderRadius:12, padding:"11px", fontSize:13, fontWeight:700, cursor:"pointer" }}>{ar?"الاتجاهات":"Directions"}</button>
                <a href={`tel:${g.phone}`} onClick={e=>e.stopPropagation()} style={{ flex:1, background:T.teal, color:"#fff", borderRadius:12, padding:"11px", fontSize:13, fontWeight:700, textDecoration:"none", display:"flex", alignItems:"center", justifyContent:"center" }}>{ar?"اتصال":"Call"}</a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PROFILE SCREEN ────────────────────────────────────────────────────────────
function ProfileScreen({ ar, setAr }) {
  return (
    <div style={{ maxWidth:640, margin:"0 auto" }}>
      <div style={{ background:`linear-gradient(135deg, ${T.navy}, ${T.navyMid})`, padding:"28px 20px 32px", textAlign:"center" }}>
        <div style={{ width:72, height:72, borderRadius:36, background:`linear-gradient(135deg, ${T.red}, ${T.amber})`, margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>👤</div>
        <div style={{ color:"#fff", fontSize:18, fontWeight:800 }}>Abdullah Al-Rashidi</div>
        <div style={{ color:"rgba(155,189,224,0.8)", fontSize:13, marginTop:4 }}>Doha, Qatar 🇶🇦</div>
      </div>
      <div style={{ padding:"20px 16px" }}>
        <Card style={{ padding:16, marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:T.navy }}>🌐 {ar?"اللغة":"Language"}</div>
              <div style={{ fontSize:12, color:T.textSec, marginTop:2 }}>Arabic / English</div>
            </div>
            <div style={{ display:"flex", background:"#EEF2F7", borderRadius:20, padding:3, gap:2 }}>
              {[{l:"عربي",v:true},{l:"EN",v:false}].map(opt=>(
                <button key={opt.l} onClick={()=>setAr(opt.v)} style={{ padding:"6px 14px", borderRadius:16, border:"none", cursor:"pointer", background:ar===opt.v?T.navy:"transparent", color:ar===opt.v?"#fff":T.textSec, fontSize:12, fontWeight:700 }}>{opt.l}</button>
              ))}
            </div>
          </div>
        </Card>

        <Card style={{ padding:16, marginBottom:14 }}>
          <div style={{ fontSize:14, fontWeight:700, color:T.navy, marginBottom:12 }}>📱 {ar?"تثبيت التطبيق":"Install App"}</div>
          <div style={{ fontSize:13, color:T.textSec, lineHeight:1.6, marginBottom:12 }}>{ar?"في Safari: اضغط على زر المشاركة ثم اختر إضافة إلى الشاشة الرئيسية":"In Safari: tap Share button then Add to Home Screen"}</div>
          <div style={{ display:"flex", gap:8 }}>
            {(ar?["1. افتح في Safari","2. اضغط مشاركة ⬆️","3. أضف للشاشة"]:["1. Open in Safari","2. Tap Share ⬆️","3. Add to Home Screen"]).map(s=>(
              <div key={s} style={{ flex:1, background:T.teal+"18", borderRadius:10, padding:"8px 4px", textAlign:"center", fontSize:10, color:T.teal, fontWeight:600, lineHeight:1.4 }}>{s}</div>
            ))}
          </div>
        </Card>

        <Card style={{ padding:16 }}>
          <div style={{ fontSize:14, fontWeight:700, color:T.navy, marginBottom:12 }}>🚙 {ar?"مركباتي":"My Vehicles"}</div>
          {["Toyota Land Cruiser 2006","Nissan Patrol 2018"].map((v,i)=>(
            <div key={v} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
              <span style={{ fontSize:13, color:T.navy, fontWeight:600 }}>{v}</span>
              <span style={{ fontSize:11, background:i===0?T.navy:T.border, color:i===0?"#fff":T.textSec, padding:"2px 8px", borderRadius:10, fontWeight:700 }}>{i===0?(ar?"رئيسي":"Primary"):(ar?"ثانوي":"Secondary")}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab,    setTab]    = useState("home");
  const [ar,     setAr]     = useState(false);
  const [faults, setFaults] = useState([]);  // Empty  -  no mock data

  const screens = {
    home:    <HomeScreen    setTab={setTab} ar={ar} faults={faults}/>,
    scan:    <ScanScreen    setTab={setTab} ar={ar} setFaults={setFaults}/>,
    report:  <ReportScreen  ar={ar} faults={faults}/>,
    garages: <GaragesScreen ar={ar}/>,
    profile: <ProfileScreen ar={ar} setAr={setAr}/>,
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, direction:ar?"rtl":"ltr", fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Navbar ar={ar} setAr={setAr} tab={tab} setTab={setTab}/>
      <main>
        {screens[tab]}
      </main>
    </div>
  );
}
