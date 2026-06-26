import { useState } from "react";
import { Reveal } from "../components/Reveal";
import { Icon } from "../components/Icons";

const GARAGES = [
  {
    id: 1,
    nameEn: "Al-Mana Auto Service Center",
    nameAr: "مركز المانع لخدمة السيارات",
    dist: "1.2 km",
    rating: 4.8,
    reviews: 312,
    tags: ["Engine", "Electrical", "Tyres"],
    tagsAr: ["محرك", "كهرباء", "إطارات"],
    open: true,
    phone: "+974 4444 0001",
  },
  {
    id: 2,
    nameEn: "Qatar Motors Garage",
    nameAr: "جراج قطر موتورز",
    dist: "2.7 km",
    rating: 4.6,
    reviews: 187,
    tags: ["Engine", "Transmission", "AC"],
    tagsAr: ["محرك", "ناقل حركة", "تكييف"],
    open: true,
    phone: "+974 4444 0002",
  },
  {
    id: 3,
    nameEn: "Gulf Auto Repair",
    nameAr: "خليج لإصلاح السيارات",
    dist: "3.5 km",
    rating: 4.4,
    reviews: 94,
    tags: ["General", "Tyres", "Battery"],
    tagsAr: ["عام", "إطارات", "بطارية"],
    open: false,
    phone: "+974 4444 0003",
  },
];

export function GaragesScreen({ ar }) {
  const [sel, setSel] = useState(null);

  return (
    <div className="garages">
      <header className="garages-head">
        <div className="container">
          <span className="eyebrow">{ar ? "الدوحة، قطر" : "Doha, Qatar"}</span>
          <h1 className="garages-title">
            {ar ? "مراكز الإصلاح القريبة" : "Nearby Repair Shops"}
          </h1>
          <p className="garages-lead">
            {ar
              ? "مراكز معتمدة وموثوقة بالقرب منك"
              : "Vetted, trusted service centers near you"}
          </p>
        </div>
      </header>

      <div className="container garages-body">
        {GARAGES.map((g, i) => {
          const isSel = sel === i;
          return (
            <Reveal
              key={g.id}
              delay={i * 70}
              className={"garage" + (isSel ? " sel" : "")}
            >
              <button
                className="garage-main"
                onClick={() => setSel(isSel ? null : i)}
                aria-expanded={isSel}
              >
                <div className="garage-top">
                  <div>
                    <div className="garage-name">{ar ? g.nameAr : g.nameEn}</div>
                    <div className="garage-rating">
                      <Icon name="star" size={14} />
                      <strong>{g.rating}</strong>
                      <span>({g.reviews})</span>
                    </div>
                  </div>
                  <div className="garage-meta">
                    <div className="garage-dist">
                      <Icon name="pin" size={13} />
                      {g.dist}
                    </div>
                    <div className={"garage-state" + (g.open ? " open" : "")}>
                      {g.open ? (ar ? "مفتوح" : "Open") : ar ? "مغلق" : "Closed"}
                    </div>
                  </div>
                </div>
                <div className="garage-tags">
                  {(ar ? g.tagsAr : g.tags).map((t) => (
                    <span key={t} className="garage-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </button>

              {isSel && (
                <div className="garage-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      window.open(
                        "https://maps.google.com/?q=" + encodeURIComponent(g.nameEn),
                        "_blank"
                      )
                    }
                  >
                    <Icon name="pin" size={16} />
                    {ar ? "الاتجاهات" : "Directions"}
                  </button>
                  <a className="btn btn-primary" href={"tel:" + g.phone}>
                    <Icon name="phone" size={16} />
                    {ar ? "اتصال" : "Call"}
                  </a>
                </div>
              )}
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
