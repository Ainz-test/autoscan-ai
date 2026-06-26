import { useState, useEffect, useRef, useCallback } from "react";

// ── Inject global CSS for animations (no backticks) ─────────────────────────
function InjectCSS() {
  useEffect(function() {
    var el = document.createElement("style");
    el.id = "autoscan-css";
    el.textContent = [
      "@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}",
      "@keyframes fadeIn{from{opacity:0}to{opacity:1}}",
      "@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
      "@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(230,57,70,.4)}70%{box-shadow:0 0 0 12px rgba(230,57,70,0)}}",
      "@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}",
      ".rcard{opacity:0;transform:translateY(28px);transition:opacity .55s ease,transform .55s ease}",
      ".rcard.vis{opacity:1;transform:translateY(0)}",
      ".hero-glow{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none}",
      "*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}",
      "body{margin:0;overscroll-behavior-y:none}",
      "select{-webkit-appearance:none;appearance:none}",
      ".hover-lift{transition:transform .2s ease,box-shadow .2s ease}",
      ".hover-lift:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,.15)}",
      "::-webkit-scrollbar{width:4px}",
      "::-webkit-scrollbar-track{background:transparent}",
      "::-webkit-scrollbar-thumb{background:#DDE3EC;border-radius:2px}"
    ].join("");
    if (!document.getElementById("autoscan-css")) document.head.appendChild(el);
    return function() { var e = document.getElementById("autoscan-css"); if(e) e.remove(); };
  }, []);
  return null;
}

// ── Scroll Reveal Hook ───────────────────────────────────────────────────────
function useReveal(delay) {
  var ref = useRef(null);
  var _s = useState(false);
  var vis = _s[0]; var setVis = _s[1];
  useEffect(function() {
    var el = ref.current;
    if (!el) return;
    var d = delay || 0;
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        setTimeout(function() { setVis(true); }, d);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return function() { obs.disconnect(); };
  }, []);
  return [ref, vis];
}

// ── Design Tokens ────────────────────────────────────────────────────────────
var T = {
  navy:    "#0D1B2A",
  mid:     "#1F3A5F",
  red:     "#E63946",
  dark:    "#C0392B",
  amber:   "#F4A261",
  teal:    "#2A9D8F",
  bg:      "#F5F7FA",
  card:    "#FFFFFF",
  border:  "#E2E8F0",
  textPri: "#0D1B2A",
  textSec: "#5A6A7E",
  textMut: "#9AA5B4",
  critBg:  "#FEF2F2",
  medBg:   "#FFFBEB",
  lowBg:   "#F0FDF4",
  hero:    "#060C14",
};

var SC = function(s) { return s==="high"?T.dark:s==="medium"?"#D97706":T.teal; };
var SB = function(s) { return s==="high"?T.critBg:s==="medium"?T.medBg:T.lowBg; };
var SL = function(s,ar) {
  if (ar) return s==="high"?"حرج":s==="medium"?"متوسط":"منخفض";
  return s==="high"?"Critical":s==="medium"?"Moderate":"Minor";
};

var MAKES  = ["Toyota","Nissan","Ford","Lexus","GMC","Chevrolet","Hyundai","Kia","BMW","Mercedes-Benz","Land Rover","Mitsubishi","Honda","Mazda","Jeep"];
var MODELS = {
  Toyota:["Land Cruiser","Camry","Corolla","Hilux","Prado","RAV4","Fortuner"],
  Nissan:["Patrol","Altima","Sunny","Pathfinder","X-Trail","Navara"],
  Ford:["F-150","Explorer","Edge","Expedition","Ranger"],
  Lexus:["LX 600","GX 460","ES 350","RX 350"],
  GMC:["Yukon","Tahoe","Sierra","Terrain"],
  Chevrolet:["Tahoe","Silverado","Traverse","Equinox"],
  Hyundai:["Tucson","Santa Fe","Elantra","Sonata"],
  Kia:["Sportage","Sorento","Telluride","Carnival"],
  BMW:["X5","X7","5 Series","7 Series"],
  "Mercedes-Benz":["GLE","S-Class","E-Class","GLS"],
  "Land Rover":["Defender","Discovery","Range Rover","Freelander"],
  Mitsubishi:["Pajero","Eclipse Cross","Outlander"],
  Honda:["Accord","Civic","CR-V","Pilot"],
  Mazda:["CX-5","CX-9","Mazda3","Mazda6"],
  Jeep:["Wrangler","Grand Cherokee","Cherokee","Compass"],
};
var YEARS = Array.from({length:35},function(_,i){return 2024-i;});

var ZONES = {
  engine_bay:         {type:"rect",   x:72,  y:88,  w:96, h:52},
  front_left_wheel:   {type:"circle", cx:52, cy:158, r:20},
  front_right_wheel:  {type:"circle", cx:188,cy:158, r:20},
  rear_left_wheel:    {type:"circle", cx:52, cy:214, r:20},
  rear_right_wheel:   {type:"circle", cx:188,cy:214, r:20},
  underbody_front:    {type:"rect",   x:82,  y:150, w:76, h:24},
  underbody_rear:     {type:"rect",   x:82,  y:196, w:76, h:24},
  cabin_dashboard:    {type:"rect",   x:76,  y:88,  w:88, h:62},
  battery_electrical: {type:"rect",   x:156, y:92,  w:28, h:28},
  fuel_system:        {type:"rect",   x:100, y:196, w:40, h:24},
};

// ── Shared UI Components ─────────────────────────────────────────────────────
function RevealCard(props) {
  var _r = useReveal(props.delay || 0);
  var ref = _r[0]; var vis = _r[1];
  return React.createElement("div", {
    ref: ref,
    className: "rcard" + (vis ? " vis" : ""),
    style: props.style
  }, props.children);
}

function SevBadge(props) {
  var s = props.sev; var ar = props.ar;
  return React.createElement("span", {
    style: {
      background: SB(s), color: SC(s),
      fontSize: 10, fontWeight: 700, padding: "3px 10px",
      borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em",
      whiteSpace: "nowrap", display: "inline-block"
    }
  }, SL(s, ar));
}

function Card(props) {
  var base = {
    background: T.card, borderRadius: 18,
    border: "1px solid "+T.border,
    boxShadow: "0 4px 24px rgba(0,0,0,.06)"
  };
  var style = Object.assign({}, base, props.style || {});
  return React.createElement("div", {style: style, onClick: props.onClick, className: props.className || ""}, props.children);
}

function Spinner() {
  return React.createElement("div", {
    style: {
      width: 20, height: 20, border: "2.5px solid rgba(255,255,255,.3)",
      borderTopColor: "#fff", borderRadius: "50%",
      animation: "spin .7s linear infinite", display: "inline-block"
    }
  });
}

// ── Navbar ───────────────────────────────────────────────────────────────────
function Navbar(props) {
  var tab=props.tab; var setTab=props.setTab;
  var ar=props.ar;   var setAr=props.setAr;
  var tabs = [
    {id:"home",    icon:"⌂",  en:"Home",    ar:"الرئيسية"},
    {id:"scan",    icon:"◎",  en:"Scan",    ar:"مسح"},
    {id:"report",  icon:"⊞", en:"Report",  ar:"التقرير"},
    {id:"garages", icon:"⧁",  en:"Garages", ar:"المراكز"},
    {id:"profile", icon:"◉",  en:"Profile", ar:"الملف"},
  ];
  return React.createElement("header", {
    style: {
      background: "linear-gradient(135deg,"+T.navy+" 0%,"+T.mid+" 100%)",
      position: "sticky", top: 0, zIndex: 200,
      boxShadow: "0 2px 20px rgba(0,0,0,.25)"
    }
  },
    React.createElement("div", {
      style: {
        maxWidth: 900, margin: "0 auto",
        padding: "0 20px"
      }
    },
      React.createElement("div", {
        style: {
          display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "12px 0 0"
        }
      },
        React.createElement("div", {style:{display:"flex",alignItems:"center",gap:8}},
          React.createElement("span",{style:{fontSize:20}},"??"),
          React.createElement("span",{style:{color:"#fff",fontSize:17,fontWeight:800,letterSpacing:"-0.3px"}},"AutoScan AI")
        ),
        React.createElement("div", {
          style: {display:"flex",background:"rgba(255,255,255,.1)",borderRadius:20,padding:3,gap:2}
        },
          ["EN","ع"].map(function(lbl) {
            var isAr = lbl === "ع";
            var active = ar === isAr;
            return React.createElement("button",{
              key:lbl,
              onClick:function(){setAr(isAr);},
              style:{
                padding:"5px 13px",borderRadius:16,border:"none",cursor:"pointer",
                background:active?"#fff":"transparent",
                color:active?T.navy:"rgba(255,255,255,.7)",
                fontSize:12,fontWeight:700,transition:"all .2s"
              }
            },lbl);
          })
        )
      ),
      React.createElement("div",{style:{display:"flex",borderTop:"1px solid rgba(255,255,255,.08)",marginTop:4}},
        tabs.map(function(t){
          var active = tab===t.id;
          return React.createElement("button",{
            key:t.id,
            onClick:function(){setTab(t.id);},
            style:{
              flex:1,background:"none",border:"none",cursor:"pointer",
              display:"flex",flexDirection:"column",alignItems:"center",gap:2,
              padding:"8px 4px 10px"
            }
          },
            React.createElement("span",{style:{fontSize:18}},t.icon),
            React.createElement("span",{style:{fontSize:10,fontWeight:active?700:400,color:active?"#fff":"rgba(255,255,255,.45)",transition:"color .2s"}},ar?t.ar:t.en),
            active && React.createElement("div",{style:{width:20,height:2.5,background:T.red,borderRadius:2,marginTop:1}})
          );
        })
      )
    )
  );
}

// ── HOME SCREEN ──────────────────────────────────────────────────────────────
function HomeScreen(props) {
  var setTab=props.setTab; var ar=props.ar; var faults=props.faults;
  var hasData = faults.length > 0;
  var high = faults.filter(function(f){return f.severity==="high";}).length;
  var med  = faults.filter(function(f){return f.severity==="medium";}).length;
  var low  = faults.filter(function(f){return f.severity==="low";}).length;

  var features = [
    {icon:"??",en:"AI-Powered OCR",ar:"تعرف بصري ذكي",sub:"Reads Arabic & English inspection sheets",subAr:"يقرأ ورق الفحص بالعربية والإنجليزية"},
    {icon:"??",en:"Smart Diagnosis",ar:"تشخيص ذكي",sub:"GPT-4o analyzes every fault in seconds",subAr:"يحلل كل عطل خلال ثوان"},
    {icon:"??️",en:"Visual Mapping",ar:"تخطيط مرئي",sub:"See exactly where each fault is on the car",subAr:"شاهد موقع كل عطل على السيارة"},
    {icon:"??",en:"Garage Locator",ar:"مواقع التصليح",sub:"Find vetted shops in Qatar & GCC",subAr:"اعثر على مراكز معتمدة في قطر والخليج"},
  ];

  return React.createElement("div", null,
    // Hero section
    React.createElement("div", {
      style: {
        background: "linear-gradient(160deg,"+T.hero+" 0%,#0d1b2a 60%,#1a0306 100%)",
        padding: "56px 24px 48px", position: "relative", overflow: "hidden"
      }
    },
      React.createElement("div",{className:"hero-glow",style:{width:400,height:400,top:-100,right:-120,background:"radial-gradient(circle,rgba(230,57,70,.18) 0%,transparent 70%)"}}),
      React.createElement("div",{className:"hero-glow",style:{width:300,height:300,bottom:-80,left:-80,background:"radial-gradient(circle,rgba(31,58,95,.6) 0%,transparent 70%)"}}),
      React.createElement("div",{style:{maxWidth:900,margin:"0 auto",position:"relative",zIndex:1}},
        React.createElement("div",{style:{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(230,57,70,.15)",border:"1px solid rgba(230,57,70,.3)",borderRadius:20,padding:"5px 14px",marginBottom:20}},
          React.createElement("div",{style:{width:7,height:7,borderRadius:"50%",background:T.red,animation:"pulse 1.8s infinite"}}),
          React.createElement("span",{style:{color:T.red,fontSize:12,fontWeight:700}},ar?"مدعوم بالذكاء الاصطناعي":"Powered by AI")
        ),
        React.createElement("h1",{
          style:{color:"#fff",fontSize:"clamp(28px,6vw,48px)",fontWeight:900,margin:"0 0 14px",lineHeight:1.15,letterSpacing:"-1px",animation:"fadeUp .6s ease both"}
        }, ar?"مساعدك في تشخيص":"Your Car,"),
        React.createElement("h1",{
          style:{color:T.red,fontSize:"clamp(28px,6vw,48px)",fontWeight:900,margin:"0 0 18px",lineHeight:1.15,letterSpacing:"-1px",animation:"fadeUp .6s .1s ease both"}
        }, ar?"سيارتك":"Diagnosed."),
        React.createElement("p",{
          style:{color:"rgba(155,189,224,.85)",fontSize:15,lineHeight:1.7,maxWidth:480,margin:"0 0 32px",animation:"fadeUp .6s .2s ease both"}
        }, ar?"ارفع صورة ورقة الفحص واحصل على تشخيص فوري":"Upload your inspection sheet and get an instant AI diagnosis in seconds."),
        React.createElement("div",{style:{display:"flex",gap:12,flexWrap:"wrap",animation:"fadeUp .6s .3s ease both"}},
          React.createElement("button",{
            onClick:function(){setTab("scan");},
            className:"hover-lift",
            style:{
              background:"linear-gradient(135deg,"+T.red+","+T.dark+")",color:"#fff",
              border:"none",borderRadius:14,padding:"15px 32px",
              fontSize:15,fontWeight:800,cursor:"pointer",
              boxShadow:"0 8px 28px rgba(230,57,70,.45)",
              display:"flex",alignItems:"center",gap:10
            }
          },
            React.createElement("span",{style:{fontSize:20}},"◎"),
            ar?"مسح ورقة الفحص":"Scan Inspection Sheet"
          ),
          hasData && React.createElement("button",{
            onClick:function(){setTab("report");},
            className:"hover-lift",
            style:{background:"rgba(255,255,255,.08)",color:"#fff",border:"1px solid rgba(255,255,255,.15)",borderRadius:14,padding:"15px 24px",fontSize:15,fontWeight:600,cursor:"pointer"}
          }, ar?"عرض التقرير →":"View Report →")
        )
      )
    ),
    // Content below hero
    React.createElement("div",{style:{maxWidth:900,margin:"0 auto",padding:"0 20px"}},
      // Report summary if exists
      hasData && React.createElement("div",{style:{margin:"32px 0"}},
        React.createElement("div",{style:{fontSize:11,fontWeight:700,color:T.textMut,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}},ar?"آخر تقرير":"Latest Report"),
        React.createElement(Card,{style:{padding:20}},
          React.createElement("div",{style:{display:"flex",gap:12,marginBottom:16}},
            [{count:high,label:ar?"حرج":"Critical",c:T.dark,bg:T.critBg},
             {count:med,label:ar?"متوسط":"Moderate",c:"#D97706",bg:T.medBg},
             {count:low,label:ar?"منخفض":"Minor",c:T.teal,bg:T.lowBg}].map(function(item){
              return React.createElement("div",{key:item.label,style:{flex:1,background:item.bg,borderRadius:14,padding:"14px 8px",textAlign:"center"}},
                React.createElement("div",{style:{fontSize:28,fontWeight:900,color:item.c}},item.count),
                React.createElement("div",{style:{fontSize:11,color:item.c,fontWeight:600}},item.label)
              );
            })
          ),
          React.createElement("button",{
            onClick:function(){setTab("report");},
            style:{width:"100%",background:T.navy,color:"#fff",border:"none",borderRadius:12,padding:14,fontSize:14,fontWeight:700,cursor:"pointer"}
          }, ar?"عرض التقرير الكامل →":"View Full Report →")
        )
      ),
      // Urgent alert
      hasData && high > 0 && React.createElement(RevealCard,{style:{background:T.critBg,borderRadius:16,padding:16,border:"1px solid rgba(192,57,43,.25)",margin:"0 0 32px"}},
        React.createElement("div",{style:{display:"flex",gap:12,alignItems:"flex-start"}},
          React.createElement("span",{style:{fontSize:22}},"⚠️"),
          React.createElement("div",null,
            React.createElement("div",{style:{fontSize:13,fontWeight:700,color:T.mid,marginBottom:4}},ar?"تنبيه عاجل":"Urgent Alert"),
            React.createElement("div",{style:{fontSize:12,color:T.textSec,lineHeight:1.6}},
              ar?(high+" عطل حرج — لا تقد السيارة"):(high+" critical fault(s). Do not drive until resolved.")
            )
          )
        )
      ),
      // Features grid
      React.createElement("div",{style:{margin:"32px 0 48px"}},
        React.createElement("div",{style:{fontSize:11,fontWeight:700,color:T.textMut,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:20}},ar?"الميزات":"Features"),
        React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14}},
          features.map(function(f,i){
            return React.createElement(RevealCard,{key:f.en,delay:i*80,style:{borderRadius:18,border:"1px solid "+T.border,padding:20,background:T.card,boxShadow:"0 4px 24px rgba(0,0,0,.05)"},className:"hover-lift"},
              React.createElement("div",{style:{fontSize:28,marginBottom:10}},f.icon),
              React.createElement("div",{style:{fontSize:14,fontWeight:700,color:T.navy,marginBottom:6}},ar?f.ar:f.en),
              React.createElement("div",{style:{fontSize:12,color:T.textSec,lineHeight:1.5}},ar?f.subAr:f.sub)
            );
          })
        )
      )
    )
  );
}

// ── SCAN SCREEN ──────────────────────────────────────────────────────────────
function ScanScreen(props) {
  var setTab=props.setTab; var ar=props.ar; var setFaults=props.setFaults;
  var _st = useState("vehicle");
  var step=_st[0]; var setStep=_st[1];
  var _mk = useState("Toyota");
  var make=_mk[0]; var setMake=_mk[1];
  var _md = useState("Land Cruiser");
  var model=_md[0]; var setModel=_md[1];
  var _yr = useState(2006);
  var year=_yr[0]; var setYear=_yr[1];
  var _pr = useState(0);
  var progress=_pr[0]; var setProgress=_pr[1];
  var _ss = useState(0);
  var subStep=_ss[0]; var setSubStep=_ss[1];
  var _pu = useState(null);
  var previewUrl=_pu[0]; var setPreviewUrl=_pu[1];
  var _em = useState(null);
  var errorMsg=_em[0]; var setErrorMsg=_em[1];

  var galleryRef = useRef(null);
  var videoRef   = useRef(null);
  var streamRef  = useRef(null);

  var stages = [
    ar?"جارٍ استخراج النص...":"Extracting text via OCR...",
    ar?"جارٍ تشغيل نموذج الذكاء الاصطناعي...":"Running AI diagnosis...",
    ar?"جارٍ تحديد مواقع الأعطال...":"Mapping fault locations...",
  ];

  function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg(ar?"الكاميرا غير مدعومة في هذا المتصفح. استخدم رفع الصورة.":"Camera not supported in this browser. Use Upload Photo.");
      return;
    }
    navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false})
      .then(function(stream) {
        streamRef.current = stream;
        if (videoRef.current) { videoRef.current.srcObject=stream; videoRef.current.play(); }
      })
      .catch(function() {
        setErrorMsg(ar?"تعذر الوصول إلى الكاميرا. استخدم زر رفع الصورة.":"Camera access denied. Please use Upload Photo.");
      });
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(function(t){t.stop();});
      streamRef.current = null;
    }
  }

  useEffect(function() {
    if (step==="camera") startCamera();
    return stopCamera;
  }, [step]);

  function capturePhoto() {
    var video = videoRef.current;
    if (!video) return;
    var canvas = document.createElement("canvas");
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(function(blob) {
      setPreviewUrl(URL.createObjectURL(blob));
      stopCamera();
      runPipeline(blob);
    }, "image/jpeg", 0.92);
  }

  function handleGallery(e) {
    var file = e.target.files[0];
    if (!file) return;
    // Security: validate file type and size
    var allowed = ["image/jpeg","image/png","image/webp","image/heic","image/heif"];
    if (allowed.indexOf(file.type) === -1 && file.type !== "") {
      setErrorMsg("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
      setStep("error"); return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg("File too large. Maximum size is 20MB.");
      setStep("error"); return;
    }
    e.target.value = "";
    setPreviewUrl(URL.createObjectURL(file));
    runPipeline(file);
  }

  function openGallery() {
    if (galleryRef.current) galleryRef.current.click();
  }

  function fail(msg) {
    setErrorMsg(msg);
    setStep("error");
  }

  function runPipeline(imageFile) {
    setStep("processing");
    setProgress(0);
    setSubStep(0);
    setErrorMsg(null);

    var p = 0;
    var tick = setInterval(function() {
      p += 1;
      if (p >= 90) clearInterval(tick);
      setProgress(p);
      if (p===30) setSubStep(1);
      if (p===65) setSubStep(2);
    }, 80);

    var reader = new FileReader();
    reader.onerror = function() {
      clearInterval(tick);
      fail("Could not read the image file. Please try again.");
    };
    reader.onload = function() {
      var base64 = reader.result.split(",")[1];
      var mediaType = imageFile.type || "image/jpeg";

      var diagPrompt = "You are an expert automotive diagnostic engineer for GCC-market vehicles. "
        + "Analyze this vehicle inspection sheet image carefully. Read ALL text, fault codes, checked boxes, "
        + "handwritten notes, and marks indicating problems. "
        + "Return ONLY a valid JSON array with no preamble, no markdown, no explanation. Raw JSON only. "
        + "Schema: [{id,severity(high/medium/low),zone(engine_bay/front_left_wheel/front_right_wheel/"
        + "rear_left_wheel/rear_right_wheel/underbody_front/underbody_rear/cabin_dashboard/"
        + "battery_electrical/fuel_system),code(DTC or null),nameEn,nameAr,fn,immediate,longterm,"
        + "steps(array of strings),cost}]. "
        + "high=safety risk do not drive, medium=repair within 2-4 weeks, low=minor within 3-6 months. "
        + "Vehicle: "+make+" "+model+" "+year+". "
        + "If not an inspection sheet or no faults found, return empty array: []";

      var body = JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        messages: [{
          role: "user",
          content: [
            {type:"image",source:{type:"base64",media_type:mediaType,data:base64}},
            {type:"text",text:diagPrompt}
          ]
        }]
      });

      fetch("/api/diagnose", {method:"POST",headers:{"Content-Type":"application/json"},body:body})
        .then(function(response) {
          clearInterval(tick);
          setProgress(100);
          if (response.status === 404) {
            fail("API proxy not found. Create api/diagnose.js in your GitHub repo (Phase 6 Step 3).");
            return;
          }
          if (!response.ok) {
            fail("Server error "+response.status+". Check Vercel logs for details.");
            return;
          }
          return response.json();
        })
        .then(function(data) {
          if (!data) return;
          if (data.error) {
            var msg = data.error.message || JSON.stringify(data.error);
            if (msg.indexOf("credit") > -1 || msg.indexOf("billing") > -1) {
              fail("Billing issue: add credit at console.anthropic.com/billing. "+msg);
            } else {
              fail("Anthropic API error: "+msg);
            }
            return;
          }
          var raw = (data.content && data.content[0] && data.content[0].text) || "[]";
          var clean = raw.replace(/```json|```/g,"").trim();
          var faults;
          try {
            var parsed = JSON.parse(clean);
            faults = Array.isArray(parsed) ? parsed : (parsed.faults || []);
          } catch(e) {
            fail("AI returned unexpected format. Please try again.");
            return;
          }
          var order = {high:0,medium:1,low:2};
          faults.sort(function(a,b){ return (order[a.severity]||3)-(order[b.severity]||3); });
          setFaults(faults);
          setTimeout(function(){ setStep("done"); }, 300);
        })
        .catch(function(err) {
          clearInterval(tick);
          if (err.message && err.message.indexOf("fetch") > -1) {
            fail("Network error. Check your internet connection and that the app is deployed.");
          } else {
            fail("Unexpected error: "+err.message);
          }
        });
    };
    reader.readAsDataURL(imageFile);
  }

  // ── Step: Error ────────────────────────────────────────────────────────────
  if (step === "error") return React.createElement("div",{style:{padding:"24px 20px",maxWidth:640,margin:"0 auto"}},
    previewUrl && React.createElement("img",{src:previewUrl,alt:"scan",style:{width:"100%",maxHeight:160,objectFit:"cover",borderRadius:14,marginBottom:16,opacity:.55}}),
    React.createElement("div",{style:{background:T.critBg,border:"1.5px solid "+T.dark,borderRadius:20,padding:24}},
      React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:16}},
        React.createElement("span",{style:{fontSize:28}},"❌"),
        React.createElement("div",{style:{fontSize:17,fontWeight:800,color:T.dark}},ar?"فشل التحليل":"Analysis Failed")
      ),
      React.createElement("div",{style:{background:"#fff",borderRadius:12,padding:14,marginBottom:18}},
        (errorMsg||"Unknown error").split("\n").map(function(p,i){
          return React.createElement("p",{key:i,style:{fontSize:13,color:T.navy,lineHeight:1.6,margin:i>0?"8px 0 0":"0"}},p);
        })
      ),
      React.createElement("div",{style:{fontSize:12,fontWeight:700,color:T.dark,marginBottom:10}},ar?"خطوات الإصلاح:":"Steps to fix:"),
      [
        ar?"تأكد من وجود api/diagnose.js في GitHub":"Ensure api/diagnose.js exists in your GitHub repo",
        ar?"تحقق من ANTHROPIC_API_KEY في Vercel Environment Variables":"Verify ANTHROPIC_API_KEY in Vercel Environment Variables",
        ar?"تأكد من وجود رصيد في console.anthropic.com":"Check you have billing credit at console.anthropic.com",
        ar?"أعد النشر في Vercel بعد أي تغييرات":"Redeploy on Vercel after any changes",
      ].map(function(tip,i){
        return React.createElement("div",{key:i,style:{display:"flex",gap:8,alignItems:"flex-start",background:"rgba(192,57,43,.07)",borderRadius:9,padding:"8px 10px",marginBottom:6}},
          React.createElement("span",{style:{color:T.dark,fontSize:11,flexShrink:0,marginTop:2}},(i+1)+"."),
          React.createElement("span",{style:{fontSize:12,color:T.navy,lineHeight:1.5}},tip)
        );
      })
      React.createElement("div",{style:{display:"flex",gap:10,marginTop:16}},
        React.createElement("button",{
          onClick:function(){setErrorMsg(null);setStep("choose");},
          style:{flex:1,background:T.navy,color:"#fff",border:"none",borderRadius:12,padding:13,fontSize:14,fontWeight:700,cursor:"pointer"}
        }, ar?"حاول مجددا":"Try Again"),
        React.createElement("button",{
          onClick:function(){setErrorMsg(null);setStep("vehicle");},
          style:{flex:1,background:T.card,color:T.textSec,border:"1px solid "+T.border,borderRadius:12,padding:13,fontSize:14,fontWeight:600,cursor:"pointer"}
        }, ar?"مسح جديد":"New Scan")
      )
    )
  );

  // ── Step: Done ─────────────────────────────────────────────────────────────
  if (step === "done") return React.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",gap:20,maxWidth:500,margin:"0 auto",textAlign:"center"}},
    previewUrl && React.createElement("img",{src:previewUrl,alt:"scan",style:{width:"100%",maxHeight:200,objectFit:"cover",borderRadius:18,marginBottom:4,boxShadow:"0 8px 32px rgba(0,0,0,.12)"}}),
    React.createElement("div",{style:{width:72,height:72,borderRadius:36,background:T.lowBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,animation:"fadeIn .4s ease"}},"✓"),
    React.createElement("div",null,
      React.createElement("div",{style:{fontSize:22,fontWeight:800,color:T.navy,marginBottom:6}},ar?"اكتمل التحليل!":"Analysis Complete!"),
      React.createElement("div",{style:{fontSize:14,color:T.textSec}},ar?"تم تحليل ورقة الفحص بنجاح":"Inspection sheet analyzed successfully")
    ),
    React.createElement("div",{style:{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}},
      React.createElement("button",{
        onClick:function(){setTab("report");setStep("vehicle");},
        style:{background:T.red,color:"#fff",border:"none",borderRadius:14,padding:"15px 36px",fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:"0 6px 24px rgba(230,57,70,.4)"}
      }, ar?"عرض التقرير":"View Report"),
      React.createElement("button",{
        onClick:function(){setStep("vehicle");setPreviewUrl(null);},
        style:{background:T.card,color:T.textSec,border:"1px solid "+T.border,borderRadius:14,padding:"15px 24px",fontSize:14,fontWeight:600,cursor:"pointer"}
      }, ar?"مسح جديد":"New Scan")
    )
  );

  // ── Step: Processing ───────────────────────────────────────────────────────
  if (step === "processing") return React.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",gap:24,maxWidth:500,margin:"0 auto"}},
    previewUrl && React.createElement("img",{src:previewUrl,alt:"scan",style:{width:"100%",maxHeight:180,objectFit:"cover",borderRadius:16,opacity:.8}}),
    React.createElement("div",{style:{position:"relative",width:100,height:100}},
      React.createElement("svg",{width:100,height:100,viewBox:"0 0 100 100"},
        React.createElement("circle",{cx:50,cy:50,r:44,fill:"none",stroke:T.border,strokeWidth:7}),
        React.createElement("circle",{cx:50,cy:50,r:44,fill:"none",stroke:T.red,strokeWidth:7,
          strokeDasharray:(2*Math.PI*44*progress/100)+" 999",strokeLinecap:"round",
          transform:"rotate(-90 50 50)",style:{transition:"stroke-dasharray .1s"}})
      ),
      React.createElement("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:17,fontWeight:800,color:T.navy}},progress+"%")
    ),
    React.createElement("div",{style:{textAlign:"center"}},
      React.createElement("div",{style:{fontSize:17,fontWeight:700,color:T.navy,marginBottom:6}},ar?"جارٍ التحليل...":"Analyzing..."),
      React.createElement("div",{style:{fontSize:13,color:T.red,fontWeight:600}},stages[subStep])
    ),
    React.createElement("div",{style:{width:"100%",maxWidth:340,display:"flex",flexDirection:"column",gap:8}},
      stages.map(function(s,i){
        var isPast = i < subStep; var isCur = i === subStep;
        return React.createElement("div",{key:i,style:{display:"flex",alignItems:"center",gap:10,opacity:i>subStep?.35:1}},
          React.createElement("div",{style:{width:22,height:22,borderRadius:11,background:isPast?T.teal:isCur?T.red:T.border,color:"#fff",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},
            isPast?"✓":(i+1)
          ),
          React.createElement("span",{style:{fontSize:13,color:isCur?T.navy:T.textSec,fontWeight:isCur?600:400}},s)
        );
      })
    )
  );

  // ── Main scan UI ───────────────────────────────────────────────────────────
  return React.createElement("div",{style:{padding:"24px 20px",maxWidth:640,margin:"0 auto"}},
    // Step indicator
    React.createElement("div",{style:{display:"flex",gap:8,marginBottom:28}},
      [ar?"المركبة":"Vehicle",ar?"المصدر":"Source",ar?"التحليل":"Analysis"].map(function(s,i){
        var isCur = (step==="vehicle"&&i===0)||(step==="choose"&&i===1)||(step==="camera"&&i===1);
        var isPast= (i===0&&step!=="vehicle")||(i===1&&step==="processing");
        return React.createElement("div",{key:s,style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}},
          React.createElement("div",{style:{width:28,height:28,borderRadius:14,background:isPast?T.teal:isCur?T.red:T.border,color:"#fff",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",transition:"background .3s"}},
            isPast?"✓":(i+1)
          ),
          React.createElement("div",{style:{fontSize:11,color:isCur?T.navy:T.textMut,fontWeight:isCur?600:400}},s)
        );
      })
    ),

    // ── Vehicle selection ──────────────────────────────────────────────────
    step==="vehicle" && React.createElement("div",null,
      React.createElement("div",{style:{fontSize:20,fontWeight:800,color:T.navy,marginBottom:20}},ar?"اختر مركبتك":"Select Your Vehicle"),
      [
        {label:ar?"الصانع":"Make",   value:make,  opts:MAKES,            onChange:function(v){setMake(v);setModel((MODELS[v]||[])[0]||"");}},
        {label:ar?"الموديل":"Model", value:model, opts:MODELS[make]||[], onChange:function(v){setModel(v);}},
        {label:ar?"السنة":"Year",  value:year,  opts:YEARS,             onChange:function(v){setYear(Number(v));}},
      ].map(function(field){
        return React.createElement("div",{key:field.label,style:{marginBottom:16}},
          React.createElement("div",{style:{fontSize:12,fontWeight:600,color:T.textSec,marginBottom:6}},field.label),
          React.createElement("div",{style:{position:"relative"}},
            React.createElement("select",{
              value:field.value,
              onChange:function(e){field.onChange(e.target.value);},
              style:{width:"100%",padding:"13px 40px 13px 16px",borderRadius:13,border:"1.5px solid "+T.border,fontSize:15,color:T.textPri,background:T.card,cursor:"pointer",fontFamily:"inherit"}
            }, field.opts.map(function(o){return React.createElement("option",{key:o,value:o},o);})),
            React.createElement("span",{style:{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:T.textMut,fontSize:11}},"▼")
          )
        );
      }),
      React.createElement("button",{
        onClick:function(){setStep("choose");},
        style:{width:"100%",background:T.navy,color:"#fff",border:"none",borderRadius:14,padding:15,fontSize:15,fontWeight:700,cursor:"pointer",marginTop:8}
      }, ar?"التالي →":"Next →")
    ),

    // ── Choose source ──────────────────────────────────────────────────────
    step==="choose" && React.createElement("div",null,
      React.createElement("div",{style:{fontSize:20,fontWeight:800,color:T.navy,marginBottom:6}},ar?"كيف تريد إضافة الصورة؟":"How would you like to add the image?"),
      React.createElement("div",{style:{fontSize:13,color:T.textSec,marginBottom:24}},ar?"اختر طريقة إضافة ورقة الفحص":"Choose how to add your inspection sheet"),
      React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:14,marginBottom:20}},
        React.createElement("button",{
          onClick:openGallery,
          className:"hover-lift",
          style:{background:T.navy,color:"#fff",border:"none",borderRadius:18,padding:22,fontSize:16,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:16,boxShadow:"0 6px 24px rgba(13,27,42,.25)"}
        },
          React.createElement("span",{style:{fontSize:36}},"??️"),
          React.createElement("div",{style:{textAlign:"left"}},
            React.createElement("div",null, ar?"رفع صورة من الهاتف":"Upload Photo from Phone"),
            React.createElement("div",{style:{fontSize:12,fontWeight:400,opacity:.7,marginTop:3}}, ar?"اختر صورة من معرض الصور":"Choose from your photo gallery")
          )
        ),
        React.createElement("button",{
          onClick:function(){setStep("camera");},
          className:"hover-lift",
          style:{background:T.card,color:T.navy,border:"2px solid "+T.border,borderRadius:18,padding:22,fontSize:16,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:16}
        },
          React.createElement("span",{style:{fontSize:36}},"??"),
          React.createElement("div",{style:{textAlign:"left"}},
            React.createElement("div",null, ar?"التقاط بالكاميرا":"Take Photo with Camera"),
            React.createElement("div",{style:{fontSize:12,fontWeight:400,color:T.textMut,marginTop:3}}, ar?"افتح الكاميرا مباشرة":"Open live camera")
          )
        )
      ),
      React.createElement("input",{ref:galleryRef,type:"file",accept:"image/jpeg,image/png,image/webp,image/heic,image/heif",onChange:handleGallery,style:{display:"none"}}),
      React.createElement("button",{onClick:function(){setStep("vehicle");},style:{background:"none",border:"none",color:T.textMut,fontSize:13,cursor:"pointer",display:"block",margin:"0 auto"}},ar?"← العودة":"← Back")
    ),

    // ── Camera ─────────────────────────────────────────────────────────────
    step==="camera" && React.createElement("div",null,
      React.createElement("div",{style:{fontSize:20,fontWeight:800,color:T.navy,marginBottom:16}},ar?"التقاط ورقة الفحص":"Capture Inspection Sheet"),
      errorMsg && React.createElement("div",{style:{background:T.critBg,border:"1px solid rgba(192,57,43,.3)",borderRadius:12,padding:"12px 16px",marginBottom:16,fontSize:13,color:T.dark,lineHeight:1.5}},
        errorMsg,
        React.createElement("button",{onClick:openGallery,style:{display:"block",marginTop:8,background:T.navy,color:"#fff",border:"none",borderRadius:8,padding:"7px 14px",fontSize:11,fontWeight:700,cursor:"pointer"}},
          ar?"رفع صورة بدلاً":"Upload Photo Instead")
      ),
      React.createElement("div",{style:{background:"#000",borderRadius:18,overflow:"hidden",marginBottom:16,position:"relative",aspectRatio:"4/3"}},
        React.createElement("video",{ref:videoRef,autoPlay:true,playsInline:true,muted:true,style:{width:"100%",height:"100%",objectFit:"cover",display:"block"}}),
        React.createElement("div",{style:{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",color:"rgba(255,255,255,.8)",fontSize:12,background:"rgba(0,0,0,.5)",padding:"4px 12px",borderRadius:20,whiteSpace:"nowrap"}},
          ar?"وجّه الكاميرا نحو الورقة":"Point camera at the inspection sheet")
      ),
      React.createElement("button",{onClick:capturePhoto,style:{width:"100%",background:T.red,color:"#fff",border:"none",borderRadius:14,padding:16,fontSize:16,fontWeight:700,cursor:"pointer",boxShadow:"0 6px 20px rgba(230,57,70,.4)",marginBottom:10}},
        "?? "+(ar?"التقاط الصورة":"Capture Photo")
      ),
      React.createElement("input",{ref:galleryRef,type:"file",accept:"image/jpeg,image/png,image/webp,image/heic,image/heif",onChange:handleGallery,style:{display:"none"}}),
      React.createElement("button",{onClick:function(){setStep("choose");setErrorMsg(null);},style:{background:"none",border:"none",color:T.textMut,fontSize:13,cursor:"pointer",display:"block",margin:"8px auto 0"}},ar?"← العودة":"← Back")
    )
  );
}

// ── VEHICLE SCHEMATIC ────────────────────────────────────────────────────────
function Schematic(props) {
  var faults=props.faults; var sel=props.sel; var onZone=props.onZone;
  var zoneSev = {};
  faults.forEach(function(f) {
    if (!zoneSev[f.zone] || f.severity==="high" || (f.severity==="medium"&&zoneSev[f.zone]==="low"))
      zoneSev[f.zone] = f.severity;
  });
  return React.createElement("svg",{viewBox:"0 0 240 290",style:{width:"100%",maxHeight:260,display:"block"}},
    React.createElement("path",{d:"M32,168 L32,238 L208,238 L208,168 L185,102 L160,82 L80,82 L55,102 Z",fill:"#E8ECF0",stroke:T.border,strokeWidth:"1.5"}),
    React.createElement("path",{d:"M80,82 L90,52 L150,52 L160,82 Z",fill:"#D0D8E4",stroke:T.border,strokeWidth:"1"}),
    React.createElement("path",{d:"M95,80 L102,56 L138,56 L145,80 Z",fill:"#B8C8DC",stroke:T.border,strokeWidth:"0.8"}),
    React.createElement("path",{d:"M88,150 L152,150 L155,162 L85,162 Z",fill:"#B8C8DC",stroke:T.border,strokeWidth:"0.8"}),
    Object.keys(ZONES).map(function(zone) {
      var shape = ZONES[zone];
      var sev = zoneSev[zone];
      if (!sev) return null;
      var col = SC(sev);
      var isSel = sel === zone;
      var fill = col + (isSel?"55":"28");
      var sw = isSel ? 2.5 : 1.5;
      if (shape.type==="circle") {
        return React.createElement("circle",{key:zone,cx:shape.cx,cy:shape.cy,r:shape.r,fill:fill,stroke:col,strokeWidth:sw,style:{cursor:"pointer"},onClick:function(){onZone(zone);}});
      }
      return React.createElement("rect",{key:zone,x:shape.x,y:shape.y,width:shape.w,height:shape.h,rx:4,fill:fill,stroke:col,strokeWidth:sw,style:{cursor:"pointer"},onClick:function(){onZone(zone);}});
    }),
    [{c:T.dark,l:"Critical"},{c:"#D97706",l:"Moderate"},{c:T.teal,l:"Minor"}].map(function(item,i){
      return React.createElement("g",{key:i,transform:"translate("+(8+i*78)+",282)"},
        React.createElement("circle",{cx:5,cy:-1,r:4.5,fill:item.c}),
        React.createElement("text",{x:13,y:3,fontSize:9,fill:T.textSec,fontFamily:"system-ui"},item.l)
      );
    })
  );
}

// ── FAULT CARD ───────────────────────────────────────────────────────────────
function FaultCard(props) {
  var fault=props.fault; var exp=props.exp; var onToggle=props.onToggle; var ar=props.ar;
  return React.createElement("div",{
    style:{background:exp?SB(fault.severity):T.card,borderRadius:16,border:"1px solid "+(exp?SC(fault.severity)+"55":T.border),marginBottom:10,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.05)",transition:"all .2s"}
  },
    React.createElement("div",{onClick:onToggle,style:{padding:16,cursor:"pointer"}},
      React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}},
        React.createElement(SevBadge,{sev:fault.severity,ar:ar}),
        fault.code && React.createElement("span",{style:{fontSize:11,fontWeight:700,background:"#EEF2F7",color:T.mid,padding:"2px 8px",borderRadius:6}},fault.code)
      ),
      React.createElement("div",{style:{fontSize:14,fontWeight:700,color:T.navy,marginBottom:4}},ar?fault.nameAr:fault.nameEn),
      React.createElement("div",{style:{fontSize:12,color:T.textSec,lineHeight:1.45,marginBottom:6}},fault.fn),
      React.createElement("div",{style:{display:"flex",justifyContent:"space-between"}},
        React.createElement("span",{style:{fontSize:11,color:T.textMut}},
          (ar?"التكلفة المقدرة:":"Est. cost: "),
          React.createElement("strong",{style:{color:T.navy}},fault.cost)
        ),
        React.createElement("span",{style:{fontSize:11,color:exp?T.red:T.textMut}},(exp?"▲":"▼")+" "+(ar?"التفاصيل":"Details"))
      )
    ),
    exp && React.createElement("div",{style:{padding:"0 16px 16px",borderTop:"1px solid "+T.border}},
      [{icon:"⚠️",color:T.dark,title:ar?"الخطر الفوري":"Immediate Risk",body:fault.immediate},
       {icon:"??",color:"#D97706",title:ar?"العواقب طويلة المدى":"Long-term",body:fault.longterm}]
      .map(function(row){
        return React.createElement("div",{key:row.title,style:{marginTop:12}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:row.color,marginBottom:4}},row.icon+" "+row.title),
          React.createElement("div",{style:{fontSize:12,color:T.textSec,lineHeight:1.5}},row.body)
        );
      }),
      React.createElement("div",{style:{marginTop:12}},
        React.createElement("div",{style:{fontSize:12,fontWeight:700,color:T.teal,marginBottom:6}},"?? "+(ar?"خطوات الإصلاح":"Repair Steps")),
        fault.steps && fault.steps.map(function(s,i){
          return React.createElement("div",{key:i,style:{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}},
            React.createElement("div",{style:{width:18,height:18,borderRadius:9,background:T.teal,color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},(i+1)),
            React.createElement("span",{style:{fontSize:12,color:T.textSec,lineHeight:1.4}},s)
          );
        })
      )
    )
  );
}

// ── REPORT SCREEN ────────────────────────────────────────────────────────────
function ReportScreen(props) {
  var ar=props.ar; var faults=props.faults;
  var _v = useState("schematic"); var view=_v[0]; var setView=_v[1];
  var _z = useState(null); var selZone=_z[0]; var setSelZone=_z[1];
  var _e = useState(null); var expanded=_e[0]; var setExpanded=_e[1];

  if (faults.length === 0) return React.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:64,gap:16,textAlign:"center",minHeight:400}},
    React.createElement("div",{style:{fontSize:64,marginBottom:8}},"??"),
    React.createElement("div",{style:{fontSize:18,fontWeight:700,color:T.navy}},ar?"لا يوجد تقرير بعد":"No report yet"),
    React.createElement("div",{style:{fontSize:14,color:T.textSec,lineHeight:1.6,maxWidth:300}},ar?"امسح ورقة فحص سيارتك أولاً":"Scan an inspection sheet first")
  );

  var grouped = [
    {sev:"high",   label:ar?"حرج":"Critical",  faults:faults.filter(function(f){return f.severity==="high";})},
    {sev:"medium", label:ar?"متوسط":"Moderate", faults:faults.filter(function(f){return f.severity==="medium";})},
    {sev:"low",    label:ar?"منخفض":"Minor",    faults:faults.filter(function(f){return f.severity==="low";})},
  ].filter(function(g){return g.faults.length>0;});

  return React.createElement("div",{style:{maxWidth:900,margin:"0 auto"}},
    React.createElement("div",{style:{background:"linear-gradient(135deg,"+T.navy+","+T.mid+")",padding:"18px 20px"}},
      React.createElement("div",{style:{color:"#fff",fontSize:16,fontWeight:800,marginBottom:12}},ar?"تقرير التشخيص":"Diagnostic Report"),
      React.createElement("div",{style:{display:"flex",gap:10}},
        [{n:faults.filter(function(f){return f.severity==="high";}).length,l:ar?"حرج":"Critical",c:T.dark},
         {n:faults.filter(function(f){return f.severity==="medium";}).length,l:ar?"متوسط":"Moderate",c:T.amber},
         {n:faults.filter(function(f){return f.severity==="low";}).length,l:ar?"منخفض":"Minor",c:T.teal}]
        .map(function(item){
          return React.createElement("div",{key:item.l,style:{flex:1,background:"rgba(255,255,255,.1)",borderRadius:10,padding:"8px 4px",textAlign:"center"}},
            React.createElement("div",{style:{fontSize:22,fontWeight:900,color:item.c}},item.n),
            React.createElement("div",{style:{fontSize:10,color:"rgba(255,255,255,.7)"}},item.l)
          );
        })
      )
    ),
    React.createElement("div",{style:{display:"flex",margin:"12px 16px 0",background:T.border,borderRadius:12,padding:3}},
      [{id:"schematic",en:"Schematic",ar:"المخطط"},{id:"list",en:"Fault List",ar:"قائمة الأعطال"}].map(function(v){
        return React.createElement("button",{key:v.id,onClick:function(){setView(v.id);},style:{flex:1,padding:"8px",border:"none",borderRadius:10,cursor:"pointer",background:view===v.id?T.card:"transparent",color:view===v.id?T.navy:T.textSec,fontWeight:view===v.id?700:500,fontSize:13,transition:"all .2s"}},ar?v.ar:v.en);
      })
    ),
    React.createElement("div",{style:{padding:"12px 16px 40px"}},
      view==="schematic" ? React.createElement("div",null,
        React.createElement(Card,{style:{padding:14,marginBottom:12}},
          React.createElement("div",{style:{fontSize:12,color:T.textSec,textAlign:"center",marginBottom:8}},ar?"اضغط على المنطقة الملونة لعرض العطل":"Tap a highlighted zone to see faults"),
          React.createElement(Schematic,{faults:faults,sel:selZone,onZone:function(z){setSelZone(selZone===z?null:z);}})
        ),
        selZone ? faults.filter(function(f){return f.zone===selZone;}).map(function(fault){
          return React.createElement(FaultCard,{key:fault.id,fault:fault,exp:expanded===fault.id,onToggle:function(){setExpanded(expanded===fault.id?null:fault.id);},ar:ar});
        }) : React.createElement("div",{style:{textAlign:"center",color:T.textMut,fontSize:13,padding:"20px 0"}},ar?"اضغط على منطقة ملونة أعلاه":"Tap a highlighted zone above")
      ) : React.createElement("div",null,
        grouped.map(function(group){
          return React.createElement("div",{key:group.sev,style:{marginBottom:18}},
            React.createElement("div",{style:{fontSize:12,fontWeight:700,color:SC(group.sev),marginBottom:8,display:"flex",alignItems:"center",gap:6}},
              React.createElement("div",{style:{width:8,height:8,borderRadius:4,background:SC(group.sev)}}),
              group.label+" ("+group.faults.length+")"
            ),
            group.faults.map(function(fault){
              return React.createElement(FaultCard,{key:fault.id,fault:fault,exp:expanded===fault.id,onToggle:function(){setExpanded(expanded===fault.id?null:fault.id);},ar:ar});
            })
          );
        })
      )
    )
  );
}

// ── GARAGES SCREEN ───────────────────────────────────────────────────────────
function GaragesScreen(props) {
  var ar=props.ar;
  var _s = useState(null); var sel=_s[0]; var setSel=_s[1];
  var garages = [
    {id:1,nameEn:"Al-Mana Auto Service Center",nameAr:"مركز المانع لخدمة السيارات",dist:"1.2 km",rating:4.8,reviews:312,tags:["Engine","Electrical","Tyres"],open:true,phone:"+974 4444 0001"},
    {id:2,nameEn:"Qatar Motors Garage",nameAr:"جراج قطر موتورز",dist:"2.7 km",rating:4.6,reviews:187,tags:["Engine","Transmission","AC"],open:true,phone:"+974 4444 0002"},
    {id:3,nameEn:"Gulf Auto Repair",nameAr:"خليج لإصلاح السيارات",dist:"3.5 km",rating:4.4,reviews:94,tags:["General","Tyres","Battery"],open:false,phone:"+974 4444 0003"},
  ];
  return React.createElement("div",{style:{maxWidth:900,margin:"0 auto"}},
    React.createElement("div",{style:{background:"linear-gradient(135deg,"+T.navy+","+T.mid+")",padding:"18px 20px"}},
      React.createElement("div",{style:{color:"#fff",fontSize:16,fontWeight:800}},ar?"مراكز الإصلاح القريبة":"Nearby Repair Shops"),
      React.createElement("div",{style:{color:"rgba(155,189,224,.85)",fontSize:13,marginTop:2}},ar?"الدوحة، قطر":"Doha, Qatar")
    ),
    React.createElement("div",{style:{padding:16}},
      garages.map(function(g,i){
        var isOpen = g.open;
        return React.createElement(RevealCard,{key:g.id,delay:i*80,
          style:{borderRadius:18,marginBottom:12,border:"1.5px solid "+(sel===i?T.red:T.border),cursor:"pointer",overflow:"hidden",background:T.card,boxShadow:sel===i?"0 4px 20px rgba(230,57,70,.15)":"0 2px 12px rgba(0,0,0,.05)",transition:"all .2s"},
          onClick:function(){setSel(sel===i?null:i);}
        },
          React.createElement("div",{style:{padding:18}},
            React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}},
              React.createElement("div",null,
                React.createElement("div",{style:{fontSize:15,fontWeight:700,color:T.navy,marginBottom:4}},ar?g.nameAr:g.nameEn),
                React.createElement("div",{style:{display:"flex",alignItems:"center",gap:5}},
                  React.createElement("span",{style:{color:"#F59E0B",fontSize:13}},"★"),
                  React.createElement("span",{style:{fontSize:13,fontWeight:700,color:T.navy}},g.rating),
                  React.createElement("span",{style:{fontSize:12,color:T.textMut}},"("+g.reviews+")")
                )
              ),
              React.createElement("div",{style:{textAlign:"right"}},
                React.createElement("div",{style:{fontSize:13,fontWeight:700,color:T.mid}},g.dist),
                React.createElement("div",{style:{fontSize:11,fontWeight:600,color:isOpen?T.teal:T.dark,marginTop:2}},isOpen?(ar?"مفتوح":"Open"):(ar?"مغلق":"Closed"))
              )
            ),
            React.createElement("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},
              g.tags.map(function(t){return React.createElement("span",{key:t,style:{background:"#EEF2F7",color:T.mid,fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20}},t);})
            )
          ),
          sel===i && React.createElement("div",{style:{display:"flex",gap:8,padding:"0 14px 14px"}},
            React.createElement("button",{onClick:function(e){e.stopPropagation();window.open("https://maps.google.com/?q="+g.nameEn,"_blank");},style:{flex:1,background:T.navy,color:"#fff",border:"none",borderRadius:12,padding:12,fontSize:13,fontWeight:700,cursor:"pointer"}},ar?"الاتجاهات":"Directions"),
            React.createElement("a",{href:"tel:"+g.phone,onClick:function(e){e.stopPropagation();},style:{flex:1,background:T.teal,color:"#fff",borderRadius:12,padding:12,fontSize:13,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"center"}},ar?"اتصال":"Call")
          )
        );
      })
    )
  );
}

// ── PROFILE SCREEN ───────────────────────────────────────────────────────────
function ProfileScreen(props) {
  var ar=props.ar; var setAr=props.setAr;
  return React.createElement("div",{style:{maxWidth:640,margin:"0 auto"}},
    React.createElement("div",{style:{background:"linear-gradient(135deg,"+T.hero+","+T.navy+")",padding:"32px 20px 36px",textAlign:"center"}},
      React.createElement("div",{style:{width:76,height:76,borderRadius:38,background:"linear-gradient(135deg,"+T.red+","+T.amber+")",margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,boxShadow:"0 8px 28px rgba(230,57,70,.4)"}},"??"),
      React.createElement("div",{style:{color:"#fff",fontSize:19,fontWeight:800}},ar?"عبدالله الرشيدي":"Abdullah Al-Rashidi"),
      React.createElement("div",{style:{color:"rgba(155,189,224,.8)",fontSize:13,marginTop:5}},"الدوحة، قطر ????")
    ),
    React.createElement("div",{style:{padding:"20px 16px"}},
      // Language
      React.createElement(RevealCard,{style:{padding:18,marginBottom:14}},
        React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
          React.createElement("div",null,
            React.createElement("div",{style:{fontSize:14,fontWeight:700,color:T.navy}},"?? "+(ar?"اللغة":"Language")),
            React.createElement("div",{style:{fontSize:12,color:T.textSec,marginTop:2}},"Arabic / English")
          ),
          React.createElement("div",{style:{display:"flex",background:"#EEF2F7",borderRadius:20,padding:3,gap:2}},
            [{l:"عربي",v:true},{l:"EN",v:false}].map(function(opt){
              return React.createElement("button",{key:opt.l,onClick:function(){setAr(opt.v);},style:{padding:"6px 14px",borderRadius:16,border:"none",cursor:"pointer",background:ar===opt.v?T.navy:"transparent",color:ar===opt.v?"#fff":T.textSec,fontSize:12,fontWeight:700,transition:"all .2s"}},opt.l);
            })
          )
        )
      ),
      // Install PWA
      React.createElement(RevealCard,{delay:80,style:{padding:18,marginBottom:14}},
        React.createElement("div",{style:{fontSize:14,fontWeight:700,color:T.navy,marginBottom:8}},"?? "+(ar?"تثبيت التطبيق على هاتفك":"Install App on Your Phone")),
        React.createElement("div",{style:{fontSize:13,color:T.textSec,lineHeight:1.6,marginBottom:12}},ar?"في Safari: اضغط على زر المشاركة ثم إضافة إلى الشاشة الرئيسية":"In Safari: tap Share ⬆️ then Add to Home Screen"),
        React.createElement("div",{style:{display:"flex",gap:8}},
          (ar?["١. افتح Safari","٢. اضغط مشاركة","٣. أضف للشاشة"]:["1. Open in Safari","2. Tap Share ⬆️","3. Add to Home Screen"]).map(function(s){
            return React.createElement("div",{key:s,style:{flex:1,background:T.teal+"18",borderRadius:10,padding:"8px 4px",textAlign:"center",fontSize:10,color:T.teal,fontWeight:600,lineHeight:1.4}},s);
          })
        )
      ),
      // Security note
      React.createElement(RevealCard,{delay:120,style:{padding:18,background:"#F8F9FF",border:"1px solid #E0E7FF"}},
        React.createElement("div",{style:{fontSize:13,fontWeight:700,color:"#3730A3",marginBottom:8}},"?? "+(ar?"خصوصية وأمان":"Privacy & Security")),
        React.createElement("div",{style:{fontSize:12,color:T.textSec,lineHeight:1.6}},ar?"صورك تبقى خاصة — لا يتم تخزينها. مفتاح API محمي على الخادم.":"Your images stay private and are never stored. The API key is protected server-side and never exposed to the browser.")
      )
    )
  );
}

// ── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  var _tab = useState("home"); var tab=_tab[0]; var setTab=_tab[1];
  var _ar  = useState(false);  var ar=_ar[0];   var setAr=_ar[1];
  var _faults = useState([]); var faults=_faults[0]; var setFaults=_faults[1];

  var screens = {
    home:    React.createElement(HomeScreen,    {setTab:setTab,ar:ar,faults:faults}),
    scan:    React.createElement(ScanScreen,    {setTab:setTab,ar:ar,setFaults:setFaults}),
    report:  React.createElement(ReportScreen,  {ar:ar,faults:faults}),
    garages: React.createElement(GaragesScreen, {ar:ar}),
    profile: React.createElement(ProfileScreen, {ar:ar,setAr:setAr}),
  };

  return React.createElement("div",{
    style:{minHeight:"100vh",background:T.bg,direction:ar?"rtl":"ltr",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}
  },
    React.createElement(InjectCSS,null),
    React.createElement(Navbar,{ar:ar,setAr:setAr,tab:tab,setTab:setTab}),
    React.createElement("main",{style:{minHeight:"calc(100vh - 100px)"}},
      screens[tab]
    )
  );
}