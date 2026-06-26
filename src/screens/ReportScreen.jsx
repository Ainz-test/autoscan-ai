import { useState } from "react";
import { sevColor } from "../lib/constants";
import { FaultCard } from "../components/FaultCard";
import { Schematic } from "../components/Schematic";
import { Icon } from "../components/Icons";

export function ReportScreen({ ar, faults, setTab }) {
  const [view, setView] = useState("list");
  const [selZone, setSelZone] = useState(null);
  const [expanded, setExpanded] = useState(null);

  if (faults.length === 0)
    return (
      <div className="container empty">
        <span className="empty-ico"><Icon name="report" size={34} /></span>
        <h3>{ar ? "لا يوجد تقرير بعد" : "No report yet"}</h3>
        <p>{ar ? "امسح ورقة فحص سيارتك أولاً للحصول على تقرير التشخيص" : "Scan an inspection sheet first to generate a diagnostic report."}</p>
        <button className="btn btn-primary btn-lg" onClick={() => setTab("scan")}>
          <Icon name="scan" size={18} /> {ar ? "ابدأ المسح" : "Start a scan"}
        </button>
      </div>
    );

  const counts = {
    high: faults.filter((f) => f.severity === "high").length,
    medium: faults.filter((f) => f.severity === "medium").length,
    low: faults.filter((f) => f.severity === "low").length,
  };
  const tiles = [
    { n: counts.high, l: ar ? "حرج" : "Critical", cls: "sev-high" },
    { n: counts.medium, l: ar ? "متوسط" : "Moderate", cls: "sev-medium" },
    { n: counts.low, l: ar ? "منخفض" : "Minor", cls: "sev-low" },
  ];
  const grouped = [
    { sev: "high", label: ar ? "حرج" : "Critical", faults: faults.filter((f) => f.severity === "high") },
    { sev: "medium", label: ar ? "متوسط" : "Moderate", faults: faults.filter((f) => f.severity === "medium") },
    { sev: "low", label: ar ? "منخفض" : "Minor", faults: faults.filter((f) => f.severity === "low") },
  ].filter((g) => g.faults.length > 0);

  return (
    <div className="report">
      <header className="report-head">
        <div className="container">
          <div className="eyebrow" style={{ color: "var(--accent)" }}>{ar ? "نتيجة التشخيص" : "Diagnostic result"}</div>
          <h1 className="report-title">{ar ? "تقرير التشخيص" : "Diagnostic Report"}</h1>
          <div className="stat-row">
            {tiles.map((t) => (
              <div key={t.l} className={`stat ${t.cls}`} style={{ background: "var(--surface)" }}>
                <div className="num">{t.n}</div>
                <div className="lbl">{t.l}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="container report-body">
        <div className="segment block report-toggle">
          {[
            { id: "list", en: "Fault List", ar: "قائمة الأعطال" },
            { id: "schematic", en: "Schematic", ar: "المخطط" },
          ].map((v) => (
            <button key={v.id} className={view === v.id ? "active" : ""} onClick={() => setView(v.id)}>
              {ar ? v.ar : v.en}
            </button>
          ))}
        </div>

        {view === "list" ? (
          <div>
            {grouped.map((group) => (
              <div key={group.sev} className="fault-group">
                <div className="group-head" style={{ color: sevColor(group.sev) }}>
                  <span className="group-dot" style={{ background: sevColor(group.sev) }} />
                  {group.label} ({group.faults.length})
                </div>
                {group.faults.map((fault) => (
                  <FaultCard
                    key={fault.id}
                    fault={fault}
                    exp={expanded === fault.id}
                    toggle={() => setExpanded(expanded === fault.id ? null : fault.id)}
                    ar={ar}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="card card-pad hud-line schematic-card">
              <p className="schematic-hint">{ar ? "اضغط على منطقة مضاءة لعرض الأعطال" : "Tap a highlighted zone to see its faults"}</p>
              <Schematic faults={faults} sel={selZone} ar={ar} onZone={(z) => setSelZone(selZone === z ? null : z)} />
            </div>
            {selZone ? (
              faults
                .filter((f) => f.zone === selZone)
                .map((fault) => (
                  <FaultCard
                    key={fault.id}
                    fault={fault}
                    exp={expanded === fault.id}
                    toggle={() => setExpanded(expanded === fault.id ? null : fault.id)}
                    ar={ar}
                  />
                ))
            ) : (
              <p className="schematic-empty">{ar ? "اضغط على منطقة ملونة" : "Tap a highlighted zone"}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
