import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, LoginRequest } from '@qldh/shared';
import { repositories } from '@/lib/api';

const TOKEN_KEY = 'qldh:token';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (input: LoginRequest) => Promise<AuthUser>;
  impersonate: (targetUserId: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      async login(input) {
        set({ loading: true, error: null });
        try {
          const { token, user } = await repositories.auth.login(input);
          localStorage.setItem(TOKEN_KEY, token);
          set({ user, token, loading: false });
          return user;
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'Login failed';
          set({ loading: false, error: msg });
          throw e;
        }
      },
      async impersonate(targetUserId) {
        if (!repositories.auth.impersonate) throw new Error('Adapter khong ho tro impersonate');
        const { token, user } = await repositories.auth.impersonate(targetUserId);
        localStorage.setItem(TOKEN_KEY, token);
        set({ user, token });
      },
      async logout() {
        try { await repositories.auth.logout(); } catch { /* ignore */ }
        localStorage.removeItem(TOKEN_KEY);
        set({ user: null, token: null });
      },
      async hydrate() {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) return;
        const user = await repositories.auth.me();
        if (user) set({ user, token });
        else { localStorage.removeItem(TOKEN_KEY); set({ user: null, token: null }); }
      },
    }),
    {
      name: 'qldh:auth',
      partialize: (s) => ({ user: s.user, token: s.token }),
    }
  )
);
