// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取用户 GET /api/user */
export async function fetchUsers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.fetchUsersParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/user', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 批量删除用户 DELETE /api/user */
export async function deleteByIds(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteByIdsParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/user', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新用户 PUT /api/user/${param0} */
export async function updateById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateByIdParams,
  body: API.UpdateUserDto,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/user/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 新增用户 POST /api/user/create */
export async function create(body: API.CreateUserDto, options?: { [key: string]: any }) {
  return request<any>('/api/user/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据电话获取用户 GET /api/user/phone/${param0} */
export async function getUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserParams,
  options?: { [key: string]: any },
) {
  const { phone: param0, ...queryParams } = params;
  return request<any>(`/api/user/phone/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}
