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

import { serviceCategorySchema, ServiceCategoryFormData } from "../model";
import { useCreateServiceCategoryMutation } from "../controller";
import { Textarea } from "@/components/ui/textarea";

const CreateServiceCategoryPage = () => {
    const router = useRouter();
    const createMutation = useCreateServiceCategoryMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ServiceCategoryFormData>({
        resolver: zodResolver(serviceCategorySchema) as any,
        defaultValues: {
            name: "",
            description: "",
            display_order: 1,
            is_active: true,
        },
    });

    const onSubmit = async (data: ServiceCategoryFormData) => {
        try {
            await createMutation.mutateAsync(data);
        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    const handleCancel = () => {
        router.push("/dashboard/utility/service-category");
    };

    return (
        <FormContainer>
            <FormBreadcrumb
                items={[
                    "Dashboard",
                    "Utility",
                    "Service Categories",
                    "Add New Category",
                ]}
            />

            <FormTitleCard
                title="Add Service Category"
                description="Create a new service category with an icon."
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
                                placeholder="e.g. Hair Cut"
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
                        // error can be complex for file, but RHF usually puts it on root if typed correctly
                        // or we check errors.icon
                        error={(errors as any).icon?.message || (errors as any).icon?.item?.message}
                        label="Icon"
                        required // Schema says optional? No, effectively required for Create probably, but schema says optional type (any). Logic check: usually create requires icon.
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

export default CreateServiceCategoryPage;
