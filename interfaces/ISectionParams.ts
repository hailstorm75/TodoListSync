import {AlertColor} from "@mui/material/Alert";
import {IGenericTaskGroup} from "./IGenericTaskModels";

export interface ISectionParams {
  addNotification: (message: string, severity: AlertColor) => void,
  setIsReady: (state: boolean) => void,
  setSelectedGroup: (group: IGenericTaskGroup) => void,
}