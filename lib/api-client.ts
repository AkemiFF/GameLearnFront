// lib/api-client.ts
import { getAdminToken, getClientToken } from "@/lib/auth";
import { BASE_URL } from "@/lib/host";
import type { UserRole } from "@/types/base";
import axios from "axios";

const createApiInstance = (role: UserRole = "user") => {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(async (config) => {
    if (typeof window !== "undefined") {
      const token = role === "admin" ? await getAdminToken() : await getClientToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem(role === "admin" ? "admin_auth" : "auth");
        window.location.href = role === "admin" ? "/admin/login" : "/login";
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const apiClient = createApiInstance();
export const apiAdmin = createApiInstance("admin");