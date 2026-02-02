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
import { getSalonCategoryDetails } from "../../controller";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";

const ViewSalonCategory = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: categoryData, isLoading, error: queryError } = useQuery({
        queryKey: ['salon-category', id],
        queryFn: () => getSalonCategoryDetails(id),
        enabled: !!id
    });

    const error = queryError instanceof Error ? queryError.message : (queryError as unknown as string);

    if (isLoading) return <FormContainer><Loading /></FormContainer>;
    if (error || !categoryData) return <FormContainer><ErrorComponent message={error || "Category not found"} /></FormContainer>;

    return (
        <FormContainer>
            <FormBreadcrumb items={["Dashboard", "Utility", "Salon Categories", "View Details"]} />

            <div className="flex items-center justify-between mb-6">
                <div />
                <Button onClick={() => router.push(`/dashboard/utility/salon-category/edit/${id}`)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
            </div>

            <FormTitleCard
                title="Category Details"
                description={`View details for ${categoryData.name}`}
            />

            <div className="space-y-6 mt-6">
                <FormSection title="Basic Information">
                    <FormRowTwo>
                        <FormField label="Category Name">
                            <Input value={categoryData.name} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Display Order">
                            <Input value={categoryData.display_order} readOnly className="bg-muted" />
                        </FormField>
                    </FormRowTwo>

                    <FormField label="Description">
                        <Textarea value={categoryData.description} readOnly className="bg-muted" />
                    </FormField>

                    <FormRowTwo>
                        <FormField label="Icon">
                            <div className="border rounded p-2 bg-muted w-fit">
                                {categoryData.icon_url ? (
                                    <img
                                        src={categoryData.icon_url}
                                        alt="Icon"
                                        className="w-16 h-16 object-cover rounded"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/64x64?text=?'; }}
                                    />
                                ) : <span className="text-sm">No Icon</span>}
                            </div>
                        </FormField>

                        <FormField label="Status">
                            <div className="flex items-center h-10">
                                <Badge
                                    variant={categoryData.is_active ? "default" : "destructive"}
                                    className={categoryData.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                                >
                                    {categoryData.is_active ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </FormField>
                    </FormRowTwo>
                </FormSection>
            </div>
        </FormContainer>
    );
};

export default ViewSalonCategory;
