import React, {useEffect, useState, useRef} from "react";
import {
  Alert, AlertColor, Avatar,
  Backdrop,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  Skeleton,
  Slide,
  Snackbar
} from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import {useScript} from "../../hooks/useScript";
import jwt_decode from "jwt-decode";
import {IGoogleClient} from "../../interfaces/IGoogleClient";
import {IGoogleUser} from "../../interfaces/IGoogleUser";

interface ILog {
  id: number;
  severity: AlertColor;
  message: string;
}

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest';
const SCOPES = 'https://www.googleapis.com/auth/tasks.readonly';
const CLIENT_ID = "18533555788-5fr6kdhaqh7j8dfogv2u1qqut4m1p94f.apps.googleusercontent.com";

const GoogleTasks = () => {
  const googleButtonRef = React.createRef<HTMLInputElement>();

  const [tokenClient, setTokenClient] = useState<any>({});
  const [user, setUser] = useState<IGoogleUser | null>(null);
  const [isLoadingLists, setIsLoadingLists] = useState(false);
  const [taskLists, setTaskLists] = useState<any[]>([]);
  const [log, setLog] = useState<ILog[]>([]);

  const onGoogleSignIn = (user: IGoogleClient) => {
    try {
      const googleUser = jwt_decode<IGoogleUser>(user.credential);
      setUser(googleUser)
    }
    catch (e: any) {
      addLog("error", "Failed to log in: " + e.toString())
    }
  }

  const loadGoogleTasks = () => {
    const accessToken = tokenClient.requestAccessToken();
    console.log(accessToken);
  }

  useScript("https://accounts.google.com/gsi/client", () => {
    const windowProxy: any = window;
    windowProxy.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: onGoogleSignIn,
      auto_select: false
    });

    windowProxy.google.accounts.id.renderButton(googleButtonRef.current, {
      size: "medium"
    });

    setTokenClient(
      windowProxy.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse: any) => {
          console.log(tokenResponse);

          if (tokenResponse && tokenResponse.access_token) {
            fetch("https://googleapis.com/tasks/v1/users/@me/lists", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenResponse.access_token}`
              }
            }).then(result => console.log(result));
          }
        }
      })
    );
  });

  const addLog = (severity: AlertColor, message: string) => {
    setLog([
      ...log,
      {
        id: log.length,
        severity: severity,
        message: message
      }
    ])
  }

  const removeLog = (id: number) => {
    const filtered = log.filter(item => item.id !== id);
    setLog(filtered);
  }

  useEffect(() => {
    if (!user)
      return;

    setIsLoadingLists(true);

  }, [user])

  // const connectToApiAsync = async () => {
  //   if (authenticated)
  //     return;
  //   // if (googleTasksApi.isSignedIn()) {
  //   //   if (!authenticated)
  //   //     setAuthenticated(true);
  //   //
  //   //   return;
  //   // }
  //
  //   setIsAuthenticating(true);
  //   try {
  //     const isAuthorized = await googleTasksApi.authorize('18533555788-5fr6kdhaqh7j8dfogv2u1qqut4m1p94f.apps.googleusercontent.com');
  //
  //     if (!isAuthorized) {
  //       addLog("error", "Failed to authorize")
  //       return;
  //     }
  //
  //     addLog("success", "Logged in")
  //     setAuthenticated(true);
  //   }
  //   catch (e: any)
  //   {
  //     console.log(e)
  //     addLog("error", "Failed to authorize: " + e.toString())
  //   }
  //   finally {
  //     setIsAuthenticating(false);
  //   }
  // };

  return (
    <>
      {
        log.map(item =>
        (
          <Snackbar open={true} key={item.id} autoHideDuration={3000} onClose={() => removeLog(item.id)}>
            <Alert severity={item.severity} sx={{ width: '100%' }} onClose={() => removeLog(item.id)}>
              {item.message}
            </Alert>
          </Snackbar>
        ))
      }

      <div>
        <div>
          {!user && <Button onClick={loadGoogleTasks}>Google Tasks</Button>}
          {user && (
            <div>
              <Avatar src={user.picture} alt="Google profile"/>
              <p>{user.email}</p>

              <Button
                onClick={() => { setUser(null); }} variant="outlined">
                Logout
              </Button>
            </div>
          )}
        </div>
        {user && isLoadingLists &&
          <div>
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
          </div>
        }
        {user && !isLoadingLists && taskLists.length == 0 &&
          <span>There are no task lists</span>
        }
        {user && !isLoadingLists && taskLists.length > 0 &&
          <List>
          </List>
        }
      </div>
    </>
  );
};

export default GoogleTasks;