import type { AuthResponse, LoginRequest, SignupRequest } from '../types/auth';
import { apiPath } from '../utils/apiPath';
import { requestJson } from './http';

export async function signup(payload: SignupRequest): Promise<AuthResponse> {
  return requestJson<AuthResponse>(apiPath('/auth/signup'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  return requestJson<AuthResponse>(apiPath('/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}
