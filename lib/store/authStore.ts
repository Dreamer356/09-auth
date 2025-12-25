import { create } from "zustand";
import type { User } from "../../types/user";
import { getSession, getCurrentUser } from "../api/clientApi";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoadingSession: boolean;
  setUser: (user: User | null) => void;
  clearIsAuthenticated: () => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()((set, get) => {
  // Очищаємо старі дані при ініціалізації
  if (typeof window !== 'undefined') {
    console.log('Clearing old auth data from localStorage');
    localStorage.removeItem('auth-store');
    localStorage.removeItem('08-zustand');
  }

  return {
    user: null,
    isAuthenticated: false,
    isLoadingSession: false,
    
    setUser: (user) => {
      console.log('Setting user:', user);
      set({ user, isAuthenticated: !!user });
    },
    
    clearIsAuthenticated: () => {
      console.log('Clearing authentication');
      set({ user: null, isAuthenticated: false });
    },

    checkSession: async () => {
      console.log('Checking session...');
      set({ isLoadingSession: true });
      
      try {
        const sessionResponse = await getSession();
        console.log('Session response:', sessionResponse);
        
        if (sessionResponse.success) {
          const user = await getCurrentUser();
          console.log('Current user:', user);
          set({ user, isAuthenticated: true });
        } else {
          console.log('No active session');
          set({ user: null, isAuthenticated: false });
        }
      } catch (error) {
        console.error('Session check error:', error);
        set({ user: null, isAuthenticated: false });
      } finally {
        set({ isLoadingSession: false });
      }
    },

    logout: async () => {
      try {
        console.log('Logging out...');
        // Викликаємо API для logout
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Очищаємо локальний стан
        console.log('Clearing local state after logout');
        set({ user: null, isAuthenticated: false });
      }
    },
  };
});
