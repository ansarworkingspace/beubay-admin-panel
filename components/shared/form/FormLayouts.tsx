"use client";

import React, { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Save, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// ===== TYPE DEFINITIONS =====

interface FormContainerProps {
  children: ReactNode;
  className?: string;
}

interface FormBreadcrumbProps {
  items?: string[];
}

interface FormTitleCardProps {
  title: string;
  description?: string;
}

interface FormSectionProps {
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
}

interface FormRowProps {
  children: ReactNode;
  className?: string;
}

interface FormFieldProps {
  children: ReactNode;
  className?: string;
  error?: string;
  label?: string;
  required?: boolean;
}

interface FormActionsProps {
  onCancel: () => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
  cancelText?: string;
  submitText?: string | null;
  className?: string;
  isCancelVisible?: boolean;
  disabled?: boolean;
}

// ===== COMPONENTS =====

// 1. Form Container
export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  className = "",
}) => (
  <div className={`min-h-screen p-6 ${className}`}>
    <div className="mx-auto space-y-6">{children}</div>
  </div>
);

// 2. Breadcrumb
export const FormBreadcrumb: React.FC<FormBreadcrumbProps> = ({
  items = [],
}) => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <Button onClick={handleBack}>Back</Button>
    </nav>
  );
};
// 3. Title Card
export const FormTitleCard: React.FC<FormTitleCardProps> = ({
  title,
  description,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
  </Card>
);

// 4. Section Card
export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  className,
  children,
}) => (
  <Card className={cn("text-lg", className)}>
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent className="space-y-6">{children}</CardContent>
  </Card>
);

export const FormSectionHalf: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </CardContent>
  </Card>
);

// 5. Row Layouts
export const FormRowOne: React.FC<FormRowProps> = ({ children }) => (
  <div className="space-y-2">{children}</div>
);

export const FormRowTwo: React.FC<FormRowProps> = ({ children, className }) => (
  <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>{children}</div>
);

export const FormRowThree: React.FC<FormRowProps> = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
);

// 6. Field Wrapper
export const FormField: React.FC<FormFieldProps> = ({
  children,
  className = "",
  error,
  label,
  required,
}) => (
  <div className={`space-y-2  ${className}`}>
    <Label htmlFor="address">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    {children}
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

// 7. Form Actions
export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onSubmit,
  isLoading = false,
  isEdit = false,
  cancelText = "Cancel",
  submitText = null,
  className = "",
  isCancelVisible = true,
}) => (
  <Card className={cn("text-right", className)}>
    <CardContent className="pt-0">
      <div className="flex justify-end space-x-4">
        {isCancelVisible && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>{cancelText}</span>
          </Button>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          onClick={onSubmit}
          className="flex items-center space-x-2"
          aria-disabled={isLoading}
        >
          <Save className="w-4 h-4" />
          <span>
            {isLoading ? (
              <span className="animate-spin">Saving...</span>
            ) : (
              submitText || (isEdit ? "Update" : "Create")
            )}
          </span>
        </Button>
      </div>
    </CardContent>
  </Card>
);
