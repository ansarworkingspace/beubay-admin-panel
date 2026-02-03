"use client";

import React from 'react';
import { SalonForm } from '../form';
import { useCreateSalonMutation } from '../controller';

export default function CreateSalonPage() {
    const mutation = useCreateSalonMutation();

    const handleSubmit = async (data: any) => {
        await mutation.mutateAsync(data);
    };

    return (
        <SalonForm onSubmit={handleSubmit} isLoading={mutation.isPending} />
    );
}
