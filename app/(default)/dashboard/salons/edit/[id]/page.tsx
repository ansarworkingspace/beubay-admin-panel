"use client";

import React from 'react';
import { SalonForm } from '../../form';
import { useUpdateSalonMutation, useSalonDetails } from '../../controller';
import { Loading } from "@/components/ui/loading";
import { Error as ErrorComponent } from "@/components/ui/error";
import { useParams } from 'next/navigation';

export default function EditSalonPage() {
    const params = useParams();
    const id = typeof params.id === 'string' ? decodeURIComponent(params.id) : '';
    const { data: salon, isLoading, error } = useSalonDetails(id);
    const mutation = useUpdateSalonMutation(id);

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent message="Failed to load salon details" />;

    const handleSubmit = async (data: any) => {
        await mutation.mutateAsync(data);
    };

    return (
        <SalonForm
            initialData={salon}
            isEdit={true}
            onSubmit={handleSubmit}
            isLoading={mutation.isPending}
        />
    );
}
