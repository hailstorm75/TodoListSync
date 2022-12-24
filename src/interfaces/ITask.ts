import ISubTask from "./ISubTask";

interface ITask {
  title: string;
  note: string;
  dueDate: Date;
  subTasks: ISubTask[];
}

export default ITask;