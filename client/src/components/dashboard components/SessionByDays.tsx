import React, { useEffect, useState } from "react";
import { Event } from '../../models/event'
import axios from 'axios'
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Legend } from 'recharts'
import { TextField } from "@material-ui/core";

const SessionByDays: React.FC<{}> = ({}) => {
    const [allSessions, setAllSessions] = useState<object[]>();
    const [offset, setOffset] = useState<number>(0);

    useEffect( () => {
        fetchSessions(offset);
    }, [offset])

    useEffect( () => {
      offset &&
      console.log(offset);
  }, [offset])

    const fetchSessions: (offset:number) => Promise<void> = async () => {
        const { data } = await axios({
          method: "get",
          url: `http://localhost:3001/events/by-days/${offset}`,
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
    <div>
      { allSessions ?
      <div>
        <TextField
          id="offset"
          label="start date"
          type="date"
          onChange={(e)=>{onEventChange(e.target.value)}}
          // className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <LineChart width={730} height={250} data={allSessions}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
      </LineChart>
        </div>
       : <h1>Loader</h1>
      }
    </div>
  );
};

export default SessionByDays;
