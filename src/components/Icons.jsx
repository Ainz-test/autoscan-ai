// Reusable line icons. `stroke="currentColor"` lets color be set via CSS.
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

export function Icon({ name, size = 20, strokeWidth, style }) {
  const p = { ...base, ...(strokeWidth ? { strokeWidth } : {}) };
  const svg = (children) => (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0, ...style }}>
      {children}
    </svg>
  );
  switch (name) {
    case "home":
      return svg(<><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" {...p} /><path d="M9 21V12h6v9" {...p} /></>);
    case "scan":
      return svg(<><circle cx="12" cy="12" r="3" {...p} /><path d="M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3" {...p} /></>);
    case "report":
      return svg(<><rect x="4" y="3" width="16" height="18" rx="2" {...p} /><path d="M8 8h8M8 12h8M8 16h5" {...p} /></>);
    case "garages":
      return svg(<><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" {...p} /><circle cx="12" cy="9" r="2.5" {...p} /></>);
    case "profile":
      return svg(<><circle cx="12" cy="8" r="4" {...p} /><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" {...p} /></>);
    case "spark":
      return svg(<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" {...p} />);
    case "image":
      return svg(<><rect x="3" y="3" width="18" height="18" rx="3" {...p} /><circle cx="8.5" cy="8.5" r="1.5" {...p} /><path d="M21 15l-5-5L5 21" {...p} /></>);
    case "camera":
      return svg(<><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" {...p} /><circle cx="12" cy="13" r="4" {...p} /></>);
    case "check":
      return svg(<path d="M5 12.5l4.5 4.5L19 7.5" {...p} strokeWidth={2.4} />);
    case "shield":
      return svg(<><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" {...p} /><path d="M9.2 12l2 2 3.6-4" {...p} /></>);
    case "alert":
      return svg(<><path d="M12 3l9.5 16.5H2.5z" {...p} /><path d="M12 10v4M12 17.5v.5" {...p} /></>);
    case "trend":
      return svg(<><path d="M3 17l5-5 4 4 8-8" {...p} /><path d="M16 8h5v5" {...p} /></>);
    case "wrench":
      return svg(<path d="M14.7 6.3a4 4 0 00-5 5L4 17l3 3 5.7-5.7a4 4 0 005-5l-2.5 2.5-2-2z" {...p} />);
    case "ocr":
      return svg(<><path d="M4 8V5a1 1 0 011-1h3M20 8V5a1 1 0 00-1-1h-3M4 16v3a1 1 0 001 1h3M20 16v3a1 1 0 01-1 1h-3" {...p} /><path d="M8 12h8" {...p} /></>);
    case "map":
      return svg(<><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" {...p} /><path d="M9 4v14M15 6v14" {...p} /></>);
    case "star":
      return svg(<path d="M12 4l2.3 4.7 5.2.8-3.8 3.7.9 5.2-4.6-2.4-4.6 2.4.9-5.2L4.5 9.5l5.2-.8z" fill="currentColor" stroke="none" />);
    case "phone":
      return svg(<path d="M5 4h3l1.5 4.5L7.5 10a12 12 0 006.5 6.5l1.5-2L20 16v3a1 1 0 01-1 1A15 15 0 014 5a1 1 0 011-1z" {...p} />);
    case "arrow":
      return svg(<path d="M5 12h14M13 6l6 6-6 6" {...p} />);
    case "back":
      return svg(<path d="M19 12H5M11 6l-6 6 6 6" {...p} />);
    case "chev":
      return svg(<path d="M6 9l6 6 6-6" {...p} />);
    case "globe":
      return svg(<><circle cx="12" cy="12" r="9" {...p} /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" {...p} /></>);
    case "download":
      return svg(<><path d="M12 3v12M7 10l5 5 5-5" {...p} /><path d="M5 21h14" {...p} /></>);
    case "lock":
      return svg(<><rect x="4" y="10" width="16" height="11" rx="2" {...p} /><path d="M8 10V7a4 4 0 018 0v3" {...p} /></>);
    case "pin":
      return svg(<><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" {...p} /><circle cx="12" cy="9" r="2.5" {...p} /></>);
    case "logo":
      return svg(<><circle cx="12" cy="12" r="9" {...p} /><circle cx="12" cy="12" r="3.2" {...p} /><path d="M12 3v3M12 18v3M3 12h3M18 12h3" {...p} /></>);
    default:
      return null;
  }
}
