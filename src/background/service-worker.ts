import { TimeTracker } from './TimeTracker';

const tracker = new TimeTracker();
// Prevent tree-shaking
(self as any).tracker = tracker;
console.log('Background service worker started with TimeTracker.');
