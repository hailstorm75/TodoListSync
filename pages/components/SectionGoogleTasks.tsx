import React, {useEffect, useState} from "react";
import { useLoadGsiScript } from "../../hooks/GoogleAPILoader";
import {ILog} from "../../interfaces/ILog";
import {
  Alert,
  Button,
  List,
  Snackbar,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Autocomplete, TextField, CircularProgress
} from "@mui/material";
import {AlertColor} from "@mui/material/Alert";
import GoogleIcon from '@mui/icons-material/Google';
import {IInitTokenClientCallback, IInitTokenClientResult} from "../../interfaces/IGoogleAPI";
import {ITaskList, ITaskListResponse} from "../../interfaces/ITaskListResponse";
import {IGoogleTaskItem, IGoogleTasks} from "../../interfaces/ITask";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const CLIENT_ID = "18533555788-5fr6kdhaqh7j8dfogv2u1qqut4m1p94f.apps.googleusercontent.com";
const SCOPES = 'https://www.googleapis.com/auth/tasks \
                https://www.googleapis.com/auth/tasks.readonly';

const GoogleTasks = () => {
  const [logs, setLogs] = useState<ILog[]>([]);
  const { isOAuthClientLoaded, gsi } = useLoadGsiScript();
  const [client, setClient] = useState<IInitTokenClientResult | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [taskListOpen, setTaskListOpen] = useState(false);
  const [taskLists, setTaskLists] = useState<ITaskList[]>([]);
  const loadingTaskLists = taskListOpen && taskLists.length === 0;

  const [selectedList, setSelectedList] = useState<ITaskList | null>(null);
  const [tasks, setTasks] = useState<IGoogleTaskItem[] | null>(null);
  const [loadingTasks, setLoadingTasks] = useState(false);

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
    setLogs(logs.filter(log => log.id !== id))
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
    if (!accessToken)
      return;

    setLoadingTasks(true);
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          const response: IGoogleTasks = JSON.parse(this.responseText);
          setTasks(response.items);
        } else {
          addLog("Loading tasks failed", "error");
        }
        setLoadingTasks(false);
      }
    };
    xhr.open('GET', `api/googleListTasks?accessToken=${accessToken}&taskListId=${id}`);
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
    let active = true;

    if (!loadingTaskLists) {
      return undefined;
    }

    (async () => {
      if (active)
        getTaskLists();
    })();

    return () => {
      active = false;
    }
  }, [loadingTaskLists])

  useEffect(() => {
    if (!taskListOpen) {
      setTaskLists([]);
    }
  }, [taskListOpen])

  useEffect(() => {
    if (!selectedList) {
      setTasks(null);
      return;
    }

    getTasks(selectedList.id);
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
      {accessToken &&
          <Autocomplete
              sx={{ width: 300 }}
              open={taskListOpen}
              onOpen={() => {
                setTaskListOpen(true);
              }}
              onClose={() => {
                setTaskListOpen(false);
              }}
              isOptionEqualToValue={(option, value) => option.title === value.title}
              getOptionLabel={(option) => option.title}
              options={taskLists}
              loading={loadingTaskLists}
              value={selectedList}
              onChange={(event: any, newValue: ITaskList | null) => setSelectedList(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Task list"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loadingTaskLists ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
          />
      }
      {loadingTasks && <CircularProgress color="inherit" />}
      {selectedList && tasks
        ? tasks.length > 0
          ? <List>
            {
              tasks.map(task => {
                return (
                  <ListItem key={task.id}>
                    <ListItemIcon>
                      <Checkbox aria-label={`Google task ${task.id}`}
                                disabled
                                checked={task.status != "needsAction"}
                                icon={<RadioButtonUncheckedIcon/>}
                                checkedIcon={<TaskAltIcon/>}/>
                    </ListItemIcon>
                    <ListItemText primary={task.title}/>
                  </ListItem>
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