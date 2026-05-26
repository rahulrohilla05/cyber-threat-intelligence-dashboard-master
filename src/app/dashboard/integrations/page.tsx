"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Plug, 
  Key, 
  Webhook, 
  Copy, 
  Eye, 
  EyeOff, 
  Plus,
  Trash2,
  Check,
  ExternalLink,
  Download,
  Upload,
  Settings,
  Zap,
  MessageSquare,
  FileJson,
  Code
} from 'lucide-react';
import { formatISO, format } from 'date-fns';

interface APIKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  permissions: string[];
  status: 'Active' | 'Revoked';
}

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'Active' | 'Inactive';
  lastTriggered: string;
  successRate: number;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  status: 'Connected' | 'Available' | 'Coming Soon';
  features: string[];
}

interface ImportState {
  selectedFile: File | null;
  importFormat: string;
  exportFormat: string;
  dataType: string;
}

export default function IntegrationsPage() {
  const { toast } = useToast();
  const fileInputRef = useState<React.RefObject<HTMLInputElement>>(React.createRef<HTMLInputElement>())[0];
  const [importState, setImportState] = useState<ImportState>({
    selectedFile: null,
    importFormat: '',
    exportFormat: '',
    dataType: ''
  });
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: 'key-1',
      name: 'Production API',
      key: 'cw_live_sk_1234567890abcdef',
      created: formatISO(new Date(2024, 0, 15)),
      lastUsed: formatISO(new Date()),
      permissions: ['read:threats', 'write:alerts', 'read:analytics'],
      status: 'Active'
    },
    {
      id: 'key-2',
      name: 'Development API',
      key: 'cw_test_sk_abcdef1234567890',
      created: formatISO(new Date(2024, 2, 1)),
      lastUsed: formatISO(new Date(2024, 3, 25)),
      permissions: ['read:threats'],
      status: 'Active'
    }
  ]);

  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: 'wh-1',
      name: 'Slack Notifications',
      url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXX',
      events: ['threat.created', 'alert.triggered', 'incident.critical'],
      status: 'Active',
      lastTriggered: formatISO(new Date()),
      successRate: 98.5
    },
    {
      id: 'wh-2',
      name: 'SIEM Integration',
      url: 'https://siem.company.com/api/webhooks/cyberwatch',
      events: ['threat.created', 'threat.updated'],
      status: 'Active',
      lastTriggered: formatISO(new Date(2024, 3, 29)),
      successRate: 100
    }
  ]);

  const [integrations] = useState<Integration[]>([
    {
      id: 'int-1',
      name: 'Slack',
      description: 'Send threat alerts and notifications to Slack channels',
      category: 'Communication',
      icon: '💬',
      status: 'Connected',
      features: ['Real-time alerts', 'Custom channels', 'Rich formatting']
    },
    {
      id: 'int-2',
      name: 'Microsoft Teams',
      description: 'Integrate with Teams for collaboration and alerts',
      category: 'Communication',
      icon: '👥',
      status: 'Available',
      features: ['Team notifications', 'Adaptive cards', 'Bot integration']
    },
    {
      id: 'int-3',
      name: 'Jira',
      description: 'Create and track security incidents in Jira',
      category: 'Ticketing',
      icon: '📋',
      status: 'Connected',
      features: ['Auto-create tickets', 'Status sync', 'Custom fields']
    },
    {
      id: 'int-4',
      name: 'Splunk',
      description: 'Send threat intelligence data to Splunk SIEM',
      category: 'SIEM',
      icon: '🔍',
      status: 'Available',
      features: ['Log forwarding', 'Custom indexes', 'Real-time streaming']
    },
    {
      id: 'int-5',
      name: 'PagerDuty',
      description: 'Trigger incidents and on-call notifications',
      category: 'Incident Management',
      icon: '🚨',
      status: 'Available',
      features: ['Incident creation', 'Escalation policies', 'On-call routing']
    },
    {
      id: 'int-6',
      name: 'ServiceNow',
      description: 'Integrate with ServiceNow for ITSM workflows',
      category: 'ITSM',
      icon: '⚙️',
      status: 'Coming Soon',
      features: ['Ticket creation', 'Workflow automation', 'CMDB integration']
    }
  ]);

  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [isCreateKeyOpen, setIsCreateKeyOpen] = useState(false);
  const [isCreateWebhookOpen, setIsCreateWebhookOpen] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied to your clipboard.`,
    });
  };

  const revokeAPIKey = (id: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, status: 'Revoked' as const } : key
    ));
    toast({
      title: "API Key Revoked",
      description: "The API key has been revoked successfully.",
      variant: "destructive",
    });
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(wh => wh.id !== id));
    toast({
      title: "Webhook Deleted",
      description: "The webhook has been removed successfully.",
    });
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportState({ ...importState, selectedFile: file });
      toast({
        title: "File Selected",
        description: `${file.name} is ready to import.`,
      });
    }
  };

  const handleExport = () => {
    if (!importState.exportFormat || !importState.dataType) {
      toast({
        title: "Missing Information",
        description: "Please select export format and data type.",
        variant: "destructive",
      });
      return;
    }

    // Simulate export
    toast({
      title: "Export Started",
      description: `Exporting ${importState.dataType} as ${importState.exportFormat.toUpperCase()}...`,
    });

    // Simulate download after 2 seconds
    setTimeout(() => {
      const blob = new Blob([JSON.stringify({ data: 'sample export data' })], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cyberwatch-export-${Date.now()}.${importState.exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: "Your data has been exported successfully.",
      });
    }, 2000);
  };

  const handleImport = () => {
    if (!importState.selectedFile || !importState.importFormat) {
      toast({
        title: "Missing Information",
        description: "Please select a file and import format.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Import Started",
      description: `Importing ${importState.selectedFile.name}...`,
    });

    // Simulate import processing
    setTimeout(() => {
      toast({
        title: "Import Complete",
        description: "Your data has been imported successfully.",
      });
      setImportState({ ...importState, selectedFile: null });
    }, 2000);
  };

  return (
    <div className="space-y-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Plug className="h-8 w-8 text-primary" />
            Integration Hub
          </h1>
          <p className="text-muted-foreground">Connect CyberWatch with your security ecosystem</p>
        </div>
        <div className="flex gap-2">
          <a href="https://docs.cyberwatch.com/api" target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <FileJson className="mr-2 h-4 w-4" />
              API Documentation
            </Button>
          </a>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active API Keys</CardTitle>
            <Key className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiKeys.filter(k => k.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">Total: {apiKeys.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Webhooks</CardTitle>
            <Webhook className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{webhooks.filter(w => w.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">Active endpoints</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integrations</CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.filter(i => i.status === 'Connected').length}</div>
            <p className="text-xs text-muted-foreground">Connected services</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">99.2%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="api" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="export">Export/Import</TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage your API keys for programmatic access</CardDescription>
                </div>
                <Dialog open={isCreateKeyOpen} onOpenChange={setIsCreateKeyOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create API Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New API Key</DialogTitle>
                      <DialogDescription>
                        Generate a new API key for accessing CyberWatch programmatically
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Key Name</Label>
                        <Input placeholder="Production API Key" />
                      </div>
                      <div>
                        <Label>Permissions</Label>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <Switch id="read-threats" />
                            <Label htmlFor="read-threats">Read Threats</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="write-threats" />
                            <Label htmlFor="write-threats">Write Threats</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="read-analytics" />
                            <Label htmlFor="read-analytics">Read Analytics</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateKeyOpen(false)}>Cancel</Button>
                      <Button onClick={() => {
                        toast({ title: "API Key Created", description: "Your new API key has been generated." });
                        setIsCreateKeyOpen(false);
                      }}>
                        Generate Key
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <Card key={key.id} className={key.status === 'Revoked' ? 'opacity-50' : ''}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Key className="h-4 w-4 text-primary" />
                            <span className="font-semibold">{key.name}</span>
                            <Badge variant={key.status === 'Active' ? 'default' : 'destructive'}>
                              {key.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                              {showKey[key.id] ? key.key : '••••••••••••••••••••••••'}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setShowKey({ ...showKey, [key.id]: !showKey[key.id] })}
                            >
                              {showKey[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(key.key, 'API Key')}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {key.permissions.map((perm) => (
                              <Badge key={perm} variant="secondary">{perm}</Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Created: {format(new Date(key.created), 'MMM dd, yyyy')} • 
                            Last used: {format(new Date(key.lastUsed), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      {key.status === 'Active' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => revokeAPIKey(key.id)}
                        >
                          <Trash2 className="mr-2 h-3 w-3" />
                          Revoke Key
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Webhook Endpoints</CardTitle>
                  <CardDescription>Configure webhooks for real-time event notifications</CardDescription>
                </div>
                <Dialog open={isCreateWebhookOpen} onOpenChange={setIsCreateWebhookOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Webhook
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Webhook</DialogTitle>
                      <DialogDescription>
                        Configure a new webhook endpoint for event notifications
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Webhook Name</Label>
                        <Input placeholder="Slack Notifications" />
                      </div>
                      <div>
                        <Label>Endpoint URL</Label>
                        <Input placeholder="https://your-endpoint.com/webhook" />
                      </div>
                      <div>
                        <Label>Events</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select events" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="threat.created">Threat Created</SelectItem>
                            <SelectItem value="alert.triggered">Alert Triggered</SelectItem>
                            <SelectItem value="incident.critical">Critical Incident</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateWebhookOpen(false)}>Cancel</Button>
                      <Button onClick={() => {
                        toast({ title: "Webhook Created", description: "Your webhook has been configured." });
                        setIsCreateWebhookOpen(false);
                      }}>
                        Create Webhook
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <Card key={webhook.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Webhook className="h-4 w-4 text-accent" />
                            <span className="font-semibold">{webhook.name}</span>
                            <Badge variant={webhook.status === 'Active' ? 'default' : 'secondary'}>
                              {webhook.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 font-mono">{webhook.url}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {webhook.events.map((event) => (
                              <Badge key={event} variant="outline">{event}</Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Success Rate: <span className="text-green-500 font-semibold">{webhook.successRate}%</span></span>
                            <span>Last triggered: {format(new Date(webhook.lastTriggered), 'MMM dd, HH:mm')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Settings className="mr-2 h-3 w-3" />
                          Configure
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteWebhook(webhook.id)}
                        >
                          <Trash2 className="mr-2 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Marketplace</CardTitle>
              <CardDescription>Connect with popular security and productivity tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {integrations.map((integration) => (
                  <Card key={integration.id} className="hover:border-primary/50 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="text-4xl">{integration.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{integration.name}</h3>
                          <Badge variant="secondary" className="mb-2">{integration.category}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{integration.description}</p>
                      <div className="space-y-1 mb-4">
                        {integration.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-xs">
                            <Check className="h-3 w-3 text-primary" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        className="w-full" 
                        variant={integration.status === 'Connected' ? 'outline' : 'default'}
                        disabled={integration.status === 'Coming Soon'}
                      >
                        {integration.status === 'Connected' && <Check className="mr-2 h-4 w-4" />}
                        {integration.status === 'Connected' ? 'Connected' : 
                         integration.status === 'Coming Soon' ? 'Coming Soon' : 'Connect'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export/Import Tab */}
        <TabsContent value="export" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  Export Data
                </CardTitle>
                <CardDescription>Export threat intelligence and analytics data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Export Format</Label>
                  <Select value={importState.exportFormat} onValueChange={(value) => setImportState({ ...importState, exportFormat: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="stix">STIX 2.1</SelectItem>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Data Type</Label>
                  <Select value={importState.dataType} onValueChange={(value) => setImportState({ ...importState, dataType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="threats">Threats</SelectItem>
                      <SelectItem value="alerts">Alerts</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                      <SelectItem value="all">All Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-accent" />
                  Import Data
                </CardTitle>
                <CardDescription>Import threat intelligence from external sources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Import Format</Label>
                  <Select value={importState.importFormat} onValueChange={(value) => setImportState({ ...importState, importFormat: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="stix">STIX 2.1</SelectItem>
                      <SelectItem value="misp">MISP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={handleFileSelect}>
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {importState.selectedFile ? importState.selectedFile.name : 'Drag and drop your file here, or click to browse'}
                  </p>
                  <Button variant="outline" size="sm" type="button">
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".json,.csv,.xml,.stix"
                    onChange={handleFileChange}
                  />
                </div>
                <Button className="w-full" variant="secondary" onClick={handleImport} disabled={!importState.selectedFile}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
