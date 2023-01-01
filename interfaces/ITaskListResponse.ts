export interface ITaskListResponse {
  kind: string,
  etag: string,
  items: ITaskList[]
}

export interface ITaskList {
  kind: string,
  id: string,
  etag: string,
  title: string,
  updated: string,
  selfLink: string
}