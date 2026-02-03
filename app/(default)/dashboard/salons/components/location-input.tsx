"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationInputProps {
    value: { lat: number; lng: number };
    onChange: (value: { lat: number; lng: number }) => void;
}

export function LocationInput({ value, onChange }: LocationInputProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Location Coordinates</h3>
            <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                    <Label>Latitude</Label>
                    <Input
                        type="number"
                        step="any"
                        value={value?.lat}
                        onChange={(e) => onChange({ ...value, lat: parseFloat(e.target.value) || 0 })}
                        placeholder="e.g. 9.931"
                    />
                </div>
                <div className="flex-1 space-y-2">
                    <Label>Longitude</Label>
                    <Input
                        type="number"
                        step="any"
                        value={value?.lng}
                        onChange={(e) => onChange({ ...value, lng: parseFloat(e.target.value) || 0 })}
                        placeholder="e.g. 76.267"
                    />
                </div>
            </div>
            <p className="text-sm text-muted-foreground">Enter the coordinates for the salon location.</p>
        </div>
    );
}
