
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
    GRANTS: (userId) => `${API_BASE_URL}/api/grants/${userId}`,
    PITCH_ANALYZE: `${API_BASE_URL}/api/pitch/analyze`,
    PITCH_IMPROVE: `${API_BASE_URL}/api/pitch/improve`,
    CREDITS_INITIALIZE: `${API_BASE_URL}/api/credits/initialize`,
    USERS: `${API_BASE_URL}/api/users`
};

export default API_BASE_URL;
