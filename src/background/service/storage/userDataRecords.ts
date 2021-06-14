import { EConfigKey, EUserDataRange } from '@/shared/interfaces/enum';
import browserBridge from '@/background/service/storage/browserBridge';
import dayjs from '@ptpp/utils/plugins/dayjs';
import { IUserInfo } from '@ptpp/sites/types';

type StoredUserDataPerSite = { // 站点HOST
  [date: string]: IUserInfo // 日期 YYYY-MM-DD
}

type StoredUserData = {
  [siteHost: string]: StoredUserDataPerSite // 站点HOST
}

class UserDataRecords extends browserBridge {
  protected override data: StoredUserData = {}
  protected configKey: string = EConfigKey.userDatas

  /**
   * 根据站点host和日期信息删除历史数据记录
   * @param query  如果date未传入，则删除该站点所有记录
   */
  async remove (query: {
    host: string,
    date?: string
  }): Promise<void> {
    const { host, date } = query;
    if (host in this.data) {
      if (typeof date === 'string') {
        delete this.data[host][date];
      } else {
        delete this.data[host];
      }

      await this.save();
    }
  }

  /**
   * 根据站点host获取用户信息，常见的范围为 all, today, latest
   * 其他范围请使用all之后再做筛选
   * @param host
   * @param range
   */
  public async getUserData (host: string, range: EUserDataRange = EUserDataRange.latest): Promise<StoredUserDataPerSite | IUserInfo | null> {
    if (!this.data || !this.data[host]) {
      return null;
    }

    const datas: StoredUserDataPerSite = this.data[host];
    switch (range) {
      case EUserDataRange.all:
        return datas;
      case EUserDataRange.today:
        return datas[dayjs().format('YYYY-MM-DD')];
      case EUserDataRange.latest:
        return datas[EUserDataRange.latest];
    }
  }

  public async updateUserData (host:string, data: IUserInfo): Promise<void> {
    const siteRecord = this.data[host] || {};

    siteRecord[EUserDataRange.latest] = siteRecord[dayjs().format('YYYY-MM-DD')] = data;
    this.data[host] = siteRecord;
    await this.save();
  }

  /**
   * 根据站点的 formerHosts 信息更新过去存储的用户历史
   * 注意，该方法仅允许在 browser.runtime.onInstalled 中触发
   */
  public async upgradeUserData () {
    // TODO
  }
}

export default new UserDataRecords();
