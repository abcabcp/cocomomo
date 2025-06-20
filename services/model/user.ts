/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * COCOMOMO API
 * COCOMOMO 백엔드 API 문서
 * OpenAPI spec version: 1.0
 */
import type { UserRole } from './userRole';

export interface User {
  /** 사용자 ID (자동생성) */
  id: number;
  /** GitHub ID */
  githubId: number;
  /** 사용자 이름 */
  username: string;
  /** 사용자 이메일 */
  email?: string;
  /** 프로필 이미지 URL */
  avatarUrl?: string;
  /** 사용자 권한 */
  role: UserRole;
  /** 사용자 계정 생성 시간 */
  createdAt: string;
  /** 사용자 정보 수정 시간 */
  updatedAt: string;
}
