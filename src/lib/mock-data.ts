import type { Threat, AlertSetting, UserProfile, ChartData, TimeSeriesData, SeverityLevel, ThreatCategory } from '@/types';
import { SEVERITY_LEVELS, THREAT_CATEGORIES } from '@/lib/constants';
import { subDays, formatISO } from 'date-fns';

const getRandomElement = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomSubset = <T>(arr: readonly T[], maxCount: number = 3): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * (maxCount + 1)));
};


const getThreatDescription = (category: ThreatCategory, variant: string, index: number): string => {
  const descriptions: Record<ThreatCategory, string[]> = {
    'Malware': [
      'A sophisticated malware strain has been identified targeting enterprise networks through compromised software supply chains. This variant uses polymorphic code to evade signature-based detection.',
      'Advanced trojan malware discovered with rootkit capabilities, allowing persistent access to infected systems while remaining hidden from traditional antivirus solutions.',
      'Fileless malware variant detected that operates entirely in memory, making it extremely difficult to detect and remove using conventional security tools.'
    ],
    'Phishing': [
      'Highly targeted spear-phishing campaign identified using social engineering tactics to impersonate trusted executives and request wire transfers or credential disclosure.',
      'Large-scale phishing operation discovered utilizing cloned legitimate websites with SSL certificates to harvest user credentials and financial information.',
      'Advanced phishing attack employing AI-generated content to create convincing emails that bypass spam filters and trick users into revealing sensitive data.'
    ],
    'Ransomware': [
      'New ransomware variant identified with double-extortion tactics, encrypting files while simultaneously exfiltrating sensitive data to threaten public disclosure.',
      'Ransomware-as-a-Service (RaaS) operation detected targeting healthcare and critical infrastructure with automated encryption and payment systems.',
      'Advanced ransomware strain discovered using worm-like propagation to spread laterally across networks, encrypting multiple systems simultaneously.'
    ],
    'DDoS': [
      'Massive distributed denial-of-service attack detected utilizing IoT botnet with over 100,000 compromised devices generating volumetric traffic floods.',
      'Application-layer DDoS attack identified targeting specific web services with low-and-slow techniques designed to exhaust server resources.',
      'Amplification DDoS attack discovered exploiting misconfigured DNS and NTP servers to generate traffic volumes exceeding 1 Tbps.'
    ],
    'Data Breach': [
      'Major data breach uncovered exposing millions of user records including personally identifiable information, payment details, and authentication credentials.',
      'Database exposure discovered due to misconfigured cloud storage, leaking sensitive corporate data and customer information to the public internet.',
      'Insider threat incident identified involving unauthorized data exfiltration of proprietary information and trade secrets over extended period.'
    ],
    'Insider Threat': [
      'Malicious insider activity detected involving privilege abuse to access and exfiltrate confidential data for financial gain or competitive advantage.',
      'Negligent insider behavior identified leading to accidental data exposure through misconfigured systems and poor security practices.',
      'Compromised insider account discovered being used by external threat actors to maintain persistent access and conduct reconnaissance.'
    ],
    'APT': [
      'Advanced Persistent Threat campaign attributed to nation-state actors targeting government agencies and defense contractors for espionage purposes.',
      'Long-term APT operation uncovered using sophisticated multi-stage malware and living-off-the-land techniques to avoid detection.',
      'State-sponsored APT group identified conducting supply chain attacks to compromise multiple organizations through trusted vendor relationships.'
    ],
    'Zero-day Exploit': [
      'Critical zero-day vulnerability discovered in widely-used software allowing remote code execution without authentication or user interaction.',
      'Previously unknown security flaw identified being actively exploited in the wild before vendor patch availability.',
      'Zero-day exploit detected targeting critical infrastructure systems with potential for widespread disruption and damage.'
    ],
    'IoT Vulnerability': [
      'Widespread IoT device vulnerability discovered affecting millions of smart home and industrial control systems with default credentials.',
      'Critical firmware flaw identified in IoT devices allowing remote takeover and botnet recruitment for malicious activities.',
      'IoT security weakness uncovered enabling unauthorized access to sensitive networks through poorly secured connected devices.'
    ]
  };
  
  const categoryDescriptions = descriptions[category] || descriptions['Malware'];
  return categoryDescriptions[index % categoryDescriptions.length];
};

const getThreatDetails = (category: ThreatCategory, variant: string, severity: SeverityLevel, date: Date, source: string, index: number): string => {
  const origins: Record<ThreatCategory, string> = {
    'Malware': 'This malware originated from Eastern European cybercriminal groups and was first detected in underground forums. It spreads through malicious email attachments, compromised websites, and software vulnerabilities.',
    'Phishing': 'This phishing campaign originates from organized crime syndicates operating across multiple countries. Attacks are distributed via email, SMS, and social media platforms using stolen or spoofed identities.',
    'Ransomware': 'This ransomware variant was developed by sophisticated cybercriminal organizations and distributed through RaaS platforms. Initial access is gained via phishing emails, RDP exploitation, and software vulnerabilities.',
    'DDoS': 'This DDoS attack originates from a global botnet network comprising compromised IoT devices, servers, and workstations. Attack commands are distributed through encrypted C2 channels.',
    'Data Breach': 'This breach resulted from a combination of social engineering, credential stuffing, and exploitation of unpatched vulnerabilities. Attackers gained initial access through compromised VPN credentials.',
    'Insider Threat': 'This insider threat originated from a disgruntled employee or contractor with legitimate access credentials. The threat actor exploited their authorized access to systems and data.',
    'APT': 'This APT campaign is attributed to state-sponsored threat actors with significant resources and advanced capabilities. Initial compromise occurred through spear-phishing and watering hole attacks.',
    'Zero-day Exploit': 'This zero-day exploit was discovered being used by advanced threat actors before public disclosure. The vulnerability exists in core system components and is being actively exploited.',
    'IoT Vulnerability': 'This IoT vulnerability stems from insecure device design and lack of security updates. Affected devices include routers, cameras, and industrial control systems with weak authentication.'
  };

  const mechanisms: Record<ThreatCategory, string> = {
    'Malware': 'The malware operates by establishing persistence through registry modifications and scheduled tasks. It communicates with C2 servers using encrypted channels, downloads additional payloads, and can disable security software. The malware employs anti-analysis techniques including sandbox detection and debugger evasion.',
    'Phishing': 'The attack works by creating convincing replicas of legitimate services and communications. Victims are lured through urgency tactics and social engineering. Once credentials are entered, they are immediately harvested and used for account takeover. The campaign uses rotating domains and hosting infrastructure to evade blocklists.',
    'Ransomware': 'The ransomware executes by first conducting network reconnaissance to identify valuable targets. It then deploys encryption across multiple systems simultaneously, deleting shadow copies and backups. A ransom note is displayed with payment instructions and threats of data publication. The encryption uses strong cryptographic algorithms making recovery without keys nearly impossible.',
    'DDoS': 'The attack functions by coordinating thousands of compromised devices to send massive amounts of traffic to target infrastructure. Multiple attack vectors are used simultaneously including UDP floods, SYN floods, and HTTP floods. The botnet employs randomization and spoofing techniques to make mitigation difficult.',
    'Data Breach': 'The breach occurred through multi-stage attack progression: initial access, privilege escalation, lateral movement, and data exfiltration. Attackers used legitimate tools and encrypted channels to avoid detection. Data was compressed and exfiltrated during off-peak hours to blend with normal traffic patterns.',
    'Insider Threat': 'The insider threat operates by abusing legitimate access privileges to access sensitive systems and data. Activities may include unauthorized data copying, system configuration changes, or credential sharing. The threat actor often uses personal devices or cloud storage to exfiltrate information.',
    'APT': 'The APT campaign operates through multiple phases: reconnaissance, initial compromise, establishing foothold, privilege escalation, lateral movement, and data exfiltration. Attackers use custom malware, living-off-the-land techniques, and encrypted communications. They maintain long-term persistence through multiple backdoors and compromised accounts.',
    'Zero-day Exploit': 'The exploit works by leveraging an unknown vulnerability in software or firmware. It allows attackers to execute arbitrary code, bypass security controls, or gain elevated privileges. The exploit is delivered through various vectors including malicious files, network packets, or web content. No patches are available at the time of discovery.',
    'IoT Vulnerability': 'The vulnerability allows attackers to gain unauthorized access to IoT devices through weak authentication, unpatched firmware, or insecure protocols. Once compromised, devices can be used for botnet activities, network pivoting, or surveillance. Many devices lack security update mechanisms, leaving them permanently vulnerable.'
  };

  const preventions: Record<ThreatCategory, string> = {
    'Malware': 'Prevention measures include: deploying endpoint detection and response (EDR) solutions, implementing application whitelisting, maintaining up-to-date antivirus signatures, conducting regular security awareness training, restricting administrative privileges, enabling email filtering and web content inspection, performing regular system patching, and implementing network segmentation.',
    'Phishing': 'Protection strategies include: implementing multi-factor authentication (MFA) on all accounts, deploying email security gateways with advanced threat protection, conducting regular phishing simulation training, enabling DMARC/SPF/DKIM email authentication, using password managers, verifying requests through secondary channels, implementing browser isolation technology, and maintaining updated security awareness programs.',
    'Ransomware': 'Defense measures include: maintaining offline encrypted backups with regular testing, implementing network segmentation and zero-trust architecture, deploying endpoint protection with behavioral analysis, restricting administrative privileges and lateral movement, disabling unnecessary services and protocols, conducting regular vulnerability assessments, implementing email and web filtering, and maintaining incident response plans with regular drills.',
    'DDoS': 'Mitigation strategies include: deploying DDoS protection services with traffic scrubbing, implementing rate limiting and traffic filtering, using content delivery networks (CDN) for distribution, maintaining excess bandwidth capacity, configuring proper firewall rules, implementing geo-blocking where appropriate, monitoring traffic patterns for anomalies, and maintaining incident response procedures with ISP contacts.',
    'Data Breach': 'Prevention measures include: implementing data loss prevention (DLP) solutions, encrypting sensitive data at rest and in transit, enforcing least privilege access controls, conducting regular security audits and penetration testing, implementing robust logging and monitoring, using multi-factor authentication, maintaining asset inventory, performing regular access reviews, and implementing data classification policies.',
    'Insider Threat': 'Protection strategies include: implementing user behavior analytics (UBA), enforcing separation of duties, conducting background checks, maintaining detailed audit logs, implementing data loss prevention, restricting access to sensitive systems, conducting regular access reviews, providing security awareness training, implementing privileged access management, and maintaining clear security policies with consequences.',
    'APT': 'Defense measures include: implementing advanced threat detection with behavioral analytics, conducting regular threat hunting activities, maintaining comprehensive logging and SIEM, implementing network segmentation and micro-segmentation, deploying endpoint detection and response, conducting regular security assessments, implementing zero-trust architecture, maintaining threat intelligence feeds, performing regular incident response drills, and ensuring rapid patch deployment.',
    'Zero-day Exploit': 'Mitigation strategies include: implementing defense-in-depth security architecture, deploying virtual patching and intrusion prevention systems, maintaining system hardening and reducing attack surface, implementing application whitelisting, using sandboxing and isolation technologies, monitoring for indicators of compromise, maintaining rapid incident response capabilities, subscribing to threat intelligence services, and implementing compensating controls until patches are available.',
    'IoT Vulnerability': 'Protection measures include: changing default credentials immediately, implementing network segmentation for IoT devices, disabling unnecessary services and features, maintaining firmware updates when available, using strong encryption for communications, implementing access controls and monitoring, conducting regular security assessments, replacing unsupported devices, using VLANs to isolate IoT traffic, and implementing intrusion detection systems.'
  };

  const origin = origins[category] || origins['Malware'];
  const mechanism = mechanisms[category] || mechanisms['Malware'];
  const prevention = preventions[category] || preventions['Malware'];

  return `**THREAT INTELLIGENCE REPORT**

Threat ID: ${variant}
Category: ${category}
Severity: ${severity}
First Detected: ${date.toDateString()}
Intelligence Source: ${source}

**THREAT ORIGIN & DISTRIBUTION:**
${origin}

**HOW THIS THREAT WORKS:**
${mechanism}

**PREVENTION & MITIGATION STRATEGIES:**
${prevention}

**INDICATORS OF COMPROMISE (IOCs):**
• Unusual network traffic patterns to unknown external IPs
• Unexpected system file modifications or new scheduled tasks
• Suspicious process execution or memory injection
• Unauthorized access attempts or privilege escalation
• Anomalous user behavior or data access patterns
• Presence of unknown files or registry entries

**RECOMMENDED ACTIONS:**
1. Immediately assess your environment for indicators of compromise
2. Update all security signatures and threat intelligence feeds
3. Review and strengthen access controls and authentication mechanisms
4. Conduct security awareness training for all personnel
5. Test backup and recovery procedures
6. Review and update incident response plans
7. Consider engaging cybersecurity professionals for assessment

**IMPACT ASSESSMENT:**
This ${severity.toLowerCase()}-severity threat has the potential to cause significant disruption to business operations, data integrity, and system availability. Organizations in the following sectors are at elevated risk: financial services, healthcare, critical infrastructure, government, and technology. The threat demonstrates ${severity === 'Critical' || severity === 'High' ? 'advanced' : 'moderate'} capabilities and should be prioritized for remediation.

**ADDITIONAL RESOURCES:**
Organizations should consult MITRE ATT&CK framework, NIST Cybersecurity Framework, and industry-specific security guidelines for comprehensive protection strategies. Consider subscribing to threat intelligence feeds and participating in information sharing communities.

This intelligence report is based on current threat analysis and should be used in conjunction with organizational security policies and risk assessments.`;
};

export const mockThreats: Threat[] = Array.from({ length: 25 }, (_, i) => {
  const date = subDays(new Date(), i * 2 + Math.floor(Math.random() * 5));
  const category = getRandomElement(THREAT_CATEGORIES);
  const severity = getRandomElement(SEVERITY_LEVELS);
  const variant = `${String.fromCharCode(65 + (i % 26))}.${i+1}`;
  const source = getRandomElement(['DarkNet Forums', 'Security Vendor X', 'Internal Honeypot', 'Government Agency']);
  
  return {
    id: `threat-${i + 1}`,
    title: `${category} Variant ${variant} Detected`,
    severity,
    category,
    date: formatISO(date),
    description: getThreatDescription(category, variant, i),
    source,
    detailsForSummary: getThreatDetails(category, variant, severity, date, source, i),
    tags: getRandomSubset(['APT', '0-day', 'SpearPhishing', 'Cloud', 'Mobile'], 3),
    status: getRandomElement(['New', 'Investigating', 'Resolved']),
    mitigation: `Apply latest security patches. Monitor network traffic for anomalies. Educate users on phishing. Current mitigation score: ${Math.floor(Math.random() * 100)}%`,
    affectedSystems: getRandomSubset(['Windows Servers', 'Linux Endpoints', 'iOS Devices', 'Cloud Storage', 'Databases'], 2)
  };
});

export const mockAlertSettings: AlertSetting[] = [
  {
    id: 'alert-1',
    name: 'Critical Ransomware Alert',
    riskLevels: ['Critical'],
    categories: ['Ransomware'],
    keywords: ['encrypt', 'payment'],
    isEnabled: true,
    lastTriggered: formatISO(subDays(new Date(), 2)),
  },
  {
    id: 'alert-2',
    name: 'High Severity Phishing',
    riskLevels: ['High', 'Critical'],
    categories: ['Phishing'],
    keywords: ['credentials', 'login', 'urgent'],
    isEnabled: true,
  },
  {
    id: 'alert-3',
    name: 'All Malware Types (Medium+)',
    riskLevels: ['Medium', 'High', 'Critical'],
    categories: ['Malware'],
    keywords: [],
    isEnabled: false,
  },
  {
    id: 'alert-4',
    name: 'Zero-Day Exploit Detection',
    riskLevels: ['Critical', 'High'],
    categories: ['Zero-day Exploit'],
    keywords: ['0-day', 'vulnerability', 'unpatched'],
    isEnabled: true,
    lastTriggered: formatISO(subDays(new Date(), 5)),
  },
  {
    id: 'alert-5',
    name: 'APT Activity Monitor',
    riskLevels: ['Critical', 'High'],
    categories: ['APT'],
    keywords: ['advanced', 'persistent', 'nation-state'],
    isEnabled: true,
    lastTriggered: formatISO(subDays(new Date(), 7)),
  },
  {
    id: 'alert-6',
    name: 'Data Breach Notification',
    riskLevels: ['Critical', 'High', 'Medium'],
    categories: ['Data Breach'],
    keywords: ['leak', 'exposed', 'database', 'credentials'],
    isEnabled: true,
    lastTriggered: formatISO(subDays(new Date(), 1)),
  },
  {
    id: 'alert-7',
    name: 'DDoS Attack Warning',
    riskLevels: ['High', 'Critical'],
    categories: ['DDoS'],
    keywords: ['botnet', 'amplification', 'flood'],
    isEnabled: true,
  },
  {
    id: 'alert-8',
    name: 'Insider Threat Detection',
    riskLevels: ['Medium', 'High', 'Critical'],
    categories: ['Insider Threat'],
    keywords: ['unauthorized', 'access', 'privilege', 'exfiltration'],
    isEnabled: false,
  },
  {
    id: 'alert-9',
    name: 'IoT Security Vulnerabilities',
    riskLevels: ['Medium', 'High'],
    categories: ['IoT Vulnerability'],
    keywords: ['device', 'firmware', 'default', 'password'],
    isEnabled: true,
    lastTriggered: formatISO(subDays(new Date(), 10)),
  },
  {
    id: 'alert-10',
    name: 'Supply Chain Attack Alert',
    riskLevels: ['Critical', 'High'],
    categories: ['Malware', 'APT'],
    keywords: ['supply-chain', 'third-party', 'vendor', 'compromise'],
    isEnabled: true,
  },
  {
    id: 'alert-11',
    name: 'Business Email Compromise',
    riskLevels: ['High', 'Critical'],
    categories: ['Phishing'],
    keywords: ['CEO', 'wire', 'transfer', 'invoice', 'impersonation'],
    isEnabled: true,
    lastTriggered: formatISO(subDays(new Date(), 3)),
  },
  {
    id: 'alert-12',
    name: 'Cryptojacking Detection',
    riskLevels: ['Medium', 'High'],
    categories: ['Malware'],
    keywords: ['mining', 'cryptocurrency', 'CPU', 'resource'],
    isEnabled: false,
  },
];

export const mockUserProfile: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  // avatarUrl and dataAiHint removed
  preferences: {
    notifications: {
      email: true,
      inApp: true,
    }
  }
};


// Analytics Data - Generated from actual threat data
export const getAnalyticsData = () => {
  // Count threats by category
  const categoryCount: Record<string, number> = {};
  THREAT_CATEGORIES.forEach(cat => categoryCount[cat] = 0);
  mockThreats.forEach(threat => {
    categoryCount[threat.category] = (categoryCount[threat.category] || 0) + 1;
  });

  // Count threats by severity
  const severityCount: Record<string, number> = {};
  SEVERITY_LEVELS.forEach(sev => severityCount[sev] = 0);
  mockThreats.forEach(threat => {
    severityCount[threat.severity] = (severityCount[threat.severity] || 0) + 1;
  });

  // Generate time series data (last 12 months)
  const monthlyData: Record<string, number> = {};
  for (let i = 11; i >= 0; i--) {
    const date = formatISO(subDays(new Date(), i * 30), { representation: 'date' });
    monthlyData[date] = 0;
  }
  mockThreats.forEach(threat => {
    const threatDate = new Date(threat.date);
    const monthKey = formatISO(new Date(threatDate.getFullYear(), threatDate.getMonth(), 1), { representation: 'date' });
    if (monthlyData[monthKey] !== undefined) {
      monthlyData[monthKey]++;
    }
  });

  return {
    commonThreatsData: Object.entries(categoryCount).map(([name, value]) => ({ name, value })),
    severityDistributionData: Object.entries(severityCount).map(([name, value]) => ({ name, value })),
    threatTrendsData: Object.entries(monthlyData).map(([date, count]) => ({ date, count })),
  };
};

export const { commonThreatsData, severityDistributionData, threatTrendsData } = getAnalyticsData();
