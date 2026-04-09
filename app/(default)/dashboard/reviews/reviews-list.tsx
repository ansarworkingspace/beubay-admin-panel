"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, User, Store, UserCircle } from "lucide-react";
import { format } from "date-fns";
import { SalonRating, StylistRating } from "./model";
import { cn } from "@/lib/utils";

interface ReviewsListProps {
    type: "salon" | "stylist";
    data: (SalonRating | StylistRating)[];
    isLoading: boolean;
}

export function ReviewsList({ type, data, isLoading }: ReviewsListProps) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 w-full animate-pulse bg-muted rounded-xl" />
                ))}
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
                <p>No reviews found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {data.map((rating) => {
                const isStylist = "stylist_id" in rating;
                
                return (
                    <Card key={rating._id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 bg-card/60 backdrop-blur-sm group">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Left: User Info */}
                                <div className="flex items-start gap-4 min-w-[200px]">
                                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm group-hover:scale-105 transition-transform">
                                        <AvatarImage src={rating.user_id?.profile_image} />
                                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                            {rating.user_id?.name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-sm leading-none">{rating.user_id?.name || "Guest User"}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            {format(new Date(rating.created_at), "MMM d, yyyy")}
                                        </p>
                                        <div className="flex items-center gap-0.5 mt-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={cn(
                                                        "h-3.5 w-3.5",
                                                        i < rating.rating 
                                                            ? "fill-orange-400 text-orange-400" 
                                                            : "text-muted-foreground/30"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Center: Feedback Content */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-primary/5 text-primary border-primary/10">
                                            {type} Review
                                        </Badge>
                                        {!isStylist && (rating as SalonRating).is_active === false && (
                                            <Badge variant="destructive" className="px-2 py-0.5 text-[10px] uppercase">Inactive</Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-foreground/80 italic leading-relaxed">
                                        "{rating.feedback || "No feedback provided."}"
                                    </p>
                                </div>

                                {/* Right: Entity Details */}
                                <div className="flex flex-col items-start md:items-end justify-center gap-2 min-w-[200px]">
                                    <div className="flex items-center gap-2 text-xs font-medium bg-muted/50 px-3 py-2 rounded-lg border border-border/50">
                                        <Store className="h-3.5 w-3.5 text-primary/70" />
                                        <span className="text-muted-foreground">Salon:</span>
                                        <span className="text-foreground">{rating.salon_id.salon_name}</span>
                                    </div>
                                    {isStylist && (
                                        <div className="flex items-center gap-2 text-xs font-medium bg-primary/5 px-3 py-2 rounded-lg border border-primary/10">
                                            <UserCircle className="h-3.5 w-3.5 text-primary" />
                                            <span className="text-primary/70">Stylist:</span>
                                            <span className="text-primary font-bold">{(rating as StylistRating).stylist_id.name}</span>
                                        </div>
                                    )}
                                    <div className="text-[10px] text-muted-foreground mt-1 px-1">
                                        Booking ID: #...{rating.booking_id.slice(-6)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
