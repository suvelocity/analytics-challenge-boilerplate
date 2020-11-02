///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import {
  getAllEvents, getAllEventsButOneByDateLimit, getEventsByDateLimitGroupedBySessions, getSpecificEventsByDateLimit, sortEventsByDate
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
  return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
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

  const offsetEvents = getEventsByDateLimitGroupedBySessions(oneWeekAndXdaysAgo.getTime(), XdaysAgo.getTime());

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

  const offsetEvents = getEventsByDateLimitGroupedBySessions(XdaysAgoStart.getTime(), XdaysAgoEnd.getTime());
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
  const dayZero:number = Number(req.query.dayZero)
  // console.log("dayzero:", dayZero)
  const now = new Date();
  console.log("now", now, now.getTime());
  const dayZeroDate = new Date(dayZero);
  // console.log("dayZeroDate", dayZeroDate, dayZeroDate.getTime());
  dayZeroDate.setHours(0,0,0,0);
  console.log("dayZeroDate2", dayZeroDate, dayZeroDate.getTime());
  const weekAfterDayZero = new Date(dayZero);
  // console.log("weekAfterDayZero", weekAfterDayZero, weekAfterDayZero.getTime());
  weekAfterDayZero.setDate(weekAfterDayZero.getDate() + 6);
  // console.log("weekAfterDayZero2", weekAfterDayZero, weekAfterDayZero.getTime());
  weekAfterDayZero.setHours(0,0,0,0);
  console.log("weekAfterDayZero3", weekAfterDayZero.toString(), weekAfterDayZero.getTime());


  const results: weeklyRetentionObject[] = [];

  const millesecondsInAWeek = 1000*60*60*24*7;
  const totalWeeksToCountFrom = Math.ceil((now.getTime() - weekAfterDayZero.getTime()) / millesecondsInAWeek)
  
  while (dayZeroDate.getTime() < now.getTime()) {
    console.log("in loop 1")
    console.log("Day Zero", dayZeroDate);
    console.log("week after", weekAfterDayZero)
    let weeksPassedFromRegistration:number = Math.ceil((now.getTime() - weekAfterDayZero.getTime()) / millesecondsInAWeek);
    let signUpEventsThisWeek = getSpecificEventsByDateLimit(dayZeroDate.getTime(), weekAfterDayZero.getTime(), "name", "signup") 
    let newUsersIds:string[] = [];
    signUpEventsThisWeek.forEach((event:Event) => newUsersIds.push(event.distinct_user_id));

    let newDayZero = new Date(weekAfterDayZero);
    let newWeekAfterDayZero = new Date(weekAfterDayZero);
    console.log("new Day Zero", newDayZero);
    console.log("new week after", newWeekAfterDayZero)
    newWeekAfterDayZero.setDate(weekAfterDayZero.getDate() + 7);
    console.log("new week after 2", newWeekAfterDayZero)

    const weeklyRetentionArray:number[] = [];

    while(newDayZero.getTime() < now.getTime()) {
      console.log("in loop 2")
      console.log("new Day Zero in loop2", newDayZero);
      console.log("new week after in loop2", newWeekAfterDayZero)
      let allEventsButSignup = getAllEventsButOneByDateLimit(newDayZero.getTime(), newWeekAfterDayZero.getTime(), "name", "sigunp");
      let userIdsWhoCameBack:string[] = [];
      
      allEventsButSignup.forEach((event:Event) => {
        if(!userIdsWhoCameBack.includes(event.distinct_user_id))
        userIdsWhoCameBack.push(event.distinct_user_id)
      })

      let cameBackPercentages = Number((newUsersIds.length*100/userIdsWhoCameBack.length).toFixed(0))
      weeklyRetentionArray.push(cameBackPercentages);

      newDayZero.setDate(newDayZero.getDate() + 7)
      newWeekAfterDayZero.setDate(newWeekAfterDayZero.getDate() + 6)
    }

    results.push({
      registrationWeek: totalWeeksToCountFrom - weeksPassedFromRegistration + 1,
      newUsers: signUpEventsThisWeek.length,
      weeklyRetention: [100, ...weeklyRetentionArray],
      start:createDateString(dayZeroDate.getTime()),
      end:createDateString(weekAfterDayZero.getTime())
    });

    dayZeroDate.setDate(dayZeroDate.getDate()+7);
    weekAfterDayZero.setDate(weekAfterDayZero.getDate()+7);
  }

  res.send(results)
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
