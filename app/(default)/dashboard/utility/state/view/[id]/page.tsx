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
import { getStateDetails } from "../../controller";
import { useQuery } from "@tanstack/react-query";

const ViewState = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    // Use useQuery for data fetching with caching
    const { data: stateData, isLoading, error: queryError } = useQuery({
        queryKey: ['state', id],
        queryFn: () => getStateDetails(id),
        enabled: !!id
    });

    // Convert error to string if present
    const error = queryError instanceof Error ? queryError.message : (queryError as unknown as string);

    if (isLoading) return <FormContainer><Loading /></FormContainer>;
    if (error || !stateData) return <FormContainer><ErrorComponent message={error || "State not found"} /></FormContainer>;

    return (
        <FormContainer>
            <FormBreadcrumb items={["Dashboard", "Utility", "States", "View Details"]} />

            <div className="flex items-center justify-between mb-6">
                <div />
                <Button onClick={() => router.push(`/dashboard/utility/state/form/${id}`)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
            </div>


            <FormTitleCard
                title="State Details"
                description={`View details for ${stateData.name}`}
            />

            <div className="space-y-6 mt-6">
                <FormSection title="Basic Information">
                    <FormRowTwo>
                        <FormField label="State Name">
                            <Input value={stateData.name} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Country">
                            <Input value={stateData.country_name || "N/A"} readOnly className="bg-muted" />
                        </FormField>
                    </FormRowTwo>

                    <FormRowTwo>
                        <FormField label="State Code">
                            <Input value={stateData.state_code} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Status">
                            <div className="flex items-center h-10">
                                <Badge
                                    variant={stateData.is_active ? "default" : "destructive"}
                                    className={stateData.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                                >
                                    {stateData.is_active ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </FormField>
                    </FormRowTwo>
                </FormSection>
            </div>
        </FormContainer>
    );
};

export default ViewState;
