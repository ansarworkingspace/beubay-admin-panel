"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LegalContent, LegalUpdatePayload } from './model';
import { Loader2, Save } from 'lucide-react';

const ReactQuill = dynamic(() => import('react-quill-new'), { 
    ssr: false,
    loading: () => <div className="h-64 w-full bg-muted animate-pulse rounded-md" />
});

interface LegalFormProps {
    type: 'terms' | 'privacy' | 'about';
    initialData?: LegalContent | null;
    isLoading: boolean;
    onSave: (payload: LegalUpdatePayload) => void;
    isUpdating: boolean;
}

export function LegalForm({ type, initialData, isLoading, onSave, isUpdating }: LegalFormProps) {
    const [content, setContent] = useState('');
    const [version, setVersion] = useState('');

    useEffect(() => {
        if (initialData) {
            setContent(initialData.content || '');
            setVersion(initialData.version || '');
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload: LegalUpdatePayload = { content };
        if (type !== 'about') {
            payload.version = version;
        }
        onSave(payload);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading content...</p>
            </div>
        );
    }

    const titleMap = {
        terms: 'Terms & Conditions',
        privacy: 'Privacy Policy',
        about: 'About Us'
    };

    return (
        <Card className="border-none shadow-premium bg-background/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-xl font-bold">{titleMap[type]}</CardTitle>
                <CardDescription>
                    Manage the content of your {titleMap[type].toLowerCase()}.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {type !== 'about' && (
                        <div className="space-y-2">
                            <Label htmlFor="version">Version</Label>
                            <Input
                                id="version"
                                value={version}
                                onChange={(e) => setVersion(e.target.value)}
                                placeholder="e.g. 1.0.0"
                                className="max-w-[200px]"
                            />
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <Label>Content</Label>
                        <div className="rounded-md overflow-hidden min-h-[400px]">
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, 3, false] }],
                                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        ['link', 'clean']
                                    ],
                                }}
                                className="h-[350px] mb-12"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isUpdating} className="w-full sm:w-auto">
                            {isUpdating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
