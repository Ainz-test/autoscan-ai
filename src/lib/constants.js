// ── Shared data, vehicle catalog, schematic zones, severity helpers ──────────

export const HERO_VIDEO = "/hero.mp4";

// Preset profile avatars (compact inline SVGs)
export const AVATARS = [
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgODAgODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiMxRjNBNUYiLz48ZWxsaXBzZSBjeD0iNDAiIGN5PSIzNCIgcng9IjE4IiByeT0iMTYiIGZpbGw9IiNFNjM5NDYiLz48cmVjdCB4PSIyNCIgeT0iNDYiIHdpZHRoPSIzMiIgaGVpZ2h0PSI4IiByeD0iNCIgZmlsbD0iI0U2Mzk0NiIvPjxlbGxpcHNlIGN4PSI0MCIgY3k9IjM0IiByeD0iMTIiIHJ5PSI2IiBmaWxsPSIjMEQxQjJBIi8+PHJlY3QgeD0iMzQiIHk9IjI4IiB3aWR0aD0iMTIiIGhlaWdodD0iNCIgcng9IjIiIGZpbGw9IiM0RUNEQzQiLz48L3N2Zz4=",
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgODAgODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiMwRDFCMkEiLz48cmVjdCB4PSIyOCIgeT0iMTgiIHdpZHRoPSIyNCIgaGVpZ2h0PSI0NCIgcng9IjgiIGZpbGw9IiMyQTlEOEYiLz48cmVjdCB4PSIzMCIgeT0iMjQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMiIgcng9IjMiIGZpbGw9IiMwRDFCMkEiIG9wYWNpdHk9Ii42Ii8+PGNpcmNsZSBjeD0iMjgiIGN5PSIyMyIgcj0iNSIgZmlsbD0iIzQ0NCIvPjxjaXJjbGUgY3g9IjUyIiBjeT0iMjMiIHI9IjUiIGZpbGw9IiM0NDQiLz48Y2lyY2xlIGN4PSIyOCIgY3k9IjU3IiByPSI1IiBmaWxsPSIjNDQ0Ii8+PGNpcmNsZSBjeD0iNTIiIGN5PSI1NyIgcj0iNSIgZmlsbD0iIzQ0NCIvPjwvc3ZnPg==",
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgODAgODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiM3QzNBRUQiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjI2IiByPSIxMCIgZmlsbD0iI0VERTlGRSIvPjxwYXRoIGQ9Ik0yMiA2MGMwLTEwIDgtMTYgMTgtMTZzMTggNiAxOCAxNiIgZmlsbD0iI0VERTlGRSIvPjxwYXRoIGQ9Ik01MCAzNiBMNTggMjggTDYyIDMyIEw1NCA0MFoiIGZpbGw9IiNFNjM5NDYiIHRyYW5zZm9ybT0icm90YXRlKC0yMCw1NiwzNikiLz48L3N2Zz4=",
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgODAgODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiMwNTk2NjkiLz48cGF0aCBkPSJNNDAgMTUgTDU4IDIzIEw1OCA0MiBDNTggNTMgNTAgNjIgNDAgNjYgQzMwIDYyIDIyIDUzIDIyIDQyIEwyMiAyM1oiIGZpbGw9IiNEMUZBRTUiLz48cGF0aCBkPSJNMzIgNDAgTDM4IDQ2IEw1MCAzNCIgc3Ryb2tlPSIjMDU5NjY5IiBzdHJva2Utd2lkdGg9IjMuNSIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgODAgODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNCNDUzMDkiLz48cG9seWdvbiBwb2ludHM9IjQwLDE4IDQ2LDMyIDYyLDM0IDUxLDQ1IDU0LDYxIDQwLDUzIDI2LDYxIDI5LDQ1IDE4LDM0IDM0LDMyIiBmaWxsPSIjRkRFNjhBIi8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgODAgODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiMxRDRFRDgiLz48cG9seWdvbiBwb2ludHM9IjQ2LDE2IDI4LDQ0IDQwLDQ0IDM0LDY0IDU0LDM2IDQyLDM2IiBmaWxsPSIjQkZEQkZFIi8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgODAgODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiM5MjQwMEUiLz48cG9seWdvbiBwb2ludHM9IjIwLDUyIDIwLDM0IDMwLDQyIDQwLDIyIDUwLDQyIDYwLDM0IDYwLDUyIiBmaWxsPSIjRkNEMzREIi8+PHJlY3QgeD0iMjAiIHk9IjUyIiB3aWR0aD0iNDAiIGhlaWdodD0iOCIgcng9IjIiIGZpbGw9IiNGQ0QzNEQiLz48L3N2Zz4=",
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgODAgODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiMzNzQxNTEiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjMwIiByPSIxMyIgZmlsbD0iIzlDQTNBRiIvPjxwYXRoIGQ9Ik0xNiA2OGMwLTEzIDExLTIyIDI0LTIyczI0IDkgMjQgMjIiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=",
];

// Severity helpers (returns CSS custom-property colors)
export const sevColor = (s) =>
  s === "high" ? "var(--crit)" : s === "medium" ? "var(--mod)" : "var(--minor)";
export const sevClass = (s) =>
  s === "high" ? "sev-high" : s === "medium" ? "sev-medium" : "sev-low";
export const sevLabel = (s, ar) => {
  if (ar) return s === "high" ? "حرج" : s === "medium" ? "متوسط" : "منخفض";
  return s === "high" ? "Critical" : s === "medium" ? "Moderate" : "Minor";
};

export const MAKES = [
  "Toyota", "Nissan", "Ford", "Lexus", "GMC", "Chevrolet", "Hyundai", "Kia",
  "BMW", "Mercedes-Benz", "Land Rover", "Mitsubishi", "Honda", "Mazda", "Jeep",
];

export const MODELS = {
  Toyota: ["Land Cruiser", "Camry", "Corolla", "Hilux", "Prado", "RAV4", "Fortuner"],
  Nissan: ["Patrol", "Altima", "Sunny", "Pathfinder", "X-Trail", "Navara"],
  Ford: ["F-150", "Explorer", "Edge", "Expedition", "Ranger"],
  Lexus: ["LX 600", "GX 460", "ES 350", "RX 350"],
  GMC: ["Yukon", "Tahoe", "Sierra", "Terrain"],
  Chevrolet: ["Tahoe", "Silverado", "Traverse", "Equinox"],
  Hyundai: ["Tucson", "Santa Fe", "Elantra", "Sonata"],
  Kia: ["Sportage", "Sorento", "Telluride", "Carnival"],
  BMW: ["X5", "X7", "5 Series", "7 Series"],
  "Mercedes-Benz": ["GLE", "S-Class", "E-Class", "GLS"],
  "Land Rover": ["Defender", "Discovery", "Range Rover", "Freelander"],
  Mitsubishi: ["Pajero", "Eclipse Cross", "Outlander"],
  Honda: ["Accord", "Civic", "CR-V", "Pilot"],
  Mazda: ["CX-5", "CX-9", "Mazda3", "Mazda6"],
  Jeep: ["Wrangler", "Grand Cherokee", "Cherokee", "Compass"],
};

export const YEARS = Array.from({ length: 35 }, (_, i) => 2024 - i);

export const ZONES = {
  engine_bay: { type: "rect", x: 72, y: 88, w: 96, h: 52 },
  front_left_wheel: { type: "circle", cx: 52, cy: 158, r: 20 },
  front_right_wheel: { type: "circle", cx: 188, cy: 158, r: 20 },
  rear_left_wheel: { type: "circle", cx: 52, cy: 214, r: 20 },
  rear_right_wheel: { type: "circle", cx: 188, cy: 214, r: 20 },
  underbody_front: { type: "rect", x: 82, y: 150, w: 76, h: 24 },
  underbody_rear: { type: "rect", x: 82, y: 196, w: 76, h: 24 },
  cabin_dashboard: { type: "rect", x: 76, y: 88, w: 88, h: 62 },
  battery_electrical: { type: "rect", x: 156, y: 92, w: 28, h: 28 },
  fuel_system: { type: "rect", x: 100, y: 196, w: 40, h: 24 },
};
