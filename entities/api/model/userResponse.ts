/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * COCOMOMO API
 * COCOMOMO 백엔드 API 문서
 * OpenAPI spec version: 1.0
 */
import type { UserResponseRole } from './userResponseRole';

export type UserResponse = {
  id: number;
  platformId: number;
  name: string;
  email: string;
  role: UserResponseRole;
  createdAt: string;
  updatedAt: string;
};
