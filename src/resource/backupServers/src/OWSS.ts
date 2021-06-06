import { backupServer } from '@/resource/backupServers/type';

// TODO
export default class OWSS implements backupServer {
  addFile (formData: FormData): Promise<any> {
    return Promise.resolve(undefined);
  }

  deleteFile (path: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  getFile (path: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  list (options: any): Promise<any> {
    return Promise.resolve(undefined);
  }

  ping (): Promise<boolean> {
    return Promise.resolve(false);
  }
}
