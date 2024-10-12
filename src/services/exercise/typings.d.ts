declare namespace API {
  type CreateExerciseDto = {
    /** 动作英文名 */
    name?: string;
    /** 动作中文名 */
    name_cn: string;
    /** 动作编号 */
    serial: string;

    bodyParts: string[];

    primaryMuscles: string[];

    secondaryMuscles: string[];

    equipments: string[];

    /** 动作图片 */
    image: string;
    /** 动作视频 */
    videos: string[];
    /** 记录类型 */
    recordType?: string;
    /** 动作描述 */
    description?: string;
    /** 提示 */
    tips?: string;
    /** 参考内容 */
    referenceContent?: string;
    /** 常见错误 */
    // commonMistakes?: string;
    /** 注意事项 */
    precautions?: string;
    /** 适合人群 */
    suitableFor?: string;
    /** 重复次数 */
    repetitions?: number;
    /** 休息时间 */
    restBetweenSets?: number;
  };

  type deleteByIdsParams = {
    ids: string[];
  };

  type FavoriteExerciseDto = {};

  type fetchExercisesParams = {
    name: string;
    name_cn: string;
    current: number;
    pageSize: number;
    bodyPart?: string;
    primaryMuscle?: string;
    equipment?: string;
    difficulty?: string;
  };

  type findFavoritesByUserParams = {
    userId: string;
  };

  type RemoveFavoriteDto = {};

  type updateByIdParams = {
    id: string;
  };

  type UpdateExerciseDto = {
    /** 序号 */
    serial?: string;
    /** 动作英文名 */
    name?: string;
    /** 动作中文名 */
    name_cn?: string;

    bodyParts: string[];

    primaryMuscles: string[];

    secondaryMuscles: string[];

    equipments: string[];

    /** 动作图片 */
    image?: string;
    /** 动作视频 */
    videos?: string[];
    /** 记录类型 */
    recordType?: string;
    /** 动作描述 */
    description?: string;
    /** 提示 */
    tips?: string;
    /** 参考内容 */
    referenceContent?: string;
    /** 常见错误 */
    // commonMistakes?: string;
    /** 注意事项 */
    precautions?: string;
    /** 适合人群 */
    suitableFor?: string;
    /** 重复次数 */
    repetitions?: number;
    /** 休息时间 */
    restBetweenSets?: number;
  };
}
