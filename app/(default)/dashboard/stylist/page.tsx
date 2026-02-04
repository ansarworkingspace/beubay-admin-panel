"use client";

import React from 'react';
import { StylistTable } from './table/table';
import { FormBreadcrumb } from '@/components/shared/form/FormLayouts';

export default function StylistPage() {
    return (
        <div className="space-y-6">
            <FormBreadcrumb items={['Dashboard', 'Stylists']} />
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Stylist Management</h1>
            </div>
            <StylistTable />
        </div>
    );
}
