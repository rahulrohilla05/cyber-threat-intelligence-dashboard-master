"use client"

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { UserPlus, MoreVertical, Trash2, Mail } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { TeamMember } from '@/types';
import { formatISO, format, parseISO } from 'date-fns';

const inviteFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  role: z.enum(['Admin', 'Analyst', 'Viewer']),
});

export function TeamCollaboration() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cyberwatch_team_members');
      return stored ? JSON.parse(stored) : [
        {
          id: 'member-1',
          name: 'Alex Johnson',
          email: 'alex.johnson@example.com',
          role: 'Admin' as const,
          status: 'Active' as const,
          joinedDate: formatISO(new Date()),
        }
      ];
    }
    return [];
  });

  const form = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Viewer",
    }
  });

  const onSubmit = (values: z.infer<typeof inviteFormSchema>) => {
    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: values.name,
      email: values.email,
      role: values.role,
      status: 'Pending',
      joinedDate: formatISO(new Date()),
    };

    const updatedMembers = [...teamMembers, newMember];
    setTeamMembers(updatedMembers);
    localStorage.setItem('cyberwatch_team_members', JSON.stringify(updatedMembers));

    toast({
      title: "Invitation Sent",
      description: `An invitation has been sent to ${values.email}`,
    });

    form.reset();
    setIsDialogOpen(false);
  };

  const removeMember = (id: string) => {
    const updatedMembers = teamMembers.filter(m => m.id !== id);
    setTeamMembers(updatedMembers);
    localStorage.setItem('cyberwatch_team_members', JSON.stringify(updatedMembers));
    toast({
      title: "Member Removed",
      description: "Team member has been removed successfully.",
    });
  };

  const resendInvite = (member: TeamMember) => {
    toast({
      title: "Invitation Resent",
      description: `Invitation has been resent to ${member.email}`,
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Admin': return 'destructive';
      case 'Analyst': return 'default';
      case 'Viewer': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Pending': return 'secondary';
      case 'Inactive': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Manage your team members and their access levels.
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to a new team member. They will receive an email with instructions to join.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Admin">Admin - Full access</SelectItem>
                          <SelectItem value="Analyst">Analyst - Can manage threats</SelectItem>
                          <SelectItem value="Viewer">Viewer - Read-only access</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Send Invitation</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatarUrl || `https://avatar.vercel.sh/${member.email}.png`} />
                      <AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(member.role)}>{member.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(member.status)}>{member.status}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(parseISO(member.joinedDate), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {member.status === 'Pending' && (
                        <DropdownMenuItem onClick={() => resendInvite(member)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Resend Invitation
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => removeMember(member.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
