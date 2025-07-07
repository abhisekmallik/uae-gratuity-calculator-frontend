import {
  ApiResponse,
  ConfigurationData,
  EmployeeData,
  EOSBCalculationResult,
} from "@/types";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Server status tracking
let isServerDown = false;

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/eosb`,
  timeout: 15000, // Increased timeout for real API calls
  headers: {
    "Content-Type": "application/json",
  },
});

// Utility function to check if we should redirect to server error page
const shouldRedirectToServerError = (error: unknown): boolean => {
  const axiosError = error as {
    response?: { status?: number; data?: { message?: string } };
    code?: string;
  }; // Type assertion for axios error
  // Check for network errors, server errors, or timeout
  return (
    !axiosError.response || // Network error
    axiosError.code === "ECONNREFUSED" || // Connection refused
    axiosError.code === "ENOTFOUND" || // DNS error
    axiosError.code === "ETIMEDOUT" || // Timeout
    (axiosError.response && (axiosError.response.status ?? 0) >= 500) // Server error
  );
};

// Function to redirect to server error page
const redirectToServerError = () => {
  if (
    typeof window !== "undefined" &&
    !window.location.pathname.includes("/server-error")
  ) {
    const currentLocale = window.location.pathname.split("/")[1] || "en";
    window.location.href = `/${currentLocale}/server-error`;
  }
};

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Reset server down status on successful response
    isServerDown = false;
    return response;
  },
  (error) => {
    console.error("API Response Error:", error);

    if (shouldRedirectToServerError(error)) {
      // Server is down, set flag and redirect
      if (
        !isServerDown &&
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/server-error")
      ) {
        isServerDown = true;

        // Show toast message before redirect
        toast.error("Server is currently unavailable. Redirecting...", {
          duration: 2000,
        });

        // Redirect after a short delay
        setTimeout(() => {
          redirectToServerError();
        }, 2000);
      }
      throw new Error("Server is currently unavailable");
    }

    // Handle other types of errors with toast messages
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || "An error occurred";

      // Show appropriate toast based on status code
      if (error.response.status === 400) {
        toast.error("Invalid request. Please check your input.");
      } else if (error.response.status === 401) {
        toast.error("Authentication required.");
      } else if (error.response.status === 403) {
        toast.error("Access forbidden.");
      } else if (error.response.status === 404) {
        toast.error("Service not found.");
      } else if (error.response.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(message);
      }

      throw new Error(message);
    } else if (error.request) {
      // Network error
      toast.error(
        "Network connection failed. Please check your internet connection."
      );
      throw new Error("Network error. Please check your connection.");
    } else {
      // Request setup error
      toast.error("Request failed. Please try again.");
      throw new Error("Request failed. Please try again.");
    }
  }
);

export const apiService = {
  async getConfiguration(): Promise<ConfigurationData> {
    try {
      const response = await apiClient.get<ApiResponse<ConfigurationData>>(
        "/config"
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.message || "Failed to fetch configuration"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Configuration fetch error:", error);
      throw error;
    }
  },

  async calculateEOSB(
    employeeData: EmployeeData
  ): Promise<EOSBCalculationResult> {
    try {
      const response = await apiClient.post<ApiResponse<EOSBCalculationResult>>(
        "/calculate",
        employeeData
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "Failed to calculate EOSB");
      }

      return response.data.data;
    } catch (error) {
      console.error("EOSB calculation error:", error);
      throw error;
    }
  },

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await apiClient.get<
        ApiResponse<{ status: string; timestamp: string }>
      >("/health");

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "Health check failed");
      }

      return response.data.data;
    } catch (error) {
      console.error("Health check error:", error);
      throw error;
    }
  },
};

// Function to reset server status (can be called externally)
export const resetServerStatus = () => {
  isServerDown = false;
};

// Export the server status for external checks
export const getServerStatus = () => isServerDown;

export default apiService;
