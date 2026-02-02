"use client";

import React from "react";
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
import { Pencil } from "lucide-react";
import { getCityDetails } from "../../controller";
import { useQuery } from "@tanstack/react-query";

const ViewCity = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    // Use useQuery for data fetching with caching
    const { data: cityData, isLoading, error: queryError } = useQuery({
        queryKey: ['city', id],
        queryFn: () => getCityDetails(id),
        enabled: !!id
    });

    // Convert error to string if present
    const error = queryError instanceof Error ? queryError.message : (queryError as unknown as string);

    if (isLoading) return <FormContainer><Loading /></FormContainer>;
    if (error || !cityData) return <FormContainer><ErrorComponent message={error || "City not found"} /></FormContainer>;

    return (
        <FormContainer>
            <FormBreadcrumb items={["Dashboard", "Utility", "Cities", "View Details"]} />

            <div className="flex items-center justify-between mb-6">
                <div />
                <Button onClick={() => router.push(`/dashboard/utility/city/edit/${id}`)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
            </div>


            <FormTitleCard
                title="City Details"
                description={`View details for ${cityData.name}`}
            />

            <div className="space-y-6 mt-6">
                <FormSection title="Basic Information">
                    <FormRowTwo>
                        <FormField label="City Name">
                            <Input value={cityData.name} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Country">
                            <Input value={(cityData as any).country_name || (cityData as any).country?.name || cityData.country_id} readOnly className="bg-muted" />
                        </FormField>
                    </FormRowTwo>

                    <FormRowTwo>
                        <FormField label="State">
                            <Input value={(cityData as any).state_name || (cityData as any).state?.name || cityData.state_id} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Status">
                            <div className="flex items-center h-10">
                                <Badge
                                    variant={cityData.is_active ? "default" : "destructive"}
                                    className={cityData.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                                >
                                    {cityData.is_active ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </FormField>
                    </FormRowTwo>
                </FormSection>
            </div>
        </FormContainer>
    );
};

export default ViewCity;
