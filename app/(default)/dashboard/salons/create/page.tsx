"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, useWatch } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { SalonFormData, BusinessHours, BusinessHour } from "../model";
import { BusinessHoursInput } from "../components/business-hours-input";
import { LocationInput } from "../components/location-input";
import { useCreateSalonMutation } from "../controller";

// Import fetchers from other modules
import { getAllCountries, getAllStates } from "../../utility/city/controller";
import { getSalonCategories } from "../../utility/salon-category/controller";
import { getServiceCategories } from "../../utility/service-category/controller";
import api from "@/lib/api_client";

// Define getAllCities locally as it might not be exported
const getAllCities = async () => {
    try {
        const response = await api.get(`/admin/cities/all`);
        return response.data?.data || [];
    } catch (error) {
        console.error("Failed to fetch all cities", error);
        return [];
    }
};

export default function CreateSalonPage() {
    const router = useRouter();
    const createSalonMutation = useCreateSalonMutation();

    const defaultBusinessHours: BusinessHours = {
        monday: { is_open: true, opening_time: "09:00", closing_time: "21:00" },
        tuesday: { is_open: true, opening_time: "09:00", closing_time: "21:00" },
        wednesday: { is_open: true, opening_time: "09:00", closing_time: "21:00" },
        thursday: { is_open: true, opening_time: "09:00", closing_time: "21:00" },
        friday: { is_open: true, opening_time: "09:00", closing_time: "21:00" },
        saturday: { is_open: true, opening_time: "09:00", closing_time: "21:00" },
        sunday: { is_open: false, opening_time: "", closing_time: "" },
    };

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm<SalonFormData>({
        defaultValues: {
            salon_name: "",
            owner_name: "",
            email: "",
            phone: "",
            salon_category_id: "",
            country_id: "",
            state_id: "",
            city_id: "",
            address: "",
            service_category_ids: [],
            location: { lat: 0, lng: 0 },
            business_hours: defaultBusinessHours,
        },
    });

    // Reference Data
    const { data: countries = [], isLoading: isCountriesLoading } = useQuery({ queryKey: ['all-countries'], queryFn: getAllCountries });
    const { data: states = [], isLoading: isStatesLoading } = useQuery({ queryKey: ['all-states'], queryFn: getAllStates });
    const { data: cities = [], isLoading: isCitiesLoading } = useQuery({ queryKey: ['all-cities'], queryFn: getAllCities });
    const { data: salonCategories = [] } = useQuery({ queryKey: ['salon-categories-all'], queryFn: () => getSalonCategories(1, 100) });
    const { data: serviceCategories = [] } = useQuery({ queryKey: ['service-categories-all'], queryFn: () => getServiceCategories(1, 100) });

    // Dependent Dropdowns
    const selectedCountryId = useWatch({ control, name: "country_id" });
    const selectedStateId = useWatch({ control, name: "state_id" });

    const filteredStates = React.useMemo(() => {
        if (!selectedCountryId) return [];
        return states.filter((state: any) => state.country_id === selectedCountryId);
    }, [states, selectedCountryId]);

    const filteredCities = React.useMemo(() => {
        if (!selectedStateId) return [];
        return cities.filter((city: any) => city.state_id === selectedStateId);
    }, [cities, selectedStateId]);


    const onSubmit = async (data: SalonFormData) => {
        await createSalonMutation.mutateAsync(data);
    };

    const handleCancel = () => {
        router.push("/dashboard/salons");
    };

    return (
        <FormContainer>
            <FormBreadcrumb
                items={[
                    "Dashboard",
                    "Salons",
                    "Create Salon",
                ]}
            />
            <FormTitleCard
                title="Create New Salon"
                description="Manage salon details, location, and services."
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <FormSection title="Basic Information" description="Salon name, owner, and contact details.">
                    <FormRowTwo>
                        <FormField label="Salon Name" required error={errors.salon_name?.message}>
                            <Input {...register("salon_name", { required: "Salon name is required" })} placeholder="Luxe Hairs & Spa" />
                        </FormField>
                        <FormField label="Owner Name" required error={errors.owner_name?.message}>
                            <Input {...register("owner_name", { required: "Owner name is required" })} placeholder="John Doe" />
                        </FormField>
                    </FormRowTwo>
                    <FormRowTwo>
                        <FormField label="Email" required error={errors.email?.message}>
                            <Input type="email" {...register("email", { required: "Email is required" })} placeholder="contact@example.com" />
                        </FormField>
                        <FormField label="Phone" required error={errors.phone?.message}>
                            <Input {...register("phone", { required: "Phone is required" })} placeholder="9876543210" />
                        </FormField>
                    </FormRowTwo>
                    <FormRowTwo>
                        <FormField label="Salon Category" required error={errors.salon_category_id?.message}>
                            <Controller
                                name="salon_category_id"
                                control={control}
                                rules={{ required: "Category is required" }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(salonCategories as any[] || []).map((cat) => (
                                                <SelectItem key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </FormField>
                        <div />
                    </FormRowTwo>
                </FormSection>

                {/* Location Information */}
                <FormSection title="Location" description="Address and geographical details.">
                    <FormRowTwo>
                        <FormField label="Country" required error={errors.country_id?.message}>
                            <Controller
                                name="country_id"
                                control={control}
                                rules={{ required: "Country is required" }}
                                render={({ field }) => (
                                    <Select onValueChange={(val) => {
                                        field.onChange(val);
                                        setValue("state_id", "");
                                        setValue("city_id", "");
                                    }} value={field.value} disabled={isCountriesLoading}>
                                        <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                                        <SelectContent>
                                            {countries.map((c: any) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </FormField>
                        <FormField label="State" required error={errors.state_id?.message}>
                            <Controller
                                name="state_id"
                                control={control}
                                rules={{ required: "State is required" }}
                                render={({ field }) => (
                                    <Select onValueChange={(val) => {
                                        field.onChange(val);
                                        setValue("city_id", "");
                                    }} value={field.value} disabled={!selectedCountryId || isStatesLoading}>
                                        <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                                        <SelectContent>
                                            {filteredStates.map((s: any) => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </FormField>
                    </FormRowTwo>
                    <FormRowTwo>
                        <FormField label="City" required error={errors.city_id?.message}>
                            <Controller
                                name="city_id"
                                control={control}
                                rules={{ required: "City is required" }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedStateId || isCitiesLoading}>
                                        <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                                        <SelectContent>
                                            {filteredCities.map((c: any) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </FormField>
                        <FormField label="Address" required error={errors.address?.message}>
                            <Input {...register("address", { required: "Address is required" })} placeholder="Full address" />
                        </FormField>
                    </FormRowTwo>

                    <div className="mt-4">
                        <Controller
                            name="location"
                            control={control}
                            render={({ field }) => (
                                <LocationInput value={field.value} onChange={field.onChange} />
                            )}
                        />
                    </div>
                </FormSection>

                {/* Services & Media */}
                <FormSection title="Services & Media" description="Select services offered and upload images.">
                    <FormField label="Service Categories">
                        <Controller
                            name="service_category_ids"
                            control={control}
                            render={({ field }) => (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border p-4 rounded-md h-48 overflow-y-auto">
                                    {(serviceCategories as any[] || []).map((service) => (
                                        <div key={service._id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`service-${service._id}`}
                                                checked={(field.value || []).includes(service._id)}
                                                onCheckedChange={(checked) => {
                                                    const current = field.value || [];
                                                    if (checked) field.onChange([...current, service._id]);
                                                    else field.onChange(current.filter((id: string) => id !== service._id));
                                                }}
                                            />
                                            <Label htmlFor={`service-${service._id}`} className="cursor-pointer">{service.name}</Label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        />
                    </FormField>

                    <FormRowTwo>
                        <FormField label="Logo" error={(errors as any).logo?.message}>
                            <Input type="file" accept="image/*" {...register("logo")} />
                        </FormField>
                        <FormField label="Salon Images" error={(errors as any).images?.message}>
                            <Input type="file" accept="image/*" multiple {...register("images")} />
                        </FormField>
                    </FormRowTwo>
                </FormSection>

                {/* Business Hours */}
                <FormSection title="Business Hours" description="Set the opening and closing times.">
                    <Controller
                        name="business_hours"
                        control={control}
                        render={({ field }) => (
                            <BusinessHoursInput value={field.value} onChange={field.onChange} />
                        )}
                    />
                </FormSection>

                <FormActions
                    onCancel={handleCancel}
                    isLoading={createSalonMutation.isPending}
                    isEdit={false}
                    submitText="Create Salon"
                />
            </form>
        </FormContainer>
    );
}
