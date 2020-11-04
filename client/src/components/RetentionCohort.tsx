import { TextField } from "@material-ui/core";
import { Event, weeklyRetentionObject } from "models";
import React, { useContext, useEffect, useState } from "react";
import styled, { ThemeContext } from "styled-components";
import { httpClient } from "utils/asyncUtils";
import { nowString, oneWeekMs, todayMs } from "utils/timeUtils";

interface StyledRegularCell {
  retention?: number;
}

// const RetentionChartWrapper = styled.div.attrs<StyledThemedComponent>(({ theme }) => ({
//   style: {
//     color: theme.chart.background,
//   },
// }))``;

// background-color: ${(props) => props.theme.chart.axis};
const RetentionChartWrapper = styled.div`
  color: ${(props) => props.theme.chart.text};
  overflow: scroll;
  max-height: 100%;
  width: 100%;
`;
const RetentionChartRow = styled.div`
  background-color: ${(props) => props.theme.chart.background};
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 25% repeat(auto-fill, 10%);
  column-gap: 3px;
  margin: 3px auto;
  padding: 5px 0 5px 10px;
  min-height: 60px;
  font-size: 1.1vw;

  @media screen and (max-width: 700px) {
    font-size: 1.1em;
  }
`;

const LeftColumnCell = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1.4vw;
  font-weight: bold;

  @media screen and (max-width: 700px) {
    font-size: 1.3em;
  }

  .users-number {
    font-style: italic;
    font-weight: initial;
    font-size: 12px;
  }
`;

const RegulatCell = styled.span.attrs<StyledRegularCell>(({ retention }) => ({
  style: {
    opacity: giveColor(retention!),
  },
}))<StyledRegularCell>`
  background: ${(props) => props.theme.chart.graph};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  width: 100%;
  height: 100%;
  transition: 0.3s ease-in-out;

  :hover {
    translate: (2px, 2px);
  }
`;

const FrameCell = styled(RegulatCell)`
  background-color: rgba(160, 160, 160, 0.5);
`;

// const Cell = styled.span`
// background-color: ${(props )=>props.count}
// `
const RetentionCohort: React.FC = () => {
  const [data, setData] = useState<weeklyRetentionObject[]>([]);
  const [dayZero, setDayZero] = useState<number>(todayMs() - 5 * oneWeekMs);
  const themeContext = useContext(ThemeContext);

  const fetchData = async (): Promise<void> => {
    const { data } = await httpClient.get(`/events/retention`, {
      params: { dayZero: dayZero },
    });
    setData(data);
  };

  const handleDatePick = (event: any): void => {
    const newDayZero = new Date(event.target.value).getTime();
    const now = todayMs();
    if (now < newDayZero) {
      alert("Pick a time in the present or past");
      return;
    }
    setDayZero(newDayZero);
  };

  useEffect(() => {
    fetchData();
  }, [dayZero]);

  console.log(data);
  return (
    <RetentionChartWrapper>
      <RetentionChartRow theme={themeContext} style={{ padding: 0 }}>
        <LeftColumnCell style={{ backgroundColor: "rgba(160,160,160,0.5)" }}>
          <TextField
            label="start-day"
            type="date"
            onChange={handleDatePick}
            value={dayZero ? new Date(dayZero).toISOString().slice(0, 10) : nowString()}
          />
        </LeftColumnCell>
        {data.map((week: weeklyRetentionObject, i) => (
          <FrameCell>Week {week.registrationWeek - 1}</FrameCell>
        ))}
      </RetentionChartRow>
      <RetentionChartRow theme={themeContext}>
        <LeftColumnCell>
          <span>All Users</span>
          <span className="users-number">
            {data.reduce((sum: number, cur: weeklyRetentionObject) => sum + cur.newUsers, 0)} users
          </span>
        </LeftColumnCell>
        {/* {data.map()} */}
      </RetentionChartRow>
      {data.map((week: weeklyRetentionObject) => (
        <RetentionChartRow theme={themeContext}>
          <LeftColumnCell>
            <span>{`${week.start} - ${week.end} `}</span>
            <span className="users-number">{`${week.newUsers} users`}</span>
          </LeftColumnCell>
          {week.weeklyRetention.map((retention: number, i) =>
            i === 0 ? (
              <FrameCell>{`${retention}%`}</FrameCell>
            ) : (
              <RegulatCell retention={retention}>{`${retention}%`}</RegulatCell>
            )
          )}
        </RetentionChartRow>
      ))}
    </RetentionChartWrapper>
  );
};

export default RetentionCohort;

//helpers
const giveColor = (precentage: number): number => {
  return 0.6 + Math.floor(precentage / 20) * 0.15;
};
