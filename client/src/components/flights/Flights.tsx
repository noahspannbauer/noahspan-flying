import LogbookCard from "../logbookCard/LogbookCard";
import { useEffect, useReducer } from "react";
import { useLogs } from "../../hooks/logs/UseLogs";
import { LogbookEntry } from "../logbook/LogbookEntry.interface";
import { initialState, reducer } from "./reducer";
import Alert from "../alert/Alert";

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
      dispatch({ type: 'SET_ALERT', payload: { severity: 'info', message: 'No flights found' }})
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
            className='mb-5'
            onClose={() =>
              dispatch({ type: 'SET_ALERT', payload: undefined })
            }
            severity={state.alert.severity}
          >
            {state.alert.message}
          </Alert>
        </div>
      )}
      {!logsLoading &&
        <div>
          <LogbookCard logs={state.flights} mode='flights' />
        </div>
      }
      {logsLoading && [...Array(5)].map((_element, index) => {
        return (
          <div className='card bg-base-100 border border-base-300 p-2 mb-7'>
            <div className='card-body' key={index}>
              <div className='skeleton h-10 w-[150px]' />
              <div className='skeleton h-[350px]' />
              <div className='skeleton h-[65px]' />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Flights;