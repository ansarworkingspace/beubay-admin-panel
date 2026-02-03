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

    return (
        <FormContainer>
            <FormBreadcrumb items={['Dashboard', 'Salons', 'View Salon']} />

            <div className="flex justify-between items-start">
                <FormTitleCard
                    title={salon.salon_name}
                    description={`Owned by ${salon.owner_name}`}
                />
                <Link href={`/dashboard/salons/edit/${id}`}>
                    <Button variant="outline" className="gap-2">
                        <SquarePen className="w-4 h-4" /> Edit
                    </Button>
                </Link>
            </div>

            <div className="space-y-6">
                <FormSection title="Basic Details" description="Core information about the salon.">
                    <FormRowTwo>
                        <div className="space-y-2">
                            <span className="text-sm font-medium text-muted-foreground">Salon Name</span>
                            <div className="p-2 border rounded-md">{salon.salon_name}</div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-sm font-medium text-muted-foreground">Owner Name</span>
                            <div className="p-2 border rounded-md">{salon.owner_name}</div>
                        </div>
                    </FormRowTwo>
                    <FormRowTwo>
                        <div className="space-y-2">
                            <span className="text-sm font-medium text-muted-foreground">Email</span>
                            <div className="p-2 border rounded-md">{salon.email}</div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-sm font-medium text-muted-foreground">Phone</span>
                            <div className="p-2 border rounded-md">{salon.phone}</div>
                        </div>
                    </FormRowTwo>
                    <FormRowTwo>
                        <div className="space-y-2">
                            <span className="text-sm font-medium text-muted-foreground">Status</span>
                            <div className="pt-2">
                                <Badge variant={salon.is_active ? "default" : "destructive"}>
                                    {salon.is_active ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-sm font-medium text-muted-foreground">Verified</span>
                            <div className="pt-2">
                                <Badge variant={salon.is_verified ? "secondary" : "outline"}>
                                    {salon.is_verified ? "Verified" : "Not Verified"}
                                </Badge>
                            </div>
                        </div>
                    </FormRowTwo>
                </FormSection>

                <FormSection title="Location" description="Where the salon is located.">
                    <div className="space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Address</span>
                        <div className="p-2 border rounded-md">{salon.address}</div>
                    </div>
                </FormSection>

                <FormSection title="Media" description="Logo and images.">
                    <div className="flex gap-4 items-center">
                        <div className="space-y-2">
                            <span className="text-sm font-medium text-muted-foreground block">Logo</span>
                            {salon.logo_url ? (
                                <img src={salon.logo_url} alt="Logo" className="w-24 h-24 object-cover rounded-md border" />
                            ) : (
                                <div className="p-2 text-sm text-muted-foreground">No Logo</div>
                            )}
                        </div>
                        <div className="space-y-2 flex-1">
                            <span className="text-sm font-medium text-muted-foreground block">Images</span>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {salon.images && salon.images.length > 0 ? (
                                    salon.images.map((img, i) => (
                                        <img key={i} src={img} alt={`Salon ${i}`} className="w-24 h-24 object-cover rounded-md border" />
                                    ))
                                ) : (
                                    <div className="p-2 text-sm text-muted-foreground">No Images</div>
                                )}
                            </div>
                        </div>
                    </div>
                </FormSection>
            </div>
        </FormContainer>
    );
}
