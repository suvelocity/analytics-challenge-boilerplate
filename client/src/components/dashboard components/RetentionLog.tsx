import React, { useEffect, useState, useRef, CSSProperties } from "react";
import { useForm, Controller } from "react-hook-form";
import { Event, weeklyRetentionObject } from '../../models/event'
import { ChartWrapper, TableEmptySquare, TableElement } from "components/styled components/cohort.styles";
import axios from 'axios'
import { 
    Accordion, 
    AccordionDetails, 
    AccordionSummary, 
    Typography,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Table,
    InputLabel,
    Input,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    IconButton,
} from "@material-ui/core";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxHeight: '100px',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    table: {
        minWidth: 650,
    },
  }),
);

const now = Date.now();
const monthAgo = now - 1000*60*60*24*31

const RetentionLog: React.FC<{}> = ({}) => {
    const classes = useStyles();
    const [allRetentions, setAllRetentions] = useState<weeklyRetentionObject[]>();
    const [dayZero, setdayZero] = useState<number>(monthAgo);

    useEffect( () => {
      fetchRetentions(dayZero);
    }, [dayZero])

    const fetchRetentions: (dayZero:number) => Promise<void> = async (query) => {
        const { data } = await axios({
          method: "get",
          url: `http://localhost:3001/events/retention?dayZero=${dayZero}`,
        });

        const retentions = data;
        console.log(data);
        setAllRetentions(retentions);
    };
      
  return (
    <ChartWrapper>
      { allRetentions ?
          <div>
            <TableElement>
              <tr>
                <th  style={{backgroundColor:"#7777", width: "200px"}}></th>
                  {allRetentions.map(retention => 
                  <th style={{backgroundColor:"#7777"}}>
                    week {retention.registrationWeek}
                  </th>)}
              </tr>
              <tr> 
                <th>All Users</th>
                {allRetentions.map(retention => <th>SUM</th>)}
              </tr>
              {allRetentions.map((retention, i) => (
              <tr>
                  <td>{`${retention.start} - ${retention.end}`}</td>
                  {retention.weeklyRetention.map((percentage, j) =>
                    <td style={{backgroundColor:`RGB(150,${percentage * 2.5},80`}}>
                      {`${percentage}`}
                    </td>
                  )}
              </tr>
              ))}
            </TableElement>
          </div>
      : <h1>Loader</h1>
      }
    </ChartWrapper>
  );
};

export default RetentionLog;
