"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api_client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAuthTokens, getAccessToken, setAccessToken, setRefreshToken } from "@/lib/token_utils";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(true); // Initial loading state for auth check

    useEffect(() => {
        // Check if user is already logged in
        const token = getAccessToken();
        if (token) {
            router.push("/dashboard"); // Redirect to dashboard if logged in
        } else {
            setLoading(false); // Only show form if no token
        }
    }, [router]);

    const mutate = useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post("/admin/auth/login", data);
            return response.data;
        },
        onSuccess: (response) => {

            const responseData = response.data || response;

            if (responseData.token || responseData.accessToken) {
                toast.success("Login successful");
                clearAuthTokens();

                const accessToken = responseData.token || responseData.accessToken;
                const refreshToken = responseData.refreshToken;

                setAccessToken(accessToken);
                if (refreshToken) {
                    setRefreshToken(refreshToken);
                }

                router.push("/dashboard");
            } else {
                toast.error("Login failed: No token received");
            }
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Login failed. Please try again.";

            toast.error(errorMessage);
            console.error("Login error:", error);
        },
    });

    const validateForm = (email: string, password: string) => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 4) {
            newErrors.password = "Password must be at least 4 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (validateForm(email, password)) {
            const data = { email, password };
            mutate.mutate(data);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

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

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="admin@example.com"
                                    className={errors.email ? "border-red-500" : ""}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>
                            <div className="grid gap-3 relative">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    {/*  <Link
                    href="/forgot-password"
                    className="text-sm underline-offset-4 hover:underline text-muted-foreground"
                    >
                    Forgot your password?
                    </Link> 
                   */}
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={isPasswordVisible ? "text" : "password"}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {isPasswordVisible ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={mutate.isPending}>
                            {mutate.isPending ? (
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
                <div className="absolute inset-0 bg-black/20" /> {/* Overlay for text readability */}

            </div>
        </div>
    );
}
