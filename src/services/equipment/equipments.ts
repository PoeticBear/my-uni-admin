// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 查询训练器械 GET /api/equipments */
export async function fetchEquipments(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.fetchEquipmentsParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/equipments', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 批量删除训练器械 DELETE /api/equipments */
export async function deleteByIds(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteByIdsParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/equipments', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新训练器械 PUT /api/equipments/${param0} */
export async function updateById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateByIdParams,
  body: API.UpdateEquipmentDto,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/equipments/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 统计符合条件的训练器械总数 GET /api/equipments/count */
export async function countEquipments(options?: { [key: string]: any }) {
  return request<any>('/api/equipments/count', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建训练器械 POST /api/equipments/create */
export async function create(body: API.CreateEquipmentDto, options?: { [key: string]: any }) {
  return request<any>('/api/equipments/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
