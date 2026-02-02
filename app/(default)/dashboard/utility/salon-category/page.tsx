"use client";

import React from 'react';
import { SalonCategoryTable } from './table/table';
import { FormBreadcrumb } from '@/components/shared/form/FormLayouts';

export default function SalonCategoryPage() {
    return (
        <div className="space-y-6">
            <FormBreadcrumb items={['Dashboard', 'Utility', 'Salon Categories']} />
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Salon Categories</h1>
            </div>
            <SalonCategoryTable />
        </div>
    );
}
