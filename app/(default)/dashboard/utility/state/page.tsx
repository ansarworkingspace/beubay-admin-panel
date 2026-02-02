import React from 'react';
import { StateTable } from './state-table/table';
import { FormBreadcrumb } from '@/components/shared/form/FormLayouts';

export default function StatePage() {
    return (
        <div className="space-y-6">
            <FormBreadcrumb items={['Dashboard', 'Utility', 'States']} />
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">States Management</h1>
            </div>
            <StateTable />
        </div>
    );
}
