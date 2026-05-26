"use client"

import type { AlertSetting } from "@/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { BellRing, Edit3, Trash2, PowerIcon, PowerOffIcon } from "lucide-react"
import { formatDistanceToNow, parseISO } from "date-fns"

interface AlertItemProps {
  alert: AlertSetting;
  onToggle: (id: string, isEnabled: boolean) => void;
  onEdit: (alert: AlertSetting) => void;
  onDelete: (id: string) => void;
}

export function AlertItem({ alert, onToggle, onEdit, onDelete }: AlertItemProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center">
            <BellRing className={`mr-3 h-5 w-5 ${alert.isEnabled ? 'text-accent' : 'text-muted-foreground'}`} />
            {alert.name}
          </CardTitle>
          <Switch
            checked={alert.isEnabled}
            onCheckedChange={(checked) => onToggle(alert.id, checked)}
            aria-label={alert.isEnabled ? "Disable alert" : "Enable alert"}
          />
        </div>
        <CardDescription>
          {alert.lastTriggered 
            ? `Last triggered: ${formatDistanceToNow(parseISO(alert.lastTriggered), { addSuffix: true })}`
            : "Not triggered yet."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <strong>Risk Levels:</strong> {alert.riskLevels.map(level => <Badge key={level} variant="secondary" className="mr-1">{level}</Badge>)}
        </div>
        <div>
          <strong>Categories:</strong> {alert.categories.slice(0,3).map(cat => <Badge key={cat} variant="outline" className="mr-1">{cat}</Badge>)}
          {alert.categories.length > 3 && <Badge variant="outline">+{alert.categories.length - 3} more</Badge>}
        </div>
        {alert.keywords && alert.keywords.length > 0 && (
          <div>
            <strong>Keywords:</strong> {alert.keywords.slice(0,3).map(kw => <Badge key={kw} variant="outline" className="mr-1">{kw}</Badge>)}
            {alert.keywords.length > 3 && <Badge variant="outline">+{alert.keywords.length - 3} more</Badge>}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(alert)} aria-label="Edit alert">
          <Edit3 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(alert.id)} className="text-destructive hover:text-destructive/80" aria-label="Delete alert">
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
