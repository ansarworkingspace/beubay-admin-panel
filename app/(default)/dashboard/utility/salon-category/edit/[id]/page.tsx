"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import {
    FormActions,
    FormBreadcrumb,
    FormContainer,
    FormField,
    FormRowTwo,
    FormSection,
    FormTitleCard,
} from "@/components/shared/form/FormLayouts";
import { Input } from "@/components/ui/input";
import { Error as ErrorComponent } from "@/components/ui/error";
import { Loading } from "@/components/ui/loading";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { salonCategorySchema, SalonCategoryFormData } from "../../model";
import { useUpdateSalonCategoryMutation, getSalonCategoryDetails } from "../../controller";
import { Textarea } from "@/components/ui/textarea";

const EditSalonCategoryPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const updateMutation = useUpdateSalonCategoryMutation(id);

    // Fetch Details
    const { data: categoryData, isLoading, error: queryError } = useQuery({
        queryKey: ['salon-category', id],
        queryFn: () => getSalonCategoryDetails(id),
        enabled: !!id
    });

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<SalonCategoryFormData>({
        resolver: zodResolver(salonCategorySchema) as any,
        defaultValues: {
            name: "",
            description: "",
            display_order: 1,
            is_active: true,
        },
    });

    // Populate form data
    useEffect(() => {
        if (categoryData) {
            reset({
                name: categoryData.name,
                description: categoryData.description,
                display_order: categoryData.display_order,
                is_active: categoryData.is_active,
            });
        }
    }, [categoryData, reset]);

    const onSubmit = async (data: SalonCategoryFormData) => {
        try {
            await updateMutation.mutateAsync(data);
        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    const handleCancel = () => {
        router.push("/dashboard/utility/salon-category");
    };

    if (isLoading) return <FormContainer><Loading /></FormContainer>;
    if (queryError || !categoryData) return <FormContainer><ErrorComponent message="Category not found" /></FormContainer>;

    return (
        <FormContainer>
            <FormBreadcrumb
                items={[
                    "Dashboard",
                    "Utility",
                    "Salon Categories",
                    "Edit Category",
                ]}
            />

            <FormTitleCard
                title="Edit Salon Category"
                description="Update category details."
            />

            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
                <FormSection
                    title="Category Details"
                    description="Basic information and icon"
                >
                    <FormRowTwo>
                        <FormField
                            error={errors.name?.message}
                            label="Category Name"
                            required
                        >
                            <Input
                                type="text"
                                {...register("name")}
                            />
                        </FormField>

                        <FormField
                            error={errors.display_order?.message}
                            label="Display Order"
                            required
                        >
                            <Input
                                type="number"
                                min={1}
                                {...register("display_order")}
                            />
                        </FormField>
                    </FormRowTwo>

                    <FormField
                        error={errors.description?.message}
                        label="Description"
                        required
                    >
                        <Textarea
                            {...register("description")}
                        />
                    </FormField>

                    <FormRowTwo>
                        <FormField
                            label="Current Icon"
                        >
                            {categoryData.icon_url ? (
                                <div className="border rounded p-2 bg-muted w-fit">
                                    <img
                                        src={categoryData.icon_url}
                                        alt="Current Icon"
                                        className="w-16 h-16 object-cover rounded"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/64x64?text=?'; }}
                                    />
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground p-4 border rounded bg-muted w-fit">No Icon</div>
                            )}
                        </FormField>

                        <FormField
                            error={(errors as any).icon?.message}
                            label="Update Icon (Optional)"
                        >
                            <Input
                                type="file"
                                accept="image/*"
                                className="pt-2"
                                {...register("icon")}
                            />
                            <p className="text-xs text-muted-foreground mt-1">Select a new image to replace the current one.</p>
                        </FormField>
                    </FormRowTwo>

                    <FormRowTwo>
                        <FormField error={errors.is_active?.message} label="Status" required>
                            <Controller
                                name="is_active"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => field.onChange(value === 'true')}
                                        value={field.value ? "true" : "false"}
                                    >
                                        <SelectTrigger id="is_active" className="w-full">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">Active</SelectItem>
                                            <SelectItem value="false">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </FormField>
                        <div></div>
                    </FormRowTwo>

                </FormSection>

                <FormActions
                    onCancel={handleCancel}
                    isLoading={updateMutation.isPending}
                    isEdit={true}
                    submitText="Update Category"
                />
            </form>
        </FormContainer>
    );
};

export default EditSalonCategoryPage;
