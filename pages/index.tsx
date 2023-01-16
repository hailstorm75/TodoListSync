import Head from 'next/head'
import React from "react";
import Header from "./components/Header";
import SectionGoogleTasks from "./components/SectionGoogleTasks";
import Footer from "./components/Footer";
import {Box, Card, CardContent, CardHeader } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Notifications from "./components/Notifications";
import {useNotifications} from "../hooks/NotificationsHook";
import Todoister from "./components/SectionTodoister";
import HeadEx from "./components/HeadEx";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Home() {
  const { notifications, removeNotification, addNotification } = useNotifications();

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
                <Grid2 md={6} sm={12}>
                  <Card variant="elevation">
                    <CardHeader title={
                      `Google Tasks`
                    }/>
                    <CardContent>
                      <SectionGoogleTasks addNotification={addNotification}/>
                    </CardContent>
                  </Card>
                </Grid2>
                <Grid2 md={6} sm={12}>
                  <Card>
                    <CardHeader title="Todoist"/>
                    <CardContent>
                      <Todoister addNotification={addNotification}/>
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
