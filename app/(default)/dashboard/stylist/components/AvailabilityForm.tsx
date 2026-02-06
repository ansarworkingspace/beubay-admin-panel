"use client";

import React from "react";
import {
    Control,
    useFieldArray,
    useWatch,
    Controller,
    UseFormRegister,
    UseFormSetValue,
    UseFormGetValues,
} from "react-hook-form";
import { Plus, Trash2, Clock } from "lucide-react";

import { StylistFormData, IStylistAvailability } from "../model";
import { FormSection } from "@/components/shared/form/FormLayouts";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const DAYS: (keyof IStylistAvailability)[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
];

interface DailyProps {
    day: keyof IStylistAvailability;
    control: Control<StylistFormData>;
    register: UseFormRegister<StylistFormData>;
    setValue: UseFormSetValue<StylistFormData>;
    getValues: UseFormGetValues<StylistFormData>;
    errors: any;
}

const DailySchedule = ({ day, control, register, setValue, getValues, errors }: DailyProps) => {
    const isWorking = useWatch({
        control,
        name: `availability.${day}.is_working`,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: `availability.${day}.breaks`,
    });

    const handleWorkingChange = (checked: boolean) => {
        setValue(`availability.${day}.is_working`, checked);
        if (checked) {
            // Set defaults if empty
            const currentStart = getValues(`availability.${day}.working_hours.start_time`);
            const currentEnd = getValues(`availability.${day}.working_hours.end_time`);
            if (!currentStart) setValue(`availability.${day}.working_hours.start_time`, "09:00");
            if (!currentEnd) setValue(`availability.${day}.working_hours.end_time`, "17:00");
        }
    };

    return (
        <div className={cn("p-4 border rounded-lg", isWorking ? "bg-card" : "bg-muted/30")}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Controller
                        name={`availability.${day}.is_working`}
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                id={`availability-${day}`}
                                checked={field.value}
                                onCheckedChange={handleWorkingChange}
                            />
                        )}
                    />
                    <Label
                        htmlFor={`availability-${day}`}
                        className="text-base font-semibold capitalize cursor-pointer"
                    >
                        {day}
                    </Label>
                </div>
                {!isWorking && <span className="text-sm text-muted-foreground">Not Working</span>}
            </div>

            {isWorking && (
                <div className="space-y-4 pl-6 border-l-2 border-muted ml-1">
                    {/* Working Hours */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock size={12} /> Start Time
                            </Label>
                            <Input
                                type="time"
                                {...register(`availability.${day}.working_hours.start_time` as const, {
                                    required: isWorking ? "Required" : false,
                                })}
                                className="h-9"
                            />
                            {errors?.availability?.[day]?.working_hours?.start_time && (
                                <p className="text-xs text-destructive">Required</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock size={12} /> End Time
                            </Label>
                            <Input
                                type="time"
                                {...register(`availability.${day}.working_hours.end_time` as const, {
                                    required: isWorking ? "Required" : false,
                                    validate: (value) => {
                                        if (!value) return true;
                                        const startTime = getValues(`availability.${day}.working_hours.start_time`);
                                        if (!startTime) return true;
                                        return value > startTime || "End time must be after start time";
                                    }
                                })}
                                className="h-9"
                            />
                            {errors?.availability?.[day]?.working_hours?.end_time && (
                                <p className="text-xs text-destructive">{errors.availability[day].working_hours.end_time.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Breaks */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Breaks</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ start_time: "13:00", end_time: "13:30" })}
                                className="h-7 text-xs"
                            >
                                <Plus size={12} className="mr-1" /> Add Break
                            </Button>
                        </div>

                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-end gap-2 animate-in fade-in slide-in-from-top-1">
                                <div className="grid grid-cols-2 gap-2 flex-1">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-muted-foreground">Start</Label>
                                        <Input
                                            type="time"
                                            {...register(`availability.${day}.breaks.${index}.start_time` as const, {
                                                required: "Required"
                                            })}
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-muted-foreground">End</Label>
                                        <Input
                                            type="time"
                                            {...register(`availability.${day}.breaks.${index}.end_time` as const, {
                                                required: "Required",
                                                validate: (value) => {
                                                    if (!value) return true;
                                                    const breakStart = getValues(`availability.${day}.breaks.${index}.start_time`);
                                                    if (!breakStart) return true;
                                                    return value > breakStart || "Invalid time";
                                                }
                                            })}
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => remove(index)}
                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        ))}
                        {errors?.availability?.[day]?.breaks && (
                            <p className="text-xs text-destructive">Please check break times</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const AvailabilityForm = ({
    control,
    register,
    setValue,
    getValues,
    errors,
}: {
    control: Control<StylistFormData>;
    register: UseFormRegister<StylistFormData>;
    setValue: UseFormSetValue<StylistFormData>;
    getValues: UseFormGetValues<StylistFormData>;
    errors: any;
}) => {
    return (
        <FormSection
            title="Availability Schedule"
            description="Set working hours and breaks for each day of the week. Unchecked days are considered explicitly not working."
        >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {DAYS.map((day) => (
                    <DailySchedule
                        key={day}
                        day={day}
                        control={control}
                        register={register}
                        setValue={setValue}
                        getValues={getValues}
                        errors={errors}
                    />
                ))}
            </div>
        </FormSection>
    );
};
