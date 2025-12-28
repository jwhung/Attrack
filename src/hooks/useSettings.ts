import { useState, useEffect } from 'react';

export interface UserSettings {
    celebrationThreshold: number; // minutes
    minDisplayTime: number; // seconds
    blacklist: string[];
}

export const DEFAULT_SETTINGS: UserSettings = {
    celebrationThreshold: 30,
    minDisplayTime: 10,
    blacklist: ['localhost', '127.0.0.1']
};

export const useSettings = () => {
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        chrome.storage.local.get('metrics_settings', (result) => {
            if (result['metrics_settings']) {
                setSettings(result['metrics_settings']);
            }
            setLoading(false);
        });
    }, []);

    const updateSettings = async (newSettings: Partial<UserSettings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        await chrome.storage.local.set({ 'metrics_settings': updated });
        // Notify background script of update
        chrome.runtime.sendMessage({ type: 'SETTINGS_UPDATED', settings: updated });
    };

    return { settings, updateSettings, loading };
};
