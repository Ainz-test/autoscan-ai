import { sevClass, sevLabel } from "../lib/constants";
import { Icon } from "./Icons";

// A single expandable fault with bilingual content, costs and repair steps.
export function FaultCard({ fault: f, exp, toggle, ar }) {
  const steps = (ar ? f.stepsAr || f.steps : f.steps) || [];
  return (
    <div className={`fault${exp ? " open " + sevClass(f.severity) : ""}`}>
      <button className="fault-head" onClick={toggle} aria-expanded={exp}>
        <div className="fault-top">
          <span className={`badge ${sevClass(f.severity)}`}>{sevLabel(f.severity, ar)}</span>
          {f.code && <span className="dtc">{f.code}</span>}
        </div>
        <div className="fault-name">{ar ? f.nameAr || f.nameEn : f.nameEn}</div>
        <div className="fault-fn">{ar ? f.fnAr || f.fn || "" : f.fn}</div>
        <div className="fault-meta">
          <span className="cost">
            {ar ? "التكلفة: " : "Cost: "}
            <strong>{f.cost}</strong>
          </span>
          <span className={`details${exp ? " on" : ""}`}>
            {ar ? "التفاصيل" : "Details"}
            <Icon name="chev" size={14} style={{ transform: exp ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
          </span>
        </div>
      </button>

      {exp && (
        <div className="fault-body">
          <div className="consequences">
            <div className="conseq crit">
              <div className="conseq-h"><Icon name="alert" size={14} /> {ar ? "الخطر الفوري" : "Immediate Risk"}</div>
              <p>{ar ? f.immediateAr || f.immediate || "" : f.immediate}</p>
            </div>
            <div className="conseq mod">
              <div className="conseq-h"><Icon name="trend" size={14} /> {ar ? "العواقب طويلة المدى" : "Long-term"}</div>
              <p>{ar ? f.longtermAr || f.longterm || "" : f.longterm}</p>
            </div>
          </div>
          <div className="repair-h"><Icon name="wrench" size={14} /> {ar ? "خطوات الإصلاح" : "Repair Steps"}</div>
          <ol className="repair-steps">
            {steps.map((s, i) => (
              <li key={i}>
                <span className="repair-n">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
