declare namespace API {
  type CreateMuscleDto = {
    /** 父级肌群 */
    parent: string;
    /** 肌肉英文名称 */
    name: string;
    /** 肌肉中文名称 */
    name_cn: string;
    /** 图片地址 */
    image: string;
  };

  type deleteByIdsParams = {
    ids: string[];
  };

  type fetchChildrenParams = {
    id: string;
  };

  type fetchMusclesParams = {
    name: string;
    name_cn: string;
    current: number;
    pageSize: number;
  };

  type updateByIdParams = {
    id: string;
  };

  type UpdateMuscleDto = {
    /** 父级肌群 */
    parent?: string;
    /** 肌肉英文名称 */
    name?: string;
    /** 肌肉中文名称 */
    name_cn?: string;
    /** 图片地址 */
    image?: string;
  };
}
