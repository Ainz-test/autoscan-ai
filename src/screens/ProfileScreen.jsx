import { useEffect } from "react";
import { Reveal } from "../components/Reveal";
import { Icon } from "../components/Icons";
import { AVATARS } from "../lib/constants";

export function ProfileScreen({ ar, setAr, profile, setProfile }) {
  // Persist profile changes to localStorage.
  useEffect(() => {
    try {
      localStorage.setItem("asc_profile", JSON.stringify(profile));
    } catch (e) {
      /* ignore */
    }
  }, [profile]);

  const displayName =
    profile.name?.trim() || (ar ? "سائق AutoScan" : "AutoScan Driver");

  return (
    <div className="profile">
      <header className="profile-head">
        <div className="profile-avatar-wrap">
          <img
            className="profile-avatar"
            src={AVATARS[profile.avatar] || AVATARS[7]}
            alt=""
          />
        </div>
        <div className="profile-name">{displayName}</div>
        <div className="profile-loc">
          <Icon name="pin" size={13} />
          {ar ? "الدوحة، قطر" : "Doha, Qatar"}
        </div>
      </header>

      <div className="container profile-body">
        {/* Name */}
        <Reveal className="card profile-card">
          <label className="field-label" htmlFor="pname">
            {ar ? "الاسم" : "Display name"}
          </label>
          <input
            id="pname"
            className="input"
            type="text"
            value={profile.name}
            placeholder={ar ? "أدخل اسمك" : "Enter your name"}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </Reveal>

        {/* Avatar picker */}
        <Reveal delay={60} className="card profile-card">
          <div className="card-label">{ar ? "الصورة الرمزية" : "Avatar"}</div>
          <div className="avatar-grid">
            {AVATARS.map((a, i) => (
              <button
                key={i}
                className={"avatar-opt" + (profile.avatar === i ? " sel" : "")}
                onClick={() => setProfile({ ...profile, avatar: i })}
                aria-label={`Avatar ${i + 1}`}
              >
                <img src={a} alt="" />
              </button>
            ))}
          </div>
        </Reveal>

        {/* Language */}
        <Reveal delay={120} className="card profile-card">
          <div className="setting-row">
            <div>
              <div className="setting-title">
                <Icon name="globe" size={16} />
                {ar ? "اللغة" : "Language"}
              </div>
              <div className="setting-sub">Arabic / English</div>
            </div>
            <div className="seg">
              {[
                { l: "عربي", v: true },
                { l: "EN", v: false },
              ].map((opt) => (
                <button
                  key={opt.l}
                  className={"seg-btn" + (ar === opt.v ? " on" : "")}
                  onClick={() => setAr(opt.v)}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Install PWA */}
        <Reveal delay={180} className="card profile-card">
          <div className="card-label">
            <Icon name="phone" size={16} />
            {ar ? "تثبيت التطبيق على هاتفك" : "Install App on Your Phone"}
          </div>
          <p className="profile-text">
            {ar
              ? "في Safari: اضغط على زر المشاركة ثم إضافة إلى الشاشة الرئيسية"
              : "In Safari: tap Share, then Add to Home Screen"}
          </p>
          <div className="pwa-steps">
            {(ar
              ? ["١. افتح Safari", "٢. اضغط مشاركة", "٣. أضف للشاشة"]
              : ["1. Open in Safari", "2. Tap Share", "3. Add to Home Screen"]
            ).map((s) => (
              <div key={s} className="pwa-step">
                {s}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Security */}
        <Reveal delay={240} className="card profile-card secure">
          <div className="card-label">
            <Icon name="shield" size={16} />
            {ar ? "خصوصية وأمان" : "Privacy & Security"}
          </div>
          <p className="profile-text">
            {ar
              ? "صورك تبقى خاصة — لا يتم تخزينها. مفتاح API محمي على الخادم."
              : "Your images stay private and are never stored. The API key is protected server-side and never exposed to the browser."}
          </p>
        </Reveal>

        <div className="profile-foot">AutoScan AI · v2.0</div>
      </div>
    </div>
  );
}
