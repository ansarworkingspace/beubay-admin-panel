
import { TransactionsTable } from "./table/table";
import { Suspense } from "react";
import { Loading } from "@/components/ui/loading";

export default function TransactionsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            </div>
            <Suspense fallback={<Loading />}>
                <TransactionsTable />
            </Suspense>
        </div>
    );
}
