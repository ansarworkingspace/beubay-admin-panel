import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command as CommandPrimitive } from "cmdk";
import { Command, CommandGroup, CommandItem } from "./command";

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
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    const handleUnselect = (item: string) => {
        onChange(selected.filter((i) => i !== item));
    };

    const selectedOptions = selected.map((s) => options.find((o) => o.value === s)).filter(Boolean) as Option[];

    return (
        <Command onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Backspace" && !inputValue) {
                e.preventDefault();
                if (selected.length > 0) {
                    handleUnselect(selected[selected.length - 1]);
                }
            }
            if (e.key === "Escape") {
                inputRef.current?.blur();
            }
        }} className="overflow-visible bg-transparent">
            <div
                className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
            >
                <div className="flex flex-wrap gap-1">
                    {selectedOptions.map((option) => (
                        <Badge key={option.value} variant="secondary">
                            {option.label}
                            <button
                                type="button"
                                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleUnselect(option.value);
                                    }
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onClick={() => handleUnselect(option.value)}
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                        </Badge>
                    ))}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder={placeholder}
                        className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
                    />
                </div>
            </div>
            <div className="relative mt-2">
                {open && (
                    <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                        <CommandGroup className="h-full overflow-auto max-h-60">
                            {options.map((option) => {
                                const isSelected = selected.includes(option.value);
                                if (isSelected) return null; // Hide selected
                                return (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={() => {
                                            onChange([...selected, option.value]);
                                            setInputValue("");
                                        }}
                                        className="cursor-pointer"
                                    >
                                        {option.label}
                                    </CommandItem>
                                );
                            })}
                            {options.filter(o => !selected.includes(o.value)).length === 0 && (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                    No results found.
                                </div>
                            )}
                        </CommandGroup>
                    </div>
                )}
            </div>
        </Command>
    );
}
