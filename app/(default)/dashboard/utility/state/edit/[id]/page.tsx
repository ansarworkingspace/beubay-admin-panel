"use client";

import React, { useEffect } from "react";
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
    useUpdateStateMutation,
    getStateDetails,
    getAllCountries,
} from "../../controller";

const EditStatePage = () => {
    const params = useParams();
    const router = useRouter();
    const stateId = params.id as string;

    const updateStateMutation = useUpdateStateMutation(stateId);

    // Fetch Countries
    const { data: countries = [], isLoading: isCountriesLoading } = useQuery({
        queryKey: ['all-countries'],
        queryFn: getAllCountries,
    });

    // Fetch State Details
    const { data: stateData, isLoading: isStateLoading, error: queryError } = useQuery({
        queryKey: ['state', stateId],
        queryFn: () => getStateDetails(stateId),
        enabled: !!stateId
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

    const [isReady, setIsReady] = React.useState(false);

    // Populate form data once BOTH are ready
    useEffect(() => {
        if (stateData) {
            reset({
                name: stateData.name,
                state_code: stateData.state_code,
                country_id: stateData.country_id,
                is_active: stateData.is_active,
            });
            setIsReady(true);
        }
    }, [stateData, reset]);

    const onSubmit = async (data: StateFormData) => {
        try {
            await updateStateMutation.mutateAsync(data);
        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    const handleCancel = () => {
        router.push("/dashboard/utility/state");
    };

    // BLOCKING RENDER: Wait for EVERYTHING to be ready
    if (isStateLoading || isCountriesLoading || !isReady) {
        return (
            <FormContainer>
                <Loading />
            </FormContainer>
        );
    }

    if (queryError || (!isStateLoading && !stateData)) {
        return (
            <FormContainer>
                <ErrorComponent message={(queryError as any)?.message || "State not found"} />
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
                    "Edit State",
                ]}
            />

            <FormTitleCard
                title="Edit State Details"
                description="Update the state information below. All fields marked with * are required."
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
                    </FormRowTwo>
                </FormSection>

                <FormActions
                    onCancel={handleCancel}
                    isLoading={updateStateMutation.isPending}
                    isEdit={true}
                    submitText="Update State"
                />
            </form>
        </FormContainer>
    );
};

export default EditStatePage;
