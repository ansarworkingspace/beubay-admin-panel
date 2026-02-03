"use client";

import React from 'react';
import { ServiceTable } from './table/table';
import { FormBreadcrumb } from '@/components/shared/form/FormLayouts';

export default function ServicePage() {
    return (
        <div className="space-y-6">
            <FormBreadcrumb items={['Dashboard', 'Services']} />
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Service Management</h1>
            </div>
            <ServiceTable />
        </div>
    );
}
