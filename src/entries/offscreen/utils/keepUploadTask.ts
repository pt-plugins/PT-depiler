/**
 * 辅种任务处理函数
 */

import { onMessage, sendMessage } from "@/messages.ts";
import type { IKeepUploadTask, TKeepUploadTaskKey, TKeepUploadTaskStorageSchema } from "@/shared/types.ts";

const STORAGE_KEY = "keepUploadTask" as const;

/**
 * 获取所有辅种任务
 */
export async function getKeepUploadTasks(): Promise<IKeepUploadTask[]> {
  const tasks = await sendMessage("getExtStorage", STORAGE_KEY);
  return tasks ? Object.values(tasks as TKeepUploadTaskStorageSchema) : [];
}

onMessage("getKeepUploadTasks", getKeepUploadTasks);

/**
 * 根据ID获取辅种任务
 */
export async function getKeepUploadTaskById(taskId: TKeepUploadTaskKey): Promise<IKeepUploadTask | undefined> {
  const tasks = await sendMessage("getExtStorage", STORAGE_KEY);
  return (tasks as TKeepUploadTaskStorageSchema)?.[taskId];
}

onMessage("getKeepUploadTaskById", async ({ data: taskId }) => {
  const task = await getKeepUploadTaskById(taskId);
  return task!;
});

/**
 * 创建辅种任务
 */
export async function createKeepUploadTask(task: IKeepUploadTask): Promise<void> {
  const tasks = ((await sendMessage("getExtStorage", STORAGE_KEY)) as TKeepUploadTaskStorageSchema) || {};
  tasks[task.id] = task;
  await sendMessage("setExtStorage", { key: STORAGE_KEY, value: tasks });
}

onMessage("createKeepUploadTask", async ({ data: task }) => {
  await createKeepUploadTask(task);
});

/**
 * 更新辅种任务
 */
export async function updateKeepUploadTask(task: IKeepUploadTask): Promise<void> {
  const tasks = ((await sendMessage("getExtStorage", STORAGE_KEY)) as TKeepUploadTaskStorageSchema) || {};
  if (tasks[task.id]) {
    tasks[task.id] = task;
    await sendMessage("setExtStorage", { key: STORAGE_KEY, value: tasks });
  }
}

onMessage("updateKeepUploadTask", async ({ data: task }) => {
  await updateKeepUploadTask(task);
});

/**
 * 删除辅种任务
 */
export async function deleteKeepUploadTask(taskId: TKeepUploadTaskKey): Promise<void> {
  const tasks = ((await sendMessage("getExtStorage", STORAGE_KEY)) as TKeepUploadTaskStorageSchema) || {};
  delete tasks[taskId];
  await sendMessage("setExtStorage", { key: STORAGE_KEY, value: tasks });
}

onMessage("deleteKeepUploadTask", async ({ data: taskId }) => {
  await deleteKeepUploadTask(taskId);
});

/**
 * 清空所有辅种任务
 */
export async function clearKeepUploadTasks(): Promise<void> {
  await sendMessage("setExtStorage", { key: STORAGE_KEY, value: {} });
}

onMessage("clearKeepUploadTasks", clearKeepUploadTasks);

/**
 * 生成唯一ID
 */
export function generateKeepUploadTaskId(): TKeepUploadTaskKey {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
