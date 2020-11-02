///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import {
  getAllEvents, getEventsByDateLimit, sortEventsByDate
} from "./database";
import { Event, weeklyRetentionObject } from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware } from "./helpers";
import {
  groupBy,
} from "lodash/fp";

import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
import { query } from "express-validator";
import { filter } from "bluebird";
import { group } from "console";
import { setHours } from "date-fns";
const router = express.Router();

// Routes

interface Filter {
  sorting: string;
  type: string;
  browser: string;
  search: string;
  offset: number;
}

// helpers
const createDateString: (timeStamp:number) => string = function(timeStamp) {
  const date = new Date(timeStamp);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

const createHourString: (timeStamp:number) =>  string = function(timeStamp) {
  const date = new Date(timeStamp);
  return `${date.getHours()}:00`;
}

router.get('/all', (req: Request, res: Response) => {
  const events:any[] = getAllEvents()
  res.send(events)
});

router.get('/all-filtered', (req: Request, res: Response) => {
  const filters: Filter = req.query;

  let filteredEvents:any[] = getAllEvents();
  let results:{events?:Event[], more?:boolean} = {};

  if(filters.search && filters.search !== "") {
    const regex: RegExp = new RegExp (filters.search, "i");
    filteredEvents = filteredEvents.filter((event) => {
      return Object.keys(event).reduce((none: boolean, key) => {
        return none || regex.test((event[key]).toString());
      }, false)
    })
  }
     
  if(filters.type && filters.type !== "all") {
    filteredEvents = filteredEvents.filter((event:Event) => event.name === filters.type)
  }

  if (filters.browser && filters.browser !== "all") {
    filteredEvents = filteredEvents.filter((event:Event) => event.browser === filters.browser)
  }

  if(filters.sorting) {
    filteredEvents = filters.sorting === "-date" ? 
    sortEventsByDate(filteredEvents,"DESC") : 
    sortEventsByDate(filteredEvents);
  }

  if(filters.offset) {
   const slicedEvents = filteredEvents.slice(0 , filters.offset);
   results.events = slicedEvents;
  results.more = slicedEvents.length < filteredEvents.length ? true : false
  } else {
    results.events = filteredEvents;
    results.more = false;
  }
  
  res.send(results)
});

router.get('/by-days/:offset', (req: Request, res: Response) => {
  const offset = req.params.offset
  const XdaysToCountBack:number = Number(offset);
  const now = new Date()
  const oneWeekAndXdaysAgo = new Date();
  const XdaysAgo = new Date();
  oneWeekAndXdaysAgo.setDate(now.getDate() - XdaysToCountBack - 6);
  oneWeekAndXdaysAgo.setHours(0,0,0);
  XdaysAgo.setDate(now.getDate() - XdaysToCountBack);
  XdaysAgo.setHours(24,0,0);

  const offsetEvents = getEventsByDateLimit(oneWeekAndXdaysAgo.getTime(), XdaysAgo.getTime());

  const groupedEvents:{date:string, events:Event[]}[] = [];

  for(const sessionId in offsetEvents) {
    (offsetEvents[sessionId].forEach((event:Event) => { 
      let i = groupedEvents.findIndex((object) => 
      (object.date) === createDateString(event.date))
      
      if(i!==-1) {
        groupedEvents[i].events.push(event);
      } else {
        groupedEvents.push({date:createDateString(event.date), events:[event]});
      }
    }))
  } 
  
  const results:{date:string, count:number}[] = groupedEvents.map((group:{date:string,events:Event[]}) => {
    
    return {date: group.date, count:group.events.length};
  })

  res.send(results)
});

router.get('/by-hours/:offset', (req: Request, res: Response) => {
  const offset = req.params.offset
  const XdaysToCountBack:number = Number(offset);
  const now = new Date();
  const XdaysAgoStart = new Date();
  const XdaysAgoEnd = new Date();
  XdaysAgoStart.setDate(now.getDate() - XdaysToCountBack);
  XdaysAgoStart.setHours(0,0,0,0)
  XdaysAgoEnd.setDate(now.getDate() - XdaysToCountBack + 1);
  XdaysAgoEnd.setHours(0,0,0,0);

  const offsetEvents = getEventsByDateLimit(XdaysAgoStart.getTime(), XdaysAgoEnd.getTime());
  console.log(XdaysAgoStart.getTime(), XdaysAgoEnd.getTime());


  const groupdEvents:{hour:string, events:Event[]}[] = [];
  for (let i = 0; i < 24; i++) {
    let groupedEvent = {hour: createHourString(new Date().setHours(i)), events: []};
    groupdEvents.push(groupedEvent);
  }


  for(const sessionId in offsetEvents) {

    (offsetEvents[sessionId].forEach((event:Event) => { 
      let i = groupdEvents.findIndex((object) => 
      (object.hour) === createHourString(event.date))
      
      if(i!==-1) {
        groupdEvents[i].events.push(event);
      } else {
        groupdEvents.push({hour:createHourString(event.date), events:[event]});
      }
    }))
  } 
  
  const results:{hour:string, count:number}[] = groupdEvents.map((group:{hour:string,events:Event[]}) => {
    return {hour: group.hour, count:group.events.length};
  })

  res.send(results)
});

router.get('/today', (req: Request, res: Response) => {
  res.send('/today')
});

router.get('/week', (req: Request, res: Response) => {
  res.send('/week')
});

router.get('/retention', (req: Request, res: Response) => {
  const {dayZero} = req.query
  res.send('/retention')
});

router.get('/:eventId',(req : Request, res : Response) => {
  res.send('/:eventId')
});

router.post('/', (req: Request, res: Response) => {
  res.send('/')
});

router.get('/chart/os/:time',(req: Request, res: Response) => {
  res.send('/chart/os/:time')
})

router.get('/chart/pageview/:time',(req: Request, res: Response) => {
  res.send('/chart/pageview/:time')
})

router.get('/chart/timeonurl/:time',(req: Request, res: Response) => {
  res.send('/chart/timeonurl/:time')
})

router.get('/chart/geolocation/:time',(req: Request, res: Response) => {
  res.send('/chart/geolocation/:time')
})


export default router;
