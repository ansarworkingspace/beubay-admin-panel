"use client";

import React from 'react';
import { SalonTable } from './table/table';
import { FormBreadcrumb } from '@/components/shared/form/FormLayouts';

export default function SalonPage() {
    return (
        <div className="space-y-6">
            <FormBreadcrumb items={['Dashboard', 'Salons']} />
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Salon Management</h1>
            </div>
            <SalonTable />
        </div>
    );
}
