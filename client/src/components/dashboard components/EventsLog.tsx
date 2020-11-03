import React, { useEffect, useState } from "react";
import { Event } from '../../models/event'
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
    Table 
} from "@material-ui/core";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Filter } from "../../../../server/backend/event-routes";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
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


const EventsLog: React.FC<{}> = ({}) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const [allEvents, setAllEvents] = useState<{events:Event[], more:boolean}>();
    const [query, setQuery] = useState<Filter>();

    useEffect( () => {
        fetchSessions(query);
    }, [query])

    const fetchSessions: (query:Filter | undefined) => Promise<void> = async (query) => {
        const { data } = await axios({
          method: "get",
          url: `http://localhost:3001/events/all-filtered?offset=10`,
        });
        const events = data;
        setAllEvents(events);
      };

    const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
    };
      
  return (
    <div>
      { allEvents ?
      <div className={classes.root}>
        { allEvents.events.map((event:Event,i) => (
            <Accordion expanded={expanded === `panel${i+1}`} onChange={handleChange(`panel${i+1}`)}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${i+1}bh-content`}
            id={`panel${i+1}bh-header`}
            >
            <Typography className={classes.heading}>{event.name}</Typography>
            <Typography className={classes.secondaryHeading}>By User-Id {event.distinct_user_id}</Typography>
            </AccordionSummary>
            <AccordionDetails>
            {/* <Typography> */}
                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>os</TableCell>
                            <TableCell>browser</TableCell>
                            <TableCell>url</TableCell>
                            <TableCell>session id</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                            <TableCell component="th" scope="row">
                                {new Date(event.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell align="right">{event.os}</TableCell>
                            <TableCell align="right">{event.browser}</TableCell>
                            <TableCell align="right">{event.url}</TableCell>
                            <TableCell align="right">{event.session_id}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            {/* </Typography> */}
            </AccordionDetails>
        </Accordion>
        ))}
        </div>
        : <h1>Loader</h1>
      }
    </div>
  );
};

export default EventsLog;
