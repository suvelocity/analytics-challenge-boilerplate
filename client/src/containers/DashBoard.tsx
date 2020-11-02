import React, { useState } from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { ChartsLayout } from "../components/ChartsLayout";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { useDarkMode } from "utils/useDarkMode";
import { darkTheme, lightTheme } from "utils/themes";
import SessionsByDaysChart from "components/SessionsByDaysChart";
import SessionsByHoursChart from "components/SessionsByHoursChart";
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
      <button onClick={toggleTheme}></button>
      <ThemeProvider theme={currentStyle}>
        <ChartsLayout>
          <div id="chart1">
            <SessionsByHoursChart className="chart1" />
          </div>
          <div id="chart2">
            <SessionsByDaysChart />
            {/* <SessionsByHoursChart className="chart2" /> */}
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
