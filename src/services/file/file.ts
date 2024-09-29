// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 上传文件 POST /api/file/upload */
export async function uploadFile(formData:FormData, options?: { [key: string]: any }) {
  return request<any>('/api/file/upload', {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...(options || {}),
  });
}
