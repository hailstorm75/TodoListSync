import React, {useEffect, useState} from "react";
import { useLoadGsiScript } from "../../hooks/GoogleAPILoader";
import {ILog} from "../../interfaces/ILog";
import {Alert, Button, Snackbar} from "@mui/material";
import {AlertColor} from "@mui/material/Alert";
import {useGoogleAuth} from "../../hooks/GoogleAuth";
import GoogleIcon from '@mui/icons-material/Google';

const GoogleTasks = () => {
  const [logs, setLogs] = useState<ILog[]>([]);
  const { isOAuthClientLoaded, gsi } = useLoadGsiScript();
  const { accessToken, client } = useGoogleAuth(gsi,
  "18533555788-5fr6kdhaqh7j8dfogv2u1qqut4m1p94f.apps.googleusercontent.com",
  ["https://www.googleapis.com/auth/tasks", "https://www.googleapis.com/auth/tasks.readonly"]);

  const addLog = (message: string, severity: AlertColor) => {
    const id = crypto.randomUUID();
    setLogs([
      ...logs,
      {
        id: id,
        message: message,
        severity: severity,
      }
    ])
  }

  const removeLog = (id: string) => {
    const index = logs.findIndex(log => log.id === id)
    if (index === -1) {
      console.error(`Unable to remove log element from stack with UUID: '${id}'`)
      return;
    }

    setLogs(logs.splice(index, 1))
  }

  useEffect(() => {
    if (gsi === undefined) {
      return;
    }

    if (!isOAuthClientLoaded)
    {
      addLog("Unable to load Google's API", "error");
      return;
    }
  }, [isOAuthClientLoaded, gsi])

  useEffect(() => {
    if (!accessToken)
      return;

  }, [accessToken])

  return (
    <>
      {logs.map(log => {
        return (
          <Snackbar key={log.id} open={true} autoHideDuration={3000} onClose={() => removeLog(log.id)}>
            <Alert onClose={() => removeLog(log.id)} severity={log.severity} sx={{ width: '100%' }}>
              {log.message}
            </Alert>
          </Snackbar>
        )})
      }

      {client && !accessToken &&
        <Button onClick={() => client.requestAccessToken()} startIcon={<GoogleIcon/>}>Log in</Button>
      }
    </>
  );
};

export default GoogleTasks;