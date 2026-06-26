import React, { useState, useEffect, useRef } from "react";

var HERO_VIDEO = "/hero.mp4";
var AVATARS = [
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgODAgODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiMwRjFDMzAiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjI2IiByPSIxMiIgc3Ryb2tlPSIjQzlBODRDIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMjAgNjJjMC0xMSA5LTE4IDIwLTE4czIwIDcgMjAgMTgiIHN0cm9rZT0iI0M5QTg0QyIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=",
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgODAgODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiMxQTBBMEEiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIyMiIgc3Ryb2tlPSIjRTYzOTQ2IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIzIiBmaWxsPSIjRTYzOTQ2Ii8+PHBhdGggZD0iTTQwIDE4djZNNDAgNTZ2Nk0xOCA0MGg2TTU2IDQwaDZNMjYgMjZsNCA0TTUwIDUwbDQgNE0yNiA1NGw0LTRNNTAgMzBsNC00IiBzdHJva2U9IiNFNjM5NDYiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=",
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgODAgODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiMwQTFBMEEiLz48cGF0aCBkPSJNNDAgMjAgTDU4IDMwIEw1OCA1MCBDNTggNjAgNTAgNjggNDAgNzIgQzMwIDY4IDIyIDYwIDIyIDUwIEwyMiAzMFoiIHN0cm9rZT0iIzJERDQ3QSIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTMyIDQ2bDYgNiAxMC0xMiIgc3Ryb2tlPSIjMkRENDdBIiBzdHJva2Utd2lkdGg9IjIuNSIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgODAgODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiMwQTBBMUEiLz48cGF0aCBkPSJNMjggNDQgTDQwIDIwIEw1MiA0NCBMNDAgMzZaIiBzdHJva2U9IiMzQjgyRjYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0icmdiYSg1OSwxMzAsMjQ2LDAuMikiLz48cmVjdCB4PSIyOCIgeT0iNDQiIHdpZHRoPSIyNCIgaGVpZ2h0PSIxNiIgcng9IjIiIHN0cm9rZT0iIzNCODJGNiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJyZ2JhKDU5LDEzMCwyNDYsMC4yKSIvPjxjaXJjbGUgY3g9IjM0IiBjeT0iNTIiIHI9IjIiIGZpbGw9IiMzQjgyRjYiLz48Y2lyY2xlIGN4PSI0NiIgY3k9IjUyIiByPSIyIiBmaWxsPSIjM0I4MkY2Ii8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgODAgODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiMxQTEwMDAiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIyMCIgc3Ryb2tlPSIjQzlBODRDIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjMiIGZpbGw9IiNDOUE4NEMiLz48cGF0aCBkPSJNNDAgMjJ2NE00MCA1NHY0TTIyIDQwaDRNNTQgNDBoNCIgc3Ryb2tlPSIjQzlBODRDIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTQwIDI0IEw0NSAzNiBMNDAgNDAgTDM1IDM2WiIgZmlsbD0iI0M5QTg0QyIgb3BhY2l0eT0iMC42Ii8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgODAgODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiMxMDBBMUEiLz48cGF0aCBkPSJNMzAgMjAgTDUwIDIwIEw1NiAzNiBMNDAgNDggTDI0IDM2WiIgc3Ryb2tlPSIjQTc4QkZBIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9InJnYmEoMTY3LDEzOSwyNTAsMC4xNSkiLz48cGF0aCBkPSJNMzYgMjhoOE0zNCAzNGgxMk0zOCA0MGg0IiBzdHJva2U9IiNBNzhCRkEiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=",
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgODAgODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiMwQTFBMUEiLz48cGF0aCBkPSJNNDAgMTggTDQ2IDMzIEw2MiAzNCBMNTAgNDUgTDU0IDYxIEw0MCA1MiBMMjYgNjEgTDMwIDQ1IEwxOCAzNCBMMzQgMzNaIiBzdHJva2U9IiMyREQ0QkYiIHN0cm9rZS13aWR0aD0iMS41IiBmaWxsPSJyZ2JhKDQ1LDIxMiwxOTEsMC4xMikiLz48L3N2Zz4=",
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgODAgODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiMxODEwMTAiLz48cGF0aCBkPSJNMjYgNTIgTDI2IDM2IEwzMiA0MiBMNDAgMjIgTDQ4IDQyIEw1NCAzNiBMNTQgNTJaIiBzdHJva2U9IiNGNTlFMEIiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0icmdiYSgyNDUsMTU4LDExLDAuMTUpIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHJlY3QgeD0iMjYiIHk9IjUyIiB3aWR0aD0iMjgiIGhlaWdodD0iOCIgcng9IjIiIHN0cm9rZT0iI0Y1OUUwQiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJyZ2JhKDI0NSwxNTgsMTEsMC4xNSkiLz48L3N2Zz4=",
];

function InjectCSS() {
  useEffect(function() {
    var el = document.createElement("style");
    el.id = "asc-css";
    el.textContent = [
      "@keyframes fadeUp{0%{opacity:0;transform:translateY(22px)}100%{opacity:1;transform:translateY(0)}}",
      "@keyframes fadeIn{0%{opacity:0}100%{opacity:1}}",
      "@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}",
      "@keyframes pulseGold{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(201,168,76,.5)}70%{opacity:.9;box-shadow:0 0 0 10px rgba(201,168,76,0)}}",
      "@keyframes pulseRed{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.5)}70%{box-shadow:0 0 0 10px rgba(239,68,68,0)}}",
      "@keyframes glowIn{0%{opacity:0;filter:blur(8px)}100%{opacity:1;filter:blur(0)}}",
      ".sc-reveal{opacity:0;transform:translateY(20px);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1)}",
      ".sc-reveal.in{opacity:1;transform:translateY(0)}",
      "*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}","video{display:block;-webkit-transform:translateZ(0);transform:translateZ(0)}",
      "body{margin:0;background:#040810;overscroll-behavior-y:none;-webkit-font-smoothing:antialiased}",
      "select,input{outline:none;font-family:inherit}",
      "select{-webkit-appearance:none;appearance:none}",
      "button{font-family:inherit}",
      "::-webkit-scrollbar{width:4px}",
      "::-webkit-scrollbar-track{background:transparent}",
      "::-webkit-scrollbar-thumb{background:#1A2E44;border-radius:2px}",
      ".btn-gold{background:linear-gradient(135deg,#D4A843,#B8902E);color:#040810;font-weight:800;border:none;cursor:pointer;transition:all .22s cubic-bezier(.16,1,.3,1)}",
      ".btn-gold:hover{background:linear-gradient(135deg,#E8C068,#D4A843);transform:translateY(-2px);box-shadow:0 8px 28px rgba(201,168,76,.4)}",
      ".btn-glass{background:rgba(255,255,255,.04);color:#C9D5E0;border:1px solid rgba(255,255,255,.1);cursor:pointer;transition:all .22s ease}",
      ".btn-glass:hover{background:rgba(255,255,255,.08);border-color:rgba(201,168,76,.3);color:#F0F4F8}",
      ".card-lift{transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease}",
      ".card-lift:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,.5);border-color:rgba(201,168,76,.25)!important}",
      ".fault-card{border-left:3px solid transparent;transition:all .2s ease}",
      ".fault-high{border-left-color:#EF4444!important}",
      ".fault-medium{border-left-color:#F59E0B!important}",
      ".fault-low{border-left-color:#22C55E!important}",
      ".video-hero{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;animation:kenburns 12s ease-in-out infinite alternate}",
      ".tech-grid{background-image:radial-gradient(circle,rgba(201,168,76,.06) 1px,transparent 1px);background-size:32px 32px}"
    ].join("");
    if(!document.getElementById("asc-css"))document.head.appendChild(el);
    return function(){var e=document.getElementById("asc-css");if(e)e.remove();};
  },[]);
  return null;
}

function useReveal(d){
  var _r=useState(false);var ref=useRef(null);
  var vis=_r[0];var setVis=_r[1];
  useEffect(function(){
    var el=ref.current;if(!el)return;
    var obs=new IntersectionObserver(function(en){
      if(en[0].isIntersecting){setTimeout(function(){setVis(true);},d||0);obs.disconnect();}
    },{threshold:.1});
    obs.observe(el);
    return function(){obs.disconnect();};
  },[]);
  return [ref,vis];
}
function SR(props){
  var _r=useReveal(props.d||0);var ref=_r[0];var vis=_r[1];
  return React.createElement("div",{ref:ref,className:"sc-reveal"+(vis?" in":""),style:props.s||{}},props.children);
}

var T={
  bg0:"#040810",
  bg1:"#070E1C",
  bg2:"#0B1524",
  bg3:"#0F1C30",
  bg4:"#142238",
  bd:"#162338",
  bd2:"#1E3050",
  gold:"#C9A84C",
  goldL:"#E8C068",
  goldD:"#A88A34",
  goldGlow:"rgba(201,168,76,.12)",
  red:"#EF4444",
  redGlow:"rgba(239,68,68,.12)",
  amber:"#F59E0B",
  amberGlow:"rgba(245,158,11,.1)",
  green:"#22C55E",
  greenGlow:"rgba(34,197,94,.1)",
  blue:"#3B82F6",
  t0:"#F0F4F8",
  t1:"#C9D5E0",
  t2:"#7A94AA",
  t3:"#3D5468",
};

var SC=function(s){return s==="high"?T.red:s==="medium"?T.amber:T.green;};
var SBG=function(s){return s==="high"?T.redGlow:s==="medium"?T.amberGlow:T.greenGlow;};
var SBD=function(s){return s==="high"?"rgba(239,68,68,.25)":s==="medium"?"rgba(245,158,11,.2)":"rgba(34,197,94,.2)";};
var SL=function(s,ar){
  if(ar)return s==="high"?"حرج":s==="medium"?"متوسط":"منخفض";
  return s==="high"?"Critical":s==="medium"?"Moderate":"Minor";
};

var MAKES=["Toyota","Nissan","Ford","Lexus","GMC","Chevrolet","Hyundai","Kia","BMW","Mercedes-Benz","Land Rover","Mitsubishi","Honda","Mazda","Jeep"];
var MODELS={Toyota:["Land Cruiser","Camry","Corolla","Hilux","Prado","RAV4","Fortuner"],Nissan:["Patrol","Altima","Sunny","Pathfinder","X-Trail","Navara"],Ford:["F-150","Explorer","Edge","Expedition","Ranger"],Lexus:["LX 600","GX 460","ES 350","RX 350"],GMC:["Yukon","Tahoe","Sierra","Terrain"],Chevrolet:["Tahoe","Silverado","Traverse","Equinox"],Hyundai:["Tucson","Santa Fe","Elantra","Sonata"],Kia:["Sportage","Sorento","Telluride","Carnival"],BMW:["X5","X7","5 Series","7 Series"],"Mercedes-Benz":["GLE","S-Class","E-Class","GLS"],"Land Rover":["Defender","Discovery","Range Rover","Freelander"],Mitsubishi:["Pajero","Eclipse Cross","Outlander"],Honda:["Accord","Civic","CR-V","Pilot"],Mazda:["CX-5","CX-9","Mazda3","Mazda6"],Jeep:["Wrangler","Grand Cherokee","Cherokee","Compass"]};
var YEARS=Array.from({length:35},function(_,i){return 2024-i;});
var ZONES={engine_bay:{type:"rect",x:72,y:88,w:96,h:52},front_left_wheel:{type:"circle",cx:52,cy:158,r:20},front_right_wheel:{type:"circle",cx:188,cy:158,r:20},rear_left_wheel:{type:"circle",cx:52,cy:214,r:20},rear_right_wheel:{type:"circle",cx:188,cy:214,r:20},underbody_front:{type:"rect",x:82,y:150,w:76,h:24},underbody_rear:{type:"rect",x:82,y:196,w:76,h:24},cabin_dashboard:{type:"rect",x:76,y:88,w:88,h:62},battery_electrical:{type:"rect",x:156,y:92,w:28,h:28},fuel_system:{type:"rect",x:100,y:196,w:40,h:24}};

function Badge(props){
  var s=props.sev;var ar=props.ar;
  return React.createElement("span",{style:{background:SBG(s),color:SC(s),border:"1px solid "+SBD(s),fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:4,textTransform:"uppercase",letterSpacing:"0.07em",whiteSpace:"nowrap",fontFamily:"monospace"}},SL(s,ar));
}
function GoldLine(){return React.createElement("div",{style:{height:1,background:"linear-gradient(90deg,transparent,rgba(201,168,76,.4),transparent)"}});}
function Label(props){return React.createElement("div",{style:{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:props.gold?T.gold:T.t3,marginBottom:props.mb||8}},props.children);}

function TIcon(props){
  var id=props.id;var on=props.on;
  var c=on?T.gold:"rgba(255,255,255,.3)";
  var s={width:20,height:20,display:"block",flexShrink:0};
  if(id==="home")return React.createElement("svg",{viewBox:"0 0 24 24",fill:"none",style:s},React.createElement("path",{d:"M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z",stroke:c,strokeWidth:"1.8",strokeLinejoin:"round"}),React.createElement("path",{d:"M9 21V12h6v9",stroke:c,strokeWidth:"1.8",strokeLinejoin:"round"}));
  if(id==="scan")return React.createElement("svg",{viewBox:"0 0 24 24",fill:"none",style:s},React.createElement("circle",{cx:"12",cy:"12",r:"3",stroke:c,strokeWidth:"1.8"}),React.createElement("path",{d:"M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3",stroke:c,strokeWidth:"1.8",strokeLinecap:"round"}));
  if(id==="report")return React.createElement("svg",{viewBox:"0 0 24 24",fill:"none",style:s},React.createElement("rect",{x:"4",y:"3",width:"16",height:"18",rx:"2",stroke:c,strokeWidth:"1.8"}),React.createElement("path",{d:"M8 8h8M8 12h8M8 16h5",stroke:c,strokeWidth:"1.8",strokeLinecap:"round"}));
  if(id==="garages")return React.createElement("svg",{viewBox:"0 0 24 24",fill:"none",style:s},React.createElement("path",{d:"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",stroke:c,strokeWidth:"1.8"}),React.createElement("circle",{cx:"12",cy:"9",r:"2.5",stroke:c,strokeWidth:"1.8"}));
  if(id==="profile")return React.createElement("svg",{viewBox:"0 0 24 24",fill:"none",style:s},React.createElement("circle",{cx:"12",cy:"8",r:"4",stroke:c,strokeWidth:"1.8"}),React.createElement("path",{d:"M4 20c0-4 3.58-7 8-7s8 3 8 7",stroke:c,strokeWidth:"1.8",strokeLinecap:"round"}));
  return null;
}

function Navbar(props){
  var tab=props.tab;var setTab=props.setTab;var ar=props.ar;var setAr=props.setAr;
  var TABS=[{id:"home",en:"Home",ar:"الرئيسية"},{id:"scan",en:"Scan",ar:"مسح"},{id:"report",en:"Report",ar:"التقرير"},{id:"garages",en:"Garages",ar:"المراكز"},{id:"profile",en:"Profile",ar:"الملف"}];
  return React.createElement("header",{style:{background:"rgba(4,8,16,.9)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",position:"sticky",top:0,zIndex:300,borderBottom:"1px solid rgba(201,168,76,.1)"}},
    React.createElement("div",{style:{maxWidth:1080,margin:"0 auto",padding:"0 24px"}},
      React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0 0"}},
        React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10}},
          React.createElement("svg",{width:28,height:28,viewBox:"0 0 24 24",fill:"none"},
            React.createElement("path",{d:"M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z",stroke:T.gold,strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})
          ),
          React.createElement("div",null,
            React.createElement("div",{style:{color:T.t0,fontSize:15,fontWeight:800,letterSpacing:"-0.3px",lineHeight:1}},"AutoScan"),
            React.createElement("div",{style:{color:T.gold,fontSize:10,fontWeight:700,letterSpacing:"0.18em",lineHeight:1,marginTop:2}},"AI DIAGNOSTICS")
          )
        ),
        React.createElement("div",{style:{display:"flex",background:"rgba(255,255,255,.04)",borderRadius:24,padding:3,gap:2,border:"1px solid rgba(255,255,255,.07)"}},
          [{l:"EN",v:false},{l:"ع",v:true}].map(function(opt){
            var act=ar===opt.v;
            return React.createElement("button",{key:opt.l,onClick:function(){setAr(opt.v);},style:{padding:"5px 14px",borderRadius:20,border:"none",cursor:"pointer",background:act?"linear-gradient(135deg,#D4A843,#B8902E)":"transparent",color:act?"#040810":T.t2,fontSize:11,fontWeight:700,transition:"all .2s",letterSpacing:"0.03em"}},opt.l);
          })
        )
      ),
      React.createElement("nav",{style:{display:"flex",marginTop:12,borderTop:"1px solid rgba(255,255,255,.05)"}},
        TABS.map(function(t){
          var on=tab===t.id;
          return React.createElement("button",{key:t.id,onClick:function(){setTab(t.id);},style:{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"8px 4px 10px",position:"relative",WebkitTapHighlightColor:"transparent",minWidth:0}},
            React.createElement("div",{style:{width:34,height:34,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:on?"rgba(201,168,76,.1)":"transparent",border:on?"1px solid rgba(201,168,76,.2)":"1px solid transparent",transition:"all .2s"}},React.createElement(TIcon,{id:t.id,on:on})),
            React.createElement("span",{style:{fontSize:9,fontWeight:on?700:500,color:on?T.gold:T.t3,letterSpacing:"0.04em",textTransform:"uppercase",transition:"color .2s",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"100%"}},ar?t.ar:t.en),
            on&&React.createElement("div",{style:{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:20,height:2,background:T.gold,borderRadius:"2px 2px 0 0"}})
          );
        })
      )
    )
  );
}

function HomeScreen(props){
  var setTab=props.setTab;var ar=props.ar;var faults=props.faults;
  var high=faults.filter(function(f){return f.severity==="high";}).length;
  var med=faults.filter(function(f){return f.severity==="medium";}).length;
  var low=faults.filter(function(f){return f.severity==="low";}).length;
  var hasData=faults.length>0;
  var FEATS=[
    {icon:"??",en:"100% Document Coverage",ar:"تغطية كاملة للوثيقة",sub:"Every mark, code, and note extracted from your inspection sheet",subAr:"كل علامة وكود وملاحظة من ورقة الفحص"},
    {icon:"??",en:"AI-Powered Analysis",ar:"تحليل بالذكاء الاصطناعي",sub:"Claude AI diagnoses every fault with repair steps and cost estimates",subAr:"ذكاء اصطناعي يشخص كل عطل مع خطوات الإصلاح والتكلفة"},
    {icon:"??",en:"Visual Fault Mapping",ar:"خريطة الأعطال المرئية",sub:"See each fault pinpointed on an interactive vehicle schematic",subAr:"شاهد كل عطل على مخطط السيارة"},
    {icon:"??",en:"Verified Garage Network",ar:"شبكة ورش معتمدة",sub:"Find trusted service centers in Qatar and across the GCC",subAr:"اعثر على مراكز خدمة موثوقة"},
  ];
  return React.createElement("div",{style:{background:T.bg0}},
    // Hero
    React.createElement("section",{style:{position:"relative",minHeight:"calc(100vh - 98px)",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}},
      React.createElement("video",{src:HERO_VIDEO,autoPlay:true,loop:true,muted:true,playsInline:true,disablePictureInPicture:true,preload:"auto",style:{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transform:"translateZ(0)",backfaceVisibility:"hidden",WebkitBackfaceVisibility:"hidden"}}),
      React.createElement("div",{style:{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(4,8,16,.25) 0%,rgba(4,8,16,.55) 40%,rgba(4,8,16,.92) 80%,rgba(4,8,16,1) 100%)"}}),
      React.createElement("div",{style:{position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 60% at 50% 40%,rgba(201,168,76,.04) 0%,transparent 70%)"}}),
      React.createElement("div",{style:{position:"relative",zIndex:2,maxWidth:720,margin:"0 auto",padding:"0 24px",textAlign:"center"}},
        React.createElement("div",{style:{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.25)",borderRadius:4,padding:"6px 16px",marginBottom:28,animation:"fadeIn 1s ease"}},
          React.createElement("div",{style:{width:6,height:6,borderRadius:"50%",background:T.gold,animation:"pulseGold 2s infinite"}}),
          React.createElement("span",{style:{color:T.gold,fontSize:11,fontWeight:700,letterSpacing:"0.12em"}},"AI-POWERED AUTOMOTIVE DIAGNOSTICS")
        ),
        React.createElement("h1",{style:{color:T.t0,fontSize:"clamp(32px,6vw,64px)",fontWeight:900,lineHeight:1.05,letterSpacing:"-2px",margin:"0 0 8px",animation:"fadeUp .7s .1s ease both"}},ar?"تشخيص سيارتك":"Know Your Car."),
        React.createElement("h1",{style:{color:T.gold,fontSize:"clamp(32px,6vw,64px)",fontWeight:900,lineHeight:1.05,letterSpacing:"-2px",margin:"0 0 24px",animation:"fadeUp .7s .2s ease both"}},ar?"في ثواني":"Fix It Right."),
        React.createElement("p",{style:{color:T.t2,fontSize:"clamp(14px,2vw,17px)",lineHeight:1.75,maxWidth:540,margin:"0 auto 36px",animation:"fadeUp .7s .3s ease both"}},ar?"ارفع صورة ورقة فحص سيارتك واحصل على تشخيص شامل بالذكاء الاصطناعي مع تكاليف الإصلاح":"Upload your vehicle inspection sheet. Get a complete AI diagnosis with repair costs, severity ratings, and expert recommendations — in seconds."),
        React.createElement("div",{style:{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",animation:"fadeUp .7s .4s ease both"}},
          React.createElement("button",{onClick:function(){setTab("scan");},className:"btn-gold",style:{borderRadius:6,padding:"14px 32px",fontSize:14,fontWeight:800,letterSpacing:"0.03em",display:"flex",alignItems:"center",gap:10}},
            React.createElement("svg",{width:16,height:16,viewBox:"0 0 24 24",fill:"none"},React.createElement("circle",{cx:"12",cy:"12",r:"3",stroke:"currentColor",strokeWidth:"2.5"}),React.createElement("path",{d:"M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})),
            ar?"ابدأ التشخيص":"Start Diagnosis"
          ),
          hasData&&React.createElement("button",{onClick:function(){setTab("report");},className:"btn-glass",style:{borderRadius:6,padding:"14px 28px",fontSize:14,fontWeight:600}},ar?"عرض التقرير":"View Last Report")
        )
      ),
      // Scroll hint
      React.createElement("div",{style:{position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:6,animation:"fadeIn 1s 1.5s ease both",opacity:0,animationFillMode:"both"}},
        React.createElement("span",{style:{fontSize:10,color:T.t3,letterSpacing:"0.1em"}},"SCROLL"),
        React.createElement("svg",{width:16,height:16,viewBox:"0 0 24 24",fill:"none"},React.createElement("path",{d:"M12 5v14M5 12l7 7 7-7",stroke:T.t3,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}))
      )
    ),
    // Stats bar
    React.createElement(GoldLine,null),
    React.createElement("div",{style:{background:T.bg1,padding:"18px 24px",borderBottom:"1px solid "+T.bd}},
      React.createElement("div",{style:{maxWidth:1080,margin:"0 auto",display:"flex",justifyContent:"center",gap:"clamp(24px,6vw,80px)",flexWrap:"wrap"}},
        [{n:"100%",l:ar?"دقة القراءة":"OCR Accuracy"},{n:"4000",l:ar?"حد الرموز":"Token Limit"},{n:"10",l:ar?"مناطق الفحص":"Zones Mapped"},{n:"2",l:ar?"لغتان":"Languages"}].map(function(s){
          return React.createElement("div",{key:s.n,style:{textAlign:"center"}},
            React.createElement("div",{style:{fontSize:"clamp(20px,4vw,32px)",fontWeight:900,color:T.gold,letterSpacing:"-0.5px",lineHeight:1}},s.n),
            React.createElement("div",{style:{fontSize:11,color:T.t3,marginTop:4,letterSpacing:"0.06em",fontWeight:600}},s.l)
          );
        })
      )
    ),
    GoldLine,
    // Last report summary
    hasData&&React.createElement("div",{style:{maxWidth:1080,margin:"0 auto",padding:"32px 24px 0"}},
      React.createElement(SR,{d:0,s:{}},
        React.createElement(Label,{gold:false},(ar?"آخر تقرير":"LAST REPORT")),
        React.createElement("div",{style:{background:T.bg2,borderRadius:8,border:"1px solid "+T.bd,padding:20,display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}},
          [{n:high,l:ar?"حرج":"CRITICAL",c:T.red,bg:T.redGlow,bd:"rgba(239,68,68,.25)"},{n:med,l:ar?"متوسط":"MODERATE",c:T.amber,bg:T.amberGlow,bd:"rgba(245,158,11,.2)"},{n:low,l:ar?"منخفض":"MINOR",c:T.green,bg:T.greenGlow,bd:"rgba(34,197,94,.2)"}].map(function(item){
            return React.createElement("div",{key:item.l,style:{flex:"1 1 80px",background:item.bg,borderRadius:6,padding:"12px 8px",textAlign:"center",border:"1px solid "+item.bd}},
              React.createElement("div",{style:{fontSize:28,fontWeight:900,color:item.c,fontFamily:"monospace",lineHeight:1}},item.n),
              React.createElement("div",{style:{fontSize:9,color:item.c,fontWeight:700,letterSpacing:"0.1em",marginTop:4}},item.l)
            );
          }),
          React.createElement("button",{onClick:function(){setTab("report");},className:"btn-gold",style:{borderRadius:6,padding:"12px 24px",fontSize:13,fontWeight:700,marginLeft:"auto"}},ar?"عرض التقرير":"View Report")
        )
      )
    ),
    // Features section
    React.createElement("div",{style:{maxWidth:1080,margin:"0 auto",padding:"48px 24px 64px"}},
      React.createElement(SR,{d:0},
        React.createElement(Label,{gold:true},ar?"المميزات":"CAPABILITIES")
      ),
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:2,background:T.bd,borderRadius:8,overflow:"hidden",border:"1px solid "+T.bd}},
        FEATS.map(function(f,i){
          return React.createElement(SR,{key:f.en,d:i*80,s:{background:T.bg2,padding:28,transition:"background .2s"},className:"card-lift"},
            React.createElement("div",{style:{fontSize:32,marginBottom:16}},f.icon),
            React.createElement("div",{style:{fontSize:14,fontWeight:700,color:T.t0,marginBottom:8,letterSpacing:"-0.2px"}},ar?f.ar:f.en),
            React.createElement("div",{style:{fontSize:12,color:T.t2,lineHeight:1.65}},ar?f.subAr:f.sub)
          );
        })
      )
    )
  );
}

function ScanScreen(props){
  var setTab=props.setTab;var ar=props.ar;var setFaults=props.setFaults;
  var _st=useState("vehicle");var step=_st[0];var setStep=_st[1];
  var _mk=useState("Toyota");var make=_mk[0];var setMake=_mk[1];
  var _md=useState("Land Cruiser");var model=_md[0];var setModel=_md[1];
  var _yr=useState(2006);var year=_yr[0];var setYear=_yr[1];
  var _pr=useState(0);var prog=_pr[0];var setProg=_pr[1];
  var _ss=useState(0);var sStage=_ss[0];var setSStage=_ss[1];
  var _pu=useState(null);var prevUrl=_pu[0];var setPrevUrl=_pu[1];
  var _em=useState(null);var errMsg=_em[0];var setErrMsg=_em[1];
  var galRef=useRef(null);var vidRef=useRef(null);var streamRef=useRef(null);
  var STAGES=[ar?"استخراج النص عبر OCR...":"Extracting text via OCR...",ar?"تشغيل محرك التشخيص...":"Running AI engine...",ar?"تحديد مواقع الأعطال...":"Mapping fault locations..."];
  function startCam(){
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){setErrMsg(ar?"الكاميرا غير مدعومة":"Camera not supported");return;}
    navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false}).then(function(s){streamRef.current=s;if(vidRef.current){vidRef.current.srcObject=s;vidRef.current.play();}}).catch(function(){setErrMsg(ar?"تعذّر الوصول للكاميرا":"Camera access denied");});
  }
  function stopCam(){if(streamRef.current){streamRef.current.getTracks().forEach(function(t){t.stop();});streamRef.current=null;}}
  useEffect(function(){if(step==="camera")startCam();return stopCam;},[step]);
  function capPhoto(){
    var v=vidRef.current;if(!v)return;
    var c=document.createElement("canvas");c.width=v.videoWidth||640;c.height=v.videoHeight||480;
    c.getContext("2d").drawImage(v,0,0);
    c.toBlob(function(b){setPrevUrl(URL.createObjectURL(b));stopCam();runAI(b);},"image/jpeg",0.92);
  }
  function handleFile(e){
    var f=e.target.files[0];if(!f)return;
    if(f.size>25*1024*1024){fail(ar?"الحد الأقصى 25MB":"Max file size is 25MB");return;}
    e.target.value="";
    setPrevUrl(URL.createObjectURL(f));
    runAI(f);
  }
  function fail(msg){setErrMsg(msg);setStep("error");}
  function runAI(imgFile){
    setStep("processing");setProg(0);setSStage(0);setErrMsg(null);
    var p=0;
    var tick=setInterval(function(){p+=1;if(p>=90)clearInterval(tick);setProg(p);if(p===28)setSStage(1);if(p===62)setSStage(2);},(80));
    var reader=new FileReader();
    reader.onerror=function(){clearInterval(tick);fail(ar?"تعذّر قراءة الصورة":"Could not read image file");};
    reader.onload=function(){
      var b64=reader.result.split(",")[1];var mt=imgFile.type||"image/jpeg";
      var prompt=""
        +"CRITICAL TASK: Analyze this vehicle inspection sheet completely. "
        +"Read EVERY fault, check mark, X mark, circled item, DTC code, and handwritten note. "
        +"List EACH fault as a SEPARATE object. Do NOT combine or skip any fault. "
        +"Return ONLY a raw JSON array starting with [ and ending with ]. No other text. "
        +"Vehicle: "+make+" "+model+" "+year+". "
        +"Each object MUST have: id(string), severity(high/medium/low), "
        +"zone(engine_bay/front_left_wheel/front_right_wheel/rear_left_wheel/rear_right_wheel/underbody_front/underbody_rear/cabin_dashboard/battery_electrical/fuel_system), "
        +"code(DTC string or null), nameEn(English fault name), nameAr(Arabic translation), "
        +"fn(what component does in English), fnAr(Arabic translation of fn), "
        +"immediate(English: immediate risk), immediateAr(Arabic translation), "
        +"longterm(English: long-term consequence), longtermAr(Arabic translation), "
        +"steps(array of English repair steps), stepsAr(array of Arabic repair steps), "
        +"cost(repair cost range like $150-$400). "
        +"Severity: high=safety critical do not drive, medium=repair within 2-4 weeks, low=minor cosmetic. "
        +"Return ALL faults found. If none, return [].";
      var body=JSON.stringify({model:"claude-sonnet-4-6",max_tokens:4000,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:mt,data:b64}},{type:"text",text:prompt}]}]});
      fetch("/api/diagnose",{method:"POST",headers:{"Content-Type":"application/json"},body:body})
        .then(function(res){
          clearInterval(tick);setProg(100);
          if(res.status===404){fail("API proxy missing. See setup guide Phase 6 Step 3.");return null;}
          if(!res.ok){fail("Server error "+res.status);return null;}
          return res.json();
        })
        .then(function(data){
          if(!data)return;
          if(data.error){fail((data.error.message||"API Error").indexOf("credit")>-1?"Add billing credit at console.anthropic.com":"API error: "+(data.error.message||""));return;}
          var raw=(data.content&&data.content[0]&&data.content[0].text)||"";
          if(!raw){fail(ar?"استجابة فارغة":"Empty response");return;}
          var faults=[];
          try{
            var clean=raw.replace(/```json/gi,"").replace(/```/g,"").trim();
            if(clean[0]==="{"){var obj=JSON.parse(clean);clean=JSON.stringify(obj.faults||obj.results||obj.data||[]);}
            if(clean[0]!=="["){var m=clean.match(/\[[\s\S]*\]/);clean=m?m[0]:"[]";}
            var parsed=JSON.parse(clean);
            faults=Array.isArray(parsed)?parsed:[];
            if(faults.length===0&&parsed&&typeof parsed==="object")Object.keys(parsed).forEach(function(k){if(Array.isArray(parsed[k])&&parsed[k].length>0)faults=parsed[k];});
          }catch(e){
            try{var ms=raw.match(/\{[^{}]*"severity"[^{}]*\}/g);if(ms&&ms.length>0)faults=ms.map(function(s){try{return JSON.parse(s);}catch(e2){return null;}}).filter(Boolean);
            else{fail(ar?"تنسيق غير متوقع":"Unexpected format. Please try again.");return;}}
            catch(e3){fail("Parse error: "+e.message);return;}
          }
          var ord={high:0,medium:1,low:2};
          faults.sort(function(a,b){return(ord[a.severity]||3)-(ord[b.severity]||3);});
          setFaults(faults);
          setTimeout(function(){setStep("done");},300);
        })
        .catch(function(err){clearInterval(tick);fail(ar?"خطأ في الشبكة":"Network error: "+err.message);});
    };
    reader.readAsDataURL(imgFile);
  }
  var WRP={minHeight:"calc(100vh - 98px)",background:T.bg0,padding:"24px 24px 60px",maxWidth:640,margin:"0 auto"};
  if(step==="error")return React.createElement("div",{style:WRP},
    prevUrl&&React.createElement("img",{src:prevUrl,alt:"scan",style:{width:"100%",maxHeight:150,objectFit:"cover",borderRadius:6,marginBottom:16,opacity:.5,border:"1px solid "+T.bd}}),
    React.createElement("div",{style:{background:T.bg2,borderRadius:8,border:"1px solid rgba(239,68,68,.3)",padding:24}},
      React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:14}},
        React.createElement("div",{style:{width:32,height:32,borderRadius:6,background:T.redGlow,border:"1px solid rgba(239,68,68,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}},"❌"),
        React.createElement("div",{style:{fontSize:15,fontWeight:700,color:T.red}},ar?"فشل التحليل":"Analysis Failed")
      ),
      React.createElement("div",{style:{background:T.bg3,borderRadius:6,padding:12,marginBottom:14,fontSize:13,color:T.t2,lineHeight:1.6,fontFamily:"monospace"}},errMsg||"Unknown error"),
      [ar?"تأكد من وجود api/diagnose.js في GitHub":"1. Ensure api/diagnose.js exists in GitHub repo",
       ar?"تحقق من ANTHROPIC_API_KEY في Vercel":"2. Verify ANTHROPIC_API_KEY in Vercel env vars",
       ar?"تأكد من وجود رصيد في console.anthropic.com":"3. Check billing credit at console.anthropic.com",
       ar?"أعد النشر في Vercel بعد أي تغيير":"4. Redeploy on Vercel after any changes"]
      .map(function(t,i){return React.createElement("div",{key:i,style:{fontSize:12,color:T.t2,padding:"6px 0",borderTop:i>0?"1px solid "+T.bd:"none"}},t);}),
      React.createElement("div",{style:{display:"flex",gap:10,marginTop:16}},
        React.createElement("button",{onClick:function(){setErrMsg(null);setStep("choose");},className:"btn-gold",style:{flex:1,borderRadius:6,padding:12,fontSize:14,fontWeight:700}},ar?"حاول مجدداً":"Try Again"),
        React.createElement("button",{onClick:function(){setErrMsg(null);setStep("vehicle");},className:"btn-glass",style:{flex:1,borderRadius:6,padding:12,fontSize:14}},ar?"بداية جديدة":"New Scan")
      )
    )
  );
  if(step==="done")return React.createElement("div",{style:Object.assign({},WRP,{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,textAlign:"center"})},
    prevUrl&&React.createElement("img",{src:prevUrl,alt:"scan",style:{width:"100%",maxHeight:220,objectFit:"cover",borderRadius:8,boxShadow:"0 12px 48px rgba(0,0,0,.6)",marginBottom:4}}),
    React.createElement("div",{style:{width:64,height:64,borderRadius:8,background:T.greenGlow,border:"1px solid rgba(34,197,94,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,animation:"fadeIn .4s ease"}},"✓"),
    React.createElement("div",null,React.createElement("div",{style:{fontSize:20,fontWeight:800,color:T.t0,marginBottom:6}},ar?"اكتمل التحليل":"Analysis Complete"),React.createElement("div",{style:{fontSize:13,color:T.t2}},ar?"تم تحليل ورقة الفحص":"Inspection sheet analyzed successfully")),
    React.createElement("div",{style:{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}},
      React.createElement("button",{onClick:function(){setTab("report");setStep("vehicle");},className:"btn-gold",style:{borderRadius:6,padding:"13px 32px",fontSize:14,fontWeight:800}},ar?"عرض التقرير":"View Report"),
      React.createElement("button",{onClick:function(){setStep("vehicle");setPrevUrl(null);},className:"btn-glass",style:{borderRadius:6,padding:"13px 24px",fontSize:14}},ar?"مسح جديد":"New Scan")
    )
  );
  if(step==="processing")return React.createElement("div",{style:Object.assign({},WRP,{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24})},
    prevUrl&&React.createElement("img",{src:prevUrl,alt:"scan",style:{width:"100%",maxHeight:180,objectFit:"cover",borderRadius:8,opacity:.7,border:"1px solid "+T.bd}}),
    React.createElement("div",{style:{position:"relative",width:100,height:100}},
      React.createElement("svg",{width:100,height:100,viewBox:"0 0 100 100"},
        React.createElement("circle",{cx:50,cy:50,r:44,fill:"none",stroke:T.bg3,strokeWidth:6}),
        React.createElement("circle",{cx:50,cy:50,r:44,fill:"none",stroke:T.gold,strokeWidth:6,strokeDasharray:(2*Math.PI*44*prog/100)+" 999",strokeLinecap:"round",transform:"rotate(-90 50 50)",style:{transition:"stroke-dasharray .1s"}})),
      React.createElement("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:16,fontWeight:900,color:T.gold,fontFamily:"monospace"}},prog+"%")
    ),
    React.createElement("div",{style:{textAlign:"center"}},
      React.createElement("div",{style:{fontSize:15,fontWeight:700,color:T.t0,marginBottom:6}},ar?"جارٍ التحليل...":"Analyzing..."),
      React.createElement("div",{style:{fontSize:12,color:T.gold,fontWeight:600,fontFamily:"monospace"}},STAGES[sStage])
    ),
    React.createElement("div",{style:{width:"100%",maxWidth:320}},
      STAGES.map(function(s,i){var past=i<sStage;var cur=i===sStage;
        return React.createElement("div",{key:i,style:{display:"flex",alignItems:"center",gap:10,padding:"6px 0",opacity:i>sStage?.3:1,borderBottom:"1px solid "+T.bd}},
          React.createElement("div",{style:{width:20,height:20,borderRadius:4,background:past?T.green:cur?T.gold:T.bg3,color:"#040810",fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"monospace"}},past?"✓":(i+1)),
          React.createElement("span",{style:{fontSize:12,color:cur?T.t0:T.t2,fontFamily:"monospace"}},s)
        );
      })
    )
  );
  // Step indicator helper
  function StepDot(props){var active=props.a;var done=props.d;var n=props.n;
    return React.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:1}},
      React.createElement("div",{style:{width:28,height:28,borderRadius:4,background:done?T.green:active?T.gold:T.bg3,color:"#040810",fontSize:12,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid "+(done?"rgba(34,197,94,.5)":active?"rgba(201,168,76,.5)":T.bd),fontFamily:"monospace"}},done?"✓":n),
      React.createElement("div",{style:{fontSize:9,letterSpacing:"0.06em",color:active?T.gold:T.t3}},props.label)
    );
  }
  var isV=step==="vehicle";var isC=step==="choose"||step==="camera";
  return React.createElement("div",{style:Object.assign({},WRP,{paddingTop:32})},
    React.createElement("div",{style:{display:"flex",alignItems:"center",gap:0,marginBottom:32}},
      React.createElement(StepDot,{n:1,a:isV,d:!isV,label:ar?"المركبة":"VEHICLE"}),
      React.createElement("div",{style:{flex:1,height:1,background:!isV?T.gold:T.bd,transition:"background .3s",margin:"0 4px",marginBottom:20}}),
      React.createElement(StepDot,{n:2,a:isC,d:false,label:ar?"المصدر":"SOURCE"}),
      React.createElement("div",{style:{flex:1,height:1,background:T.bd,margin:"0 4px",marginBottom:20}}),
      React.createElement(StepDot,{n:3,a:false,d:false,label:ar?"التحليل":"ANALYSIS"})
    ),
    step==="vehicle"&&React.createElement("div",null,
      React.createElement("div",{style:{fontSize:22,fontWeight:800,color:T.t0,marginBottom:4,letterSpacing:"-0.5px"}},ar?"اختر مركبتك":"Select Your Vehicle"),
      React.createElement("div",{style:{fontSize:13,color:T.t2,marginBottom:24}},ar?"حدد المركبة لتحسين دقة التشخيص":"Specify your vehicle for more accurate diagnosis"),
      [{label:ar?"الصانع":"MAKE",val:make,opts:MAKES,set:function(v){setMake(v);setModel((MODELS[v]||[])[0]||"");}},{label:ar?"الموديل":"MODEL",val:model,opts:MODELS[make]||[],set:function(v){setModel(v);}},{label:ar?"السنة":"YEAR",val:year,opts:YEARS,set:function(v){setYear(Number(v));}}].map(function(f){
        return React.createElement("div",{key:f.label,style:{marginBottom:14}},
          React.createElement(Label,null,f.label),
          React.createElement("div",{style:{position:"relative"}},
            React.createElement("select",{value:f.val,onChange:function(e){f.set(e.target.value);},style:{width:"100%",padding:"12px 40px 12px 14px",borderRadius:6,border:"1px solid "+T.bd,fontSize:14,color:T.t0,background:T.bg2,cursor:"pointer",transition:"border-color .2s"}},
              f.opts.map(function(o){return React.createElement("option",{key:o,value:o},o);})),
            React.createElement("svg",{viewBox:"0 0 10 6",width:10,height:6,style:{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",fill:"none"}},React.createElement("path",{d:"M1 1l4 4 4-4",stroke:T.t3,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}))
          )
        );
      }),
      React.createElement("button",{onClick:function(){setStep("choose");},className:"btn-gold",style:{width:"100%",borderRadius:6,padding:14,fontSize:14,fontWeight:800,marginTop:8}},ar?"التالي":"Next")
    ),
    step==="choose"&&React.createElement("div",null,
      React.createElement("div",{style:{fontSize:22,fontWeight:800,color:T.t0,marginBottom:4,letterSpacing:"-0.5px"}},ar?"إضافة صورة ورقة الفحص":"Add Inspection Sheet"),
      React.createElement("div",{style:{fontSize:13,color:T.t2,marginBottom:28}},ar?"اختر طريقة إضافة الصورة":"Choose how to provide the inspection document"),
      [{icon:"??",en:"Upload from Gallery",ar:"رفع من معرض الصور",sub:ar?"اختر صورة موجودة في هاتفك":"Select an existing photo from your phone",click:function(){if(galRef.current)galRef.current.click();}},{icon:"??",en:"Capture with Camera",ar:"التقاط بالكاميرا",sub:ar?"افتح الكاميرا والتقط صورة":"Open camera and take a photo now",click:function(){setStep("camera");}}].map(function(opt,i){
        return React.createElement("button",{key:i,onClick:opt.click,className:"card-lift",style:{width:"100%",background:T.bg2,border:"1px solid "+T.bd,borderRadius:8,padding:"22px 20px",display:"flex",alignItems:"center",gap:16,marginBottom:12,cursor:"pointer",textAlign:"left",transition:"all .22s"}},
          React.createElement("div",{style:{width:48,height:48,borderRadius:8,background:i===0?"rgba(201,168,76,.1)":"rgba(59,130,246,.1)",border:"1px solid "+(i===0?"rgba(201,168,76,.2)":"rgba(59,130,246,.2)"),display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}},opt.icon),
          React.createElement("div",null,
            React.createElement("div",{style:{fontSize:15,fontWeight:700,color:T.t0,marginBottom:3}},ar?opt.ar:opt.en),
            React.createElement("div",{style:{fontSize:12,color:T.t2}},opt.sub)
          )
        );
      }),
      React.createElement("input",{ref:galRef,type:"file",accept:"image/jpeg,image/png,image/webp,image/heic,image/heif",onChange:handleFile,style:{display:"none"}}),
      React.createElement("button",{onClick:function(){setStep("vehicle");},style:{background:"none",border:"none",color:T.t3,fontSize:12,cursor:"pointer",display:"block",margin:"8px auto 0",letterSpacing:"0.04em"}},ar?"← العودة":"BACK")
    ),
    step==="camera"&&React.createElement("div",null,
      errMsg&&React.createElement("div",{style:{background:T.redGlow,border:"1px solid rgba(239,68,68,.3)",borderRadius:6,padding:"10px 14px",marginBottom:14,fontSize:13,color:T.red}},errMsg),
      React.createElement("div",{style:{background:"#000",borderRadius:8,overflow:"hidden",marginBottom:14,position:"relative",aspectRatio:"4/3",border:"1px solid "+T.bd}},
        React.createElement("video",{ref:vidRef,autoPlay:true,playsInline:true,muted:true,style:{width:"100%",height:"100%",objectFit:"cover",display:"block"}}),
        React.createElement("div",{style:{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",fontSize:11,color:"rgba(255,255,255,.6)",background:"rgba(0,0,0,.6)",padding:"3px 12px",borderRadius:4,letterSpacing:"0.04em"}},ar?"وجّه الكاميرا نحو ورقة الفحص":"Align camera with inspection sheet")
      ),
      React.createElement("button",{onClick:capPhoto,className:"btn-gold",style:{width:"100%",borderRadius:6,padding:14,fontSize:15,fontWeight:800,marginBottom:10}},ar?"التقاط":"Capture"),
      React.createElement("input",{ref:galRef,type:"file",accept:"image/jpeg,image/png,image/webp,image/heic,image/heif",onChange:handleFile,style:{display:"none"}}),
      React.createElement("button",{onClick:function(){setStep("choose");setErrMsg(null);},style:{background:"none",border:"none",color:T.t3,fontSize:12,cursor:"pointer",display:"block",margin:"8px auto 0",letterSpacing:"0.04em"}},ar?"← العودة":"BACK")
    )
  );
}

function Schematic(props){
  var faults=props.faults;var sel=props.sel;var onZone=props.onZone;
  var zs={};faults.forEach(function(f){if(!zs[f.zone]||f.severity==="high"||(f.severity==="medium"&&zs[f.zone]==="low"))zs[f.zone]=f.severity;});
  return React.createElement("svg",{viewBox:"0 0 240 290",style:{width:"100%",maxHeight:260,display:"block"}},
    React.createElement("path",{d:"M32,168 L32,238 L208,238 L208,168 L185,102 L160,82 L80,82 L55,102 Z",fill:"#0B1524",stroke:"#162338",strokeWidth:"1.5"}),
    React.createElement("path",{d:"M80,82 L90,52 L150,52 L160,82 Z",fill:"#081018",stroke:"#162338",strokeWidth:"1"}),
    React.createElement("path",{d:"M95,80 L102,56 L138,56 L145,80 Z",fill:"#040810",stroke:"#162338",strokeWidth:"0.8"}),
    React.createElement("path",{d:"M88,150 L152,150 L155,162 L85,162 Z",fill:"#040810",stroke:"#162338",strokeWidth:"0.8"}),
    Object.keys(ZONES).map(function(zone){
      var sh=ZONES[zone];var sev=zs[zone];if(!sev)return null;
      var col=SC(sev);var isSel=sel===zone;var fill=col+(isSel?"44":"1A");
      if(sh.type==="circle")return React.createElement("circle",{key:zone,cx:sh.cx,cy:sh.cy,r:sh.r,fill:fill,stroke:col,strokeWidth:isSel?2.5:1.5,style:{cursor:"pointer"},onClick:function(){onZone(zone);}});
      return React.createElement("rect",{key:zone,x:sh.x,y:sh.y,width:sh.w,height:sh.h,rx:3,fill:fill,stroke:col,strokeWidth:isSel?2.5:1.5,style:{cursor:"pointer"},onClick:function(){onZone(zone);}});
    }),
    [{c:T.red,l:"Critical"},{c:T.amber,l:"Moderate"},{c:T.green,l:"Minor"}].map(function(item,i){
      return React.createElement("g",{key:i,transform:"translate("+(6+i*78)+",280)"},
        React.createElement("rect",{width:8,height:8,rx:2,fill:item.c+"33",stroke:item.c,strokeWidth:"1"}),
        React.createElement("text",{x:12,y:7,fontSize:8,fill:"#7A94AA",fontFamily:"monospace"},item.l)
      );
    })
  );
}

function FaultCard(props){
  var f=props.f;var exp=props.exp;var tog=props.tog;var ar=props.ar;
  var cls="fault-card fault-"+f.severity;
  return React.createElement("div",{className:cls,style:{background:exp?"rgba(255,255,255,.02)":T.bg2,borderRadius:6,border:"1px solid "+(exp?SBD(f.severity):T.bd),marginBottom:8,overflow:"hidden",transition:"all .2s"}},
    React.createElement("div",{onClick:tog,style:{padding:"14px 16px",cursor:"pointer"}},
      React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}},
        React.createElement(Badge,{sev:f.severity,ar:ar}),
        f.code&&React.createElement("span",{style:{fontSize:11,fontWeight:700,fontFamily:"monospace",color:T.gold,background:T.goldGlow,padding:"2px 8px",borderRadius:3,border:"1px solid rgba(201,168,76,.2)"}},f.code)
      ),
      React.createElement("div",{style:{fontSize:14,fontWeight:700,color:T.t0,marginBottom:4,letterSpacing:"-0.2px"}},ar?(f.nameAr||f.nameEn):f.nameEn),
      React.createElement("div",{style:{fontSize:12,color:T.t2,lineHeight:1.55,marginBottom:8}},ar?(f.fnAr||f.fn||""):f.fn),
      React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
        React.createElement("span",{style:{fontSize:11,color:T.t3,fontFamily:"monospace"}},ar?"التكلفة: ":"COST: ",React.createElement("span",{style:{color:T.gold}},f.cost)),
        React.createElement("span",{style:{fontSize:10,color:exp?T.gold:T.t3,letterSpacing:"0.05em",fontWeight:600}},exp?"HIDE ▴":"DETAILS ▾")
      )
    ),
    exp&&React.createElement("div",{style:{padding:"0 16px 16px",borderTop:"1px solid "+T.bd}},
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"14px 0"}},
        React.createElement("div",{style:{background:T.bg3,borderRadius:6,padding:12,borderLeft:"2px solid "+T.red}},
          React.createElement(Label,{gold:false},ar?"الخطر الفوري":"IMMEDIATE RISK"),
          React.createElement("div",{style:{fontSize:12,color:T.t1,lineHeight:1.5}},ar?(f.immediateAr||f.immediate||""):f.immediate)
        ),
        React.createElement("div",{style:{background:T.bg3,borderRadius:6,padding:12,borderLeft:"2px solid "+T.amber}},
          React.createElement(Label,{gold:false},ar?"العواقب طويلة المدى":"LONG-TERM"),
          React.createElement("div",{style:{fontSize:12,color:T.t1,lineHeight:1.5}},ar?(f.longtermAr||f.longterm||""):f.longterm)
        )
      ),
      React.createElement(Label,{gold:false},ar?"خطوات الإصلاح":"REPAIR STEPS"),
      (ar?(f.stepsAr||f.steps||[]):f.steps||[]).map(function(s,i){
        return React.createElement("div",{key:i,style:{display:"flex",gap:10,marginBottom:6,alignItems:"flex-start"}},
          React.createElement("div",{style:{width:18,height:18,borderRadius:3,background:T.goldGlow,border:"1px solid rgba(201,168,76,.3)",color:T.gold,fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"monospace"}},i+1),
          React.createElement("span",{style:{fontSize:12,color:T.t2,lineHeight:1.5}},s)
        );
      })
    )
  );
}

function ReportScreen(props){
  var ar=props.ar;var faults=props.faults;
  var _v=useState("list");var view=_v[0];var setView=_v[1];
  var _z=useState(null);var selZone=_z[0];var setSelZone=_z[1];
  var _e=useState(null);var expanded=_e[0];var setExpanded=_e[1];
  if(faults.length===0)return React.createElement("div",{style:{minHeight:"calc(100vh - 98px)",background:T.bg0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:48,gap:14,textAlign:"center"}},
    React.createElement("div",{style:{width:64,height:64,borderRadius:8,background:T.bg2,border:"1px solid "+T.bd,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:8}},"??"),
    React.createElement("div",{style:{fontSize:18,fontWeight:700,color:T.t0}},ar?"لا يوجد تقرير بعد":"No Report Yet"),
    React.createElement("div",{style:{fontSize:13,color:T.t2,maxWidth:280,lineHeight:1.6}},ar?"امسح ورقة فحص سيارتك أولاً":"Scan an inspection sheet to generate your diagnostic report")
  );
  var hi=faults.filter(function(f){return f.severity==="high";}).length;
  var me=faults.filter(function(f){return f.severity==="medium";}).length;
  var lo=faults.filter(function(f){return f.severity==="low";}).length;
  var grouped=[{sev:"high",l:ar?"حرج":"Critical",faults:faults.filter(function(f){return f.severity==="high";})},{sev:"medium",l:ar?"متوسط":"Moderate",faults:faults.filter(function(f){return f.severity==="medium";})},{sev:"low",l:ar?"منخفض":"Minor",faults:faults.filter(function(f){return f.severity==="low";})}].filter(function(g){return g.faults.length>0;});
  return React.createElement("div",{style:{minHeight:"calc(100vh - 98px)",background:T.bg0}},
    React.createElement("div",{style:{background:"linear-gradient(180deg,#0A1220 0%,#040810 100%)",borderBottom:"1px solid "+T.bd,padding:"18px 24px"}},
      React.createElement("div",{style:{maxWidth:1080,margin:"0 auto"}},
        React.createElement(Label,{gold:true},ar?"تقرير التشخيص":"DIAGNOSTIC REPORT"),
        React.createElement("div",{style:{display:"flex",gap:10}},
          [{n:hi,l:"CRITICAL",c:T.red,bg:T.redGlow,bd:"rgba(239,68,68,.25)"},{n:me,l:"MODERATE",c:T.amber,bg:T.amberGlow,bd:"rgba(245,158,11,.2)"},{n:lo,l:"MINOR",c:T.green,bg:T.greenGlow,bd:"rgba(34,197,94,.2)"}].map(function(item){
            return React.createElement("div",{key:item.l,style:{flex:"1 1 80px",background:item.bg,borderRadius:6,padding:"12px 8px",textAlign:"center",border:"1px solid "+item.bd}},
              React.createElement("div",{style:{fontSize:26,fontWeight:900,color:item.c,fontFamily:"monospace",lineHeight:1}},item.n),
              React.createElement("div",{style:{fontSize:9,color:item.c,fontWeight:700,letterSpacing:"0.1em",marginTop:4}},item.l)
            );
          })
        )
      )
    ),
    React.createElement("div",{style:{maxWidth:1080,margin:"0 auto",padding:"0 24px"}},
      React.createElement("div",{style:{display:"flex",gap:2,background:T.bg1,borderRadius:6,padding:3,margin:"16px 0",border:"1px solid "+T.bd,width:"fit-content"}},
        [{id:"list",en:"Fault List",ar:"قائمة الأعطال"},{id:"schematic",en:"Schematic",ar:"المخطط"}].map(function(v){
          return React.createElement("button",{key:v.id,onClick:function(){setView(v.id);},style:{padding:"7px 18px",border:"none",borderRadius:4,cursor:"pointer",background:view===v.id?T.gold:"transparent",color:view===v.id?"#040810":T.t3,fontWeight:700,fontSize:12,letterSpacing:"0.03em",transition:"all .2s",fontFamily:"inherit"}},ar?v.ar:v.en);
        })
      ),
      view==="list"?React.createElement("div",{style:{paddingBottom:60}},
        grouped.map(function(group){
          return React.createElement("div",{key:group.sev,style:{marginBottom:24}},
            React.createElement("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:10,paddingBottom:8,borderBottom:"1px solid "+T.bd}},
              React.createElement("div",{style:{width:6,height:6,borderRadius:1,background:SC(group.sev)}}),
              React.createElement("span",{style:{fontSize:10,fontWeight:700,color:SC(group.sev),letterSpacing:"0.1em"}},(ar?group.l:group.sev.toUpperCase())+" ("+group.faults.length+")")
            ),
            group.faults.map(function(fault){
              return React.createElement(FaultCard,{key:fault.id,f:fault,exp:expanded===fault.id,tog:function(){setExpanded(expanded===fault.id?null:fault.id);},ar:ar});
            })
          );
        })
      ):React.createElement("div",{style:{paddingBottom:60}},
        React.createElement("div",{style:{background:T.bg2,borderRadius:8,border:"1px solid "+T.bd,padding:16,marginBottom:12}},
          React.createElement("div",{style:{fontSize:11,color:T.t3,textAlign:"center",marginBottom:12,letterSpacing:"0.04em"}},ar?"اضغط على منطقة مضاءة":"TAP A HIGHLIGHTED ZONE TO INSPECT"),
          React.createElement(Schematic,{faults:faults,sel:selZone,onZone:function(z){setSelZone(selZone===z?null:z);}})
        ),
        selZone?faults.filter(function(f){return f.zone===selZone;}).map(function(fault){
          return React.createElement(FaultCard,{key:fault.id,f:fault,exp:expanded===fault.id,tog:function(){setExpanded(expanded===fault.id?null:fault.id);},ar:ar});
        }):React.createElement("div",{style:{textAlign:"center",color:T.t3,fontSize:11,padding:"20px 0",letterSpacing:"0.06em"}},"SELECT A ZONE ABOVE")
      )
    )
  );
}

function GaragesScreen(props){
  var ar=props.ar;
  var _s=useState(null);var sel=_s[0];var setSel=_s[1];
  var G=[{id:1,en:"Al-Mana Auto Service Center",ar:"مركز المانع لخدمة السيارات",dist:"1.2 km",rating:4.8,reviews:312,tags:["Engine","Electrical","Tyres"],open:true,phone:"+974 4444 0001"},{id:2,en:"Qatar Motors Garage",ar:"جراج قطر موتورز",dist:"2.7 km",rating:4.6,reviews:187,tags:["Engine","Transmission","AC"],open:true,phone:"+974 4444 0002"},{id:3,en:"Gulf Auto Repair",ar:"خليج لإصلاح السيارات",dist:"3.5 km",rating:4.4,reviews:94,tags:["General","Tyres","Battery"],open:false,phone:"+974 4444 0003"}];
  return React.createElement("div",{style:{minHeight:"calc(100vh - 98px)",background:T.bg0}},
    React.createElement("div",{style:{borderBottom:"1px solid "+T.bd,padding:"18px 24px",background:T.bg1}},
      React.createElement("div",{style:{maxWidth:1080,margin:"0 auto"}},
        React.createElement(Label,{gold:true},ar?"مراكز الإصلاح القريبة":"NEARBY SERVICE CENTERS"),
        React.createElement("div",{style:{fontSize:12,color:T.t3}},ar?"الدوحة، قطر — في نطاق 10 كم":"Doha, Qatar — Within 10 km")
      )
    ),
    React.createElement("div",{style:{maxWidth:1080,margin:"0 auto",padding:"16px 24px 60px"}},
      G.map(function(g,i){
        var open=g.open;
        return React.createElement("div",{key:g.id,onClick:function(){setSel(sel===i?null:i);},className:"card-lift",style:{background:T.bg2,borderRadius:8,marginBottom:10,border:"1px solid "+(sel===i?"rgba(201,168,76,.3)":T.bd),cursor:"pointer",overflow:"hidden",transition:"all .22s"}},
          React.createElement("div",{style:{padding:18}},
            React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}},
              React.createElement("div",null,
                React.createElement("div",{style:{fontSize:15,fontWeight:700,color:T.t0,marginBottom:4}},ar?g.ar:g.en),
                React.createElement("div",{style:{display:"flex",alignItems:"center",gap:5}},
                  React.createElement("span",{style:{color:T.gold,fontSize:12}},"\u2605"),
                  React.createElement("span",{style:{fontSize:12,fontWeight:700,color:T.t0,fontFamily:"monospace"}},g.rating),
                  React.createElement("span",{style:{fontSize:11,color:T.t3}},"("+g.reviews+")")
                )
              ),
              React.createElement("div",{style:{textAlign:"right"}},
                React.createElement("div",{style:{fontSize:11,color:T.t3,fontFamily:"monospace"}},g.dist),
                React.createElement("div",{style:{fontSize:10,fontWeight:700,color:open?T.green:T.red,marginTop:3,letterSpacing:"0.06em"}},open?(ar?"مفتوح":"OPEN"):(ar?"مغلق":"CLOSED"))
              )
            ),
            React.createElement("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},
              g.tags.map(function(t){return React.createElement("span",{key:t,style:{background:T.bg3,color:T.t3,fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:3,border:"1px solid "+T.bd,fontFamily:"monospace"}},t);})
            )
          ),
          sel===i&&React.createElement("div",{style:{borderTop:"1px solid "+T.bd,padding:"12px 16px",display:"flex",gap:10}},
            React.createElement("button",{onClick:function(e){e.stopPropagation();window.open("https://maps.google.com/?q="+g.en,"_blank");},className:"btn-gold",style:{flex:1,borderRadius:6,padding:"10px",fontSize:13,fontWeight:700}},ar?"الاتجاهات":"Directions"),
            React.createElement("a",{href:"tel:"+g.phone,onClick:function(e){e.stopPropagation();},className:"btn-glass",style:{flex:1,borderRadius:6,padding:"10px",fontSize:13,fontWeight:600,textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"center"}},ar?"اتصال":"Call")
          )
        );
      })
    )
  );
}

function ProfileScreen(props){
  var ar=props.ar;var setAr=props.setAr;var profile=props.profile;var setProfile=props.setProfile;
  var _edit=useState(false);var editing=_edit[0];var setEditing=_edit[1];
  var _nv=useState(profile.name||"");var nameVal=_nv[0];var setNameVal=_nv[1];
  function save(){var u=Object.assign({},profile,{name:nameVal.trim()});setProfile(u);try{localStorage.setItem("asc_profile",JSON.stringify(u));}catch(e){}setEditing(false);}
  function pickAv(idx){var u=Object.assign({},profile,{avatar:idx});setProfile(u);try{localStorage.setItem("asc_profile",JSON.stringify(u));}catch(e){};}
  var hasName=profile.name&&profile.name.trim().length>0;
  var av=AVATARS[profile.avatar!==undefined?profile.avatar:7];
  return React.createElement("div",{style:{minHeight:"calc(100vh - 98px)",background:T.bg0}},
    editing&&React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}},
      React.createElement("div",{style:{background:T.bg2,borderRadius:8,padding:28,width:"100%",maxWidth:420,border:"1px solid "+T.bd}},
        React.createElement(Label,{gold:true},ar?"تعديل الملف":"EDIT PROFILE"),
        React.createElement("div",{style:{marginBottom:20}},
          React.createElement(Label,null,ar?"الاسم":"NAME"),
          React.createElement("input",{type:"text",value:nameVal,onChange:function(e){setNameVal(e.target.value);},placeholder:ar?"أدخل اسمك":"Enter your name",style:{width:"100%",padding:"11px 14px",borderRadius:6,border:"1px solid "+T.bd,background:T.bg3,color:T.t0,fontSize:14,fontFamily:"inherit",transition:"border-color .2s"}})
        ),
        React.createElement("div",{style:{marginBottom:22}},
          React.createElement(Label,null,ar?"صورة الملف":"AVATAR"),
          React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}},
            AVATARS.map(function(av,idx){
              var sel=(profile.avatar!==undefined?profile.avatar:7)===idx;
              return React.createElement("div",{key:idx,onClick:function(){pickAv(idx);},style:{width:"100%",aspectRatio:"1",borderRadius:8,overflow:"hidden",cursor:"pointer",border:"2px solid "+(sel?T.gold:T.bd),boxShadow:sel?"0 0 0 3px "+T.goldGlow:"none",transition:"all .2s"}},
                React.createElement("img",{src:av,style:{width:"100%",height:"100%",objectFit:"cover"},alt:"av"+idx})
              );
            })
          )
        ),
        React.createElement("div",{style:{display:"flex",gap:10}},
          React.createElement("button",{onClick:save,className:"btn-gold",style:{flex:1,borderRadius:6,padding:12,fontSize:14,fontWeight:700}},ar?"حفظ":"Save"),
          React.createElement("button",{onClick:function(){setEditing(false);},className:"btn-glass",style:{flex:1,borderRadius:6,padding:12,fontSize:14}},ar?"إلغاء":"Cancel")
        )
      )
    ),
    React.createElement("div",{style:{borderBottom:"1px solid "+T.bd,background:"linear-gradient(180deg,#0A1220,"+T.bg0+")",padding:"32px 24px",textAlign:"center"}},
      React.createElement("div",{style:{width:72,height:72,borderRadius:8,overflow:"hidden",margin:"0 auto 14px",border:"2px solid "+(hasName?T.gold:T.bd),boxShadow:hasName?"0 0 0 4px "+T.goldGlow:"none",cursor:"pointer"},onClick:function(){setNameVal(profile.name||"");setEditing(true);}},
        React.createElement("img",{src:av,style:{width:"100%",height:"100%",objectFit:"cover"},alt:"avatar"})
      ),
      hasName
        ?React.createElement("div",{style:{fontSize:20,fontWeight:800,color:T.t0,letterSpacing:"-0.5px",marginBottom:4}},profile.name)
        :React.createElement("div",{style:{fontSize:13,color:T.t3,marginBottom:4}},ar?"اضغط لتعيين اسمك":"Tap to set your name"),
      React.createElement("div",{style:{fontSize:11,color:T.t3,letterSpacing:"0.04em"}},"???? "+(ar?"الدوحة، قطر":"DOHA, QATAR")),
      React.createElement("button",{onClick:function(){setNameVal(profile.name||"");setEditing(true);},className:"btn-glass",style:{marginTop:14,borderRadius:6,padding:"7px 20px",fontSize:11,fontWeight:600,letterSpacing:"0.04em"}},ar?"تعديل الملف":"EDIT PROFILE")
    ),
    React.createElement("div",{style:{maxWidth:640,margin:"0 auto",padding:"20px 24px 60px"}},
      // Language
      React.createElement("div",{style:{background:T.bg2,borderRadius:8,border:"1px solid "+T.bd,padding:18,marginBottom:10}},
        React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
          React.createElement("div",null,
            React.createElement(Label,{gold:false},ar?"اللغة":"LANGUAGE"),
            React.createElement("div",{style:{fontSize:13,color:T.t1,marginTop:-4}},"Arabic / English")
          ),
          React.createElement("div",{style:{display:"flex",background:T.bg3,borderRadius:6,padding:3,gap:2,border:"1px solid "+T.bd}},
            [{l:"عربي",v:true},{l:"EN",v:false}].map(function(o){return React.createElement("button",{key:o.l,onClick:function(){setAr(o.v);},style:{padding:"7px 16px",borderRadius:4,border:"none",cursor:"pointer",background:ar===o.v?T.gold:"transparent",color:ar===o.v?"#040810":T.t2,fontSize:12,fontWeight:700,transition:"all .2s",fontFamily:"inherit"}},o.l);})
          )
        )
      ),
      // Install
      React.createElement("div",{style:{background:T.bg2,borderRadius:8,border:"1px solid "+T.bd,padding:18,marginBottom:10}},
        React.createElement(Label,{gold:false},ar?"تثبيت التطبيق":"INSTALL APP"),
        React.createElement("div",{style:{fontSize:12,color:T.t2,lineHeight:1.7,marginBottom:12}},ar?"Safari: اضغط زر المشاركة ⬆️ ثم إضافة إلى الشاشة الرئيسية":"In Safari: Tap Share ⬆️ then Add to Home Screen"),
        React.createElement("div",{style:{display:"flex",gap:6}},
          (ar?["1. افتح Safari","2. اضغط مشاركة","3. أضف للشاشة"]:["1. Open Safari","2. Tap Share","3. Add to Home Screen"]).map(function(s){
            return React.createElement("div",{key:s,style:{flex:1,background:T.bg3,borderRadius:4,padding:"8px 4px",textAlign:"center",fontSize:9,color:T.gold,fontWeight:700,letterSpacing:"0.03em",border:"1px solid rgba(201,168,76,.15)"}},s);
          })
        )
      ),
      // Security
      React.createElement("div",{style:{background:T.bg2,borderRadius:8,border:"1px solid rgba(59,130,246,.15)",padding:18}},
        React.createElement(Label,{gold:false},ar?"الخصوصية والأمان":"SECURITY"),
        React.createElement("div",{style:{fontSize:12,color:T.t2,lineHeight:1.7}},ar?"صورك تبقى خاصة ولا يتم تخزينها. مفتاح API محمي على الخادم فقط.":"Your images are private and never stored. API key is protected server-side only.")
      )
    )
  );
}

export default function App(){
  var _tab=useState("home");var tab=_tab[0];var setTab=_tab[1];
  var _ar=useState(false);var ar=_ar[0];var setAr=_ar[1];
  var _faults=useState([]);var faults=_faults[0];var setFaults=_faults[1];
  var DP={name:"",avatar:7};
  var _profile=useState(function(){try{var s=localStorage.getItem("asc_profile");return s?JSON.parse(s):DP;}catch(e){return DP;}});
  var profile=_profile[0];var setProfile=_profile[1];
  var screens={
    home:    React.createElement(HomeScreen,   {setTab:setTab,ar:ar,faults:faults}),
    scan:    React.createElement(ScanScreen,   {setTab:setTab,ar:ar,setFaults:setFaults}),
    report:  React.createElement(ReportScreen, {ar:ar,faults:faults}),
    garages: React.createElement(GaragesScreen,{ar:ar}),
    profile: React.createElement(ProfileScreen,{ar:ar,setAr:setAr,profile:profile,setProfile:setProfile}),
  };
  return React.createElement("div",{style:{minHeight:"100vh",background:T.bg0,direction:ar?"rtl":"ltr",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",color:T.t0}},
    React.createElement(InjectCSS,null),
    React.createElement(Navbar,{ar:ar,setAr:setAr,tab:tab,setTab:setTab}),
    React.createElement("main",null,screens[tab])
  );
}