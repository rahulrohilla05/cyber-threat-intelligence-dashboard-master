export interface CountryThreat {
  code: string;
  name: string;
  threatScore: number;
  category: 'Low' | 'Medium' | 'High' | 'Critical';
  lat: number;
  lng: number;
  attackTypes: { type: string; count: number }[];
  recentIncidents: { date: string; description: string }[];
  trendData: { day: string; score: number }[];
}

export const countryThreats: CountryThreat[] = [
  {
    code: 'US',
    name: 'United States',
    threatScore: 78,
    category: 'High',
    lat: 37.0902,
    lng: -95.7129,
    attackTypes: [
      { type: 'DDoS', count: 1247 },
      { type: 'Malware', count: 892 },
      { type: 'Phishing', count: 2341 },
      { type: 'Ransomware', count: 456 }
    ],
    recentIncidents: [
      { date: '2024-01-15', description: 'Major DDoS attack on financial sector' },
      { date: '2024-01-12', description: 'Phishing campaign targeting healthcare' },
      { date: '2024-01-08', description: 'Ransomware attack on manufacturing' }
    ],
    trendData: [
      { day: 'Day 1', score: 72 },
      { day: 'Day 7', score: 75 },
      { day: 'Day 14', score: 78 },
      { day: 'Day 21', score: 76 },
      { day: 'Day 30', score: 78 }
    ]
  },
  {
    code: 'CN',
    name: 'China',
    threatScore: 92,
    category: 'Critical',
    lat: 35.8617,
    lng: 104.1954,
    attackTypes: [
      { type: 'APT', count: 2341 },
      { type: 'Espionage', count: 1892 },
      { type: 'DDoS', count: 1547 },
      { type: 'Malware', count: 1234 }
    ],
    recentIncidents: [
      { date: '2024-01-16', description: 'State-sponsored APT campaign detected' },
      { date: '2024-01-14', description: 'Large-scale espionage operation' },
      { date: '2024-01-10', description: 'Critical infrastructure targeting' }
    ],
    trendData: [
      { day: 'Day 1', score: 88 },
      { day: 'Day 7', score: 90 },
      { day: 'Day 14', score: 91 },
      { day: 'Day 21', score: 93 },
      { day: 'Day 30', score: 92 }
    ]
  },
  {
    code: 'RU',
    name: 'Russia',
    threatScore: 95,
    category: 'Critical',
    lat: 61.5240,
    lng: 105.3188,
    attackTypes: [
      { type: 'Ransomware', count: 3241 },
      { type: 'APT', count: 2892 },
      { type: 'DDoS', count: 2147 },
      { type: 'Cyber Warfare', count: 1834 }
    ],
    recentIncidents: [
      { date: '2024-01-17', description: 'Massive ransomware campaign launched' },
      { date: '2024-01-15', description: 'Critical infrastructure DDoS attacks' },
      { date: '2024-01-11', description: 'APT group targeting government agencies' }
    ],
    trendData: [
      { day: 'Day 1', score: 93 },
      { day: 'Day 7', score: 94 },
      { day: 'Day 14', score: 96 },
      { day: 'Day 21', score: 95 },
      { day: 'Day 30', score: 95 }
    ]
  },
  {
    code: 'KP',
    name: 'North Korea',
    threatScore: 88,
    category: 'Critical',
    lat: 40.3399,
    lng: 127.5101,
    attackTypes: [
      { type: 'Cryptocurrency Theft', count: 1892 },
      { type: 'APT', count: 1547 },
      { type: 'Malware', count: 1234 },
      { type: 'Espionage', count: 987 }
    ],
    recentIncidents: [
      { date: '2024-01-16', description: 'Cryptocurrency exchange breach' },
      { date: '2024-01-13', description: 'APT targeting defense contractors' },
      { date: '2024-01-09', description: 'Malware campaign against financial sector' }
    ],
    trendData: [
      { day: 'Day 1', score: 85 },
      { day: 'Day 7', score: 87 },
      { day: 'Day 14', score: 88 },
      { day: 'Day 21', score: 89 },
      { day: 'Day 30', score: 88 }
    ]
  },
  {
    code: 'IR',
    name: 'Iran',
    threatScore: 82,
    category: 'High',
    lat: 32.4279,
    lng: 53.6880,
    attackTypes: [
      { type: 'DDoS', count: 1647 },
      { type: 'Defacement', count: 1234 },
      { type: 'APT', count: 987 },
      { type: 'Malware', count: 756 }
    ],
    recentIncidents: [
      { date: '2024-01-15', description: 'DDoS attacks on energy sector' },
      { date: '2024-01-12', description: 'Website defacement campaign' },
      { date: '2024-01-08', description: 'APT targeting oil & gas industry' }
    ],
    trendData: [
      { day: 'Day 1', score: 79 },
      { day: 'Day 7', score: 81 },
      { day: 'Day 14', score: 82 },
      { day: 'Day 21', score: 83 },
      { day: 'Day 30', score: 82 }
    ]
  },
  {
    code: 'BR',
    name: 'Brazil',
    threatScore: 65,
    category: 'Medium',
    lat: -14.2350,
    lng: -51.9253,
    attackTypes: [
      { type: 'Banking Trojans', count: 1234 },
      { type: 'Phishing', count: 987 },
      { type: 'Malware', count: 756 },
      { type: 'Fraud', count: 645 }
    ],
    recentIncidents: [
      { date: '2024-01-14', description: 'Banking trojan outbreak' },
      { date: '2024-01-11', description: 'Phishing targeting financial institutions' },
      { date: '2024-01-07', description: 'Mobile malware campaign' }
    ],
    trendData: [
      { day: 'Day 1', score: 62 },
      { day: 'Day 7', score: 64 },
      { day: 'Day 14', score: 65 },
      { day: 'Day 21', score: 66 },
      { day: 'Day 30', score: 65 }
    ]
  },
  {
    code: 'IN',
    name: 'India',
    threatScore: 71,
    category: 'High',
    lat: 20.5937,
    lng: 78.9629,
    attackTypes: [
      { type: 'Phishing', count: 1547 },
      { type: 'Malware', count: 1234 },
      { type: 'DDoS', count: 987 },
      { type: 'Data Breach', count: 756 }
    ],
    recentIncidents: [
      { date: '2024-01-16', description: 'Large-scale phishing campaign' },
      { date: '2024-01-13', description: 'Malware targeting government agencies' },
      { date: '2024-01-09', description: 'DDoS attacks on e-commerce platforms' }
    ],
    trendData: [
      { day: 'Day 1', score: 68 },
      { day: 'Day 7', score: 70 },
      { day: 'Day 14', score: 71 },
      { day: 'Day 21', score: 72 },
      { day: 'Day 30', score: 71 }
    ]
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    threatScore: 68,
    category: 'Medium',
    lat: 55.3781,
    lng: -3.4360,
    attackTypes: [
      { type: 'Ransomware', count: 987 },
      { type: 'Phishing', count: 1234 },
      { type: 'DDoS', count: 756 },
      { type: 'Malware', count: 645 }
    ],
    recentIncidents: [
      { date: '2024-01-15', description: 'Ransomware attack on healthcare' },
      { date: '2024-01-12', description: 'Phishing targeting financial sector' },
      { date: '2024-01-08', description: 'DDoS attacks on government websites' }
    ],
    trendData: [
      { day: 'Day 1', score: 65 },
      { day: 'Day 7', score: 67 },
      { day: 'Day 14', score: 68 },
      { day: 'Day 21', score: 69 },
      { day: 'Day 30', score: 68 }
    ]
  },
  {
    code: 'DE',
    name: 'Germany',
    threatScore: 62,
    category: 'Medium',
    lat: 51.1657,
    lng: 10.4515,
    attackTypes: [
      { type: 'Malware', count: 987 },
      { type: 'Phishing', count: 876 },
      { type: 'DDoS', count: 645 },
      { type: 'Ransomware', count: 534 }
    ],
    recentIncidents: [
      { date: '2024-01-14', description: 'Malware campaign targeting manufacturing' },
      { date: '2024-01-11', description: 'Phishing attacks on automotive sector' },
      { date: '2024-01-07', description: 'DDoS attacks on financial institutions' }
    ],
    trendData: [
      { day: 'Day 1', score: 59 },
      { day: 'Day 7', score: 61 },
      { day: 'Day 14', score: 62 },
      { day: 'Day 21', score: 63 },
      { day: 'Day 30', score: 62 }
    ]
  },
  {
    code: 'JP',
    name: 'Japan',
    threatScore: 58,
    category: 'Medium',
    lat: 36.2048,
    lng: 138.2529,
    attackTypes: [
      { type: 'APT', count: 756 },
      { type: 'Malware', count: 645 },
      { type: 'Phishing', count: 534 },
      { type: 'DDoS', count: 423 }
    ],
    recentIncidents: [
      { date: '2024-01-15', description: 'APT targeting technology companies' },
      { date: '2024-01-12', description: 'Malware campaign against manufacturing' },
      { date: '2024-01-08', description: 'Phishing targeting financial sector' }
    ],
    trendData: [
      { day: 'Day 1', score: 55 },
      { day: 'Day 7', score: 57 },
      { day: 'Day 14', score: 58 },
      { day: 'Day 21', score: 59 },
      { day: 'Day 30', score: 58 }
    ]
  },
  {
    code: 'FR',
    name: 'France',
    threatScore: 64,
    category: 'Medium',
    lat: 46.2276,
    lng: 2.2137,
    attackTypes: [
      { type: 'Ransomware', count: 876 },
      { type: 'Phishing', count: 756 },
      { type: 'DDoS', count: 645 },
      { type: 'Malware', count: 534 }
    ],
    recentIncidents: [
      { date: '2024-01-16', description: 'Ransomware targeting healthcare' },
      { date: '2024-01-13', description: 'Phishing campaign against government' },
      { date: '2024-01-09', description: 'DDoS attacks on critical infrastructure' }
    ],
    trendData: [
      { day: 'Day 1', score: 61 },
      { day: 'Day 7', score: 63 },
      { day: 'Day 14', score: 64 },
      { day: 'Day 21', score: 65 },
      { day: 'Day 30', score: 64 }
    ]
  },
  {
    code: 'AU',
    name: 'Australia',
    threatScore: 55,
    category: 'Medium',
    lat: -25.2744,
    lng: 133.7751,
    attackTypes: [
      { type: 'Phishing', count: 645 },
      { type: 'Malware', count: 534 },
      { type: 'Ransomware', count: 423 },
      { type: 'DDoS', count: 312 }
    ],
    recentIncidents: [
      { date: '2024-01-14', description: 'Phishing targeting financial sector' },
      { date: '2024-01-11', description: 'Malware campaign against mining industry' },
      { date: '2024-01-07', description: 'Ransomware attack on education sector' }
    ],
    trendData: [
      { day: 'Day 1', score: 52 },
      { day: 'Day 7', score: 54 },
      { day: 'Day 14', score: 55 },
      { day: 'Day 21', score: 56 },
      { day: 'Day 30', score: 55 }
    ]
  },
  {
    code: 'CA',
    name: 'Canada',
    threatScore: 52,
    category: 'Medium',
    lat: 56.1304,
    lng: -106.3468,
    attackTypes: [
      { type: 'Ransomware', count: 534 },
      { type: 'Phishing', count: 645 },
      { type: 'Malware', count: 423 },
      { type: 'DDoS', count: 312 }
    ],
    recentIncidents: [
      { date: '2024-01-15', description: 'Ransomware targeting healthcare' },
      { date: '2024-01-12', description: 'Phishing campaign against government' },
      { date: '2024-01-08', description: 'Malware attacks on energy sector' }
    ],
    trendData: [
      { day: 'Day 1', score: 49 },
      { day: 'Day 7', score: 51 },
      { day: 'Day 14', score: 52 },
      { day: 'Day 21', score: 53 },
      { day: 'Day 30', score: 52 }
    ]
  },
  {
    code: 'MX',
    name: 'Mexico',
    threatScore: 69,
    category: 'Medium',
    lat: 23.6345,
    lng: -102.5528,
    attackTypes: [
      { type: 'Banking Trojans', count: 987 },
      { type: 'Phishing', count: 876 },
      { type: 'Malware', count: 645 },
      { type: 'Fraud', count: 534 }
    ],
    recentIncidents: [
      { date: '2024-01-16', description: 'Banking trojan campaign' },
      { date: '2024-01-13', description: 'Phishing targeting financial institutions' },
      { date: '2024-01-09', description: 'Malware attacks on retail sector' }
    ],
    trendData: [
      { day: 'Day 1', score: 66 },
      { day: 'Day 7', score: 68 },
      { day: 'Day 14', score: 69 },
      { day: 'Day 21', score: 70 },
      { day: 'Day 30', score: 69 }
    ]
  },
  {
    code: 'ZA',
    name: 'South Africa',
    threatScore: 61,
    category: 'Medium',
    lat: -30.5595,
    lng: 22.9375,
    attackTypes: [
      { type: 'Phishing', count: 756 },
      { type: 'Malware', count: 645 },
      { type: 'Fraud', count: 534 },
      { type: 'DDoS', count: 423 }
    ],
    recentIncidents: [
      { date: '2024-01-15', description: 'Phishing targeting banking sector' },
      { date: '2024-01-12', description: 'Malware campaign against telecommunications' },
      { date: '2024-01-08', description: 'Fraud attacks on e-commerce platforms' }
    ],
    trendData: [
      { day: 'Day 1', score: 58 },
      { day: 'Day 7', score: 60 },
      { day: 'Day 14', score: 61 },
      { day: 'Day 21', score: 62 },
      { day: 'Day 30', score: 61 }
    ]
  }
];

export function getThreatColor(score: number): string {
  if (score >= 85) return '#ff1744'; // Critical - vivid red
  if (score >= 70) return '#ff6d00'; // High - orange
  if (score >= 50) return '#ffd600'; // Medium - yellow
  return '#00e676'; // Low - green
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case 'Critical': return 'text-red-500';
    case 'High': return 'text-orange-500';
    case 'Medium': return 'text-yellow-500';
    case 'Low': return 'text-green-500';
    default: return 'text-gray-500';
  }
}
