import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { 
  login, 
  register, 
  logout, 
  getSession, 
  getCurrentUser,
  updateUserProfile
} from "../api/clientApi";
import type { User } from "../../types/user";
import type { 
  LoginParams, 
  RegisterParams 
} from "../api/clientApi";

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCheckedSession: boolean;
  login: (credentials: LoginParams) => Promise<void>;
  register: (credentials: RegisterParams) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  updateProfile: (userData: { username?: string; email?: string }) => Promise<void>;
  setUser: (user: User | null) => void;
  clearIsAuthenticated: () => void;
  resetSessionCheck: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      hasCheckedSession: false,
      
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          console.log('Attempting login with credentials:', credentials);
          const user = await login(credentials);
          console.log('Login successful, user data:', user);
          set({ user, isAuthenticated: true, isLoading: false, hasCheckedSession: true });
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      register: async (credentials) => {
        set({ isLoading: true });
        try {
          const user = await register(credentials);
          set({ user, isAuthenticated: true, isLoading: false, hasCheckedSession: true });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        try {
          await logout();
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false, 
            hasCheckedSession: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      checkSession: async () => {
        const state = get();
        
        // Запобігаємо повторним викликам тільки якщо вже виконується
        if (state.isLoading) {
          return;
        }
        
        console.log('Checking session...');
        set({ isLoading: true });
        try {
          const response = await getSession();
          console.log('Session response:', response);
          
          // API повертає { success: true/false }, а не об'єкт користувача
          if (response && typeof response === 'object' && 'success' in response) {
            if (response.success) {
              // Якщо сесія активна, отримуємо дані користувача
              try {
                console.log('Session is active, fetching user data...');
                const user = await getCurrentUser();
                console.log('User data received:', user);
                set({ 
                  user, 
                  isAuthenticated: true, 
                  isLoading: false, 
                  hasCheckedSession: true 
                });
              } catch (error) {
                console.error('Error fetching user data:', error);
                // Якщо не можемо отримати користувача, але сесія активна
                set({ 
                  isAuthenticated: true, 
                  isLoading: false, 
                  hasCheckedSession: true 
                });
              }
            } else {
              console.log('Session is not active');
              set({ 
                user: null, 
                isAuthenticated: false, 
                isLoading: false, 
                hasCheckedSession: true 
              });
            }
          } else {
            // Якщо отримали об'єкт користувача напряму
            console.log('Received user object directly:', response);
            set({ 
              user: response as User, 
              isAuthenticated: !!response, 
              isLoading: false, 
              hasCheckedSession: true 
            });
          }
        } catch (error) {
          console.error('Session check error:', error);
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false, 
            hasCheckedSession: true 
          });
        }
      },
      
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
      
      clearIsAuthenticated: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateProfile: async (userData) => {
        set({ isLoading: true });
        try {
          const updatedUser = await updateUserProfile(userData);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      resetSessionCheck: () => {
        set({ hasCheckedSession: false });
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        hasCheckedSession: state.hasCheckedSession 
      }),
    }
  )
);
