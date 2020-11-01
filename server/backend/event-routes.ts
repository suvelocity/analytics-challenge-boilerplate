///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import { getAllEvents, getAllEventsFiltered } from "./database";
import { Event, weeklyRetentionObject } from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware } from "./helpers";

import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
import { date } from "faker";
const router = express.Router();

// Routes

interface Filter {
  sorting: string;
  type?: string;
  browser?: string;
  search?: string;
  offset?: number;
}

//passing tests - DO NOT TOUCH
router.get("/all", (req: Request, res: Response) => {
  const events = getAllEvents();
  res.json(events);
});

// for now returns all events filtered from earliest to latest
router.get("/all-filtered", (req: Request, res: Response) => {
  const filter: Filter = req.query;
  console.log(filter);
  const offset: number = filter?.offset ? filter.offset : 10000000000;
  const filtered = getAllEventsFiltered(filter);
  // console.log(filtered.slice(0, 5));
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

router.get("/by-days/:offset", (req: Request, res: Response) => {
  res.send("/by-days/:offset");
});

router.get("/by-hours/:offset", (req: Request, res: Response) => {
  res.send("/by-hours/:offset");
});

router.get("/today", (req: Request, res: Response) => {
  res.send("/today");
});

router.get("/week", (req: Request, res: Response) => {
  res.send("/week");
});

router.get("/retention", (req: Request, res: Response) => {
  const { dayZero } = req.query;
  res.send("/retention");
});
router.get("/:eventId", (req: Request, res: Response) => {
  res.send("/:eventId");
});

router.post("/", (req: Request, res: Response) => {
  res.send("/");
});

router.get("/chart/os/:time", (req: Request, res: Response) => {
  res.send("/chart/os/:time");
});

router.get("/chart/pageview/:time", (req: Request, res: Response) => {
  res.send("/chart/pageview/:time");
});

router.get("/chart/timeonurl/:time", (req: Request, res: Response) => {
  res.send("/chart/timeonurl/:time");
});

router.get("/chart/geolocation/:time", (req: Request, res: Response) => {
  res.send("/chart/geolocation/:time");
});

export default router;
