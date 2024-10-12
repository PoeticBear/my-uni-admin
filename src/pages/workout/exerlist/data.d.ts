export type TableListItem = {
  id: string;
  key: number;
  name: string;
  name_cn: string;
  serial: string;
  bodyParts:string[];
  primaryMuscles:string[];
  secondaryMuscles:string[];
  equipments:string[];
  image: string;
  videos: string[];
  commonMistakes:string;
  precautions:string;
  suitableFor:string;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  key?: number;
  name?: string;
  name_cn?: string;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
