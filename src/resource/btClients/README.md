# 下载客户端定义

此目录用来存放 **下载客户端** 的实现，其中每个`ts文件`均代表其中的一种客户端实现

## 添加下载客户端

1. 编写 `./src/${type}.ts` 文件，每个ts文件的实现模板如下：
    
    ```typescript
    export const clientConfig: TorrentClientBaseConfig = {
        type: string,  // 客户端类型，与文件名中 ${type} 部分相同
        ...
    }
    
    export const clientMetaData: TorrentClientMetaData = {
        
    }
    
    export default class ${type} extends AbstractBittorrentClient<T> {
        readonly version: string;  // 实现的版本号 x.y.z 格式，目前暂无特别用处

        constructor (options: Partial<TorrentClientBaseConfig | TorrentClientConfig>) {
            super({...clientConfig, ...options});
        }

        // 检查客户端是否可以连接
        public async ping (): Promise<boolean> {}
    
        /**
         * 获取种子信息的方法
         *
         * 注意 abstract class 中内置了一种本地筛选种子的获取方法，
         * 即从bt软件中获取所有种子，然后本地筛选，即 getAllTorrents -> getTorrentsBy -> getTorrent
         * 此时只需要完成 getAllTorrents 方法的逻辑即可
         *
         * 如果该客户端支持在获取种子的时候进行筛选，
         * 则建议将筛选给bt软件，即 getTorrentsBy -> getAllTorrents/getTorrent
         * 此时，则同时需要完成 3个方法（部分情况下为其中1个或2个）的 override
         *
         */
        public async getAllTorrents (): Promise<Torrent[]> {}
        public async getTorrentsBy (filter: TorrentFilterRules): Promise<Torrent[]> {}
        public async getTorrent (id: any): Promise<Torrent> {}
    
        // 添加种子
        public async addTorrent (url: string, options: Partial<AddTorrentOptions> = {}): Promise<boolean> {}
    
        // 对某个种子进行操作
        public async pauseTorrent (id: string): Promise<boolean> {}
        public async removeTorrent (id: string, removeData?: boolean): Promise<boolean> {}
        public async resumeTorrent (id: any): Promise<boolean> {}
    }
    ```
    
    即至少应该对外暴露出
    
     - `clientConfig`, `clientMetaData` 两个配置文件
     - 一个实现了 TorrentClient 接口的 class 作为默认抛出对象
    
    请注意，`interface TorrentClient` 并没有约定真实的请求方法，所以你一般要在 class 中实现类似方法
    
    ```typescript
    export default class ${type} implements TorrentClient {
        // 当然，这个方法也可以不叫 request
        private async request() {
            // TODO
        }
    }
    ```

2. 在 `/public/assets/btclients/` 目录下放入同名的图标，要求： `png` 格式，分辨率 128x128
