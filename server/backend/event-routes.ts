///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import db from "./database";
import { browser, Event, eventName, weeklyRetentionObject } from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware } from "./helpers";

import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
const router = express.Router();

// Routes

interface Filter {
  sorting: string;
  type?: eventName;
  browser?: browser;
  search?: string;
  offset?: number;
}
function getAllEvents(query?: Filter): { more: boolean; events: Event[] } | Event[] {
  let more = false;
  let events = db.get("events").value();
  console.log(query);
  if (query) {
    if (Object.keys(query).some((val) => ["type", "browser", "search"].includes(val))) {
      console.log(query);
      let newRes = [];
      for (let i = 0; i < events.length; i++) {
        if (query.offset && Number(query.offset) === newRes.length) {
          more = true;
          console.log("break");
          break;
        }
        let type = query?.type ? query.type === events[i].name : true;
        let browser = query?.browser ? query.browser === events[i].browser : true;
        let search = query?.search
          ? Object.keys(events[i]).some((value) =>
              new RegExp(query.search!, "i").test(`${events[i][value as keyof Event]}`)
            )
          : true;
        if (type && browser && search) {
          newRes.push(events[i]);
        } else {
          more = true;
        }
      }
      events = newRes;
    }
    if (query.sorting) {
      console.log(query);
      console.log(Object.keys(query));

      let operator: string | undefined;
      let { sorting } = query;
      if (sorting[0] === "-" || sorting[0] === "+") {
        operator = sorting[0];
        sorting = sorting.slice(1);
      }
      if (sorting === "user") sorting = "distinct_user_id";
      events.sort((a, b) => {
        if (sorting == "date") return operator === "-" ? (a.date - b.date) * -1 : a.date - b.date;
        if (a[sorting as keyof Event] !== undefined && sorting !== "geolocation") {
          if ((a[sorting as keyof Event] as string[0]) < (b[sorting as keyof Event] as string[0]))
            return operator === "-" ? 1 : -1;
        }
        return 1;
      });
    }
    let answer = { events, more };
    return answer;
  }
  return events;
}

router.get("/all", (req: Request, res: Response) => {
  res.send(getAllEvents());
});

router.get("/all-filtered", (req: Request, res: Response) => {
  res.send(getAllEvents(req.query));
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
  if (req.body as Event) {
    console.log(req.body);
    db.get("events").push(req.body).write();
  }
  res.send({ seccess: true });
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
