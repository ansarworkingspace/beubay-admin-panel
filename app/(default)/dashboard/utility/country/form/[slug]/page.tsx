"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
    const [dataLoading, setDataLoading] = useState(isEdit);
    const [dataError, setDataError] = useState<string | null>(null);

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
        resolver: zodResolver(countrySchema),
        defaultValues: {
            country_name: "",
            phone_code: "",
            currency_name: "",
            currency_code: "",
            status: "active",
        },
    });

    // Fetch country data for edit mode
    useEffect(() => {
        if (isEdit && countryId) {
            setDataLoading(true);
            setDataError(null);

            const fetchCountryDetails = async () => {
                try {
                    const countryData = await getCountryDetails(countryId);
                    if (!countryData) {
                        router.push("/dashboard/utility/country");
                        return;
                    }

                    setValue("country_name", countryData.country_name);
                    setValue("phone_code", countryData.phone_code);
                    setValue("currency_name", countryData.currency_name);
                    setValue("currency_code", countryData.currency_code);
                    setValue("status", countryData.status);
                } catch (error) {
                    setDataError("Error loading country data");
                    console.error("Error fetching country details:", error);
                } finally {
                    setDataLoading(false);
                }
            };

            fetchCountryDetails();
        }
    }, [isEdit, countryId, setValue, router]);

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

    if (dataLoading) {
        return (
            <FormContainer>
                <Loading />
            </FormContainer>
        );
    }

    if (dataError) {
        return (
            <FormContainer>
                <ErrorComponent message={dataError} />
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormSection
                    title="Country Information"
                    description="Basic details about the country"
                >
                    <FormRowTwo>
                        <FormField
                            error={errors.country_name?.message}
                            label="Country Name"
                            required
                        >
                            <Input
                                type="text"
                                id="country_name"
                                placeholder="Enter country name"
                                {...register("country_name", {
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
                            error={errors.currency_name?.message}
                            label="Currency Name"
                            required
                        >
                            <Input
                                type="text"
                                id="currency_name"
                                placeholder="Enter currency name (e.g., Indian Rupee)"
                                {...register("currency_name", {
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
                            error={errors.currency_code?.message}
                            label="Currency Code"
                            required
                        >
                            <Input
                                type="text"
                                id="currency_code"
                                placeholder="Enter currency code (e.g., INR)"
                                maxLength={4}
                                {...register("currency_code", {
                                    required: "Currency code is required",
                                    pattern: {
                                        value: /^[A-Za-z]{2,4}$/,
                                        message: "Enter 2-4 alphabet characters only (e.g., INR)",
                                    },
                                })}
                                onInput={(e) => {
                                    e.currentTarget.value = e.currentTarget.value
                                        .replace(/[^A-Za-z]/g, "")
                                        .toUpperCase();
                                }}
                            />
                        </FormField>
                    </FormRowTwo>

                    {isEdit && <FormRowTwo>
                        <FormField error={errors.status?.message} label="Status" required>
                            <Select
                                onValueChange={(value: "active" | "inactive") =>
                                    setValue("status", value)
                                }
                                value={watch("status")}
                            >
                                <SelectTrigger id="status" className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>

                        <div></div>
                    </FormRowTwo>}
                </FormSection>

                <FormActions
                    onCancel={handleCancel}
                    onSubmit={handleSubmit(onSubmit)}
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
