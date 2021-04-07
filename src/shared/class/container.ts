export default abstract class Container {
  private initializedObject: {
    [key: string]: any
  } = {}

  protected async resolveObject<T> (id: string, fn: Function): Promise<T> {
    if (!(id in this.initializedObject)) {
      this.initializedObject[id] = await fn()
    }
    return this.initializedObject[id] as T
  }
}
