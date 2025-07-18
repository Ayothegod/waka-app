import { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (userData: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (values: { email: string, password: string }) => authAPI.login(values),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setError(null);
      navigate('/');
    },
    onError: (error: Error) => {
      setError(error);
    },
  });

  const signupMutation = useMutation({
    mutationFn: (values: { name: string; email: string, password: string }) => authAPI.signup(values),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setError(null);
      navigate('/');
    },
    onError: (error: Error) => {
      setError(error);
    },
  });

  const login = async (credentials: { email: string; password: string }) => {
    await loginMutation.mutateAsync(credentials);
  };

  const signup = async (userData: { email: string; password: string; name: string }) => {
    await signupMutation.mutateAsync(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    queryClient.removeQueries();
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!localStorage.getItem('token'),
        login,
        signup,
        logout,
        isLoading: loginMutation.isPending || signupMutation.isPending,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}