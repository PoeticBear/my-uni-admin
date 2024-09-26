declare namespace API {
  type CreateUserDto = {
    /** 用户名称 */
    username: string;
    /** 用户密码 */
    password: string;
    /** 手机号码 */
    phone: string;
    /** 用户头像 */
    avatar: string;
  };

  type deleteByIdsParams = {
    ids: string[];
  };

  type fetchUsersParams = {
    username: string;
    phone: string;
    current: number;
    pageSize: number;
  };

  type getUserParams = {
    phone: string;
  };

  type updateByIdParams = {
    id: string;
  };

  type UpdateUserDto = {
    /** 用户名称 */
    username?: string;
    /** 用户密码 */
    password?: string;
    /** 手机号码 */
    phone?: string;
    /** 用户头像 */
    avatar?: string;
  };
}
