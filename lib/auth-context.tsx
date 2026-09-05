'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient, ApiResponse } from '@/lib/api-client';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface OtpChallengeState {
  email: string;
  challengeId: string;
  resendAllowedAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  otpChallenge: OtpChallengeState | null;
  login: (email: string, password: string) => Promise<ApiResponse<any>>;
  verifyOtp: (otp: string) => Promise<ApiResponse<any>>;
  resendOtp: () => Promise<ApiResponse<any>>;
  logout: () => Promise<void>;
  cancelOtp: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [otpChallenge, setOtpChallenge] = useState<OtpChallengeState | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const refetchUser = useCallback(async () => {
    try {
      const res = await apiClient.get<UserProfile>('/api/v1/auth/me');
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchUser();
  }, [refetchUser]);

  // Centralized 401 unauthorized listener
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      if (typeof window !== 'undefined' && !pathname.startsWith('/admin/login')) {
        router.push('/admin/login');
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [pathname, router]);

  const login = async (email: string, password: string): Promise<ApiResponse<any>> => {
    const res = await apiClient.post<any>('/api/v1/auth/login', { email, password });
    if (res.success && res.data?.requiresOtp) {
      setOtpChallenge({
        email: res.data.email,
        challengeId: res.data.challengeId,
        resendAllowedAt: res.data.resendAllowedAt,
      });
    }
    return res;
  };

  const verifyOtp = async (otp: string): Promise<ApiResponse<any>> => {
    if (!otpChallenge) {
      return {
        success: false,
        message: 'No active OTP challenge found. Please sign in again.',
        data: null,
      };
    }

    const res = await apiClient.post<any>('/api/v1/auth/verify-otp', {
      email: otpChallenge.email,
      otp,
      challengeId: otpChallenge.challengeId,
    });

    if (res.success && res.data?.user) {
      setUser(res.data.user);
      setOtpChallenge(null);
    }
    return res;
  };

  const resendOtp = async (): Promise<ApiResponse<any>> => {
    if (!otpChallenge) {
      return {
        success: false,
        message: 'No active OTP challenge found.',
        data: null,
      };
    }

    const res = await apiClient.post<any>('/api/v1/auth/resend-otp', {
      email: otpChallenge.email,
      challengeId: otpChallenge.challengeId,
    });

    if (res.success && res.data?.challengeId) {
      setOtpChallenge((prev) =>
        prev
          ? {
              ...prev,
              challengeId: res.data.challengeId,
              resendAllowedAt: res.data.resendAllowedAt,
            }
          : null
      );
    }
    return res;
  };

  const logout = async () => {
    try {
      await apiClient.post('/api/v1/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setOtpChallenge(null);
      router.push('/admin/login');
    }
  };

  const cancelOtp = () => {
    setOtpChallenge(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        otpChallenge,
        login,
        verifyOtp,
        resendOtp,
        logout,
        cancelOtp,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
