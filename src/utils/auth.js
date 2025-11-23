// 认证状态管理工具函数

export const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    return !!token;
};

export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

export const getUserId = () => {
    return localStorage.getItem('userId');
};

export const getUsername = () => {
    return localStorage.getItem('username');
};

export const getUserInfo = () => {
    return {
        token: getAuthToken(),
        userId: getUserId(),
        username: getUsername(),
        isAuthenticated: isAuthenticated()
    };
};

export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    window.location.reload();
};

export const getAuthHeaders = (includeContentType = true) => {
    const token = getAuthToken();
    const headers = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (includeContentType) {
        headers['Content-Type'] = 'application/json';
    }

    return headers;
};