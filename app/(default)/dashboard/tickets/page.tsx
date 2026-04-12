"use client";

import React, { Suspense } from 'react';
import { TicketsTable } from './table/table';
import { FormBreadcrumb } from '@/components/shared/form/FormLayouts';
import { Loading } from '@/components/ui/loading';

export default function TicketsPage() {
    return (
        <div className="space-y-6">
            <FormBreadcrumb items={['Dashboard', 'Ticket Management']} />
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Support Tickets</h1>
            </div>
            <Suspense fallback={<Loading />}>
                <TicketsTable />
            </Suspense>
        </div>
    );
}
