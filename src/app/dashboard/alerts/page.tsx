
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, BellOff, Loader2 } from 'lucide-react';
import { AlertForm } from '@/components/alerts/alert-form';
import { AlertItem } from '@/components/alerts/alert-item';
import type { AlertSetting } from '@/types';
import { mockAlertSettings } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState<AlertSetting | undefined>(undefined);
  const [alertToDelete, setAlertToDelete] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setAlerts(mockAlertSettings);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleFormSubmit = async (data: AlertSetting) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    if (editingAlert) {
      setAlerts(prev => prev.map(a => a.id === data.id ? data : a));
    } else {
      setAlerts(prev => [...prev, data]);
    }
    setShowForm(false);
    setEditingAlert(undefined);
  };

  const handleToggleAlert = (id: string, isEnabled: boolean) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isEnabled } : a));
    toast({ title: `Alert ${isEnabled ? 'Enabled' : 'Disabled'}`});
  };

  const handleEditAlert = (alert: AlertSetting) => {
    setEditingAlert(alert);
    setShowForm(true);
  };

  const handleDeleteAlert = async () => {
    if (!alertToDelete) return;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setAlerts(prev => prev.filter(a => a.id !== alertToDelete));
    toast({ title: "Alert Deleted", description: "The alert has been successfully deleted." });
    setAlertToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Custom Alerts</h1>
          <p className="text-muted-foreground">Manage your personalized threat notifications.</p>
        </div>
        <Dialog open={showForm} onOpenChange={(open) => { setShowForm(open); if(!open) setEditingAlert(undefined);}}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingAlert(undefined); setShowForm(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{editingAlert ? 'Edit Alert' : 'Create New Alert'}</DialogTitle>
              <DialogDescription>
                {editingAlert ? 'Modify the details of your alert.' : 'Configure a new alert to stay informed about specific threats.'}
              </DialogDescription>
            </DialogHeader>
            <AlertForm 
              initialData={editingAlert} 
              onSubmitForm={handleFormSubmit} 
              onCancel={() => { setShowForm(false); setEditingAlert(undefined); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {alerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map(alert => (
            <AlertItem 
              key={alert.id} 
              alert={alert} 
              onToggle={handleToggleAlert}
              onEdit={handleEditAlert}
              onDelete={() => setAlertToDelete(alert.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg flex flex-col items-center">
          <BellOff className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold">No Alerts Configured</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first alert to get notified about specific threats.
          </p>
          {/* Image removed from here */}
          <Button className="mt-4" onClick={() => { setEditingAlert(undefined); setShowForm(true); }}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Alert
          </Button>
        </div>
      )}
      
      <AlertDialog open={!!alertToDelete} onOpenChange={(open) => !open && setAlertToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this alert?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the alert configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAlert} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
