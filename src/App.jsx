import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { HomeScreen } from "./screens/HomeScreen";
import { ScanScreen } from "./screens/ScanScreen";
import { ReportScreen } from "./screens/ReportScreen";
import { GaragesScreen } from "./screens/GaragesScreen";
import { ProfileScreen } from "./screens/ProfileScreen";

const DEFAULT_PROFILE = { name: "", avatar: 7 };

export default function App() {
  const [tab, setTab] = useState("home");
  const [ar, setAr] = useState(false);
  const [faults, setFaults] = useState([]);
  const [profile, setProfile] = useState(() => {
    try {
      const s = localStorage.getItem("asc_profile");
      return s ? JSON.parse(s) : DEFAULT_PROFILE;
    } catch (e) {
      return DEFAULT_PROFILE;
    }
  });

  // Keep document direction + lang in sync with the language toggle.
  useEffect(() => {
    document.documentElement.dir = ar ? "rtl" : "ltr";
    document.documentElement.lang = ar ? "ar" : "en";
  }, [ar]);

  // Scroll to top whenever the active screen changes.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab]);

  const screens = {
    home: <HomeScreen setTab={setTab} ar={ar} faults={faults} profile={profile} />,
    scan: <ScanScreen setTab={setTab} ar={ar} setFaults={setFaults} />,
    report: <ReportScreen ar={ar} faults={faults} setTab={setTab} />,
    garages: <GaragesScreen ar={ar} />,
    profile: <ProfileScreen ar={ar} setAr={setAr} profile={profile} setProfile={setProfile} />,
  };

  return (
    <div className="app">
      <Navbar tab={tab} setTab={setTab} ar={ar} setAr={setAr} />
      <main className="screen">{screens[tab]}</main>
    </div>
  );
}
