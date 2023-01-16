import React, {useState} from "react";
import Header from "./components/Header";
import SectionGoogleTasks from "./components/SectionGoogleTasks";
import Footer from "./components/Footer";
import {Box, Card, CardContent, CardHeader, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Notifications from "./components/Notifications";
import {useNotifications} from "../hooks/NotificationsHook";
import Todoister from "./components/SectionTodoister";
import HeadEx from "./components/HeadEx";
import SwipeLeftAltIcon from '@mui/icons-material/SwipeLeftAlt';
import SwipeRightAltIcon from '@mui/icons-material/SwipeRightAlt';
import SwipeDownAltIcon from '@mui/icons-material/SwipeDownAlt';
import SwipeUpAltIcon from '@mui/icons-material/SwipeUpAlt';
import {IGenericTaskGroup} from "../interfaces/IGenericTaskModels";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Home() {
  const { notifications, removeNotification, addNotification } = useNotifications();
  const [googleReady, setGoogleReady] = useState(false);
  const [todoistReady, setTodoistReady] = useState(false);
  const canSync = googleReady && todoistReady;

  const [googleTasks, setGoogleTasks] = useState<IGenericTaskGroup | null>(null);
  const [todoistTasks, setTodoistTasks] = useState<IGenericTaskGroup | null>(null);

  return (
    <>
      <HeadEx/>
      <main>
        <Header/>
        <ThemeProvider theme={darkTheme}>
          <>
            <Notifications notifications={notifications} removeNotification={removeNotification} />
            <Box sx={{ width: '100%', padding: '20px' }}>
              <Grid2 container spacing={2}>
                <Grid2 md={5.5} sm={12}>
                  <Card variant="elevation">
                    <CardHeader title={
                      `Google Tasks`
                    }/>
                    <CardContent>
                      <SectionGoogleTasks addNotification={addNotification} setIsReady={setGoogleReady} setSelectedGroup={setGoogleTasks} />
                    </CardContent>
                  </Card>
                </Grid2>
                <Grid2 md={1} sm={12}>
                  <Box sx={{ flexGrow: 1, display: { sm: 'flex', md: 'none' } }} alignItems="center">
                    <Typography variant="caption" textAlign="center">
                      Sync Direction
                    </Typography>

                    <Box width="100%" display="flex" justifyContent="center">
                      <Tooltip title="Sync Todoist to Google Tasks">
                        <IconButton aria-label="Sync Todoist to Google Tasks" disabled={!canSync}>
                          <SwipeUpAltIcon/>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Sync Google Tasks to Todoist">
                        <IconButton aria-label="Sync Google Tasks to Todoist" disabled={!canSync}>
                          <SwipeDownAltIcon/>
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Stack sx={{ flexGrow: 1, display: { sm: 'none', md: 'flex' } }} justifyContent="center" alignItems="center">
                    <Typography variant="caption" textAlign="center" alignContent="center">
                      Sync
                      Direction
                    </Typography>

                    <Tooltip title="Sync Todoist to Google Tasks">
                      <IconButton aria-label="Sync Todoist to Google Tasks" disabled={!canSync}>
                        <SwipeLeftAltIcon/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sync Google Tasks to Todoist">
                      <IconButton aria-label="Sync Google Tasks to Todoist" disabled={!canSync}>
                        <SwipeRightAltIcon/>
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Grid2>
                <Grid2 md={5.5} sm={12}>
                  <Card>
                    <CardHeader title="Todoist"/>
                    <CardContent>
                      <Todoister addNotification={addNotification} setIsReady={setTodoistReady} setSelectedGroup={setTodoistTasks} />
                    </CardContent>
                  </Card>
                </Grid2>
              </Grid2>
            </Box>
          </>

        </ThemeProvider>
        <Footer/>
      </main>
    </>
  )
}
