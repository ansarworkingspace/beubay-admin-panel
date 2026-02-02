"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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

import { countrySchema, CountryFormData } from "../../model";
import {
    useCreateCountryMutation,
    useUpdateCountryMutation,
    getCountryDetails,
} from "../../controller";

const CountryForm = () => {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const isEdit = slug !== "add";
    const countryId = isEdit ? slug : null;

    const createCountryMutation = useCreateCountryMutation();
    const updateCountryMutation = useUpdateCountryMutation(countryId ?? "");

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<CountryFormData>({
        resolver: zodResolver(countrySchema) as any,
        defaultValues: {
            name: "",
            phone_code: "",
            currency: "",
            currency_symbol: "",
            country_code: "", // added default
            is_active: true, // boolean as per new model
        },
    });

    // Use useQuery for data fetching with caching
    const { data: countryData, isLoading: dataLoading, error: queryError } = useQuery({
        queryKey: ['country', countryId],
        queryFn: () => getCountryDetails(countryId!),
        enabled: isEdit && !!countryId
    });

    const dataError = queryError instanceof Error ? queryError.message : (queryError as unknown as string);

    // Populate form when data is loaded
    useEffect(() => {
        if (countryData) {
            setValue("name", countryData.name);
            setValue("phone_code", countryData.phone_code);
            setValue("currency", countryData.currency);
            setValue("currency_symbol", countryData.currency_symbol);
            setValue("country_code", countryData.country_code);
            setValue("is_active", countryData.is_active);
        }
    }, [countryData, setValue]);

    const onSubmit = async (data: CountryFormData) => {
        try {
            if (isEdit) {
                await updateCountryMutation.mutateAsync(data);
            } else {
                await createCountryMutation.mutateAsync(data);
            }
        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    const handleCancel = () => {
        reset();
        router.push("/dashboard/utility/country");
    };

    if (isEdit && dataLoading) {
        return (
            <FormContainer>
                <Loading />
            </FormContainer>
        );
    }

    if (isEdit && (dataError || (!dataLoading && !countryData))) {
        return (
            <FormContainer>
                <ErrorComponent message={dataError || "Country not found"} />
            </FormContainer>
        );
    }

    return (
        <FormContainer>
            <FormBreadcrumb
                items={[
                    "Dashboard",
                    "Utility",
                    "Countries",
                    isEdit ? `Edit Country` : "Add New Country",
                ]}
            />

            <FormTitleCard
                title={isEdit ? `Edit Country Details` : "Add New Country"}
                description={
                    isEdit
                        ? "Update the country information below. All fields marked with * are required."
                        : "Fill in the details below to create a new country record. All fields marked with * are required."
                }
            />

            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
                <FormSection
                    title="Country Information"
                    description="Basic details about the country"
                >
                    <FormRowTwo>
                        <FormField
                            error={errors.name?.message}
                            label="Country Name"
                            required
                        >
                            <Input
                                type="text"
                                id="name"
                                placeholder="Enter country name"
                                {...register("name", {
                                    required: "Country name is required"
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
                            error={errors.phone_code?.message}
                            label="Phone Code"
                            required
                        >
                            <Input
                                type="text"
                                id="phone_code"
                                placeholder="Enter phone code (e.g., +91)"
                                maxLength={5}
                                {...register("phone_code", {
                                    required: "Phone code is required",
                                    pattern: {
                                        value: /^\+[0-9]+$/,
                                        message: "Phone code must start with + followed by numbers",
                                    },
                                })}
                                onInput={(e) => {
                                    let value = e.currentTarget.value;
                                    if (!value.startsWith('+')) {
                                        value = '+' + value.replace(/[^0-9]/g, '');
                                    } else {
                                        value = '+' + value.slice(1).replace(/[^0-9]/g, '');
                                    }
                                    e.currentTarget.value = value;
                                }}
                            />
                        </FormField>
                    </FormRowTwo>

                    <FormRowTwo>
                        <FormField
                            error={errors.currency?.message}
                            label="Currency Name"
                            required
                        >
                            <Input
                                type="text"
                                id="currency"
                                placeholder="Enter currency name (e.g., Indian Rupee)"
                                {...register("currency", {
                                    required: "Currency name is required",
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
                            error={errors.currency_symbol?.message}
                            label="Currency Symbol"
                            required
                        >
                            <Input
                                type="text"
                                id="currency_symbol"
                                placeholder="Enter currency symbol (e.g., ₹)"
                                maxLength={4}
                                {...register("currency_symbol", {
                                    required: "Currency symbol is required"
                                })}
                            />
                        </FormField>
                    </FormRowTwo>

                    <FormRowTwo>
                        <FormField
                            error={errors.country_code?.message}
                            label="Country Code"
                            required
                        >
                            <Input
                                type="text"
                                id="country_code"
                                placeholder="Enter country code (e.g., IN)"
                                maxLength={3}
                                {...register("country_code", {
                                    required: "Country code is required",
                                    pattern: {
                                        value: /^[A-Za-z]{2,3}$/,
                                        message: "Enter 2-3 alphabet characters only (e.g., IN)",
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
                                <Select
                                    onValueChange={(value: string) => {
                                        // Handle string "true"/"false" from Select back to boolean
                                        setValue("is_active", value === 'true');
                                    }}
                                    value={watch("is_active") ? "true" : "false"}
                                >
                                    <SelectTrigger id="is_active" className="w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Active</SelectItem>
                                        <SelectItem value="false">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>
                        )}
                        {!isEdit && <div></div>}
                    </FormRowTwo>
                </FormSection>

                <FormActions
                    onCancel={handleCancel}
                    isLoading={
                        createCountryMutation.isPending || updateCountryMutation.isPending
                    }
                    isEdit={isEdit}
                    submitText={isEdit ? "Update Country" : "Create Country"}
                />
            </form>
        </FormContainer>
    );
};

export default CountryForm;
