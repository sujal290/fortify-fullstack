'use client';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { loginUser, registerUser } from '@/services/authService';
import { setCredentials, logout as logoutAction } from '@/redux/slices/authSlice';
import { useToast } from './useToast';

/**
 * Wraps auth state (Redux) + auth API calls (React Query mutations) behind
 * one hook so components never touch the store or axios directly.
 */
export function useAuth() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { user, token } = useSelector((s) => s.auth);

  const login = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      showToast(`Welcome back, ${data.name.split(' ')[0]}`);
    },
    onError: (err) => showToast(err?.response?.data?.message || 'Login failed', 'error'),
  });

  const signup = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      showToast(`Account created — welcome, ${data.name.split(' ')[0]}`);
    },
    onError: (err) => showToast(err?.response?.data?.message || 'Signup failed', 'error'),
  });

  const logout = () => {
    dispatch(logoutAction());
    showToast('Signed out');
  };

  return {
    user,
    token,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    login: login.mutate,
    loginPending: login.isPending,
    signup: signup.mutate,
    signupPending: signup.isPending,
    logout,
  };
}
