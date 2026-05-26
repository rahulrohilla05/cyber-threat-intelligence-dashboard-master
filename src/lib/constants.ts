export const APP_NAME = "CyberWatch";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard/threat-feed", label: "Threat Feed" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/ai-summary", label: "AI Summary" },
  { href: "/dashboard/alerts", label: "Alerts" },
];

export const DASHBOARD_NAV_LINKS = [
  { href: "/dashboard", label: "Overview", iconName: "LayoutDashboard" },
  { href: "/dashboard/threat-feed", label: "Threat Feed", iconName: "ShieldAlert" },
  { href: "/dashboard/analytics", label: "Analytics", iconName: "BarChartBig" },
  { href: "/dashboard/global-threat-map", label: "Global Threat Map", iconName: "Globe" },
  { href: "/dashboard/dark-web", label: "Dark Web", iconName: "Eye" },
  { href: "/dashboard/ai-summary", label: "AI Summary", iconName: "BrainCircuit" },
  { href: "/dashboard/alerts", label: "My Alerts", iconName: "BellRing" },
  { href: "/dashboard/integrations", label: "Integrations", iconName: "Plug" },
  { href: "/dashboard/settings", label: "Settings", iconName: "Settings" },
];

export const SEVERITY_LEVELS = ['Low', 'Medium', 'High', 'Critical'] as const;
export type SeverityLevel = typeof SEVERITY_LEVELS[number];

export const THREAT_CATEGORIES = ['Malware', 'Phishing', 'Ransomware', 'DDoS', 'Data Breach', 'Insider Threat', 'APT', 'Zero-day Exploit', 'IoT Vulnerability'] as const;
export type ThreatCategory = typeof THREAT_CATEGORIES[number];
