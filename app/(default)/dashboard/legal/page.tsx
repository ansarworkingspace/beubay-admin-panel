"use client";

import React, { useState } from 'react';
import { FormBreadcrumb } from '@/components/shared/form/FormLayouts';
import { LegalForm } from './legal-form';
import { useLegalContent, useUpdateLegalMutation } from './controller';
import { cn } from '@/lib/utils';
import { FileText, ShieldCheck, Info } from 'lucide-react';

type LegalType = 'terms' | 'privacy' | 'about';

export default function LegalAdminPage() {
    const [activeTab, setActiveTab] = useState<LegalType>('terms');

    const { data: termsData, isLoading: termsLoading } = useLegalContent('terms');
    const { data: privacyData, isLoading: privacyLoading } = useLegalContent('privacy');
    const { data: aboutData, isLoading: aboutLoading } = useLegalContent('about');

    const updateTerms = useUpdateLegalMutation('terms');
    const updatePrivacy = useUpdateLegalMutation('privacy');
    const updateAbout = useUpdateLegalMutation('about');

    const tabs = [
        { id: 'terms', label: 'Terms & Conditions', icon: FileText },
        { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
        { id: 'about', label: 'About Us', icon: Info },
    ] as const;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <FormBreadcrumb items={['Dashboard', 'Legal Admin']} />
            
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Legal Administration
                </h1>
                <p className="text-muted-foreground">
                    Management of legal documents and company information displayed across platforms.
                </p>
            </div>

            <div className="flex flex-wrap gap-2 p-1 bg-muted/30 rounded-lg w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as LegalType)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-md",
                            activeTab === tab.id
                                ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="mt-6">
                {activeTab === 'terms' && (
                    <LegalForm
                        type="terms"
                        initialData={termsData}
                        isLoading={termsLoading}
                        onSave={(payload) => updateTerms.mutate(payload)}
                        isUpdating={updateTerms.isPending}
                    />
                )}
                {activeTab === 'privacy' && (
                    <LegalForm
                        type="privacy"
                        initialData={privacyData}
                        isLoading={privacyLoading}
                        onSave={(payload) => updatePrivacy.mutate(payload)}
                        isUpdating={updatePrivacy.isPending}
                    />
                )}
                {activeTab === 'about' && (
                    <LegalForm
                        type="about"
                        initialData={aboutData}
                        isLoading={aboutLoading}
                        onSave={(payload) => updateAbout.mutate(payload)}
                        isUpdating={updateAbout.isPending}
                    />
                )}
            </div>
        </div>
    );
}
