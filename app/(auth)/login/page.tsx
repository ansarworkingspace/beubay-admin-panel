"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAccessToken, setRefreshToken } from "@/lib/token_utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate API call
            // In a real app, replace with:
            // const res = await fetch('/api/v1/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

            // Mocking a successful response after 1 second
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Mock Token (This would come from your backend)
            // This token needs to be a valid JWT for the client helper to decode 'is_super_admin' if checking on client side.
            // However, client side check is just for UI. Middleware checks server side.
            // For demo purposes, we will just set a dummy token.
            // IMPORTANT: In production, the backend returns the token.

            // Since we don't have a real backend to generate a signed JWT,
            // we'll just store a placeholder and rely on the fact that we aren't verify signature locally in this demo
            // or we can mock a token if we had a library to sign it, but we can't sign on client.
            // So we will assume the text "mock-jwt-token" works for our middleware PLACEHOLDER logic.
            const mockAccessToken = "mock.access.token";
            const mockRefreshToken = "mock.refresh.token";

            setAccessToken(mockAccessToken);
            setRefreshToken(mockRefreshToken);

            toast.success("Login successful!");
            router.push("/dashboard");
        } catch (error) {
            toast.error("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-screen flex">
            {/* Left Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-bold tracking-tight">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Sign in to your account to continue
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1"
                                    placeholder="admin@example.com"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </form>
                </div>
            </div>

            {/* Right Side: Image/Background */}
            <div className="hidden lg:block w-1/2 bg-muted relative overflow-hidden">
                <Image
                    src="/login-bg.jpg"
                    alt="Login Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/20" /> {/* Overlay for text readability if needed */}

            </div>
        </div>
    );
}
