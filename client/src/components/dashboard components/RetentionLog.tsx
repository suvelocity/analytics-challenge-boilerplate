import React, { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Event } from '../../models/event'
import { ChartWrapper } from "components/styled components/cohort.styles";
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
    const [allRetentions, setAllRetentions] = useState<{events:Event[], more:boolean}>();
    const [dayZero, setdayZero] = useState<number>(monthAgo);

    useEffect( () => {
      fetchRetentions(dayZero);
    }, [dayZero])

    const fetchRetentions: (dayZero:number) => Promise<void> = async (query) => {
        const { data } = await axios({
          method: "get",
          url: `http://localhost:3001/events/all-filtered?dayZero=${dayZero}`,
        });

        const retentions = data;
        setAllRetentions(retentions);
    };
      
  return (
    <ChartWrapper>
      { allRetentions ?
          <h1>Retentions Log</h1>
        : <h1>Loader</h1>
      }
    </ChartWrapper>
  );
};

export default RetentionLog;
