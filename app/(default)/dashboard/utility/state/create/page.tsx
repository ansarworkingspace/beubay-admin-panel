"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { stateSchema, StateFormData } from "../model";
import { useCreateStateMutation, getAllCountries } from "../controller";

const CreateStatePage = () => {
    const router = useRouter();
    const createStateMutation = useCreateStateMutation();

    // Fetch Countries for Dropdown
    const { data: countries = [], isLoading: isCountriesLoading } = useQuery({
        queryKey: ['all-countries'],
        queryFn: getAllCountries,
    });

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<StateFormData>({
        resolver: zodResolver(stateSchema) as any,
        defaultValues: {
            name: "",
            state_code: "",
            country_id: "",
            is_active: true,
        },
    });

    const onSubmit = async (data: StateFormData) => {
        try {
            await createStateMutation.mutateAsync(data);
        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    const handleCancel = () => {
        reset();
        router.push("/dashboard/utility/state");
    };

    return (
        <FormContainer>
            <FormBreadcrumb
                items={[
                    "Dashboard",
                    "Utility",
                    "States",
                    "Add New State",
                ]}
            />

            <FormTitleCard
                title="Add New State"
                description="Fill in the details below to create a new state record. All fields marked with * are required."
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormSection
                    title="State Information"
                    description="Basic details about the state"
                >
                    <FormRowTwo>
                        <FormField
                            error={errors.name?.message}
                            label="State Name"
                            required
                        >
                            <Input
                                type="text"
                                id="name"
                                placeholder="Enter state name"
                                {...register("name")}
                                onInput={(e) => {
                                    e.currentTarget.value = e.currentTarget.value.replace(
                                        /[^A-Za-z\s]/g,
                                        ""
                                    );
                                }}
                            />
                        </FormField>

                        <FormField
                            error={errors.country_id?.message}
                            label="Country"
                            required
                        >
                            <Controller
                                name="country_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={isCountriesLoading}
                                    >
                                        <SelectTrigger id="country_id" className="w-full">
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map((country) => (
                                                <SelectItem key={country._id} value={country._id}>
                                                    {country.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </FormField>
                    </FormRowTwo>

                    <FormRowTwo>
                        <FormField
                            error={errors.state_code?.message}
                            label="State Code"
                            required
                        >
                            <Input
                                type="text"
                                id="state_code"
                                placeholder="Enter state code (e.g., KRL)"
                                maxLength={5}
                                {...register("state_code", {
                                    pattern: {
                                        value: /^[A-Z]{2,5}$/,
                                        message: "Enter 2-5 uppercase characters only",
                                    },
                                })}
                                onInput={(e) => {
                                    e.currentTarget.value = e.currentTarget.value
                                        .replace(/[^A-Za-z]/g, "")
                                        .toUpperCase();
                                }}
                            />
                        </FormField>
                        <div></div>
                    </FormRowTwo>
                </FormSection>

                <FormActions
                    onCancel={handleCancel}
                    isLoading={createStateMutation.isPending}
                    isEdit={false}
                    submitText="Create State"
                />
            </form>
        </FormContainer>
    );
};

export default CreateStatePage;
