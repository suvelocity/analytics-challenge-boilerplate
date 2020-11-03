import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { getUserById } from "./database";

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  /* istanbul ignore next */
  res.status(401).send({
    error: "Unauthorized",
  });
};

export const validateMiddleware = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation: any) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(422).json({ errors: errors.array() });
  };
};

export function AdminValidation(req: Request, res: Response, next: NextFunction) {
  const userId = req.session!.passport.user;
  const user = getUserById(userId);

  if (user.isAdmin) {
    next();
  } else {
    res.status(401).send({
      error: "Unauthorized",
    });
  }
}

export function groupBy(collection: any[] , property: string) {
  let i = 0;
  let values = [];
  let result = [];
  let val;
  let index; 
  for (; i < collection.length; i++) {
      val = collection[i][property];
      index = values.indexOf(val);
      if (index > -1)
          result[index].push(collection[i]);
      else {
          values.push(val);
          result.push([collection[i]]);
      }
  }
  return result;
}

export function formatDate(date: Date) {
  let dd = String(date.getDate()).padStart(2, "0");
  let mm = String(date.getMonth() + 1).padStart(2, "0");
  let yyyy = date.getFullYear();
  return dd + "/" + mm + "/" + yyyy;
}

export function createArrayWeekAgo(offset: number) {
  const currentDate=new Date();
  let firstDay: Date=new Date(currentDate.setDate(currentDate.getDate()-(6+offset)));
  let array=[{date: formatDate(firstDay), count:0}]
  for(let i=0;i<6;i++){
      array.push({date: formatDate(new Date(currentDate.setDate(currentDate.getDate()+1))), count:0});
  }
  const day: number = new Date(firstDay).getDate();
  const month: number = new Date(firstDay).getMonth() + 1;
  const year: number = new Date(firstDay).getFullYear();
  const firstDayUnix = new Date(`${year}/${month}/${day}`).valueOf();
  return({arrayOfDates: array, firstDay: firstDay, firstDayUnix: firstDayUnix});
  
};
export function diffrenceInDays(date1: Date,date2: Date): number{
  const date3=new Date(date1.toISOString().substring(0,10))
  const date4=new Date(date2.toISOString().substring(0,10))
  const diffTime = date4.getTime() - date3.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays
}

export function createArrayByHours(){
  let array=[];
  for(let i=0;i<24;i++){
      if(i<10){
          const obj={hour:`0${i}:00`,count:0}
          array.push(obj);
      }else{
          const obj={hour:`${i}:00`,count:0}
          array.push(obj);
      }
      }
      return array;
  }
  