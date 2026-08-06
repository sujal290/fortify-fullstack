// PATH: client/src/services/analyticsService.js  (NEW FILE)
import api from './api';

export const fetchDashboardAnalytics = () => api.get('/analytics/dashboard').then((r) => r.data);
export const runScheduledJobsNow = () => api.post('/analytics/run-jobs').then((r) => r.data);