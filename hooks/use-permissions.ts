import { useState, useEffect } from 'react';
import { getUserFromToken, CustomJwtPayload } from '@/lib/token_utils';

export function usePermissions() {
    const [user, setUser] = useState<CustomJwtPayload | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, you might want to subscribe to store/context
        // For now, we just read from the token on mount
        const userData = getUserFromToken();
        setUser(userData);
        setLoading(false);
    }, []);

    const hasPermission = (moduleId?: string) => {
        if (!moduleId) return true; // Public or no specific permission needed
        if (!user) return false;
        if (user.is_super_admin) return true; // Super admin has access to everything

        // Future: Check user.permissions array
        // return user.permissions?.includes(moduleId) ?? false;

        // For now, as per instructions, only super admin check is strictly required for full access.
        // If we want to support partial permissions later:
        return user.permissions?.includes(moduleId) || false;
    };

    return { user, loading, hasPermission };
}
