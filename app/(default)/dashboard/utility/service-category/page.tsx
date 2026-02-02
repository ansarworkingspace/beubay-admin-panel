"use client";

import React from 'react';
import { ServiceCategoryTable } from './table/table';
import { FormBreadcrumb } from '@/components/shared/form/FormLayouts';

export default function ServiceCategoryPage() {
    return (
        <div className="space-y-6">
            <FormBreadcrumb items={['Dashboard', 'Utility', 'Service Categories']} />
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Service Categories</h1>
            </div>
            <ServiceCategoryTable />
        </div>
    );
}
