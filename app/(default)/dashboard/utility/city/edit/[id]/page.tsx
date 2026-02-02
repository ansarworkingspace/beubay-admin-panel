"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Error as ErrorComponent } from "@/components/ui/error";
import { Loading } from "@/components/ui/loading";

import { citySchema, CityFormData } from "../../model";
import {
    useUpdateCityMutation,
    getCityDetails,
    getAllCountries,
    getAllStates,
} from "../../controller";

const EditCityPage = () => {
    const params = useParams();
    const router = useRouter();
    const cityId = params.id as string;

    const updateCityMutation = useUpdateCityMutation(cityId);

    // Fetch Reference Data
    const { data: countries = [], isLoading: isCountriesLoading } = useQuery({
        queryKey: ['all-countries'],
        queryFn: getAllCountries,
    });

    const { data: states = [], isLoading: isStatesLoading } = useQuery({
        queryKey: ['all-states'],
        queryFn: getAllStates,
    });

    // Fetch City Details
    const { data: cityData, isLoading: isCityLoading, error: queryError } = useQuery({
        queryKey: ['city', cityId],
        queryFn: () => getCityDetails(cityId),
        enabled: !!cityId
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

    const [isReady, setIsReady] = React.useState(false);

    // Watch country to filter states
    const selectedCountryId = useWatch({ control, name: "country_id" });

    const filteredStates = React.useMemo(() => {
        if (!selectedCountryId) return [];
        return states.filter((state: any) => state.country_id === selectedCountryId);
    }, [states, selectedCountryId]);

    // Populate form data once ready
    useEffect(() => {
        if (cityData) {
            reset({
                name: cityData.name,
                country_id: cityData.country_id,
                state_id: cityData.state_id,
                is_active: cityData.is_active,
            });
            setIsReady(true);
        }
    }, [cityData, reset]);

    const onSubmit = async (data: CityFormData) => {
        try {
            await updateCityMutation.mutateAsync(data);
        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    const handleCancel = () => {
        router.push("/dashboard/utility/city");
    };

    // BLOCKING RENDER: Wait for EVERYTHING to be ready
    if (isCityLoading || isCountriesLoading || isStatesLoading || !isReady) {
        return (
            <FormContainer>
                <Loading />
            </FormContainer>
        );
    }

    if (queryError || (!isCityLoading && !cityData)) {
        return (
            <FormContainer>
                <ErrorComponent message={(queryError as any)?.message || "City not found"} />
            </FormContainer>
        );
    }

    return (
        <FormContainer>
            <FormBreadcrumb
                items={[
                    "Dashboard",
                    "Utility",
                    "Cities",
                    "Edit City",
                ]}
            />

            <FormTitleCard
                title="Edit City Details"
                description="Update the city information below. All fields marked with * are required."
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
                                            // Only clear state if it's a user interaction, not initial load
                                            // But since we are in controlled component, this triggers on user change.
                                            // Initial set via reset() bypasses this handler? No, reset sets value directly.
                                            // So this callback is only for UI interaction.
                                            // We should clear state_id when user changes country.
                                            setValue("state_id", "");
                                        }}
                                        value={field.value}
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
                                        disabled={!selectedCountryId}
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
                    isLoading={updateCityMutation.isPending}
                    isEdit={true}
                    submitText="Update City"
                />
            </form>
        </FormContainer>
    );
};

export default EditCityPage;
