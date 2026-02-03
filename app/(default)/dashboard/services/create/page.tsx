"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { ServiceFormData } from "../model";
import { useCreateServiceMutation } from "../controller";
import { getSalons } from "../../salons/controller";
import { getServiceCategories } from "../../utility/service-category/controller";

export default function CreateServicePage() {
    const router = useRouter();
    const createServiceMutation = useCreateServiceMutation();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ServiceFormData>({
        defaultValues: {
            salon_id: "",
            service_category_id: "",
            name: "",
            original_price: 0,
            discount_percentage: 0,
            duration_minutes: 0,
            gender: "male",
            description: "",
            tax_details: {
                cgst_percentage: 9,
                sgst_percentage: 9,
                igst_percentage: 0,
            },
        },
    });

    // Reference Data
    const { data: salonsData, isLoading: isLoadingSalons } = useQuery({
        queryKey: ["salons", "all"],
        queryFn: () => getSalons(1, 1000),
    });
    const salons = salonsData?.data || [];

    const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
        queryKey: ["service-categories", "all"],
        queryFn: () => getServiceCategories(1, 1000),
    });
    const categories = categoriesData?.data || [];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: ServiceFormData) => {
        // Prepare data inside mutation or here. 
        // Controller expects ServiceFormData but with image as FileList usually from register.
        // We passed register("image") to Input type="file", so data.image should be FileList.
        await createServiceMutation.mutateAsync(data);
    };

    const handleCancel = () => {
        router.push("/dashboard/services");
    };

    return (
        <FormContainer>
            <FormBreadcrumb
                items={[
                    "Dashboard",
                    "Services",
                    "Create Service",
                ]}
            />
            <FormTitleCard
                title="Create New Service"
                description="Add a new service to a salon."
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <FormSection title="Service Details" description="Basic information about the service.">
                    <FormRowTwo>
                        <FormField label="Salon" required error={errors.salon_id?.message}>
                            <Controller
                                name="salon_id"
                                control={control}
                                rules={{ required: "Salon is required" }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={isLoadingSalons ? "Loading..." : "Select Salon"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {salons.map((salon) => (
                                                <SelectItem key={salon._id} value={salon._id}>
                                                    {salon.salon_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </FormField>
                        <FormField label="Category" required error={errors.service_category_id?.message}>
                            <Controller
                                name="service_category_id"
                                control={control}
                                rules={{ required: "Category is required" }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Select Category"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat._id} value={cat._id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </FormField>
                    </FormRowTwo>

                    <FormRowTwo>
                        <FormField label="Service Name" required error={errors.name?.message}>
                            <Input {...register("name", { required: "Name is required" })} placeholder="Fade Cut" />
                        </FormField>
                        <FormField label="Gender" required error={errors.gender?.message}>
                            <Controller
                                name="gender"
                                control={control}
                                rules={{ required: "Gender is required" }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="unisex">Unisex</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </FormField>
                    </FormRowTwo>

                    <FormField label="Description" required error={errors.description?.message}>
                        <Textarea {...register("description", { required: "Description is required" })} placeholder="Service details..." />
                    </FormField>
                </FormSection>

                {/* Pricing & Time */}
                <FormSection title="Pricing & Duration" description="Set price, discount, and duration.">
                    <FormRowTwo>
                        <FormField label="Original Price" required error={errors.original_price?.message}>
                            <Input
                                type="number"
                                {...register("original_price", { required: "Price is required", min: 0 })}
                                placeholder="0.00"
                            />
                        </FormField>
                        <FormField label="Discount (%)" error={errors.discount_percentage?.message}>
                            <Input
                                type="number"
                                {...register("discount_percentage", { min: 0, max: 100 })}
                                placeholder="0"
                            />
                        </FormField>
                    </FormRowTwo>
                    <FormRowTwo>
                        <FormField label="Duration (Minutes)" required error={errors.duration_minutes?.message}>
                            <Input
                                type="number"
                                {...register("duration_minutes", { required: "Duration is required", min: 1 })}
                                placeholder="30"
                            />
                        </FormField>
                        <div />
                    </FormRowTwo>
                </FormSection>

                {/* Tax Information */}
                <FormSection title="Tax Settings" description="Configure tax percentages.">
                    <FormRowTwo>
                        <FormField label="CGST (%)" error={errors.tax_details?.cgst_percentage?.message}>
                            <Input
                                type="number"
                                {...register("tax_details.cgst_percentage", { min: 0 })}
                                placeholder="9"
                            />
                        </FormField>
                        <FormField label="SGST (%)" error={errors.tax_details?.sgst_percentage?.message}>
                            <Input
                                type="number"
                                {...register("tax_details.sgst_percentage", { min: 0 })}
                                placeholder="9"
                            />
                        </FormField>
                    </FormRowTwo>
                </FormSection>

                {/* Media */}
                <FormSection title="Service Image" description="Upload a cover image for the service.">
                    <FormField label="Image" error={(errors as any).image?.message}>
                        <div className="space-y-4">
                            {imagePreview && (
                                <div className="w-24 h-24 border rounded-md overflow-hidden">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                {...register("image")}
                                onChange={(e) => {
                                    register("image").onChange(e); // allow hook form to track it
                                    handleImageChange(e);
                                }}
                            />
                        </div>
                    </FormField>
                </FormSection>

                <FormActions
                    onCancel={handleCancel}
                    isLoading={createServiceMutation.isPending}
                    isEdit={false}
                    submitText="Create Service"
                />
            </form>
        </FormContainer>
    );
}
