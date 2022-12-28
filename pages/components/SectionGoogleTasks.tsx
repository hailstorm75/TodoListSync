import React, {useEffect, useState} from "react";
import {
  Alert,
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

const googleTasksApi = require('google-tasks-api')

const GoogleTasks = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isLoadingLists, setIsLoadingLists] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [failOpen, setFailOpen] = useState(false);
  const [taskLists, setTaskLists] = useState<any[]>([]);

  useEffect(() => {
    if (!authenticated)
      return;

    setIsLoadingLists(true);
    googleTasksApi
      .listTaskLists()
      .then((result: any) => {
        setTaskLists(result);
        setIsLoadingLists(false);
      });
  }, [authenticated])

  const handleSuccessClose = () => {
    setSuccessOpen(false);
  }
  const handleFailClose = () => {
    setFailOpen(false);
  }

  const connectToApiAsync = async () => {
    if (authenticated)
      return;
    // if (googleTasksApi.isSignedIn()) {
    //   if (!authenticated)
    //     setAuthenticated(true);
    //
    //   return;
    // }

    setIsAuthenticating(true);
    try {
      const isAuthorized = await googleTasksApi.authorize('18533555788-5fr6kdhaqh7j8dfogv2u1qqut4m1p94f.apps.googleusercontent.com');

      if (!isAuthorized) {
        setFailOpen(true);
        return;
      }

      setSuccessOpen(true);
      setAuthenticated(true);
    }
    catch
    {
      setFailOpen(true);
    }
    finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isAuthenticating}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar open={successOpen} autoHideDuration={3000} onClose={handleSuccessClose}>
        <Alert severity="success" sx={{ width: '100%' }} onClose={handleSuccessClose}>
          Logged in successfully
        </Alert>
      </Snackbar>
      <Snackbar open={failOpen} autoHideDuration={3000} onClose={handleFailClose}>
        <Alert severity="error" sx={{ width: '100%' }} onClose={handleFailClose}>
          Login failed
        </Alert>
      </Snackbar>

      <div>
        {!authenticated &&
          <Button onClick={connectToApiAsync} variant="outlined" startIcon={<GoogleIcon/>}>
              Login to Google
          </Button>
        }
        {authenticated && isLoadingLists &&
          <div>
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
          </div>
        }
        {authenticated && !isLoadingLists && taskLists.length == 0 &&
          <span>There are no task lists</span>
        }
        {authenticated && !isLoadingLists && taskLists.length > 0 &&
          <List>
          </List>
        }
      </div>
    </>
  );
};

export default GoogleTasks;