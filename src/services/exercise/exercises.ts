// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 查询训练动作 GET /api/exercises */
export async function fetchExercises(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.fetchExercisesParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/exercises', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 批量删除训练动作 DELETE /api/exercises */
export async function deleteByIds(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteByIdsParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/exercises', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新训练动作 PUT /api/exercises/${param0} */
export async function updateById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateByIdParams,
  body: API.UpdateExerciseDto,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/exercises/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 批量查询数据 POST /api/exercises/batch */
export async function findManyByIds(options?: { [key: string]: any }) {
  return request<any>('/api/exercises/batch', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 统计符合条件的动作总数 GET /api/exercises/count */
export async function countExercises(options?: { [key: string]: any }) {
  return request<any>('/api/exercises/count', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建动作 POST /api/exercises/create */
export async function create(body: API.CreateExerciseDto, options?: { [key: string]: any }) {
  return request<any>('/api/exercises/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 收藏动作 POST /api/exercises/favorite */
export async function favorite(body: API.FavoriteExerciseDto, options?: { [key: string]: any }) {
  return request<any>('/api/exercises/favorite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 取消收藏 DELETE /api/exercises/favorite */
export async function removeFavorite(
  body: API.RemoveFavoriteDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/exercises/favorite', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询用户收藏的动作 GET /api/exercises/favorites/${param0} */
export async function findFavoritesByUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.findFavoritesByUserParams,
  options?: { [key: string]: any },
) {
  const { userId: param0, ...queryParams } = params;
  return request<any>(`/api/exercises/favorites/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 统计已上传图片的动作数量占比 GET /api/exercises/images-ratio */
export async function countImagesRatio(options?: { [key: string]: any }) {
  return request<any>('/api/exercises/images-ratio', {
    method: 'GET',
    ...(options || {}),
  });
}
