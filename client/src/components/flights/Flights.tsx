import { Card, Skeleton } from "@noahspan/noahspan-components";
import LogbookCard from "../logbookCard/LogbookCard";
import { useEffect, useState } from "react";
import { useLogs } from "../../hooks/logs/UseLogs";
import { ILogbookEntry } from "../logbook/ILogbookEntry";

const Flights = () => {
  const [flights, setFlights] = useState<ILogbookEntry[]>([]);
  const { logs, isLoading } = useLogs();

  useEffect(() => {
    console.log(logs)
    const flights: ILogbookEntry[] | undefined = logs?.filter((log: ILogbookEntry) => {
      if (log.tracks && log.tracks.length > 0) {
        return log;
      }
    })

    if (flights && flights.length > 0) {
      setFlights(flights)
    }
  }, [logs])
  
  return (
    <div className='max-w-screen-lg mx-auto'>
      <div className='prose mt-5 mb-5'>
        <h1>Flights</h1>
      </div>
      {!isLoading &&
        <div>
          <LogbookCard logs={flights} mode='flights' />
        </div>
      }
      {!isLoading && [...Array(6)].map((_element, index) => {
        return (
          <div className='mb-5'>
            <Card
              key={index}
            >
              <div className='p-5'>
                  <div className='mb-2'><Skeleton height='h-[60px]' width='w-[200px]' /></div>
                  <div className='mb-2'><Skeleton height='h-[30px]' width='w-[200px]' /></div>
                  <div className='mb-2'><Skeleton height='h-[300px]' width='w-[300px]' /></div>
                    {[...Array(4)].map((_element, index) => {
                      return (
                        <>
                          <div className='mb-2'><Skeleton height='h-[20px]' width='w-[300px]' /></div>
                          <div className='mb-2'><Skeleton height='h-[20px]' width='w-[300px]' /></div>
                        </>
                      )
                    })}
              </div>
            </Card>
          </div>
        )
      })}
    </div>
  )
}

export default Flights;