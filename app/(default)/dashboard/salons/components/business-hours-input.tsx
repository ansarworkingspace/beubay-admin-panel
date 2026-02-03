"use client";

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { BusinessHours, BusinessHour } from '../model';

interface BusinessHoursInputProps {
    value: BusinessHours;
    onChange: (value: BusinessHours) => void;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export function BusinessHoursInput({ value, onChange }: BusinessHoursInputProps) {
    const handleDayChange = (day: keyof BusinessHours, field: keyof BusinessHour, newVal: any) => {
        const currentDay = value[day] || { is_open: false, opening_time: '', closing_time: '' };
        const updatedDay = { ...currentDay, [field]: newVal };
        onChange({
            ...value,
            [day]: updatedDay
        });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Business Hours</h3>
            <div className="grid gap-4">
                {DAYS.map((day) => {
                    const dayData = value?.[day] || { is_open: false, opening_time: '', closing_time: '' };
                    return (
                        <div key={day} className="flex items-center gap-10 border p-3 rounded-md">
                            <div className="w-32 capitalize font-medium flex items-center gap-2">
                                <Checkbox
                                    checked={dayData.is_open}
                                    onCheckedChange={(checked) => handleDayChange(day, 'is_open', !!checked)}
                                />
                                {day}
                            </div>

                            {dayData.is_open ? (
                                <div className="flex items-center gap-2 flex-1">
                                    <Input
                                        type="time"
                                        value={dayData.opening_time}
                                        onChange={(e) => handleDayChange(day, 'opening_time', e.target.value)}
                                        className="w-32"
                                    />
                                    <span>to</span>
                                    <Input
                                        type="time"
                                        value={dayData.closing_time}
                                        onChange={(e) => handleDayChange(day, 'closing_time', e.target.value)}
                                        className="w-32"
                                    />
                                </div>
                            ) : (
                                <span className="text-muted-foreground text-sm flex-1">Closed</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
