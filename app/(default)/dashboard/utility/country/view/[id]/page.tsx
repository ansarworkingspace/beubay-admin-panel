"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    FormBreadcrumb,
    FormContainer,
    FormRowTwo,
    FormSection,
    FormTitleCard,
    FormField,
} from "@/components/shared/form/FormLayouts";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Error as ErrorComponent } from "@/components/ui/error";
import { Loading } from "@/components/ui/loading";
import { Pencil, ArrowLeft } from "lucide-react";
import { getCountryDetails } from "../../controller";
import { CountryFormData } from "../../model";
import { useQuery } from "@tanstack/react-query";

const ViewCountry = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    // Use useQuery for data fetching with caching
    const { data: country, isLoading, error: queryError } = useQuery({
        queryKey: ['country', id],
        queryFn: () => getCountryDetails(id),
        enabled: !!id
    });

    // Convert error to string if present
    const error = queryError instanceof Error ? queryError.message : (queryError as unknown as string);

    if (isLoading) return <FormContainer><Loading /></FormContainer>;
    if (error || !country) return <FormContainer><ErrorComponent message={error || "Country not found"} /></FormContainer>;

    return (
        <FormContainer>
            <div className="flex items-center justify-between">
                <FormBreadcrumb items={["Dashboard", "Utility", "Countries", "View Details"]} />
                <Button onClick={() => router.push(`/dashboard/utility/country/form/${id}`)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
            </div>

            <FormTitleCard
                title="Country Details"
                description={`View details for ${country.name}`}
            />

            <div className="space-y-6">
                <FormSection title="Basic Information">
                    <FormRowTwo>
                        <FormField label="Country Name">
                            <Input value={country.name} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Phone Code">
                            <Input value={country.phone_code} readOnly className="bg-muted" />
                        </FormField>
                    </FormRowTwo>

                    <FormRowTwo>
                        <FormField label="Currency">
                            <Input value={country.currency} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Currency Symbol">
                            <Input value={country.currency_symbol} readOnly className="bg-muted" />
                        </FormField>
                    </FormRowTwo>

                    <FormRowTwo>
                        <FormField label="Country Code">
                            <Input value={country.country_code} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Status">
                            <div className="flex items-center h-10">
                                <Badge
                                    variant={country.is_active ? "default" : "destructive"}
                                    className={country.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                                >
                                    {country.is_active ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </FormField>
                    </FormRowTwo>
                </FormSection>
            </div>
        </FormContainer>
    );
};

export default ViewCountry;
