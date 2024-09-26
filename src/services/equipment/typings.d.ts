declare namespace API {
  type CreateEquipmentDto = {
    /** 训练器械英文名称 */
    name: string;
    /** 训练器械中文名称 */
    name_cn: string;
    /** 训练器械图片 */
    image: string;
  };

  type deleteByIdsParams = {
    ids: string[];
  };

  type fetchEquipmentsParams = {
    name: string;
    name_cn: string;
    current: number;
    pageSize: number;
  };

  type updateByIdParams = {
    id: string;
  };

  type UpdateEquipmentDto = {
    /** 训练器械英文名称 */
    name?: string;
    /** 训练器械中文名称 */
    name_cn?: string;
    /** 训练器械图片 */
    image?: string;
  };
}
