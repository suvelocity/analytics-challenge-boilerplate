import { weeklyRetentionObject } from "models";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { httpClient } from "utils/asyncUtils";
import { oneWeekMs, todayMs } from "utils/timeUtils";
import { number } from "yup";

const RetentionChartWrapper = styled.div`
  background-color: white;
`;
const RetentionChartRow = styled.div`
  display: grid;
  grid-template-columns: minmax(90px, 3fr) repeat(6, minmax(30px, 1fr));
`;

const LeftColumnCell = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1.5em;

  .users-number {
    color: red;
    font-size: initial;
  }
`;

// const Cell = styled.span`
// background-color: ${(props )=>props.count}
// `
const RetentionCohort: React.FC = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const { data } = await httpClient.get(`/events/retention`, {
      params: { dayZero: todayMs() - 5 * oneWeekMs },
    });
    setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(data);
  return (
    <RetentionChartWrapper>
      {data.map((week: weeklyRetentionObject) => (
        <RetentionChartRow>
          <LeftColumnCell>
            <span>{`${week.start} - ${week.end} `}</span>
            <span className="users-number">{`${week.newUsers} users`}</span>
          </LeftColumnCell>
          {week.weeklyRetention.map((retention: number) => (
            <span style={{ backgroundColor: giveColor(retention) }}>{`${retention}%`}</span>
          ))}
        </RetentionChartRow>
      ))}
    </RetentionChartWrapper>
  );
};

export default RetentionCohort;

//helpers
const giveColor = (precentage: number): string =>
  `rgba(30,40,210,${0.1 + Math.floor(precentage / 30) * 0.2})`;
