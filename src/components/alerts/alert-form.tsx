"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import type { AlertSetting } from "@/types"
import { SEVERITY_LEVELS, THREAT_CATEGORIES } from "@/lib/constants"
import { Loader2, Save } from "lucide-react"
import { useState } from "react"

const alertFormSchema = z.object({
  name: z.string().min(3, "Alert name must be at least 3 characters."),
  riskLevels: z.array(z.enum(SEVERITY_LEVELS)).min(1, "Select at least one risk level."),
  categories: z.array(z.enum(THREAT_CATEGORIES)).min(1, "Select at least one category."),
  keywords: z.string().optional().transform(val => val ? val.split(',').map(k => k.trim()).filter(k => k) : []),
  isEnabled: z.boolean().default(true),
})

interface AlertFormProps {
  initialData?: Partial<AlertSetting>;
  onSubmitForm: (data: AlertSetting) => Promise<void>; // Make it async
  onCancel?: () => void;
}

export function AlertForm({ initialData, onSubmitForm, onCancel }: AlertFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof alertFormSchema>>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      riskLevels: initialData?.riskLevels || [],
      categories: initialData?.categories || [],
      keywords: initialData?.keywords?.join(', ') || "",
      isEnabled: initialData?.isEnabled ?? true,
    },
  })

  async function handleSubmit(values: z.infer<typeof alertFormSchema>) {
    setIsLoading(true);
    const alertData: AlertSetting = {
      id: initialData?.id || `alert-${Date.now()}`, // Generate ID if new
      ...values,
      keywords: values.keywords || [], // Ensure keywords is an array
    };
    try {
      await onSubmitForm(alertData);
      toast({
        title: initialData?.id ? "Alert Updated" : "Alert Created",
        description: `Alert "${alertData.name}" has been saved.`,
      })
    } catch (error) {
       toast({
        title: "Error Saving Alert",
        description: "Could not save the alert. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alert Name</FormLabel>
              <FormControl><Input placeholder="e.g., Critical Ransomware Activity" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="riskLevels"
          render={() => (
            <FormItem>
              <FormLabel>Risk Levels</FormLabel>
              <FormDescription>Select severity levels to monitor.</FormDescription>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {SEVERITY_LEVELS.map((level) => (
                  <FormField
                    key={level}
                    control={form.control}
                    name="riskLevels"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(level)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), level])
                                : field.onChange(field.value?.filter((value) => value !== level))
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{level}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categories"
          render={() => (
            <FormItem>
              <FormLabel>Threat Categories</FormLabel>
              <FormDescription>Select threat categories to monitor.</FormDescription>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 pt-2 max-h-48 overflow-y-auto">
                {THREAT_CATEGORIES.map((category) => (
                  <FormField
                    key={category}
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(category)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), category])
                                : field.onChange(field.value?.filter((value) => value !== category))
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-sm">{category}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords (Optional)</FormLabel>
              <FormControl><Input placeholder="e.g., payment, urgent, confidential" {...field} value={Array.isArray(field.value) ? field.value.join(', ') : field.value} /></FormControl>
              <FormDescription>Comma-separated keywords to look for in threat details.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Enable Alert</FormLabel>
                <FormDescription>Receive notifications for this alert.</FormDescription>
              </div>
              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {initialData?.id ? 'Save Changes' : 'Create Alert'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
