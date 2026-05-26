'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Lock, Globe, Mail, Monitor, AlertOctagon, ChevronDown, ChevronUp } from 'lucide-react';

interface Tip {
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium';
}

interface Category {
  id: string;
  label: string;
  emoji: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  tips: Tip[];
}

const CATEGORIES: Category[] = [
  {
    id: 'account',
    label: 'Account Security',
    emoji: '🔐',
    icon: <Lock className="h-4 w-4" />,
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    tips: [
      { title: 'Enable Multi-Factor Authentication (MFA)', description: 'Always enable MFA on every account — email, banking, social media. Even if your password is stolen, MFA blocks attackers from logging in.', severity: 'Critical' },
      { title: 'Use a Password Manager', description: 'Use tools like Bitwarden or 1Password to generate and store unique, strong passwords (16+ chars) for every site. Never reuse passwords across accounts.', severity: 'Critical' },
      { title: 'Audit Your Active Sessions Regularly', description: 'Check "active sessions" or "logged-in devices" in your account settings. Revoke any sessions you don\'t recognize immediately.', severity: 'High' },
      { title: 'Use Passkeys Where Available', description: 'Passkeys replace passwords with cryptographic keys tied to your device. They are phishing-resistant and far more secure than traditional passwords.', severity: 'High' },
      { title: 'Monitor for Credential Leaks', description: 'Use HaveIBeenPwned.com to check if your email or passwords appeared in known data breaches. Change affected credentials immediately.', severity: 'Medium' },
    ],
  },
  {
    id: 'network',
    label: 'Network Safety',
    emoji: '🌐',
    icon: <Globe className="h-4 w-4" />,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    tips: [
      { title: 'Never Use Public Wi-Fi Without a VPN', description: 'Public Wi-Fi (airports, cafes) is unencrypted. Attackers can intercept your traffic via MITM attacks. Always use a trusted VPN like Mullvad or ProtonVPN.', severity: 'Critical' },
      { title: 'Change Default Router Credentials', description: 'Default router usernames/passwords (admin/admin) are publicly known. Change them immediately and disable remote management unless required.', severity: 'Critical' },
      { title: 'Enable WPA3 Encryption on Your Router', description: 'WPA3 is the latest Wi-Fi security standard. Switch from WPA2 to WPA3 in your router settings for stronger encryption and brute-force resistance.', severity: 'High' },
      { title: 'Segment IoT Devices on a Guest Network', description: 'Put smart TVs, cameras, and IoT devices on a separate guest network. This prevents a compromised device from accessing your main computers.', severity: 'High' },
      { title: 'Use DNS-over-HTTPS (DoH)', description: 'Standard DNS queries are unencrypted and can be intercepted. Enable DoH in your browser or OS to encrypt DNS lookups and prevent snooping.', severity: 'Medium' },
    ],
  },
  {
    id: 'email',
    label: 'Email & Phishing Protection',
    emoji: '📧',
    icon: <Mail className="h-4 w-4" />,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    tips: [
      { title: 'Verify Sender Identity Before Clicking', description: 'Attackers spoof display names. Always check the actual email address, not just the name. "PayPal Support" from noreply@paypa1-secure.ru is a phishing attempt.', severity: 'Critical' },
      { title: 'Never Enter Credentials via Email Links', description: 'Legitimate services never ask you to log in via an email link. Always navigate directly to the website by typing the URL in your browser manually.', severity: 'Critical' },
      { title: 'Enable Advanced Spam & Phishing Filters', description: 'Use email providers with strong anti-phishing filters (Gmail, Outlook). Enable advanced phishing protection in settings and report suspicious emails.', severity: 'High' },
      { title: 'Be Suspicious of Urgency & Fear Tactics', description: '"Your account will be suspended in 24 hours!" is a classic social engineering tactic. Slow down, verify through official channels before taking any action.', severity: 'High' },
      { title: 'Use Email Aliases for Sign-ups', description: 'Use services like SimpleLogin or Apple Hide My Email to create disposable aliases. This prevents your real email from being harvested in data breaches.', severity: 'Medium' },
    ],
  },
  {
    id: 'device',
    label: 'Device Security',
    emoji: '💻',
    icon: <Monitor className="h-4 w-4" />,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    tips: [
      { title: 'Keep OS & Software Updated Immediately', description: 'Most ransomware exploits known vulnerabilities. Enable automatic updates. WannaCry infected 200,000+ systems via an unpatched Windows flaw that had a patch available.', severity: 'Critical' },
      { title: 'Enable Full-Disk Encryption', description: 'Enable BitLocker (Windows) or FileVault (Mac) to encrypt your entire drive. If your laptop is stolen, attackers cannot read your data without your password.', severity: 'Critical' },
      { title: 'Install a Reputable Endpoint Security Tool', description: 'Use trusted antivirus/EDR tools (Malwarebytes, Windows Defender, CrowdStrike Falcon). Avoid free tools from unknown sources — some are malware themselves.', severity: 'High' },
      { title: 'Disable AutoRun for USB Drives', description: 'USB-based attacks (BadUSB) auto-execute malware when plugged in. Disable AutoRun/AutoPlay in Windows settings and never plug in unknown USB drives.', severity: 'High' },
      { title: 'Lock Your Screen When Away', description: 'Use Win+L (Windows) or Ctrl+Cmd+Q (Mac) to instantly lock your screen. Set auto-lock after 1–2 minutes of inactivity to prevent physical access attacks.', severity: 'Medium' },
    ],
  },
  {
    id: 'fraud',
    label: 'Fraud Prevention',
    emoji: '🛑',
    icon: <AlertOctagon className="h-4 w-4" />,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    tips: [
      { title: 'Verify Money/Data Requests Independently', description: 'If someone (even your "boss" or "bank") asks for urgent wire transfers or sensitive data, verify via a separate phone call to a known number — not one they provided.', severity: 'Critical' },
      { title: 'Never Share OTP / Verification Codes', description: 'No legitimate company will ever ask for your one-time password over phone or chat. Sharing an OTP gives attackers full real-time access to your account.', severity: 'Critical' },
      { title: 'Check URLs Before Entering Payment Info', description: 'Look for HTTPS and verify the exact domain (amazon.com vs amaz0n.com). Use browser extensions like uBlock Origin to block known malicious domains automatically.', severity: 'High' },
      { title: 'Freeze Your Credit When Not in Use', description: 'A credit freeze prevents fraudsters from opening new accounts in your name. It\'s free in most countries and can be lifted instantly when you need it.', severity: 'High' },
      { title: 'Be Wary of Unsolicited Tech Support Calls', description: '"Microsoft" will never call you about a virus on your PC. These are scams. Hang up immediately and never give remote access to unsolicited callers.', severity: 'Medium' },
    ],
  },
];

const SEVERITY_STYLE: Record<string, string> = {
  Critical: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
  High: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  Medium: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
};

function TipCard({ tip }: { tip: Tip }) {
  return (
    <div className="flex gap-3 p-3 rounded-lg bg-muted/30 border border-border/40 hover:border-border/80 transition-colors">
      <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
      <div className="space-y-1 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <p className="text-sm font-medium leading-tight">{tip.title}</p>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${SEVERITY_STYLE[tip.severity]}`}>
            {tip.severity}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
      </div>
    </div>
  );
}

function CategoryPanel({ cat }: { cat: Category }) {
  const [open, setOpen] = useState(false);
  const criticalCount = cat.tips.filter(t => t.severity === 'Critical').length;

  return (
    <div className={`rounded-xl border ${cat.borderColor} overflow-hidden`}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 ${cat.bgColor} hover:brightness-110 transition-all`}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{cat.emoji}</span>
          <span className={`text-sm font-semibold ${cat.color}`}>{cat.label}</span>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ml-1 ${cat.borderColor} ${cat.color}`}>
            {cat.tips.length} tips
          </Badge>
          {criticalCount > 0 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-rose-500/20 text-rose-400 border-rose-500/40">
              {criticalCount} critical
            </Badge>
          )}
        </div>
        {open
          ? <ChevronUp className={`h-4 w-4 ${cat.color}`} />
          : <ChevronDown className={`h-4 w-4 ${cat.color}`} />}
      </button>

      {open && (
        <div className="p-3 space-y-2 bg-background/60">
          {cat.tips.map((tip, i) => <TipCard key={i} tip={tip} />)}
        </div>
      )}
    </div>
  );
}

export function SecurityTips() {
  const totalTips = CATEGORIES.reduce((s, c) => s + c.tips.length, 0);
  const totalCritical = CATEGORIES.reduce((s, c) => s + c.tips.filter(t => t.severity === 'Critical').length, 0);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-5 w-5 text-green-400" />
            Categorized Security Tips
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs text-muted-foreground border-border">
              {totalTips} tips
            </Badge>
            <Badge variant="outline" className="text-xs bg-rose-500/20 text-rose-400 border-rose-500/40">
              {totalCritical} critical
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Actionable guidance to protect yourself from real-world cyber attackers. Click a category to expand.
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {CATEGORIES.map(cat => <CategoryPanel key={cat.id} cat={cat} />)}
      </CardContent>
    </Card>
  );
}
