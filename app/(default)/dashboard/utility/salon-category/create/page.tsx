"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { salonCategorySchema, SalonCategoryFormData } from "../model";
import { useCreateSalonCategoryMutation } from "../controller";
import { Textarea } from "@/components/ui/textarea";

const CreateSalonCategoryPage = () => {
    const router = useRouter();
    const createMutation = useCreateSalonCategoryMutation();

    const {
        register,
        handleSubmit,
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

    const onSubmit = async (data: SalonCategoryFormData) => {
        try {
            await createMutation.mutateAsync(data);
        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    const handleCancel = () => {
        router.push("/dashboard/utility/salon-category");
    };

    return (
        <FormContainer>
            <FormBreadcrumb
                items={[
                    "Dashboard",
                    "Utility",
                    "Salon Categories",
                    "Add New Category",
                ]}
            />

            <FormTitleCard
                title="Add Salon Category"
                description="Create a new salon category with an icon."
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
                                placeholder="e.g. Men's Saloon"
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
                            placeholder="Describe the category..."
                            {...register("description")}
                        />
                    </FormField>

                    <FormField
                        error={(errors as any).icon?.message || (errors as any).icon?.item?.message}
                        label="Icon"
                        required
                    >
                        <Input
                            type="file"
                            accept="image/*"
                            className="pt-2"
                            {...register("icon")}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Upload an image for the category icon.</p>
                    </FormField>

                </FormSection>

                <FormActions
                    onCancel={handleCancel}
                    isLoading={createMutation.isPending}
                    isEdit={false}
                    submitText="Create Category"
                />
            </form>
        </FormContainer>
    );
};

export default CreateSalonCategoryPage;
