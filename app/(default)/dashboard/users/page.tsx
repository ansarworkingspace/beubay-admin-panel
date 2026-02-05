"use client";

import React from 'react';
import { CustomerTable } from './table/table';
import { FormBreadcrumb } from '@/components/shared/form/FormLayouts';

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <FormBreadcrumb items={['Dashboard', 'User Management']} />
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
            </div>
            <CustomerTable />
        </div>
    );
}
