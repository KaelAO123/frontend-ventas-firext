import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Usuario, LoginResponse } from '@/types';

interface AuthState {
  user: Usuario | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: Usuario) => void;
  getUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: true,

      login: async (username: string, password: string) => {
        set({ isLoading: true });
        
        try {

          const response = await api.post<LoginResponse>('/login', { 
            username: username.trim(), 
            password 
          });
          
          const { token, usuario, message } = response.data;
          console.log(usuario);
          
          set({ 
            token, 
            user: usuario, 
            isLoading: false 
          });
          
          localStorage.setItem('token', token);
          toast.success(message || '¡Bienvenido! Inicio de sesión exitoso');
          
          return response.data;
        } catch (error: any) {
          set({ isLoading: false });
                    
          let errorMessage = 'Error al iniciar sesión';
          
          if (error.response?.data?.errors) {
            const errors = error.response.data.errors;
            if (errors.login) {
              errorMessage = errors.login[0];
            } else if (errors.username) {
              errorMessage = errors.username[0];
            } else if (errors.password) {
              errorMessage = errors.password[0];
            }
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          
          toast.error(errorMessage);
          throw error;
        }
      },

      logout: async () => {
        try {
          const token = get().token;
          if (token) {
            await api.post('/logout');
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ user: null, token: null });
          localStorage.removeItem('token');
          toast.success('Sesión cerrada exitosamente');
        }
      },

      setUser: (user: Usuario) => set({ user }),
      
      getUser: async () => {
        try {
          const response = await api.get('/me');
          if (response.data.usuario) {
            set({ user: response.data.usuario });
          }
        } catch (error) {
          console.error('Error fetching user:', error);          
          if (get().token) {
            get().logout();
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);