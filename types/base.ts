// lib/types.ts

// Type pour les rôles utilisateur
export type UserRole = "user" | "admin";

// Type pour les données d'authentification
export interface AuthResponse {
    access: string;
    refresh: string;
    user_id?: number; // Pour les utilisateurs normaux
    admin_id?: number; // Pour les administrateurs
    username: string;
    token_lifetime: {
        access: number; // Durée en secondes
        refresh: number; // Durée en secondes
    };
}

// Type pour les erreurs d'API
export interface ApiError {
    status: number;
    message: string;
    errors?: Record<string, string[]>; // Pour les erreurs de validation
}

// Type pour les options de configuration des requêtes
export interface ApiRequestOptions {
    headers?: Record<string, string>;
    params?: Record<string, any>;
    data?: any;
    timeout?: number;
    role?: UserRole; // Pour spécifier le rôle (user ou admin)
}


export interface AuthData {
    access: string;
    refresh: string;
    username: string;
    email: string;
}