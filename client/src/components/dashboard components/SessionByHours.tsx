import React, { useEffect, useState } from "react";
import { ChartWrapper, DatePickerWrapper } from "components/styled components/cohort.styles";
import { Event } from '../../models/event'
import axios from 'axios'
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Legend } from 'recharts'
import { TextField } from "@material-ui/core";

const SessionByHours: React.FC<{}> = ({}) => {
  const [allSessions, setAllSessions] = useState<object[]>();
  const [offset, setOffset] = useState<number>(0);

    useEffect( () => {
        fetchSessions(offset);
    }, [offset])

    const fetchSessions: (offset:number) => Promise<void> = async () => {
        const { data } = await axios({
          method: "get",
          url: `http://localhost:3001/events/by-hours/${offset}`,
        });
        const sessions = data;
        setAllSessions(sessions);
      };

    const getDateDifferences = (dateToStart:string):number => {
      if (new Date(dateToStart).getTime() < Date.now()) {
        return  Number(((Date.now() - new Date(dateToStart).getTime()) / (1000*60*60*24)).toFixed())
      } else return 0
    }

    const onEventChange = (dateToStart:string) => {
      setOffset(getDateDifferences(dateToStart));
    }
      
  return (
    <ChartWrapper>
      { allSessions ?
      <div>
        <DatePickerWrapper className="form">
        <TextField
          id="offset"
          label="date"
          type="date"
          onChange={(e)=>{onEventChange(e.target.value)}}
          InputLabelProps={{
            shrink: true,
          }}
        />
        </DatePickerWrapper>
        <LineChart width={500} height={250} data={allSessions}
          margin={{ top: 10, right: 60, bottom: 5 }}
        >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis tick={{fontSize: 7}} dataKey="hour" />
        <YAxis tick={{fontSize: 7}}/>
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
      </LineChart>
        </div>
       : <h1>Loader</h1>
      }
    </ChartWrapper>
  );
};

export default SessionByHours;
