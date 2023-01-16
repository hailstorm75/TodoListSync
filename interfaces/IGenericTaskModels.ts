export interface IGenericTaskGroup {
  name: string,
  tasks: IGenericTask[]
}

export interface IGenericTask {
  content: string,
  complete: boolean,
  subTasks: IGenericTask[]
}