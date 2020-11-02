///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import {
  getAllEvents,
  createNewEvents,
  getEventsUniqBySessionID
} from "./database";
// import { Event, weeklyRetentionObject } from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware, groupBy, formatDate, createArrayWeekAgo, diffrenceInDays, createArrayByHours } from "./helpers";

import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
const router = express.Router();

// Routes

type eventName = "login" | "signup" | "admin" | "/";
type os = "windows" | "mac" | "linux" | "ios" | "android" | "other";
type browser = "chrome" | "safari" | "edge" | "firefox" | "ie" | "other";
type GeoLocation = {
  location: Location;
  accuracy: number;
};
type Location = {
  lat: number;
  lng: number;
};


export interface event {
  _id: string;
  session_id: string;
  name: eventName;
  url: string;
  distinct_user_id: string;
  date: number; // Date.prototype.getTime()
  os: os;
  browser: browser;
  geolocation: GeoLocation;
}



interface Filter {
  sorting: string;
  type: string;
  browser: string;
  search: string;
  offset: number;
}

router.get('/all', (req: Request, res: Response) => {
  const data: event[]= getAllEvents();
  res.send(data);
    
});

router.get('/all-filtered',  (req: Request, res: Response) => {
  const filters: Filter = req.query;
  const events: any[]= getAllEvents();
  let eventsAfterFillering: event[]=[...events];
  if(filters.sorting==="+date"){
    eventsAfterFillering.sort((a, b) => a.date - b.date);
  } else{
    eventsAfterFillering.sort((a, b) => b.date - a.date);
  }
  if(filters.type){
      eventsAfterFillering=eventsAfterFillering.filter((event: event) => event.name === filters.type);
  }
  if(filters.browser){
      eventsAfterFillering=eventsAfterFillering.filter((event: event) => event.browser === filters.browser);
  }
  if(filters.search){
      const regex: RegExp = new RegExp(filters.search, "i");
      eventsAfterFillering=eventsAfterFillering.filter((event: any) => {
          for (const key in event) {
              if(typeof event[key]==="string"){
                if(event[key].match(regex)){
                  return true;
                }
              }else if(typeof event[key]==="number"){
                if(event[key].toString().match(regex)){
                  return true;
                }
              }
          }
          return false;
      });
  }
  if(filters.offset){
      eventsAfterFillering = eventsAfterFillering.slice(0, filters.offset);
  }
  res.json({events: eventsAfterFillering, more: !(events.length===eventsAfterFillering.length)});
});


router.get('/by-days/:offset', (req: Request, res: Response) => {
  const events: event[]= getAllEvents();
  const eventsGroupBySession: event[]= getEventsUniqBySessionID(events);
  const { arrayOfDates, firstDay}=createArrayWeekAgo(parseInt(req.params.offset));
  eventsGroupBySession.forEach(arrayByGroup => {
      const dateOfElement=new Date(arrayByGroup.date)
      const diffrenceDays: number=diffrenceInDays(firstDay,dateOfElement)
      if(diffrenceDays>=0 &&diffrenceDays<7){
          arrayOfDates[diffrenceDays].count++;
      }
  });
  res.send(arrayOfDates);
});




router.get('/by-hours/:offset', (req: Request, res: Response) => {
  const events: event[]= getAllEvents();
  let arrayByHours=createArrayByHours();
  const offset=parseInt(req.params.offset);
  const currentDate=new Date();
  const choosenDay=new Date(currentDate.setDate(currentDate.getDate()-offset));
  const choosenDayString=choosenDay.toISOString().substring(0,10);
  const eventFilteredByDate: event[]=events.filter((element)=>{
      return (new Date(element.date)).toISOString().substring(0,10)===choosenDayString
  })
  const eventsGroupBySession: event[]= getEventsUniqBySessionID(eventFilteredByDate);
  eventsGroupBySession.forEach(arrayByGroup => {
      const hourOfElement=new Date(arrayByGroup.date).getHours();     
      arrayByHours[hourOfElement].count++;
  });
  res.send(arrayByHours)
});




// router.get('/today', (req: Request, res: Response) => {
//   res.send('/today')
// });

// router.get('/week', (req: Request, res: Response) => {
//   res.send('/week')
// });


interface weeklyRetentionObject {
  registrationWeek:number;  //launch is week 0 and so on
  newUsers:number;  // how many new user have joined this week
  weeklyRetention:number[]; // for every week since, what percentage of the users came back. weeklyRetention[0] is always 100% because it's the week of registration  
  start:string;  //date string for the first day of the week
  end:string  //date string for the first day of the week
}
let week0Retention : weeklyRetentionObject = {
  registrationWeek: 1, 
  newUsers: 34, 
  weeklyRetention:[100,24,45,66,1,80],  // here we see there were 7 in total since week 1 has data for 6 weeks 
  start:'01/11/2020',
  end: '07/11/2020'
} 

// function getRetentionCohort(dayZero:number) : weeklyRetentionObject[] {

// }


router.get('/retention', (req: Request, res: Response) => {
  const {dayZero} = req.query
  const firstDay=new Date(dayZero)
  const firstDayForLast=new Date(dayZero)
  const lastDay=new Date(firstDayForLast.setDate(firstDayForLast.getDate()+7))
  res.send('/retention')
});
// router.get('/:eventId',(req : Request, res : Response) => {
//   res.send('/:eventId')
// });
// interface event {
//   _id: string;
//  session_id: string;
//  name: eventName;
//  url: string;
//  distinct_user_id: string;
//  date: number; // Date.prototype.getTime()
//  os: os;
//  browser: browser;
//  geolocation: GeoLocation;
//  }
 
router.post('/', (req: Request, res: Response) => {
  const newEvent:event=req.body;
  createNewEvents(newEvent);
  res.send("SUCCESS")
});

// router.get('/chart/os/:time',(req: Request, res: Response) => {
//   res.send('/chart/os/:time')
// })

  
// router.get('/chart/pageview/:time',(req: Request, res: Response) => {
//   res.send('/chart/pageview/:time')
// })

// router.get('/chart/timeonurl/:time',(req: Request, res: Response) => {
//   res.send('/chart/timeonurl/:time')
// })

// router.get('/chart/geolocation/:time',(req: Request, res: Response) => {
//   res.send('/chart/geolocation/:time')
// })


export default router;
