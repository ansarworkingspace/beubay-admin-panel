"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, useWatch } from "react-hook-form";
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

import { citySchema, CityFormData } from "../model";
import { useCreateCityMutation, getAllCountries, getAllStates } from "../controller";

const CreateCityPage = () => {
    const router = useRouter();
    const createCityMutation = useCreateCityMutation();

    // Fetch Reference Data
    const { data: countries = [], isLoading: isCountriesLoading } = useQuery({
        queryKey: ['all-countries'],
        queryFn: getAllCountries,
    });

    const { data: states = [], isLoading: isStatesLoading } = useQuery({
        queryKey: ['all-states'],
        queryFn: getAllStates,
    });

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CityFormData>({
        resolver: zodResolver(citySchema) as any,
        defaultValues: {
            name: "",
            country_id: "",
            state_id: "",
            is_active: true,
        },
    });

    // Watch country_id to filter states
    const selectedCountryId = useWatch({ control, name: "country_id" });

    const filteredStates = React.useMemo(() => {
        if (!selectedCountryId) return [];
        return states.filter((state: any) => state.country_id === selectedCountryId);
    }, [states, selectedCountryId]);

    // Reset state selection if country changes
    React.useEffect(() => {
        // Optional: clear state_id if the selected state doesn't belong to new country
        // But doing this automatically might be annoying if user just misclicked.
        // However, strictly, a state id from Country A is invalid for Country B.
        // We'll leave it to the user to pick a new state, or the dropdown will just look invalid?
        // Actually, if we filter the options, the current value (if set) remains but won't match any option.
        // It's cleaner to reset state_id when country changes.
        // But useWatch triggers on every change. I need to be careful not to reset ONLY when it changes.
        // I'll skip auto-reset for now to keep it simple, or user can manually change.
        // Actually, creating a new city, it starts empty.
    }, [selectedCountryId]);


    const onSubmit = async (data: CityFormData) => {
        try {
            await createCityMutation.mutateAsync(data);
        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    const handleCancel = () => {
        reset();
        router.push("/dashboard/utility/city");
    };

    return (
        <FormContainer>
            <FormBreadcrumb
                items={[
                    "Dashboard",
                    "Utility",
                    "Cities",
                    "Add New City",
                ]}
            />

            <FormTitleCard
                title="Add New City"
                description="Fill in the details below to create a new city record. All fields marked with * are required."
            />

            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
                <FormSection
                    title="City Information"
                    description="Basic details about the city"
                >
                    <FormRowTwo>
                        <FormField
                            error={errors.name?.message}
                            label="City Name"
                            required
                        >
                            <Input
                                type="text"
                                id="name"
                                placeholder="Enter city name"
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
                                        onValueChange={(val) => {
                                            field.onChange(val);
                                            setValue("state_id", ""); // Clear state when country changes
                                        }}
                                        value={field.value}
                                        disabled={isCountriesLoading}
                                    >
                                        <SelectTrigger id="country_id" className="w-full">
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map((country: any) => (
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
                            error={errors.state_id?.message}
                            label="State"
                            required
                        >
                            <Controller
                                name="state_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={isStatesLoading || !selectedCountryId}
                                    >
                                        <SelectTrigger id="state_id" className="w-full">
                                            <SelectValue placeholder={selectedCountryId ? "Select State" : "Select Country First"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredStates.map((state: any) => (
                                                <SelectItem key={state._id} value={state._id}>
                                                    {state.name}
                                                </SelectItem>
                                            ))}
                                            {filteredStates.length === 0 && selectedCountryId && (
                                                <div className="p-2 text-sm text-muted-foreground text-center">No states found</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </FormField>
                        <div></div>
                    </FormRowTwo>
                </FormSection>

                <FormActions
                    onCancel={handleCancel}
                    isLoading={createCityMutation.isPending}
                    isEdit={false}
                    submitText="Create City"
                />
            </form>
        </FormContainer>
    );
};

export default CreateCityPage;
