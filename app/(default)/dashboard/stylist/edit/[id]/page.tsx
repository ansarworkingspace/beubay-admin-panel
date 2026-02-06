"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { MultiSelect } from "@/components/ui/multi-select";
import { Loading } from "@/components/ui/loading";
import { Error as ErrorComponent } from "@/components/ui/error";

import { StylistFormData } from "../../model";
import { useUpdateStylistMutation, useStylistDetails } from "../../controller";
import { AvailabilityForm } from "../../components/AvailabilityForm";
import { getSalons } from "../../../salons/controller";
import { getServiceCategories } from "../../../utility/service-category/controller";

export default function EditStylistPage() {
    const router = useRouter();
    const params = useParams();
    const id = typeof params.id === 'string' ? decodeURIComponent(params.id) : '';

    const { data: stylist, isLoading: isStylistLoading, error: stylistError } = useStylistDetails(id);
    const updateStylistMutation = useUpdateStylistMutation(id);

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isFormReady, setIsFormReady] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<StylistFormData>({
        defaultValues: {
            salon_id: "",
            name: "",
            email: "",
            phone: "",
            experience_years: 0,
            bio: "",
            service_category_ids: [],
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

    const categoryOptions = categories.map(cat => ({
        label: cat.name,
        value: cat._id
    }));

    // Populate Form
    useEffect(() => {
        if (stylist) {
            const getId = (item: any) => (item && typeof item === 'object' && item._id) ? item._id : item;

            // Handle service categories: if they are objects, extract _id, if strings, keep them.
            const serviceCategoryIds = Array.isArray(stylist.service_category_ids)
                ? stylist.service_category_ids.map(getId)
                : [];

            reset({
                salon_id: getId(stylist.salon_id) || "",
                name: stylist.name,
                email: stylist.email,
                phone: stylist.phone,
                experience_years: stylist.experience_years,
                bio: stylist.bio,
                service_category_ids: serviceCategoryIds,
                availability: stylist.availability,
            });

            if (stylist.profile_image) {
                setImagePreview(stylist.profile_image);
            }
            setIsFormReady(true);
        }
    }, [stylist, reset]);

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

    const onSubmit = async (data: StylistFormData) => {
        await updateStylistMutation.mutateAsync(data);
    };

    const handleCancel = () => {
        router.push("/dashboard/stylist");
    };

    if (isStylistLoading || isLoadingSalons || isLoadingCategories || !isFormReady) return <Loading />;
    if (stylistError || !stylist) return <ErrorComponent message="Failed to load stylist details" />;

    return (
        <FormContainer>
            <FormBreadcrumb
                items={[
                    "Dashboard",
                    "Stylists",
                    "Edit Stylist",
                ]}
            />
            <FormTitleCard
                title="Edit Stylist"
                description="Update stylist details."
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <FormSection title="Stylist Details" description="Personal information about the stylist.">
                    <FormRowTwo>
                        <FormField label="Salon" required error={errors.salon_id?.message}>
                            <Controller
                                name="salon_id"
                                control={control}
                                rules={{ required: "Salon is required" }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Salon" />
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
                        <FormField label="Full Name" required error={errors.name?.message}>
                            <Input {...register("name", { required: "Name is required" })} placeholder="John Doe" />
                        </FormField>
                    </FormRowTwo>

                    <FormRowTwo>
                        <FormField label="Email" required error={errors.email?.message}>
                            <Input
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                placeholder="john@example.com"
                            />
                        </FormField>
                        <FormField label="Phone Number" required error={errors.phone?.message}>
                            <Input
                                type="tel"
                                {...register("phone", {
                                    required: "Phone is required",
                                    minLength: { value: 10, message: "Phone must be at least 10 digits" }
                                })}
                                placeholder="9876543210"
                            />
                        </FormField>
                    </FormRowTwo>

                    <FormRowTwo>
                        <FormField label="Experience (Years)" required error={errors.experience_years?.message}>
                            <Input
                                type="number"
                                {...register("experience_years", { required: "Experience is required", min: 0 })}
                                placeholder="2"
                            />
                        </FormField>
                        <div />
                    </FormRowTwo>

                    <FormField label="Bio" required error={errors.bio?.message}>
                        <Textarea {...register("bio", { required: "Bio is required" })} placeholder="Stylist background and expertise..." />
                    </FormField>
                </FormSection>

                {/* Skills */}
                <FormSection title="Skills & Specialties" description="Select the services this stylist can perform.">
                    <FormField label="Service Categories" required error={errors.service_category_ids?.message}>
                        <Controller
                            name="service_category_ids"
                            control={control}
                            rules={{ required: "At least one category is required" }}
                            render={({ field }) => (
                                <MultiSelect
                                    options={categoryOptions}
                                    selected={field.value}
                                    onChange={field.onChange}
                                    placeholder="Select Service Categories"
                                />
                            )}
                        />
                    </FormField>
                </FormSection>

                {/* Media */}
                <FormSection title="Profile Image" description="Update profile picture.">
                    <FormField label="Image" error={(errors as any).profile_image?.message}>
                        <div className="space-y-4">
                            {imagePreview && (
                                <div className="w-24 h-24 border rounded-full overflow-hidden">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                {...register("profile_image")}
                                onChange={(e) => {
                                    register("profile_image").onChange(e);
                                    handleImageChange(e);
                                }}
                            />
                        </div>
                    </FormField>
                </FormSection>

                {/* Availability */}
                <AvailabilityForm
                    control={control}
                    register={register}
                    setValue={setValue}
                    getValues={getValues}
                    errors={errors}
                />

                <FormActions
                    onCancel={handleCancel}
                    isLoading={updateStylistMutation.isPending}
                    isEdit={true}
                    submitText="Update Stylist"
                />
            </form>
        </FormContainer>
    );
}
