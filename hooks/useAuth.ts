import { useAuth } from '@/lib/auth-context';

export { useAuth };

export function useMe() {
  const { user, isLoading, refetchUser } = useAuth();
  return { user, isLoading, refetchUser };
}

export function useLogin() {
  const { login } = useAuth();
  return { login };
}

export function useVerifyOtp() {
  const { verifyOtp, cancelOtp, otpChallenge } = useAuth();
  return { verifyOtp, cancelOtp, otpChallenge };
}

export function useResendOtp() {
  const { resendOtp, otpChallenge } = useAuth();
  return { resendOtp, otpChallenge };
}

export function useLogout() {
  const { logout } = useAuth();
  return { logout };
}
