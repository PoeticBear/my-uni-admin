export type TableListItem = {
  _id: string;
  id: string;
  key: number;
  parent: string;
  name: string;
  name_cn: string;
  image: string;
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
  parent?: string;
  name?: string;
  name_cn?: string;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
