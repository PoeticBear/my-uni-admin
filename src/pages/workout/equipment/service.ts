// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { TableListItem } from './data';

/** 获取训练器械列表 GET /api/equipment */
export async function fetchEquipmentList(
  params: {
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  } = {}, // 设置默认值为空对象
  options: { [key: string]: any } = {}, // 同样为 options 设置默认值
) {
  try {
    const response = await request<{
      result: TableListItem[];
      message: string;
      statusCode: number;
    }>('/api/equipments', {
      method: 'GET',
      ...(options || {}),
    });

    const { result, statusCode } = response;

    return {
      data: result || [], // 确保 result 存在
      total: result?.length || 0, // 确保 result 不为空时计算长度
      success: statusCode === 200, // 使用解构后的 statusCode
    };
  } catch (error) {
    console.error('Failed to fetch equipment list:', error);
    return {
      data: [],
      total: 0,
      success: false,
      errorMessage: error.message || 'Unknown error occurred',
    };
  }
}

/** 更新训练器械信息 PUT /api/equipment */
export async function updateEquipment(data: TableListItem, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/equipments', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建训练器械 POST /api/equipment */
export async function addEquipment(data: TableListItem, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/equipments', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除训练器械 DELETE /api/equipment */
export async function removeEquipment(data: { ids: number[] }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/equipments', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

// /** 此处后端没有提供注释 GET /api/equipments/filter */
// export async function queryEquipments(
//   // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
//   params: API.EquipmentControllerFilterParams,
//   options?: { [key: string]: any },
// ) {
//   return request<any>('/api/equipments/filter', {
//     method: 'GET',
//     params: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }
