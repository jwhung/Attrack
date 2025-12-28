export class TimeTracker {
    private activeTabId: number | null = null;
    private activeUrl: string | null = null;
    private startTime: number | null = null;
    private timerInterval: any = null;
    private readonly HEARTBEAT_INTERVAL = 1000;
    private readonly IDLE_THRESHOLD = 30; // Seconds

    // Settings
    private celebrationThresholdLines = 30 * 60; // Seconds
    private blacklist: string[] = [];

    constructor() {
        this.init();
    }

    private init() {
        // Listen for tab activation (switching tabs)
        // @ts-ignore
        chrome.tabs.onActivated.addListener(this.handleTabActivated.bind(this));

        // Listen for tab updates (URL changes)
        // @ts-ignore
        chrome.tabs.onUpdated.addListener(this.handleTabUpdated.bind(this));

        // Listen for window focus changes
        chrome.windows.onFocusChanged.addListener(this.handleWindowFocusChanged.bind(this));

        // Listen for idle state
        chrome.idle.setDetectionInterval(this.IDLE_THRESHOLD);
        // @ts-ignore
        chrome.idle.onStateChanged.addListener(this.handleIdleStateChanged.bind(this));

        // Start tracking the current active tab immediately
        this.checkCurrentTab();
    }

    private async checkCurrentTab() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id && tab.url) {
            this.startTracking(tab.id, tab.url);
        }
    }

    private handleTabActivated(activeInfo: any) {
        this.stopTracking();
        chrome.tabs.get(activeInfo.tabId, (tab) => {
            if (tab && tab.url) {
                this.startTracking(tab.id!, tab.url);
            }
        });
    }

    private handleTabUpdated(tabId: number, changeInfo: any, tab: chrome.tabs.Tab) {
        if (tabId === this.activeTabId && changeInfo.status === 'complete' && tab.url) {
            // If URL changed in the active tab, restart tracking
            if (tab.url !== this.activeUrl) {
                this.stopTracking();
                this.startTracking(tabId, tab.url);
            }
        }
    }

    private handleWindowFocusChanged(windowId: number) {
        if (windowId === chrome.windows.WINDOW_ID_NONE) {
            this.stopTracking();
        } else {
            this.checkCurrentTab();
        }
    }

    private handleIdleStateChanged(newState: any) {
        if (newState === 'active') {
            this.checkCurrentTab();
        } else {
            this.stopTracking();
        }
    }

    private async startTracking(tabId: number, url: string) {
        // Validate protocol (http/https only)
        if (!url.startsWith('http')) return;

        this.activeTabId = tabId;
        this.activeUrl = url;
        this.startTime = Date.now();

        console.log(`Starting tracking for: ${url}`);

        // Get tab title
        try {
            const tab = await chrome.tabs.get(tabId);
            const title = tab.title || new URL(url).hostname;
            // Increment visit count for new session
            await this.incrementVisitCount(url, title);
        } catch (e) {
            console.error('Error getting tab info:', e);
        }

        // Clear existing timer if any
        if (this.timerInterval) clearInterval(this.timerInterval);

        // Start heartbeat
        this.timerInterval = setInterval(() => {
            this.updateStorage();
        }, this.HEARTBEAT_INTERVAL);
    }

    private async incrementVisitCount(url: string, title: string) {
        const data = await chrome.storage.local.get(url);
        const currentData = (data[url] as any) || { totalActiveTime: 0, visitCount: 0, lastVisitTime: 0, title };

        await chrome.storage.local.set({
            [url]: {
                ...currentData,
                visitCount: currentData.visitCount + 1,
                lastVisitTime: Date.now(),
                title: title // Update title in case it changed
            }
        });
    }

    private stopTracking() {
        if (this.activeUrl && this.startTime) {
            this.updateStorage(); // Final update before stopping
            console.log(`Stopped tracking for: ${this.activeUrl}`);
        }

        this.activeTabId = null;
        this.activeUrl = null;
        this.startTime = null;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    private async updateStorage() {
        if (!this.activeUrl) return;

        const url = this.activeUrl;

        // visitCount is already initialized in incrementVisitCount
        const data = await chrome.storage.local.get(url);
        const currentData = (data[url] as any) || { totalActiveTime: 0, visitCount: 1, lastVisitTime: Date.now(), title: 'Unknown' };

        const newTotalTime = currentData.totalActiveTime + 1;

        // Check for celebration trigger
        if (newTotalTime % this.NOTIFICATION_THRESHOLD === 0 && newTotalTime > 0) {
            this.triggerCelebration();
        }

        const updatedData = {
            ...currentData,
            totalActiveTime: newTotalTime,
            lastVisitTime: Date.now(),
        };

        await chrome.storage.local.set({ [url]: updatedData });
    }

    private triggerCelebration() {
        if (this.activeTabId) {
            console.log('Triggering celebration!');
            chrome.tabs.sendMessage(this.activeTabId, { type: 'CELEBRATE' })
                .catch((e) => {
                    // Ignore errors
                    console.log('Celebration trigger failed (harmless):', e);
                });
        }
    }
}
