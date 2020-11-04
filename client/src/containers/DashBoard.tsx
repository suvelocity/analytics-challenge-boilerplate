import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { makeStyles, Paper, Typography, Box } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import EventsMap from '../components/dashboard components/EventsMap'
import ErrorBoundary from '../containers/ErrorBoundaries'
import SessionByDays from "components/dashboard components/SessionByDays";
import SessionByHours from "components/dashboard components/SessionByHours";
import EventsLog from "components/dashboard components/EventsLog";
import RetentionLog from "components/dashboard components/RetentionLog";
import { AdminCard, ChartWrapper } from "components/styled components/cohort.styles";
import EventsByOs from "components/dashboard components/EventByOs";
import PageViews from "components/dashboard components/PageViews";



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
      <AdminCard>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Analytics
      </Typography>
          {/* <ErrorBoundary>
            <EventsMap/>
          </ErrorBoundary>
          <ErrorBoundary>
            <SessionByDays/>
          </ErrorBoundary>
          <ErrorBoundary>
            <SessionByHours/>
          </ErrorBoundary>
          <ErrorBoundary>
            <EventsLog/>
          </ErrorBoundary> */}
          <ErrorBoundary>
            <RetentionLog/>
          </ErrorBoundary>
          {/* <ErrorBoundary>
            <EventsByOs/>
          </ErrorBoundary>
          <ErrorBoundary>
            <PageViews/>
          </ErrorBoundary> */}
      </AdminCard>
    </>
  );
};

export default DashBoard;
