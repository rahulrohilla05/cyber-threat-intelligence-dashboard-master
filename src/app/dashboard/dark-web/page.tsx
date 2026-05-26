"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Eye, 
  EyeOff, 
  Shield, 
  AlertTriangle, 
  Search, 
  Download,
  ExternalLink,
  Lock,
  Skull,
  Database,
  Globe,
  TrendingUp,
  Clock,
  Info,
  Layers,
  ShieldAlert,
  UserX
} from 'lucide-react';
import { formatISO, format, parseISO } from 'date-fns';

interface CredentialLeak {
  id: string;
  email: string;
  source: string;
  leakDate: string;
  dataTypes: string[];
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Resolved' | 'Investigating';
}

interface RansomwareGroup {
  id: string;
  name: string;
  victims: number;
  lastActivity: string;
  targetSectors: string[];
  ransomAmount: string;
  status: 'Active' | 'Dormant';
  threatLevel: 'Critical' | 'High' | 'Medium';
}

interface BrandMention {
  id: string;
  platform: string;
  content: string;
  timestamp: string;
  sentiment: 'Negative' | 'Neutral' | 'Positive';
  threatScore: number;
  url: string;
}

interface StolenData {
  id: string;
  marketplace: string;
  dataType: string;
  recordCount: number;
  price: string;
  seller: string;
  postedDate: string;
  verified: boolean;
}

export default function DarkWebMonitoringPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [credentialLeaks, setCredentialLeaks] = useState<CredentialLeak[]>([]);
  const [ransomwareGroups, setRansomwareGroups] = useState<RansomwareGroup[]>([]);
  const [brandMentions, setBrandMentions] = useState<BrandMention[]>([]);
  const [stolenData, setStolenData] = useState<StolenData[]>([]);

  useEffect(() => {
    // Simulate loading dark web intelligence
    setTimeout(() => {
      setCredentialLeaks([
        {
          id: 'leak-1',
          email: 'admin@company.com',
          source: 'RaidForums Breach',
          leakDate: formatISO(new Date(2024, 2, 15)),
          dataTypes: ['Email', 'Password', 'IP Address', 'Session Tokens'],
          severity: 'Critical',
          status: 'Active'
        },
        {
          id: 'leak-2',
          email: 'user@company.com',
          source: 'Stealer Logs Collection',
          leakDate: formatISO(new Date(2024, 3, 1)),
          dataTypes: ['Email', 'Password', 'Browser Cookies'],
          severity: 'High',
          status: 'Investigating'
        },
        {
          id: 'leak-3',
          email: 'support@company.com',
          source: 'Combo List Database',
          leakDate: formatISO(new Date(2024, 1, 20)),
          dataTypes: ['Email', 'Password'],
          severity: 'Medium',
          status: 'Resolved'
        }
      ]);

      setRansomwareGroups([
        {
          id: 'rg-1',
          name: 'LockBit 3.0',
          victims: 847,
          lastActivity: formatISO(new Date()),
          targetSectors: ['Healthcare', 'Finance', 'Manufacturing'],
          ransomAmount: '$2.5M - $10M',
          status: 'Active',
          threatLevel: 'Critical'
        },
        {
          id: 'rg-2',
          name: 'BlackCat (ALPHV)',
          victims: 623,
          lastActivity: formatISO(new Date(2024, 3, 28)),
          targetSectors: ['Energy', 'Technology', 'Retail'],
          ransomAmount: '$1M - $5M',
          status: 'Active',
          threatLevel: 'Critical'
        },
        {
          id: 'rg-3',
          name: 'Royal Ransomware',
          victims: 412,
          lastActivity: formatISO(new Date(2024, 3, 25)),
          targetSectors: ['Education', 'Government', 'Healthcare'],
          ransomAmount: '$500K - $3M',
          status: 'Active',
          threatLevel: 'High'
        }
      ]);

      setBrandMentions([
        {
          id: 'bm-1',
          platform: 'Dark Web Forum - XSS',
          content: 'Selling access to company.com admin panel. Full database access available.',
          timestamp: formatISO(new Date()),
          sentiment: 'Negative',
          threatScore: 95,
          url: 'onion://xss[.]is/thread/12345'
        },
        {
          id: 'bm-2',
          platform: 'Telegram Channel - CyberCrime',
          content: 'Company.com employee credentials leaked. 500+ accounts available.',
          timestamp: formatISO(new Date(2024, 3, 29)),
          sentiment: 'Negative',
          threatScore: 88,
          url: 't.me/cybercrime_channel'
        },
        {
          id: 'bm-3',
          platform: 'Dark Web Marketplace',
          content: 'Company.com customer database for sale. 100K records.',
          timestamp: formatISO(new Date(2024, 3, 27)),
          sentiment: 'Negative',
          threatScore: 92,
          url: 'onion://marketplace[.]onion/listing/789'
        }
      ]);

      setStolenData([
        {
          id: 'sd-1',
          marketplace: 'Russian Market',
          dataType: 'Credit Card Database',
          recordCount: 50000,
          price: '$15,000',
          seller: 'DarkVendor_2024',
          postedDate: formatISO(new Date()),
          verified: true
        },
        {
          id: 'sd-2',
          marketplace: 'Genesis Market',
          dataType: 'Browser Fingerprints',
          recordCount: 25000,
          price: '$8,500',
          seller: 'StealerPro',
          postedDate: formatISO(new Date(2024, 3, 28)),
          verified: true
        },
        {
          id: 'sd-3',
          marketplace: 'Exploit.in',
          dataType: 'Corporate VPN Access',
          recordCount: 150,
          price: '$25,000',
          seller: 'AccessBroker',
          postedDate: formatISO(new Date(2024, 3, 26)),
          verified: false
        }
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'default';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Eye className="h-8 w-8 text-primary" />
            Dark Web Monitoring
          </h1>
          <p className="text-muted-foreground">Real-time intelligence from the dark web and underground forums</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Dark Web Info Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="h-5 w-5 text-primary" />
              What is the Dark Web?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>The <span className="text-foreground font-medium">Dark Web</span> is a hidden part of the internet that requires special software (like <span className="font-medium text-foreground">Tor Browser</span>) to access. It is not indexed by standard search engines and operates on encrypted overlay networks.</p>
            <p>It consists of three layers:</p>
            <ul className="space-y-1 pl-2">
              <li className="flex items-start gap-2"><Layers className="h-4 w-4 mt-0.5 text-primary shrink-0" /><span><span className="text-foreground font-medium">Surface Web</span> — publicly accessible websites (Google, news sites, etc.)</span></li>
              <li className="flex items-start gap-2"><Layers className="h-4 w-4 mt-0.5 text-yellow-500 shrink-0" /><span><span className="text-foreground font-medium">Deep Web</span> — private content behind logins (emails, banking, databases)</span></li>
              <li className="flex items-start gap-2"><Layers className="h-4 w-4 mt-0.5 text-destructive shrink-0" /><span><span className="text-foreground font-medium">Dark Web</span> — anonymous, encrypted networks used for both legitimate privacy and criminal activity</span></li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              Why Monitor the Dark Web?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Cybercriminals use the dark web to buy, sell, and trade stolen data, malware, and unauthorized access. Monitoring it helps organizations:</p>
            <ul className="space-y-1 pl-2">
              <li className="flex items-start gap-2"><UserX className="h-4 w-4 mt-0.5 text-destructive shrink-0" /><span>Detect <span className="text-foreground font-medium">leaked credentials</span> before attackers exploit them</span></li>
              <li className="flex items-start gap-2"><Skull className="h-4 w-4 mt-0.5 text-orange-500 shrink-0" /><span>Track <span className="text-foreground font-medium">ransomware groups</span> targeting your industry</span></li>
              <li className="flex items-start gap-2"><Globe className="h-4 w-4 mt-0.5 text-primary shrink-0" /><span>Identify <span className="text-foreground font-medium">brand impersonation</span> and data sale listings</span></li>
              <li className="flex items-start gap-2"><Database className="h-4 w-4 mt-0.5 text-accent shrink-0" /><span>Respond to <span className="text-foreground font-medium">data breaches</span> faster with early warning intelligence</span></li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credential Leaks</CardTitle>
            <Lock className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{credentialLeaks.length}</div>
            <p className="text-xs text-muted-foreground">Active exposures detected</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ransomware Groups</CardTitle>
            <Skull className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{ransomwareGroups.filter(g => g.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">Active threat actors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brand Mentions</CardTitle>
            <Globe className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{brandMentions.length}</div>
            <p className="text-xs text-muted-foreground">Dark web references</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stolen Data</CardTitle>
            <Database className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stolenData.length}</div>
            <p className="text-xs text-muted-foreground">Marketplace listings</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="credentials" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="credentials">Credential Leaks</TabsTrigger>
          <TabsTrigger value="ransomware">Ransomware Groups</TabsTrigger>
          <TabsTrigger value="brand">Brand Monitoring</TabsTrigger>
          <TabsTrigger value="stolen">Stolen Data</TabsTrigger>
        </TabsList>

        {/* Credential Leaks Tab */}
        <TabsContent value="credentials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exposed Credentials</CardTitle>
              <CardDescription>Monitor compromised credentials across dark web sources</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {credentialLeaks.map((leak) => (
                    <Card key={leak.id} className="border-l-4 border-l-destructive">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Lock className="h-4 w-4 text-destructive" />
                              <span className="font-mono text-sm">{leak.email}</span>
                              <Badge variant={getSeverityColor(leak.severity)}>{leak.severity}</Badge>
                              <Badge variant="outline">{leak.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Source: <span className="font-semibold">{leak.source}</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {leak.dataTypes.map((type) => (
                                <Badge key={type} variant="secondary">{type}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              {format(parseISO(leak.leakDate), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Shield className="mr-2 h-3 w-3" />
                            Reset Password
                          </Button>
                          <Button size="sm" variant="outline">
                            <AlertTriangle className="mr-2 h-3 w-3" />
                            Create Incident
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ransomware Groups Tab */}
        <TabsContent value="ransomware" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Ransomware Groups</CardTitle>
              <CardDescription>Track ransomware operations and threat actors</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {ransomwareGroups.map((group) => (
                    <Card key={group.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Skull className="h-5 w-5 text-orange-500" />
                              <h3 className="font-bold text-lg">{group.name}</h3>
                              <Badge variant={getSeverityColor(group.threatLevel)}>{group.threatLevel}</Badge>
                              <Badge variant={group.status === 'Active' ? 'destructive' : 'secondary'}>
                                {group.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-xs text-muted-foreground">Victims</p>
                                <p className="text-lg font-semibold">{group.victims.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Ransom Amount</p>
                                <p className="text-lg font-semibold">{group.ransomAmount}</p>
                              </div>
                            </div>
                            <div className="mb-3">
                              <p className="text-xs text-muted-foreground mb-1">Target Sectors</p>
                              <div className="flex flex-wrap gap-2">
                                {group.targetSectors.map((sector) => (
                                  <Badge key={sector} variant="outline">{sector}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(parseISO(group.lastActivity), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="mr-2 h-3 w-3" />
                          View Full Profile
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Brand Monitoring Tab */}
        <TabsContent value="brand" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Brand Mentions on Dark Web</CardTitle>
              <CardDescription>Monitor your brand across dark web forums and marketplaces</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {brandMentions.map((mention) => (
                    <Alert key={mention.id} variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">{mention.platform}</Badge>
                                <Badge variant="destructive">Threat Score: {mention.threatScore}/100</Badge>
                              </div>
                              <p className="text-sm mb-2">{mention.content}</p>
                              <p className="text-xs text-muted-foreground font-mono">{mention.url}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {format(parseISO(mention.timestamp), 'MMM dd, HH:mm')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Shield className="mr-2 h-3 w-3" />
                              Investigate
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="mr-2 h-3 w-3" />
                              Save Evidence
                            </Button>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stolen Data Tab */}
        <TabsContent value="stolen" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stolen Data Marketplace</CardTitle>
              <CardDescription>Monitor stolen data listings on underground marketplaces</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {stolenData.map((data) => (
                    <Card key={data.id} className="border-l-4 border-l-accent">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Database className="h-4 w-4 text-accent" />
                              <span className="font-semibold">{data.dataType}</span>
                              {data.verified && (
                                <Badge variant="default">Verified</Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <div>
                                <p className="text-xs text-muted-foreground">Records</p>
                                <p className="font-semibold">{data.recordCount.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Price</p>
                                <p className="font-semibold text-accent">{data.price}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Marketplace</p>
                                <p className="font-semibold text-sm">{data.marketplace}</p>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Seller: <span className="font-mono">{data.seller}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              {format(parseISO(data.postedDate), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <TrendingUp className="mr-2 h-3 w-3" />
                          Track Listing
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
