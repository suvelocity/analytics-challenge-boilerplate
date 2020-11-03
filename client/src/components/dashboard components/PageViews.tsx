import React, { useEffect, useState } from "react";
import { Event } from '../../models/event'
import { ChartWrapper, DatePickerWrapper } from "components/styled components/cohort.styles";
import axios from 'axios'
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Legend, Pie ,PieChart, Cell } from 'recharts'
import { TextField } from "@material-ui/core";

const month = 1000*60*60*24*31
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AAAAAA','#800080'];

const now = Date.now();
const monthAgo = now - 1000*60*60*24*31

const PageViews: React.FC<{}> = ({}) => {
    const [allUrlVisits, setAllUrlVisits] = useState<object[]>();
    const [timeStamp, settimeStamp] = useState<number>(monthAgo);

    useEffect( () => {
        fetchUrlViews(timeStamp);
    }, [timeStamp])

    const fetchUrlViews: (timeStamp:number) => Promise<void> = async () => {
        const { data } = await axios({
          method: "get",
          url: `http://localhost:3001/events/chart/pageview/${timeStamp}`,
        });
        const urlVisits = data;
        console.log(data);
        setAllUrlVisits(urlVisits);
      };

    const getDateDifferences = (dateTurltart:string):number => {

      if (new Date(dateTurltart).getTime() < Date.now()) {
        return  new Date(dateTurltart).getTime()
      } else return 0
    }

    const onEventChange = (dateTurltart:string) => {
      settimeStamp(getDateDifferences(dateTurltart));
    }

 
  return (
    <ChartWrapper>
      { allUrlVisits ?
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
                data={allUrlVisits}
                dataKey="count"
                nameKey="url"
                cx="50%"
                cy="50%"
                innerRadius={50}
                fill="#8884d8"
                label
            >
            {
            allUrlVisits.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
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

export default PageViews;
