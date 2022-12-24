import ITask from "./ITask";

interface IComponentParams
{
  setIsLoggedIn: (loggedIn: boolean) => void;
  setIsListSelected: (listSelected: boolean) => void;
  setTasks: (tasks: ITask[]) => void;
}

export default IComponentParams;

