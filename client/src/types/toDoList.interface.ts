import { ITask } from './task.interface';

export interface IToDoList {
  id: string;
  name: string;
  description: string;
}

export interface IToDoListDetails extends IToDoList {
  tasks: ITask[];
}
