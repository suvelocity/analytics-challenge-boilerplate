import React, { useState } from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { ChartsLayout } from "../components/ChartsLayout";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { useDarkMode } from "utils/useDarkMode";
import { darkTheme, lightTheme } from "utils/themes";
import SessionsByDaysChart from "components/SessionsByDaysChart";
import SessionsByHoursChart from "components/SessionsByHoursChart";
import GenericPieChart from "components/PieChart";
import RetentionCohort from "components/RetentionCohort";
import AllEventsLog from "components/AllEventsLog";
import LocationChart from "components/LocationsChart";
export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const GlobalStyle = createGlobalStyle`
body {
  font-family: Arial, Helvetica, sans-serif;
}
`;

const DashBoard: React.FC = () => {
  const [theme, changeTheme, themeLoaded] = useDarkMode();

  const toggleTheme = (): void => changeTheme();

  const currentStyle = theme === "light" ? lightTheme : darkTheme;

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={currentStyle}>
        <ChartsLayout>
          <button onClick={toggleTheme}>Dark mode</button>
          <div id="chart1">
            <SessionsByHoursChart />
          </div>
          <div id="chart2">
            <SessionsByDaysChart />
            {/* <SessionsByHoursChart className="chart2" /> */}
          </div>
          <div className="pie-charts">
            <GenericPieChart filter="os" />
          </div>
          <div className="pie-charts">
            <GenericPieChart filter="pageView" />
          </div>
          <div id="retention">
            <RetentionCohort />
          </div>
          <div id="all-events">
            <AllEventsLog />
          </div>
          <div id="locations">
            <LocationChart />
          </div>
          {/* <div className="chart1">a</div>
          <div className="chart2">a</div>
          <div className="chart3">a</div>
          <div className="chart4">a</div>
          <div className="chart5">a</div> */}
        </ChartsLayout>
      </ThemeProvider>
    </>
  );
};

export default DashBoard;
