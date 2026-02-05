"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loading } from "@/components/ui/loading";
import { Error as ErrorComponent } from "@/components/ui/error";

import { CustomerFormData } from "../../model";
import { useUpdateCustomerMutation, useCustomerDetails } from "../../controller";

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const id = typeof params.id === 'string' ? decodeURIComponent(params.id) : '';

    const { data: customer, isLoading: isCustomerLoading, error: customerError } = useCustomerDetails(id);
    const updateCustomerMutation = useUpdateCustomerMutation(id);

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isFormReady, setIsFormReady] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<CustomerFormData>({
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            gender: "male",
            date_of_birth: "",
            preferred_language: "English",
        },
    });

    useEffect(() => {
        if (customer) {
            let dob = "";
            if (customer.date_of_birth) {
                try {
                    dob = format(new Date(customer.date_of_birth), "yyyy-MM-dd");
                } catch (e) {
                    console.error("Invalid DOB date", e);
                }
            }

            reset({
                name: customer.name || "",
                phone: customer.phone,
                email: customer.email || "",
                gender: customer.gender || "male",
                date_of_birth: dob,
                preferred_language: customer.preferred_language || "",
            });

            if (customer.profile_image) {
                setImagePreview(customer.profile_image);
            }
            setIsFormReady(true);
        }
    }, [customer, reset]);

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

    const onSubmit = async (data: CustomerFormData) => {
        await updateCustomerMutation.mutateAsync(data);
    };

    const handleCancel = () => {
        router.push("/dashboard/users");
    };

    if (isCustomerLoading || !isFormReady) return <Loading />;
    if (customerError || !customer) return <ErrorComponent message="Failed to load user details" />;

    return (
        <FormContainer>
            <FormBreadcrumb
                items={[
                    "Dashboard",
                    "User Management",
                    "Edit User",
                ]}
            />
            <FormTitleCard
                title="Edit User"
                description="Update customer details."
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormSection title="Personal Details" description="Basic customer information.">
                    <FormRowTwo>
                        <FormField label="Full Name" error={errors.name?.message}>
                            <Input {...register("name")} placeholder="John Doe" />
                        </FormField>
                        <FormField label="Phone Number" required error={errors.phone?.message}>
                            <Input
                                type="tel"
                                {...register("phone", {
                                    required: "Phone is required",
                                    minLength: { value: 10, message: "Phone must be at least 10 digits" }
                                })}
                                readOnly // Usually primary keys or unique identifiers like phone are harder to update or should be read-only if used for auth
                                className="bg-muted"
                            />
                        </FormField>
                    </FormRowTwo>

                    <FormRowTwo>
                        <FormField label="Email" error={errors.email?.message}>
                            <Input
                                type="email"
                                {...register("email", {
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                placeholder="john@example.com"
                            />
                        </FormField>
                        <FormField label="Gender" error={errors.gender?.message}>
                            <Controller
                                name="gender"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </FormField>
                    </FormRowTwo>

                    <FormRowTwo>
                        <FormField label="Date of Birth" error={errors.date_of_birth?.message}>
                            <Input
                                type="date"
                                {...register("date_of_birth")}
                            />
                        </FormField>
                        <FormField label="Preferred Language" error={errors.preferred_language?.message}>
                            <Input {...register("preferred_language")} placeholder="English" />
                        </FormField>
                    </FormRowTwo>
                </FormSection>

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

                <FormActions
                    onCancel={handleCancel}
                    isLoading={updateCustomerMutation.isPending}
                    isEdit={true}
                    submitText="Update User"
                />
            </form>
        </FormContainer>
    );
}
