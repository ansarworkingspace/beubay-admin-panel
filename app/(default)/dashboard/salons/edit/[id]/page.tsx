"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { X, Upload } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { Error as ErrorComponent } from "@/components/ui/error";
import { MultiSelect } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";

import { SalonFormData, BusinessHours } from "../../model";
import { BusinessHoursInput } from "../../components/business-hours-input";
import { LocationInput } from "../../components/location-input";
import { useUpdateSalonMutation, useSalonDetails } from "../../controller";

// Import fetchers from other modules
import { getAllCountries, getAllStates } from "../../../utility/city/controller";
import { getSalonCategories } from "../../../utility/salon-category/controller";
import { getServiceCategories } from "../../../utility/service-category/controller";
import api from "@/lib/api_client";

// Define getAllCities locally as it might not be exported from controller
const getAllCities = async () => {
    try {
        const response = await api.get(`/admin/cities/all`);
        return response.data?.data || [];
    } catch (error) {
        console.error("Failed to fetch all cities", error);
        return [];
    }
};

export default function EditSalonPage() {
    const router = useRouter();
    const params = useParams();
    const id = typeof params.id === 'string' ? decodeURIComponent(params.id) : '';

    const { data: salon, isLoading: isSalonLoading, error: salonError } = useSalonDetails(id);
    const updateSalonMutation = useUpdateSalonMutation(id);

    // Reference Data
    const { data: countries = [], isLoading: isCountriesLoading } = useQuery({ queryKey: ['all-countries'], queryFn: getAllCountries });
    const { data: states = [], isLoading: isStatesLoading } = useQuery({ queryKey: ['all-states'], queryFn: getAllStates });
    const { data: cities = [], isLoading: isCitiesLoading } = useQuery({ queryKey: ['all-cities'], queryFn: getAllCities });

    const { data: salonCategories = [], isLoading: isSalonCatsLoading } = useQuery({
        queryKey: ['salon-categories-all'],
        queryFn: async () => {
            const res = await api.get('/admin/salon-categories/all');
            return res.data?.data || [];
        }
    });

    const { data: serviceCategories = [], isLoading: isServiceCatsLoading } = useQuery({
        queryKey: ['service-categories-all'],
        queryFn: async () => {
            const res = await api.get('/admin/service-categories/all');
            return res.data?.data || [];
        }
    });

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
        reset,
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

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    const [isFormReady, setIsFormReady] = React.useState(false);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [deletedImages, setDeletedImages] = useState<string[]>([]);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    // Populate form
    useEffect(() => {
        if (salon) {
            const getId = (item: any) => (item && typeof item === 'object' && item._id) ? item._id : item;

            reset({
                salon_name: salon.salon_name,
                owner_name: salon.owner_name,
                email: salon.email,
                phone: salon.phone,
                salon_category_id: getId(salon.salon_category_id),
                country_id: getId(salon.country_id),
                state_id: getId(salon.state_id),
                city_id: getId(salon.city_id),
                address: salon.address,
                service_category_ids: Array.isArray(salon.service_category_ids)
                    ? salon.service_category_ids.map((s: any) => getId(s))
                    : [],
                location: salon.location ? { lat: salon.location.coordinates[1], lng: salon.location.coordinates[0] } : { lat: 0, lng: 0 },
                business_hours: salon.business_hours || defaultBusinessHours,
            });

            if (salon.images && Array.isArray(salon.images)) {
                setExistingImages(salon.images);
            }
            if (salon.logo_url) {
                setLogoPreview(salon.logo_url);
            }

            setIsFormReady(true);
        }
    }, [salon, reset]);


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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const totalImages = existingImages.length + selectedFiles.length + filesArray.length;

            const remainingSlots = 3 - (existingImages.length + selectedFiles.length);

            if (remainingSlots > 0) {
                const authorizedFiles = filesArray.slice(0, remainingSlots);

                setSelectedFiles(prev => [...prev, ...authorizedFiles]);

                const newPreviews = authorizedFiles.map(file => URL.createObjectURL(file));
                setNewImagePreviews(prev => [...prev, ...newPreviews]);
            }
        }
        e.target.value = "";
    };

    const handleRemoveNewFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setNewImagePreviews(prev => {
            if (prev[index]) URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleRemoveImage = (imgUrl: string) => {
        setExistingImages(prev => prev.filter(url => url !== imgUrl));
        setDeletedImages(prev => [...prev, imgUrl]);
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: SalonFormData) => {
        const finalData = {
            ...data,
            images: selectedFiles as any,
            deleted_images: deletedImages
        };
        await updateSalonMutation.mutateAsync(finalData);
    };

    const handleCancel = () => {
        router.push("/dashboard/salons");
    };

    // Prepare options for MultiSelect
    const serviceOptions = React.useMemo(() => {
        return (Array.isArray(serviceCategories) ? serviceCategories : []).map((cat: any) => ({
            label: cat.name,
            value: cat._id || cat.id
        }));
    }, [serviceCategories]);

    if (isSalonLoading || isCountriesLoading || isStatesLoading || isCitiesLoading || isSalonCatsLoading || isServiceCatsLoading || !isFormReady) {
        return <Loading />;
    }

    if (salonError) return <ErrorComponent message="Failed to load salon details" />;


    return (
        <FormContainer>
            <FormBreadcrumb
                items={[
                    "Dashboard",
                    "Salons",
                    "Edit Salon",
                ]}
            />
            <FormTitleCard
                title="Edit Salon"
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
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(Array.isArray(salonCategories) ? salonCategories : []).map((cat: any) => (
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
                                    }} value={field.value || ""}>
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
                                    }} value={field.value || ""} disabled={!selectedCountryId}>
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
                                    <Select onValueChange={field.onChange} value={field.value || ""} disabled={!selectedStateId}>
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
                                <MultiSelect
                                    options={serviceOptions}
                                    selected={field.value || []}
                                    onChange={field.onChange}
                                    placeholder="Select services..."
                                />
                            )}
                        />
                    </FormField>

                    <FormRowTwo className="items-start">
                        <FormField label="Logo" error={(errors as any).logo?.message}>
                            <div className="space-y-4">
                                <div className="min-h-[6rem] flex items-end">
                                    {logoPreview ? (
                                        <div className="relative w-24 h-24 border rounded-md overflow-hidden group">
                                            <img src={logoPreview} alt="Current Logo" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 border rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                            No Logo
                                        </div>
                                    )}
                                </div>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    {...register("logo")}
                                    onChange={(e) => {
                                        register("logo").onChange(e);
                                        handleLogoChange(e);
                                    }}
                                />
                            </div>
                        </FormField>
                        <FormField label="Salon Images (Max 3)" error={(errors as any).images?.message}>
                            <div className="space-y-4">
                                <div className="min-h-[6rem] flex flex-wrap gap-4">
                                    {existingImages.map((img: string, idx: number) => (
                                        <div key={`existing-${idx}`} className="relative w-24 h-24 border rounded-md overflow-hidden group">
                                            <img src={img} alt={`Salon image ${idx + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(img)}
                                                className="absolute top-1 right-1 bg-white/80 hover:bg-white text-destructive rounded-full p-1 opacity-100 shadow-sm transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {newImagePreviews.map((preview, idx) => (
                                        <div key={`new-${idx}`} className="relative w-24 h-24 border rounded-md overflow-hidden group">
                                            <img src={preview} alt={`New upload ${idx + 1}`} className="w-full h-full object-cover opacity-80" />
                                            <div className="absolute inset-0 bg-black/10" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveNewFile(idx)}
                                                className="absolute top-1 right-1 bg-white/80 hover:bg-white text-destructive rounded-full p-1 opacity-100 shadow-sm transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {existingImages.length === 0 && newImagePreviews.length === 0 && (
                                        <div className="w-24 h-24 border rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                            No Images
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        disabled={existingImages.length + selectedFiles.length >= 3}
                                        onChange={handleImageChange}
                                        name="images_manual"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {existingImages.length + selectedFiles.length} OF 3 images used.
                                </p>
                            </div>
                        </FormField>
                    </FormRowTwo>
                </FormSection>

                {/* Business Hours */}
                <FormSection title="Business Hours" description="Set the opening and closing times.">
                    <div className="space-y-4">
                        <Controller
                            name="business_hours"
                            control={control}
                            render={({ field }) => (
                                <BusinessHoursInput value={field.value} onChange={field.onChange} />
                            )}
                        />
                    </div>
                </FormSection>

                <FormActions
                    onCancel={handleCancel}
                    isLoading={updateSalonMutation.isPending}
                    isEdit={true}
                    submitText="Update Salon"
                />
            </form>
        </FormContainer>
    );
}

