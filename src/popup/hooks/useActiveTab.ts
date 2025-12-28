import { useState, useEffect } from 'react';

export interface TabData {
    totalActiveTime: number;
    visitCount: number;
    lastVisitTime: number;
    title?: string;
}

export const useActiveTab = () => {
    const [activeUrl, setActiveUrl] = useState<string | null>(null);
    const [data, setData] = useState<TabData | null>(null);

    useEffect(() => {
        // Get current active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            if (tab?.url) {
                setActiveUrl(tab.url);
                fetchData(tab.url);
            }
        });

        const fetchData = (url: string) => {
            chrome.storage.local.get(url, (result) => {
                if (result[url]) {
                    setData(result[url] as TabData);
                }
            });
        };

        // Listen for storage changes to update UI in real-time
        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
            if (activeUrl && changes[activeUrl]) {
                setData(changes[activeUrl].newValue as TabData);
            }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);
        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, [activeUrl]);

    return { activeUrl, data };
};
