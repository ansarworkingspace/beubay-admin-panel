"use client";

import React, { useEffect, useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Error as ErrorComponent } from "@/components/ui/error";
import { Loading } from "@/components/ui/loading";

import { stateSchema, StateFormData } from "../../model";
import {
    useCreateStateMutation,
    useUpdateStateMutation,
    getStateDetails,
    getAllCountries,
} from "../../controller";

const StateForm = () => {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const isEdit = slug !== "add";
    const stateId = isEdit ? slug : null;

    const createStateMutation = useCreateStateMutation();
    const updateStateMutation = useUpdateStateMutation(stateId ?? "");

    // Fetch Countries for Dropdown
    const { data: countries = [], isLoading: isCountriesLoading } = useQuery({
        queryKey: ['all-countries'],
        queryFn: getAllCountries,
    });

    const {
        register,
        handleSubmit,
        setValue,
        control, // added control
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

    // Use useQuery for data fetching with caching
    const { data: stateData, isLoading: dataLoading, error: queryError } = useQuery({
        queryKey: ['state', stateId],
        queryFn: () => getStateDetails(stateId!),
        enabled: isEdit && !!stateId
    });

    const dataError = queryError instanceof Error ? queryError.message : (queryError as unknown as string);

    // Populate form when data is loaded
    useEffect(() => {
        if (stateData) {
            setValue("name", stateData.name);
            setValue("state_code", stateData.state_code);
            setValue("country_id", stateData.country_id);
            setValue("is_active", stateData.is_active);
        }
    }, [stateData, setValue]);

    const onSubmit = async (data: StateFormData) => {
        try {
            if (isEdit) {
                await updateStateMutation.mutateAsync(data);
            } else {
                await createStateMutation.mutateAsync(data);
            }
        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    const handleCancel = () => {
        reset();
        router.push("/dashboard/utility/state");
    };

    if (isEdit && dataLoading) {
        return (
            <FormContainer>
                <Loading />
            </FormContainer>
        );
    }

    if (isEdit && (dataError || (!dataLoading && !stateData))) {
        return (
            <FormContainer>
                <ErrorComponent message={dataError || "State not found"} />
            </FormContainer>
        );
    }

    return (
        <FormContainer>
            <FormBreadcrumb
                items={[
                    "Dashboard",
                    "Utility",
                    "States",
                    isEdit ? `Edit State` : "Add New State",
                ]}
            />

            <FormTitleCard
                title={isEdit ? `Edit State Details` : "Add New State"}
                description={
                    isEdit
                        ? "Update the state information below. All fields marked with * are required."
                        : "Fill in the details below to create a new state record. All fields marked with * are required."
                }
            />

            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
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
                                {...register("name", {
                                    required: "State name is required"
                                })}
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
                                        key={countries.length} // Force re-render when options load
                                        onValueChange={field.onChange}
                                        value={field.value || ""}
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
                                    required: "State code is required",
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

                        {isEdit && (
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
                        )}
                        {!isEdit && <div></div>}
                    </FormRowTwo>
                </FormSection>

                <FormActions
                    onCancel={handleCancel}
                    isLoading={
                        createStateMutation.isPending || updateStateMutation.isPending
                    }
                    isEdit={isEdit}
                    submitText={isEdit ? "Update State" : "Create State"}
                />
            </form>
        </FormContainer>
    );
};

export default StateForm;
