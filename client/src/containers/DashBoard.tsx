import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { makeStyles, Paper, Typography, Box } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import EventsMap from '../components/dashboard components/EventsMap'
import ErrorBoundary from '../containers/ErrorBoundaries'
import SessionByDays from "components/dashboard components/SessionByDays";


const useStyles = makeStyles((theme) => ({
  paper: {
    minHeight: "90vh",
    // minWidth: "70vw",
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}


const DashBoard: React.FC = () => {

  const classes = useStyles();

  return (
    <>
      <Paper className={classes.paper}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Analytics
      </Typography>
      <Box      
        display="flex"
        height={600}
        min-height={600}
        alignItems="center"
        justifyContent="center"
        border={1}
        borderColor={grey[200]}
      >
        <ErrorBoundary>
          <EventsMap/>
        </ErrorBoundary>
        <ErrorBoundary>
          <SessionByDays/>
        </ErrorBoundary>
      </Box>
      </Paper>
    </>
  );
};

export default DashBoard;
