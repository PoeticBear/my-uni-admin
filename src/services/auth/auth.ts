// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 登录 POST /api/auth/login */
export async function login(options?: { [key: string]: any }) {
  return request<any>('/api/auth/login', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 退出登录 POST /api/auth/logout */
export async function logout(options?: { [key: string]: any }) {
  return request<any>('/api/auth/logout', {
    method: 'POST',
    ...(options || {}),
  });
}
