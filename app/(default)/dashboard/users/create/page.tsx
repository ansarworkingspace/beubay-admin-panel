"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";

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

import { CustomerFormData } from "../model";
import { useCreateCustomerMutation } from "../controller";

export default function CreateUserPage() {
    const router = useRouter();
    const createCustomerMutation = useCreateCustomerMutation();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<CustomerFormData>({
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            gender: "male",
            date_of_birth: "",
            preferred_language: "English",
            is_active: true,
        },
    });

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
        await createCustomerMutation.mutateAsync(data);
    };

    const handleCancel = () => {
        router.push("/dashboard/users");
    };

    return (
        <FormContainer>
            <FormBreadcrumb
                items={[
                    "Dashboard",
                    "User Management",
                    "Create User",
                ]}
            />
            <FormTitleCard
                title="Create New User"
                description="Onboard a new customer."
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
                                placeholder="9876543210"
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

                    {/* Optional Password if creating manually */}
                    <FormField label="Password" error={errors.password?.message}>
                        <Input
                            type="password"
                            {...register("password", { minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                            placeholder="******"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Optional. Defaults will apply if left blank.</p>
                    </FormField>
                </FormSection>

                <FormSection title="Profile Image" description="User's profile picture.">
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
                    isLoading={createCustomerMutation.isPending}
                    isEdit={false}
                    submitText="Create User"
                />
            </form>
        </FormContainer>
    );
}
