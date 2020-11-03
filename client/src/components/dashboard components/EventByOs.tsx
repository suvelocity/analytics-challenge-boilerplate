import React, { useEffect, useState } from "react";
import { Event } from '../../models/event'
import { ChartWrapper, DatePickerWrapper } from "components/styled components/cohort.styles";
import axios from 'axios'
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Legend, Pie ,PieChart, Cell } from 'recharts'
import { TextField } from "@material-ui/core";

const month = 1000*60*60*24*31
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AAAAAA','#800080'];


const EventsByOs: React.FC<{}> = ({}) => {
    const [allOsCounts, setAllOsCounts] = useState<object[]>();
    const [timeStamp, settimeStamp] = useState<number>(Date.now()-month);

    useEffect( () => {
        fetchSessions(timeStamp);
    }, [timeStamp])

    const fetchSessions: (timeStamp:number) => Promise<void> = async () => {
        const { data } = await axios({
          method: "get",
          url: `http://localhost:3001/events/chart/os/${timeStamp}`,
        });
        const counts = data;
        console.log("counts",counts);
        setAllOsCounts(counts);
      };

    const getDateDifferences = (dateToStart:string):number => {

      if (new Date(dateToStart).getTime() < Date.now()) {
        return  new Date(dateToStart).getTime()
      } else return 0
    }

    const onEventChange = (dateToStart:string) => {
      settimeStamp(getDateDifferences(dateToStart));
    }

 
  return (
    <ChartWrapper>
      { allOsCounts ?
      <div>
        <DatePickerWrapper className="form">
        <TextField
          id="timeStamp"
          label="start date"
          type="date"
          onChange={(e)=>{onEventChange(e.target.value)}}
          InputLabelProps={{
            shrink: true,
          }}
        />
        </DatePickerWrapper>
        <PieChart width={730} height={350}>
            <Pie 
                data={allOsCounts}
                dataKey="count"
                nameKey="os"
                cx="50%"
                cy="50%"
                innerRadius={50}
                fill="#8884d8"
                label
            >
            {
            allOsCounts.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                }    
            </Pie>
            <Tooltip/>
            <Legend/>
        </PieChart>
        </div>
       : <h1>Loader</h1>
      }
    </ChartWrapper>
  );
};

export default EventsByOs;
