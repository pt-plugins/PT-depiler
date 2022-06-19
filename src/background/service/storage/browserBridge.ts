// FIXME
import browser from "webextension-polyfill";

export default abstract class BrowserBridge {
  protected data: any;
  protected abstract configKey: string

  private readonly emptyData?: any;

  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor () {
    this.emptyData = this.data;
    this.load().then(r => {
      console.log(`${this.constructor.name}.load`, this.data);
    });
  }

  private static async getBrowserData <T> (key: string): Promise<T | null> {
    const result = await browser.storage.local.get(key);
    if (result[key]) {
      return result[key] as T;
    }
    return null;
  }

  private static async setBrowserData (key:string, value:any): Promise<void> {
    const data: any = {};
    data[key] = value;
    return await browser.storage.local.set(data);
  }

  /**
   * 获取记录
   */
  protected async load ():Promise<void> {
    this.data = (await BrowserBridge.getBrowserData(this.configKey)) || this.emptyData;
  }

  /**
   * 保存记录
   */
  protected async save (): Promise<void> {
    await BrowserBridge.setBrowserData(this.configKey, this.data);
  }

  /**
   * 使用外部数据覆盖所有记录
   * @param data
   * @protected
   */
  async reset (data: any): Promise<void> {
    this.data = data;
    await this.save();
  }

  /**
   * 删除其中一条数据的方法
   * @param id
   */
  abstract remove (id: any) : Promise<any>;

  /**
   * 清除全部记录
   */
  async clear (): Promise<void> {
    await this.reset(this.emptyData);
  }
}
