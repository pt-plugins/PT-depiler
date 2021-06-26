
// 动态生成 btClient 列表
import Container from '@/resource/utils/class/container';
import { IBackupConfig, IBackupMetadata, IBackupServer } from '@/resource/backupServers/type';

export const serverTypeFullList =
  require.context('@/resource/backupServers/src/', true, /\.ts$/, 'weak')
    .keys()
    .map(value => {
      return value.replace(/^\.\//, '').replace(/\.ts$/, '');
    });

class BackupServerFactory extends Container {
  protected readonly serverTypeList = serverTypeFullList;

  public async dynamicImport (type: string) {
    return await import(
      /* webpackChunkName: "lib/backupServers/[request]" */
      /* webpackMode: "lazy" */
      /* webpackExports: ["default", "serverConfig", "serverMetaData"] */
      `@/resource/backupServers/src/${type}`) as {
      default: IBackupServer<IBackupConfig>,
      serverConfig: IBackupConfig,
      serverMetaData: IBackupMetadata<IBackupConfig>
    };
  }

  // noinspection JSUnusedGlobalSymbols
  public async getBackupServer (config: IBackupConfig): Promise<IBackupServer<IBackupConfig>> {
    return await this.resolveObject<IBackupServer<IBackupConfig>>(`backupServer-${config.id}`, async () => {
      const { default: Server } = await this.dynamicImport(config.type);
      // @ts-ignore
      return new Server(config);
    });
  }
}

export default new BackupServerFactory();
