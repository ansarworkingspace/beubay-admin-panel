import * as React from "react";
import { X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Option = {
    label: string;
    value: string;
};

type MultiSelectProps = {
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
};

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select items...",
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggle = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((item) => item !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const handleRemove = (value: string) => {
        onChange(selected.filter((item) => item !== value));
    };

    const selectedOptions = options.filter(o => selected.includes(o.value));

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className="min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <div className="flex flex-wrap gap-1">
                    {selectedOptions.length > 0 ? (
                        selectedOptions.map((option) => (
                            <Badge key={option.value} variant="secondary" className="gap-1">
                                {option.label}
                                <button
                                    type="button"
                                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(option.value);
                                    }}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        ))
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                </div>
            </div>

            {open && (
                <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
                    {options.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            No options available
                        </div>
                    ) : (
                        <div className="p-1">
                            {options.map((option) => {
                                const isSelected = selected.includes(option.value);
                                return (
                                    <div
                                        key={option.value}
                                        className={cn(
                                            "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                            isSelected && "bg-accent"
                                        )}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggle(option.value);
                                        }}
                                    >
                                        <div className="flex items-center gap-2 flex-1">
                                            <div className={cn(
                                                "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                                            )}>
                                                {isSelected && <Check className="h-3 w-3" />}
                                            </div>
                                            <span>{option.label}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
