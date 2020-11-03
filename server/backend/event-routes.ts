///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import {
  getAllEvents,
  getAllEventsFiltered,
  getRetentionFromDayZero,
  getSessionsByDayInWeek,
  getSessionsByHoursInDay,
  saveNewEvent,
} from "./database";
import {
  Event,
  Filter,
  os,
  eventName,
  weeklyRetentionObject,
  pieChartResponseObject,
} from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware } from "./helpers";
import * as alonTime from "./timeFrames";

import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
const router = express.Router();

// Routes

//passing test - DO NOT TOUCH
router.get("/all", (req: Request, res: Response) => {
  const events = getAllEvents();
  res.json(events);
});

//passing test - DO NOT TOUCH
router.get("/all-filtered", (req: Request, res: Response) => {
  const filter: Filter = req.query;

  const offset: number = filter?.offset ? filter.offset : 10000000000;
  const filtered = getAllEventsFiltered(filter);

  res.json({
    events: filtered
      // .map((event) => {
      //   event.date = (new Date(event.date) as unknown) as number;
      //   return event;
      // })
      .slice(0, offset),
    more: true,
  });
});

//passing test - DO NOT TOUCH
router.get("/by-days/:offset", (req: Request, res: Response) => {
  const { offset } = req.params;
  const endDate: number = new Date().setHours(0, 0, 0) - parseInt(offset) * alonTime.OneDay;
  const startDate: number = endDate - alonTime.OneDay * 6;

  const byDays = getSessionsByDayInWeek(startDate, endDate);
  console.log(byDays);
  res.json(byDays);
});

//passing test - DO NOT TOUCH
router.get("/by-hours/:offset", (req: Request, res: Response) => {
  const { offset } = req.params;
  const startDate = new Date().setHours(0, 0, 0) - parseInt(offset) * alonTime.OneDay;

  const byHours = getSessionsByHoursInDay(startDate);

  res.json(byHours);
});

router.get("/today", (req: Request, res: Response) => {
  res.send("/today");
});

router.get("/week", (req: Request, res: Response) => {
  res.send("/week");
});

router.get("/retention", (req: Request, res: Response) => {
  const dayZero: number = new Date(parseInt(req.query.dayZero)).setHours(0, 0, 0, 0);
  if (!dayZero) res.sendStatus(400);
  const retention: weeklyRetentionObject[] = getRetentionFromDayZero(dayZero);
  res.json(retention);
});

router.get("/:eventId", (req: Request, res: Response) => {
  res.send("/:eventId");
});

//passing test - DO NOT TOUCH
router.post("/", (req: Request, res: Response) => {
  const newEvent: Event = req.body;
  saveNewEvent(newEvent);
  res.sendStatus(200);
});

router.get("/chart/os", (req: Request, res: Response) => {
  const operatingSystems: os[] = ["windows", "mac", "linux", "ios", "android", "other"];
  const data: pieChartResponseObject[] = operatingSystems.map((os: os) => {
    return { title: os, value: getAllEventsFiltered({ os: os }).length };
  });

  res.json(data);
});

router.get("/chart/pageview", (req: Request, res: Response) => {
  const pages: eventName[] = ["login", "signup", "admin", "/"];
  const data: pieChartResponseObject[] = pages.map((page: eventName) => {
    const count = getAllEventsFiltered({ type: page }).length;
    return { title: page, value: count === 0 ? 2 : count };
  });

  res.json(data);
});

router.get("/chart/timeonurl/:time", (req: Request, res: Response) => {
  res.send("/chart/timeonurl/:time");
});

router.get("/chart/geolocation/:time", (req: Request, res: Response) => {
  res.send("/chart/geolocation/:time");
});

export default router;
