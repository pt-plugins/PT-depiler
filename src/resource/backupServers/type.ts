
export interface backupServer {
  /**
   * 验证服务器可用性
   */
  ping: () => Promise<boolean>;

  /**
   * 获取资源列表
   * @param options
   */
  list: (options: any) => Promise<any>;

  addFile: (formData: FormData) => Promise<any>;

  /**
   * 获取（下载）一个文件
   * @param path
   * @returns 返回一个 binary 数据
   */
  getFile: (path: string) => Promise<any>;

  deleteFile: (path: string) => Promise<any>;
}
