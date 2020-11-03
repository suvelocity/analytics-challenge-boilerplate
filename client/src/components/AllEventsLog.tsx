import React, { useState, useCallback, createRef, useRef } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { httpClient } from "utils/asyncUtils";
import useInfiniteScroll from "utils/useInfinteScroll";
import { Event, EventsLogResponse, Filter } from "../models/event";

const AllEventsLog: React.FC = () => {
  //#region  bla
  // //   const [step, setStep] = useState<number>(0);
  // const curr:string[] = [];
  //   const data = [
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //   ];
  //   //   const [items, setItems] = useState<string[]>([]);
  //   const [hasMore, setHasMore] = useState<boolean>(true);

  //   const loadMore = (): void => {
  //     // setItems(data.slice(step * 10, (step + 1) * 10 + 1));
  //     // setStep((step) => step + 1);
  // curr = data.slice()
  //   };

  //   const items = data.slice(step * 10, (step + 1) * 10 + 1).map((item) => <div>{item}</div>);
  //   console.log(items);

  //   const [data, setData] = useState<any[]>([
  //     <div>{1}</div>,
  //     <div>{1}</div>,
  //     <div>{1}</div>,
  //     <div>{1}</div>,
  //     <div>{1}</div>,
  //     <div>{1}</div>,
  //     <div>{1}</div>,
  //   ]);
  //   const [hasMore, setHasMore] = useState<boolean>(true);
  //   const logs: any = [];

  //   const loadMore = async () => {
  //     const { data } = await httpClient.get(`events/all-filtered`, {
  //       params: { sorting: "-date", offset: 10 },
  //     });
  //     const eventLogs: Event[] = data.events;
  //     const more: boolean = data.more;
  //     console.log(data);
  //     // logs.concat(eventLogs.map((log: Event) => <div>{log._id}</div>));
  //     setData(eventLogs.map((log: Event) => <div style={{ fontSize: "30px" }}>{log._id}</div>));
  //     setHasMore(more);
  //   };
  //   if (data.length > 0) {
  //   }
  //   console.log(logs);
  //   return (
  //     <div style={{ height: "300px", backgroundColor: "red", overflow: "auto" }}>
  //       <InfiniteScroll
  //         pageStart={0}
  //         loadMore={loadMore}
  //         hasMore={hasMore}
  //         loader={<div>loadin....</div>}
  //         useWindow={false}
  //       >
  //         {data}
  //       </InfiniteScroll>
  //     </div>
  //   );
  //#endregion
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [query, setQuery] = useState<Filter>({
    sorting: "-date",
    offset: 10,
  });
  const {
    data,
    hasMore,
    loading,
    error,
  }: { data: Array<any>; hasMore: boolean; loading: boolean; error: boolean } = useInfiniteScroll(
    query,
    pageNumber,
    `/events/all-filtered`
  );

  //The Magic
  //   const observer = createRef<any>();
  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      //@ts-ignore
      if (observer.current) observer.current.disconnect();
      //@ts-ignore
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      //@ts-ignore
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleSearch = (e: Event): void => {
    //@ts-ignore
    setQuery(e.target.value);
    setPageNumber(1);
  };

  const logs = data.map((event: Event) => event._id);
  console.log(pageNumber);
  return (
    <div style={{ height: "300px", overflowY: "scroll", fontSize: "20px" }}>
      {logs.map((log: string, i: number) => {
        if (logs.length === i + 1) {
          return (
            <div ref={lastBookElementRef} key={`log${i}`}>
              {`${i}.${log}`}
            </div>
          );
        } else {
          return <div key={`log${i}`}>{`${i}.${log}`}</div>;
        }
      })}
      <div>{loading && "Loading..."}</div>
      <div>{error && "Error"}</div>
    </div>
  );
};

export default AllEventsLog;
