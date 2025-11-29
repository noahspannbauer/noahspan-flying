import { Icon, IconName, Skeleton } from "@noahspan/noahspan-components";
import { Card } from '@heroui/react';
import LogbookCard from "../logbookCard/LogbookCard";
import { useEffect, useReducer } from "react";
import { useLogs } from "../../hooks/logs/UseLogs";
import { LogbookEntry } from "../logbook/LogbookEntry.interface";
import { initialState, reducer } from "./reducer";
import { Alert } from '@heroui/react'

const Flights = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { logs, logsLoading } = useLogs();

  useEffect(() => {

    const flights: LogbookEntry[] | undefined = logs?.filter((log: LogbookEntry) => {
      if (log.tracks && log.tracks.length > 0) {
        return log;
      }
    })

    if (flights && flights.length > 0) {
      dispatch({ type: 'SET_FLIGHTS', payload: flights})
      dispatch({ type: 'SET_ALERT', payload: undefined })
    } else {
      dispatch({ type: 'SET_ALERT', payload: { severity: 'default', message: 'No flights found' }})
    }
  }, [logs])
  
  return (
    <div className='max-w-screen-lg mx-auto'>
      <div className='prose mt-5 mb-5'>
        <h1>Flights</h1>
      </div>
      {!logsLoading && state.alert && (
        <div>
          <Alert
            onClose={() =>
              dispatch({ type: 'SET_ALERT', payload: undefined })
            }
            color={state.alert.severity}
            title={state.alert.message}
          />
        </div>
      )}
      {!logsLoading &&
        <div>
          <LogbookCard logs={state.flights} mode='flights' />
        </div>
      }
      {logsLoading && [...Array(6)].map((_element, index) => {
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