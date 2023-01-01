import React, {useEffect, useState} from "react";
import { useLoadGsiScript } from "../../hooks/GoogleAPILoader";
import {ILog} from "../../interfaces/ILog";
import {Alert, Button, List, Snackbar, ListItemButton, ListItem} from "@mui/material";
import {AlertColor} from "@mui/material/Alert";
import GoogleIcon from '@mui/icons-material/Google';
import {IInitTokenClientCallback, IInitTokenClientResult} from "../../interfaces/IGoogleAPI";
import {ITaskList, ITaskListResponse} from "../../interfaces/ITaskListResponse";
import {IGoogleTask} from "../../interfaces/ITask";

const CLIENT_ID = "18533555788-5fr6kdhaqh7j8dfogv2u1qqut4m1p94f.apps.googleusercontent.com";
const SCOPES = 'https://www.googleapis.com/auth/tasks \
                https://www.googleapis.com/auth/tasks.readonly';

const GoogleTasks = () => {
  const [logs, setLogs] = useState<ILog[]>([]);
  const { isOAuthClientLoaded, gsi } = useLoadGsiScript();
  const [client, setClient] = useState<IInitTokenClientResult | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [taskLists, setTaskLists] = useState<ITaskList[] | null>(null);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [tasks, setTasks] = useState<IGoogleTask[] | null>(null);

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

  const getTaskLists = () => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const response: ITaskListResponse = JSON.parse(this.responseText);
        setTaskLists(response.items);
      }
    };
    xhr.open('GET', 'https://www.googleapis.com/tasks/v1/users/@me/lists');
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.send();
  }

  const getTasks = (id: string) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const response = JSON.parse(this.responseText);
        console.log(response)
      }
    };
    xhr.open('GET', `https://tasks.googleapis.com/tasks/v1/users/@me/lists/${id}/tasks`);
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.setRequestHeader('Content-Type', "application/json");
    xhr.send();
  }

  useEffect(() => {
    if (gsi === undefined) {
      return;
    }

    if (gsi === null)
    {
      addLog("Unable to load Google's API", "error");
      return;
    }

    if (client !== null)
      return;

    const result = gsi.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (tokenResponse: IInitTokenClientCallback) => {
        setAccessToken(tokenResponse.access_token);
        addLog("Logged in", "success");
      }
    });

    console.log(result);
    setClient(result);
  }, [isOAuthClientLoaded, gsi, client])

  useEffect(() => {
    if (!selectedList) {
      setTasks(null);
      return;
    }

    getTasks(selectedList);
  }, [selectedList])

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
      {client && accessToken && !taskLists &&
        <Button onClick={() => getTaskLists()}>Load task lists</Button>
      }
      {taskLists && !selectedList
        ? taskLists.length > 0
          ? <List>
              {taskLists.map((list: any) => {
                  return (
                    <ListItemButton key={list.id} onClick={() => setSelectedList(list.id)}>{list.title}</ListItemButton>
                  )
                })
              }
            </List>
          : <Alert severity="warning">Your account has no Google Task lists</Alert>
        : <span></span>
      }
      {selectedList && tasks
        ? tasks.length > 0
          ? <List>
              {
                tasks.map(task => {
                  return (
                    <ListItem key={task.id}></ListItem>
                  )
                })
              }
            </List>
          : <span>No tasks</span>
        : <span></span>
      }
    </>
  );
};

export default GoogleTasks;