import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background p-4 text-center">
            <ShieldAlert className="h-24 w-24 text-destructive" />
            <h1 className="text-4xl font-bold tracking-tight">401 - Unauthorized</h1>
            <p className="text-muted-foreground text-lg">
                You do not have permission to access this page.
            </p>
            <div className="flex gap-4 mt-4">
                <Button asChild variant="outline">
                    <Link href="/">
                        Go to Dashboard
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/login">
                        Login with a Different Account
                    </Link>
                </Button>
            </div>
        </div>
    );
}
