"use client";

import React from 'react';
import { useServiceDetails } from '../../controller';
import { Loading } from "@/components/ui/loading";
import { Error as ErrorComponent } from "@/components/ui/error";
import { FormBreadcrumb, FormContainer, FormSection, FormRowTwo, FormField } from "@/components/shared/form/FormLayouts";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SquarePen } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Textarea } from "@/components/ui/textarea";

export default function ViewServicePage() {
    const params = useParams();
    const id = typeof params.id === 'string' ? decodeURIComponent(params.id) : '';
    const { data: service, isLoading, error } = useServiceDetails(id);

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent message="Failed to load service details" />;

    if (!service) return <ErrorComponent message="Service not found" />;

    // Helper to safely get name from populated object
    const getSalonName = (salon: any) => salon?.salon_name || salon || '-';

    return (
        <FormContainer>
            <FormBreadcrumb items={['Dashboard', 'Services', 'View Service']} />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{service.name}</h2>
                    <p className="text-muted-foreground">{getSalonName(service.salon_id)}</p>
                </div>
                <Link href={`/dashboard/services/edit/${id}`}>
                    <Button variant="outline" className="gap-2">
                        <SquarePen className="w-4 h-4" /> Edit
                    </Button>
                </Link>
            </div>

            <div className="space-y-6">
                <FormSection title="Service Details" description="Core information about the service.">
                    <FormRowTwo>
                        <FormField label="Service Name">
                            <Input value={service.name} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Status">
                            <div className="flex items-center h-10">
                                <Badge variant={service.is_active ? "default" : "destructive"}>
                                    {service.is_active ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </FormField>
                    </FormRowTwo>
                    <FormRowTwo>
                        <FormField label="Salon">
                            <Input value={getSalonName(service.salon_id)} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Category">
                            {/* Category might need fetching or be populated if backend supports it. Assuming ID for now if not populated. */}
                            <Input value={service.service_category_id?.name || '-'} readOnly className="bg-muted" />
                        </FormField>
                    </FormRowTwo>
                    <FormRowTwo>
                        <FormField label="Gender">
                            <Input value={service.gender} readOnly className="bg-muted capitalize" />
                        </FormField>
                        <FormField label="Duration (Minutes)">
                            <Input value={service.duration_minutes} readOnly className="bg-muted" />
                        </FormField>
                    </FormRowTwo>
                    <FormField label="Description">
                        <Textarea value={service.description} readOnly className="bg-muted min-h-[100px]" />
                    </FormField>
                </FormSection>

                <FormSection title="Pricing & Tax" description="Price breakdown and tax details.">
                    <FormRowTwo>
                        <FormField label="Original Price">
                            <Input value={service.original_price} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Discount (%)">
                            <Input value={service.discount_percentage} readOnly className="bg-muted" />
                        </FormField>
                    </FormRowTwo>
                    <FormRowTwo>
                        <FormField label="Discount Amount">
                            <Input value={service.discount_amount} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Final Price">
                            <Input value={service.final_price} readOnly className="bg-muted font-bold" />
                        </FormField>
                    </FormRowTwo>
                    <div className="grid grid-cols-3 gap-4 border p-4 rounded-md bg-muted/50">
                        <FormField label="CGST (%)">
                            <Input value={service.tax_details.cgst_percentage} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="SGST (%)">
                            <Input value={service.tax_details.sgst_percentage} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Total Tax (%)">
                            <Input value={(service.tax_details.cgst_percentage || 0) + (service.tax_details.sgst_percentage || 0)} readOnly className="bg-muted" />
                        </FormField>
                    </div>
                </FormSection>

                <FormSection title="Service Image" description="Cover image for the service.">
                    <div className="flex gap-6 items-start">
                        <div className="space-y-2">
                            {service.image_url ? (
                                <div className="border rounded-md p-1 bg-white inline-block">
                                    <img src={service.image_url} alt={service.name} className="w-64 h-64 object-cover rounded-md" />
                                </div>
                            ) : (
                                <div className="p-4 border rounded-md bg-muted text-sm text-muted-foreground">No Image</div>
                            )}
                        </div>
                    </div>
                </FormSection>
            </div>
        </FormContainer>
    );
}
