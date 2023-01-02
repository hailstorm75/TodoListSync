export interface IGoogleTasks {
  kind: string,
  etag: string,
  items: IGoogleTaskItem[];
}

export interface IGoogleTaskItem {
  kind: string,
  id: string,
  etag: string,
  title: string,
  updated: string,
  selfLink: string,
  position: string,
  status: GoogleTaskStatus,
  links: IGoogleTaskLink[]
}

export type GoogleTaskStatus = 'needsAction' | 'completed'

export interface IGoogleTask {
  kind: string,
  id: string,
  etag: string,
  title: string,
  updated: string,
  selfLink: string,
  parent: string,
  position: string,
  notes: string,
  status: string,
  due: string,
  completed: string,
  deleted: boolean,
  hidden: boolean,
  links: IGoogleTaskLink[]
}

export interface IGoogleTaskLink {
  type: string,
  description: string,
  link: string
}