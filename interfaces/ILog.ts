import { AlertColor } from "@mui/material/Alert";

export interface ILog {
  id: string;
  message: string;
  severity: AlertColor;
}