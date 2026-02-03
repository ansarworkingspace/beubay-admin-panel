"use client";

import React from 'react';
import { useSalonDetails } from '../../controller';
import { Loading } from "@/components/ui/loading";
import { Error as ErrorComponent } from "@/components/ui/error";
import { FormBreadcrumb, FormContainer, FormSection, FormRowTwo, FormField, FormTitleCard } from "@/components/shared/form/FormLayouts";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SquarePen } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function ViewSalonPage() {
    const params = useParams();
    const id = typeof params.id === 'string' ? decodeURIComponent(params.id) : '';
    const { data: salon, isLoading, error } = useSalonDetails(id);

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent message="Failed to load salon details" />;

    if (!salon) return <ErrorComponent message="Salon not found" />;

    // Helper to safely get name from populated object or string
    const getName = (field: any) => field?.name || field || '-';

    // Format time
    const formatTime = (time: string) => {
        if (!time) return '';
        // ample time format conversion if needed, assuming HH:mm 24h format
        return time;
    };

    return (
        <FormContainer>
            <FormBreadcrumb items={['Dashboard', 'Salons', 'View Salon']} />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{salon.salon_name}</h2>
                    <p className="text-muted-foreground">Owned by {salon.owner_name}</p>
                </div>
                <Link href={`/dashboard/salons/edit/${id}`}>
                    <Button variant="outline" className="gap-2">
                        <SquarePen className="w-4 h-4" /> Edit
                    </Button>
                </Link>
            </div>

            <div className="space-y-6">
                <FormSection title="Basic Details" description="Core information about the salon.">
                    <FormRowTwo>
                        <FormField label="Salon Name">
                            <Input value={salon.salon_name} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Owner Name">
                            <Input value={salon.owner_name} readOnly className="bg-muted" />
                        </FormField>
                    </FormRowTwo>
                    <FormRowTwo>
                        <FormField label="Email">
                            <Input value={salon.email} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Phone">
                            <Input value={salon.phone} readOnly className="bg-muted" />
                        </FormField>
                    </FormRowTwo>
                    <FormRowTwo>
                        <FormField label="Salon Category">
                            <Input value={getName(salon.salon_category_id)} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Status">
                            <div className="flex items-center h-10">
                                <Badge variant={salon.is_active ? "default" : "destructive"}>
                                    {salon.is_active ? "Active" : "Inactive"}
                                </Badge>
                                {salon.is_verified && (
                                    <Badge variant="secondary" className="ml-2">Verified</Badge>
                                )}
                            </div>
                        </FormField>
                    </FormRowTwo>
                    <FormField label="Service Categories">
                        <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted min-h-[42px]">
                            {salon.service_category_ids && Array.isArray(salon.service_category_ids) && salon.service_category_ids.length > 0 ? (
                                salon.service_category_ids.map((service: any, idx: number) => (
                                    <Badge key={idx} variant="outline" className="bg-background">
                                        {getName(service)}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-muted-foreground text-sm">No services listed</span>
                            )}
                        </div>
                    </FormField>
                </FormSection>

                <FormSection title="Location" description="Address and geographical details.">
                    <FormRowTwo>
                        <FormField label="Country">
                            <Input value={getName(salon.country_id)} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="State">
                            <Input value={getName(salon.state_id)} readOnly className="bg-muted" />
                        </FormField>
                    </FormRowTwo>
                    <FormRowTwo>
                        <FormField label="City">
                            <Input value={getName(salon.city_id)} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Address">
                            <Input value={salon.address} readOnly className="bg-muted" />
                        </FormField>
                    </FormRowTwo>
                    {salon.location && (
                        <FormRowTwo>
                            <FormField label="Latitude">
                                <Input value={salon.location.coordinates[1]} readOnly className="bg-muted" />
                            </FormField>
                            <FormField label="Longitude">
                                <Input value={salon.location.coordinates[0]} readOnly className="bg-muted" />
                            </FormField>
                        </FormRowTwo>
                    )}
                </FormSection>

                <FormSection title="Business Hours" description="Weekly opening hours.">
                    <div className="grid gap-2">
                        {salon.business_hours && Object.entries(salon.business_hours).map(([day, hours]: [string, any]) => (
                            <div key={day} className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                                <span className="capitalize font-medium w-32">{day}</span>
                                <div className="flex-1 text-right">
                                    {hours.is_open ? (
                                        <span className="text-sm">
                                            {formatTime(hours.opening_time)} - {formatTime(hours.closing_time)}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">Closed</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </FormSection>

                <FormSection title="Media" description="Logo and images.">
                    <div className="flex gap-6 items-start">
                        <div className="space-y-2">
                            <span className="text-sm font-medium text-muted-foreground block">Logo</span>
                            {salon.logo_url ? (
                                <div className="border rounded-md p-1 bg-white inline-block">
                                    <img src={salon.logo_url} alt="Logo" className="w-32 h-32 object-contain" />
                                </div>
                            ) : (
                                <div className="p-4 border rounded-md bg-muted text-sm text-muted-foreground">No Logo</div>
                            )}
                        </div>
                        <div className="space-y-2 flex-1">
                            <span className="text-sm font-medium text-muted-foreground block">Gallery Images</span>
                            <div className="flex flex-wrap gap-4">
                                {salon.images && salon.images.length > 0 ? (
                                    salon.images.map((img, i) => (
                                        <div key={i} className="border rounded-md p-1 bg-white">
                                            <img src={img} alt={`Salon ${i}`} className="w-32 h-32 object-cover" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 border rounded-md bg-muted text-sm text-muted-foreground w-full">No Images</div>
                                )}
                            </div>
                        </div>
                    </div>
                </FormSection>
            </div>
        </FormContainer>
    );
}
