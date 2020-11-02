import { TextField } from "@material-ui/core";
import React, { createRef, useContext, useEffect, useRef, useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ThemeContext } from "styled-components";
import { httpClient } from "utils/asyncUtils";
import { nowString, todayMs, oneDayMs } from "../utils/timeUtils";

interface props {
  className: string;
}
const SessionsByHoursChart: React.FC<props> = ({ className }) => {
  const [data, setData] = useState();
  const [offset, setOffset] = useState(0);
  const dateFieldRef = createRef<HTMLInputElement>();
  const themeContext = useContext(ThemeContext);

  const fetchData = async () => {
    const { data } = await httpClient.get(`/events/by-hours/${offset}`);

    setData(data);
  };

  const handleDatePick = (event: any): void => {
    const pickInMs = new Date(event.target.value).getTime();
    const now = todayMs();
    if (now < pickInMs) {
      alert("Pick a time in the present");
      if (dateFieldRef.current) dateFieldRef.current.value = nowString();
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
        label="day"
        type="date"
        defaultValue={nowString()}
        onChange={handleDatePick}
        ref={dateFieldRef}
      />
      <ResponsiveContainer width={"100%"} height={"100%"} className={className}>
        <LineChart
          data={data}
          style={{ backgroundColor: themeContext.chart.background, fontSize: "12px" }}
        >
          <XAxis dataKey="hour" stroke={themeContext.chart.axis} />
          <YAxis stroke={themeContext.chart.axis} />
          <Line type="monotone" dataKey="count" stroke={themeContext.chart.text} />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </>
  ) : (
    <div>loading</div>
  );
};

export default SessionsByHoursChart;
