// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取全部用户 GET /api/user */
export async function findAll(options?: { [key: string]: any }) {
  return request<any>('/api/user', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 更新用户 PUT /api/user/${param0} */
export async function updateUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateUserParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/user/${param0}`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除用户 DELETE /api/user/${param0} */
export async function deleteUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/user/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取用户数据 GET /api/user/${param0} */
export async function getUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserParams,
  options?: { [key: string]: any },
) {
  const { username: param0, ...queryParams } = params;
  return request<any>(`/api/user/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取用户资料 GET /api/user/profile */
export async function getProfile(options?: { [key: string]: any }) {
  return request<any>('/api/user/profile', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 注册用户 POST /api/user/register */
export async function register(options?: { [key: string]: any }) {
  return request<any>('/api/user/register', {
    method: 'POST',
    ...(options || {}),
  });
}
