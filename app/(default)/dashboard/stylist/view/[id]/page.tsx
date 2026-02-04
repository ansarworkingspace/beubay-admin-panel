"use client";

import React from 'react';
import { useStylistDetails } from '../../controller';
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

export default function ViewStylistPage() {
    const params = useParams();
    const id = typeof params.id === 'string' ? decodeURIComponent(params.id) : '';
    const { data: stylist, isLoading, error } = useStylistDetails(id);

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent message="Failed to load stylist details" />;

    if (!stylist) return <ErrorComponent message="Stylist not found" />;

    const getSalonName = (salon: any) => salon?.salon_name || salon || '-';

    return (
        <FormContainer>
            <FormBreadcrumb items={['Dashboard', 'Stylists', 'View Stylist']} />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{stylist.name}</h2>
                    <p className="text-muted-foreground">{getSalonName(stylist.salon_id)}</p>
                </div>
                <Link href={`/dashboard/stylist/edit/${id}`}>
                    <Button variant="outline" className="gap-2">
                        <SquarePen className="w-4 h-4" /> Edit
                    </Button>
                </Link>
            </div>

            <div className="space-y-6">
                <FormSection title="Stylist Details" description="Personal information about the stylist.">
                    <FormRowTwo>
                        <FormField label="Full Name">
                            <Input value={stylist.name} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Status">
                            <div className="flex items-center h-10">
                                <Badge variant={stylist.is_active ? "default" : "destructive"}>
                                    {stylist.is_active ? "Active" : "Inactive"}
                                </Badge>
                                <span className="ml-2 text-sm text-muted-foreground">
                                    {stylist.is_available ? "(Available)" : "(Unavailable)"}
                                </span>
                            </div>
                        </FormField>
                    </FormRowTwo>
                    <FormRowTwo>
                        <FormField label="Email">
                            <Input value={stylist.email} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Phone">
                            <Input value={stylist.phone} readOnly className="bg-muted" />
                        </FormField>
                    </FormRowTwo>
                    <FormRowTwo>
                        <FormField label="Salon">
                            <Input value={getSalonName(stylist.salon_id)} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Experience (Years)">
                            <Input value={stylist.experience_years} readOnly className="bg-muted" />
                        </FormField>
                    </FormRowTwo>
                    <FormField label="Bio">
                        <Textarea value={stylist.bio} readOnly className="bg-muted min-h-[100px]" />
                    </FormField>
                </FormSection>

                <FormSection title="Skills & Metrics" description="Skills and performance metrics.">
                    <FormField label="Service Categories">
                        <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted min-h-[42px]">
                            {stylist.service_category_ids && Array.isArray(stylist.service_category_ids) && stylist.service_category_ids.length > 0 ? (
                                stylist.service_category_ids.map((cat: any) => (
                                    <Badge key={cat._id || cat} variant="secondary">
                                        {cat.name || "Unknown"}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-sm text-muted-foreground">No specific skills listed</span>
                            )}
                        </div>
                    </FormField>

                    <FormRowTwo>
                        <FormField label="Average Rating">
                            <Input value={stylist.average_rating} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Total Ratings">
                            <Input value={stylist.total_ratings} readOnly className="bg-muted" />
                        </FormField>
                    </FormRowTwo>
                </FormSection>

                <FormSection title="Profile Image" description="Stylist's profile picture.">
                    <div className="flex gap-6 items-start">
                        <div className="space-y-2">
                            {stylist.profile_image ? (
                                <div className="border rounded-full p-1 bg-white inline-block overflow-hidden w-64 h-64">
                                    <img src={stylist.profile_image} alt={stylist.name} className="w-full h-full object-cover rounded-full" />
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
