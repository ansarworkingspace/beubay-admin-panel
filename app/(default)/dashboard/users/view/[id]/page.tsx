"use client";

import React from 'react';
import { useCustomerDetails } from '../../controller';
import { Loading } from "@/components/ui/loading";
import { Error as ErrorComponent } from "@/components/ui/error";
import { FormBreadcrumb, FormContainer, FormSection, FormRowTwo, FormField } from "@/components/shared/form/FormLayouts";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SquarePen, UserRound } from 'lucide-react';
import { useParams } from 'next/navigation';
import { format } from "date-fns";

export default function ViewUserPage() {
    const params = useParams();
    const id = typeof params.id === 'string' ? decodeURIComponent(params.id) : '';
    const { data: customer, isLoading, error } = useCustomerDetails(id);

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent message="Failed to load user details" />;
    if (!customer) return <ErrorComponent message="User not found" />;

    return (
        <FormContainer>
            <FormBreadcrumb items={['Dashboard', 'User Management', 'View User']} />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{customer.name || "Unknown User"}</h2>
                    <p className="text-muted-foreground">{customer.phone}</p>
                </div>
                <Link href={`/dashboard/users/edit/${id}`}>
                    <Button variant="outline" className="gap-2">
                        <SquarePen className="w-4 h-4" /> Edit
                    </Button>
                </Link>
            </div>

            <div className="space-y-6">
                <FormSection title="Personal Information" description="Details about the user.">
                    <FormRowTwo>
                        <FormField label="Full Name">
                            <Input value={customer.name || '-'} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Status">
                            <div className="flex items-center h-10 gap-2">
                                <Badge variant={customer.is_active ? "default" : "destructive"}>
                                    {customer.is_active ? "Active" : "Inactive"}
                                </Badge>
                                {customer.is_deleted && <Badge variant="destructive">Deleted</Badge>}
                            </div>
                        </FormField>
                    </FormRowTwo>
                    <FormRowTwo>
                        <FormField label="Email">
                            <div className="relative">
                                <Input value={customer.email || '-'} readOnly className="bg-muted" />
                                {customer.is_email_verified && customer.email && (
                                    <Badge className="absolute right-2 top-2.5 h-5 bg-green-500 hover:bg-green-600">Verified</Badge>
                                )}
                            </div>
                        </FormField>
                        <FormField label="Phone">
                            <div className="relative">
                                <Input value={customer.phone} readOnly className="bg-muted" />
                                {customer.is_phone_verified && (
                                    <Badge className="absolute right-2 top-2.5 h-5 bg-green-500 hover:bg-green-600">Verified</Badge>
                                )}
                            </div>
                        </FormField>
                    </FormRowTwo>
                    <FormRowTwo>
                        <FormField label="Gender">
                            <Input value={customer.gender || '-'} readOnly className="bg-muted capitalize" />
                        </FormField>
                        <FormField label="Date of Birth">
                            <Input
                                value={customer.date_of_birth ? format(new Date(customer.date_of_birth), "PPP") : '-'}
                                readOnly
                                className="bg-muted"
                            />
                        </FormField>
                    </FormRowTwo>
                    <FormField label="Preferred Language">
                        <Input value={customer.preferred_language || '-'} readOnly className="bg-muted" />
                    </FormField>
                </FormSection>

                <FormSection title="Account Image" description="User's profile image.">
                    <div className="flex gap-6 items-start">
                        <div className="space-y-2">
                            {customer.profile_image ? (
                                <div className="border rounded-full p-1 bg-white inline-block overflow-hidden w-64 h-64">
                                    <img src={customer.profile_image} alt={customer.name} className="w-full h-full object-cover rounded-full" />
                                </div>
                            ) : (
                                <div className="p-10 border rounded-full bg-muted flex items-center justify-center w-64 h-64">
                                    <UserRound className="w-20 h-20 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Timestamps" description="Record creation details.">
                    <FormRowTwo>
                        <FormField label="Created At">
                            <Input value={format(new Date(customer.created_at), "PPpp")} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Last Updated">
                            <Input value={format(new Date(customer.updated_at), "PPpp")} readOnly className="bg-muted" />
                        </FormField>
                    </FormRowTwo>
                </FormSection>
            </div>
        </FormContainer>
    );
}
