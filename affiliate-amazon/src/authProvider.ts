import { AuthProvider } from "react-admin";

const LOGIN_URL = "https://et.urbantrends.dev/accounts/login/";

export const authProvider: AuthProvider = {
    login: async ({ username, password }) => {
        const response = await fetch(LOGIN_URL, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Authentication failed');
        }

        const auth = await response.json();
        // Stores { access: "...", refresh: "..." }
        localStorage.setItem('auth', JSON.stringify(auth));
    },

    logout: () => {
        localStorage.removeItem('auth');
        return Promise.resolve();
    },

    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('auth');
            return Promise.reject();
        }
        return Promise.resolve();
    },

    checkAuth: () => {
        return localStorage.getItem('auth') ? Promise.resolve() : Promise.reject();
    },

    getPermissions: () => Promise.resolve(),
};