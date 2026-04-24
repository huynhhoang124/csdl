import type { LoginRequest, LoginResponse, AuthUser } from '@qldh/shared';

export interface IAuthRepository {
  login(input: LoginRequest): Promise<LoginResponse>;
  logout(): Promise<void>;
  me(): Promise<AuthUser | null>;
  impersonate?(targetUserId: string): Promise<LoginResponse>;
}
