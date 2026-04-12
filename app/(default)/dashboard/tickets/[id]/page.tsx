"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTicketDetails, useUpdateTicketStatusMutation } from '../controller';
import { Loading } from "@/components/ui/loading";
import { Error as ErrorComponent } from "@/components/ui/error";
import { 
    FormBreadcrumb, 
    FormContainer, 
    FormSection, 
    FormRowTwo, 
    FormField 
} from "@/components/shared/form/FormLayouts";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { 
    Clock, 
    CheckCircle2, 
    ArrowLeft 
} from 'lucide-react';
import { format } from "date-fns";
import { Textarea } from '@/components/ui/textarea';

export default function TicketDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: ticket, isLoading, error } = useTicketDetails(id);
    const updateStatus = useUpdateTicketStatusMutation(id);

    if (isLoading) return <Loading />;
    if (error || !ticket) return <ErrorComponent message={(error as Error)?.message || "Ticket not found"} />;

    const isOpen = ticket.status === "OPEN";

    return (
        <FormContainer>
            <FormBreadcrumb items={['Dashboard', 'Ticket Management', 'View Ticket']} />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => router.back()}
                        className="h-8 w-8"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Ticket #{ticket._id.substring(ticket._id.length - 6)}</h2>
                        <p className="text-muted-foreground">{ticket.reason}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={ticket.status === "OPEN" || updateStatus.isPending}
                        onClick={() => updateStatus.mutate("OPEN")}
                        className="gap-2"
                    >
                        <Clock className="w-4 h-4" /> Open
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        disabled={ticket.status === "CLOSED" || updateStatus.isPending}
                        onClick={() => updateStatus.mutate("CLOSED")}
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                        <CheckCircle2 className="w-4 h-4" /> Close
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <FormSection title="Ticket Information" description="Details about the support request.">
                    <FormRowTwo>
                        <FormField label="Reason">
                            <Input value={ticket.reason} readOnly className="bg-muted font-medium" />
                        </FormField>
                        <FormField label="Status">
                            <div className="flex items-center h-10">
                                <Badge 
                                    className={isOpen 
                                        ? "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200" 
                                        : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200"
                                    }
                                >
                                    {ticket.status}
                                </Badge>
                            </div>
                        </FormField>
                    </FormRowTwo>
                    <FormField label="Concern Details">
                        <Textarea 
                            value={ticket.details} 
                            readOnly 
                            className="bg-muted min-h-[120px] resize-none" 
                        />
                    </FormField>
                </FormSection>

                <FormSection title="User Information" description="Details of the user who raised the ticket.">
                    <FormRowTwo>
                        <FormField label="User Name">
                            <Input value={ticket.user_id?.name || 'Guest User'} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="User ID">
                            <Input value={ticket.user_id?._id || '-'} readOnly className="bg-muted text-xs font-mono" />
                        </FormField>
                    </FormRowTwo>
                    <FormRowTwo>
                        <FormField label="Email">
                            <Input value={ticket.user_id?.email || '-'} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Phone">
                            <Input value={ticket.user_id?.phone || '-'} readOnly className="bg-muted" />
                        </FormField>
                    </FormRowTwo>
                </FormSection>

                <FormSection title="Record Details" description="Timestamps for this ticket.">
                    <FormRowTwo>
                        <FormField label="Created At">
                            <Input value={format(new Date(ticket.created_at), "PPpp")} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Last Updated">
                            <Input value={format(new Date(ticket.updated_at), "PPpp")} readOnly className="bg-muted" />
                        </FormField>
                    </FormRowTwo>
                </FormSection>
            </div>
        </FormContainer>
    );
}
