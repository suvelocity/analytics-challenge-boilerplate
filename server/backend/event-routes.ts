///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import {
  getAllEvents, sortEventsByDate
} from "./database";
import { Event, weeklyRetentionObject } from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware } from "./helpers";

import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
import { query } from "express-validator";
import { filter } from "bluebird";
const router = express.Router();

// Routes

interface Filter {
  sorting: string;
  type: string;
  browser: string;
  search: string;
  offset: number;
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
  res.send('/by-days/:offset')
});

router.get('/by-hours/:offset', (req: Request, res: Response) => {
  res.send('/by-hours/:offset')
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
