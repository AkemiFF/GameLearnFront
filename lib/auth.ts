// lib/auth.ts
type AuthType = "user" | "admin";

import type { AuthData } from "@/types/base";
import { BASE_URL } from "./host";

const authManager = (type: AuthType = "user") => {
    const storageKey = type === "admin" ? "admin_auth" : "auth";

    // Référence stable pour les méthodes
    const auth = {
        save: (responseData: any) => {
            const authData: AuthData = {
                access: responseData.access,
                refresh: responseData.refresh,
                username: responseData.username,
                email: responseData.email,
            };

            localStorage.setItem(storageKey, JSON.stringify(authData));
        },

        // Maintenant asynchrone pour gérer le refresh si nécessaire
        getToken: async (tokenType: "access" | "refresh"): Promise<string | null> => {
            const storedAuth = localStorage.getItem(storageKey);
            if (!storedAuth) return null;
            const parsed = JSON.parse(storedAuth);
            if (tokenType === "access") {
                // Si le token d'accès est expiré, le rafraîchir
                if (Date.now() >= parsed.access_expires_at) {
                    try {
                        const newAccessToken = await auth.refreshToken();
                        return newAccessToken;
                    } catch (error) {
                        console.error("Erreur lors du rafraîchissement du token :", error);
                        return null;
                    }
                }
            }
            return parsed[tokenType];
        },

        isAuthenticated: (): boolean => {
            const authData = localStorage.getItem(storageKey);
            if (!authData) return false;
            return Date.now() < JSON.parse(authData).access_expires_at;
        },

        getAuthHeader: async (): Promise<HeadersInit> => {
            let token: string | null;
            token = await auth.getToken("access");
            if (!token) throw new Error("Token d'accès indisponible");
            return {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            };
        },

        refreshToken: async (): Promise<string> => {
            const storedAuth = localStorage.getItem(storageKey);
            if (!storedAuth) {
                throw new Error("Aucun token de rafraîchissement disponible");
            }
            const parsed = JSON.parse(storedAuth);
            const refreshToken = parsed.refresh;
            if (!refreshToken) {
                throw new Error("Aucun token de rafraîchissement disponible");
            }
            const response = await fetch(`${BASE_URL}/auth/token/refresh/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (!response.ok) throw new Error("Échec du rafraîchissement du token");

            const data = await response.json();
            auth.save(data);
            return data.access;
        },

        logout: () => {
            localStorage.removeItem(storageKey);
            window.location.href = type === "admin" ? "/admin/login" : "/auth/login";
        }
    };

    return auth;
};

// Exports
export const userAuth = authManager();
export const adminAuth = authManager("admin");

// Fonctions dépréciées
export const getClientToken = async () => await userAuth.getToken("access");
export const getAdminToken = async () => await adminAuth.getToken("access");
