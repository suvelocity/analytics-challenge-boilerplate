import { TextField } from "@material-ui/core";
import React, { createRef, useContext, useEffect, useRef, useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ThemeContext } from "styled-components";
import { httpClient } from "utils/asyncUtils";
import { nowString, todayMs, oneDayMs } from "../utils/timeUtils";

const SessionsByDaysChart: React.FC = () => {
  const [data, setData] = useState();
  const [offset, setOffset] = useState(0);
  const themeContext = useContext(ThemeContext);

  const fetchData = async () => {
    const { data } = await httpClient.get(`/events/by-days/${offset}`);
    setData(data);
  };

  const handleDatePick = (event: any): void => {
    const pickInMs = new Date(event.target.value).getTime();
    const now = todayMs();
    if (now < pickInMs) {
      alert("Pick a time in the present");
      return;
    }
    const newOffset: number = Math.floor((now - pickInMs) / oneDayMs);

    setOffset(newOffset);
  };
  useEffect(() => {
    fetchData();
  }, [offset]);

  return data ? (
    <>
      <TextField
        label="Pick Day"
        type="date"
        onChange={handleDatePick}
        value={
          offset ? new Date(todayMs() - oneDayMs * offset).toISOString().slice(0, 10) : nowString()
        }
        style={{ backgroundColor: themeContext.chart.background, borderRadius: "10px" }}
      />
      <ResponsiveContainer width={"100%"} height={"100%"}>
        <LineChart
          data={data}
          style={{
            backgroundColor: themeContext.chart.background,
            fontSize: "1em",
          }}
        >
          <XAxis dataKey="date" stroke={themeContext.chart.axis} />
          <YAxis stroke={themeContext.chart.axis} />
          <Line type="monotone" dataKey="count" stroke={themeContext.chart.graph} />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </>
  ) : (
    <div>loading</div>
  );
};

export default SessionsByDaysChart;
