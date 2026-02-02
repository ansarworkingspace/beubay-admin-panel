import React from 'react';
import { CityTable } from './city-table/table';
import { FormBreadcrumb } from '@/components/shared/form/FormLayouts';

export default function CityPage() {
    return (
        <div className="space-y-6">
            <FormBreadcrumb items={['Dashboard', 'Utility', 'Cities']} />
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Cities Management</h1>
            </div>
            <CityTable />
        </div>
    );
}
