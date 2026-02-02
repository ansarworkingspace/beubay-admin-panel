"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    FormBreadcrumb,
    FormContainer,
    FormRowTwo,
    FormSection,
    FormTitleCard,
    FormField,
} from "@/components/shared/form/FormLayouts";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Error as ErrorComponent } from "@/components/ui/error";
import { Loading } from "@/components/ui/loading";
import { Pencil, ArrowLeft } from "lucide-react";
import { getCountryDetails } from "../../controller";
import { CountryFormData } from "../../model";

const ViewCountry = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [country, setCountry] = useState<(CountryFormData & { _id: string, id: string }) | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchCountry = async () => {
                try {
                    const data = await getCountryDetails(id);
                    if (data) {
                        setCountry(data);
                    } else {
                        setError("Country not found");
                    }
                } catch (err) {
                    console.error(err);
                    setError("Failed to load country details");
                } finally {
                    setLoading(false);
                }
            };
            fetchCountry();
        }
    }, [id]);

    if (loading) return <FormContainer><Loading /></FormContainer>;
    if (error || !country) return <FormContainer><ErrorComponent message={error || "Country not found"} /></FormContainer>;

    return (
        <FormContainer>
            <div className="flex items-center justify-between">
                <FormBreadcrumb items={["Dashboard", "Utility", "Countries", "View Details"]} />
                <Button onClick={() => router.push(`/dashboard/utility/country/form/${id}`)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
            </div>

            <FormTitleCard
                title="Country Details"
                description={`View details for ${country.country_name}`}
            />

            <div className="space-y-6">
                <FormSection title="Basic Information">
                    <FormRowTwo>
                        <FormField label="Country Name">
                            <Input value={country.country_name} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Phone Code">
                            <Input value={country.phone_code} readOnly className="bg-muted" />
                        </FormField>
                    </FormRowTwo>

                    <FormRowTwo>
                        <FormField label="Currency Name">
                            <Input value={country.currency_name} readOnly className="bg-muted" />
                        </FormField>
                        <FormField label="Currency Code">
                            <Input value={country.currency_code} readOnly className="bg-muted" />
                        </FormField>
                    </FormRowTwo>

                    <FormRowTwo>
                        <FormField label="Status">
                            <div className="flex items-center h-10">
                                <Badge
                                    variant={country.status === 'active' ? "default" : "destructive"}
                                    className={country.status === 'active' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                                >
                                    {country.status === 'active' ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </FormField>
                    </FormRowTwo>
                </FormSection>
            </div>
        </FormContainer>
    );
};

export default ViewCountry;
