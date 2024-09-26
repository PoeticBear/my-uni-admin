// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 查询训练器械 GET /api/muscles */
export async function fetchMuscles(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.fetchMusclesParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/muscles', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 批量删除肌群数据 DELETE /api/muscles */
export async function deleteByIds(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteByIdsParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/muscles', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新肌群数据 PUT /api/muscles/${param0} */
export async function updateById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateByIdParams,
  body: API.UpdateMuscleDto,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/muscles/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 获取一级肌群数据（身体部位） GET /api/muscles/body-part */
export async function fetchBodyPart(options?: { [key: string]: any }) {
  return request<any>('/api/muscles/body-part', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建肌群数据 POST /api/muscles/create */
export async function create(body: API.CreateMuscleDto, options?: { [key: string]: any }) {
  return request<any>('/api/muscles/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
