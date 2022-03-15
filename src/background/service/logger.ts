import { v4 as uuidv4 } from 'uuid';
import { EConfigKey } from '@/shared/interfaces/enum';
import { LogItem } from '@/shared/interfaces/common';
import BrowserBridge from '@/background/service/storage/browserBridge';

class Logger extends BrowserBridge {
  protected maxLength = 100;
  protected configKey = EConfigKey.systemLogs;
  protected override data: LogItem[] = [];

  /**
   * 添加日志
   * @param data 日志信息
   */
  public async add (data: Partial<LogItem>): Promise<string> {
    // 如果超出了最大值，则删除最早的记录
    if (this.data.length > this.maxLength) {
      this.data.splice(0, 1);
    }

    data.id = uuidv4(); // 不使用外部传入 ID 和时间戳
    data.time = new Date().getTime();
    this.data.push(<LogItem>data);
    await this.save();

    return data.id; // 返回日志id
  }

  /**
   * 删除历史记录，返回总共删除的数量
   * @param logIds 需要删除的记录ids
   */
  async remove (logIds: string[]):Promise<number> {
    let removeCount = 0;

    logIds.forEach(logId => {
      const findIndex = this.data.findIndex(rec => rec.id === logId);
      if (findIndex > 0) {
        this.data.splice(findIndex, 1);
        removeCount++;
      }
    });
    await this.save();

    return removeCount;
  }
}

export default new Logger();
