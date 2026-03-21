import LogbookCard from "../logbookCard/LogbookCard";
import { useEffect, useReducer } from "react";
import { useLogs } from "../../hooks/logs/UseLogs";
import { LogbookEntry } from "../logbook/LogbookEntry.interface";
import { initialState, reducer } from "./reducer";
import { useOidc } from "../../auth/oidcConfig";
import Alert from "../alert/Alert";
import { AxiosError, AxiosResponse } from "axios";
import httpClient from "../../httpClient/httpClient";
import { useBreakpoints } from "../../hooks/useBreakpoints/UseBreakpoints";
import { ScreenSize } from "../../enums/screenSize";

const Flights = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isUserLoggedIn } = useOidc();
  const { screenSize } = useBreakpoints();

  const getFlights = async (pageIndex: number, pageSize: number) => {
    try {
      const response: AxiosResponse = await httpClient.get(`api/logs/tracks`, {
        params: {
          skip: pageIndex,
          take: pageSize
        }
      });
      const flights: LogbookEntry[] = response.data.entities;
      const hasMore: boolean = response.data.hasNextPage;
      const total: number = response.data.total;

      if (flights.length > 0) {
        const newFlights: LogbookEntry[] = [...state.flights, ...flights]
        const newPageIndex: number = state.pageIndex + flights.length;

        dispatch({ type: 'SET_FLIGHTS', payload: { flights: newFlights, hasMoreFlights: hasMore, pageIndex: newPageIndex, totalFlights: total }})

        if (!isUserLoggedIn && flights.length >= 5) {
          dispatch({ type: 'SET_ALERT', payload: { severity: 'info', message: 'A limited number of flights displayed. Sign in to view all flights.'}})
        } else {
          dispatch({ type: 'SET_ALERT', payload: undefined })
        }
      } else {
        dispatch({ type: 'SET_ALERT', payload: { severity: 'info', message: 'No flights found' }})
      }
    } catch (error) {
      const axiosError = error as AxiosError;

      dispatch({
        type: 'SET_ALERT',
        payload: { severity: 'error', message: `Loading of flights failed with the following message: ${axiosError.message}`}
      });
    } finally {
      dispatch({ type: 'SET_IS_LOADING', payload: false })
    }
  }

  const loadMore = () => {
    getFlights(state.pageIndex, state.pageSize)
  }

  useEffect(() => {
    getFlights(state.pageIndex, state.pageSize);
  }, [])

  useEffect(() => {
    console.log(screenSize)
  }, [screenSize])
  
  return (
    <div className={`max-w-screen-lg mx-auto ${screenSize === ScreenSize.SM || screenSize === ScreenSize.MD? 'mr-4 ml-4' : ''}`}>
      <div className='prose mt-5 mb-5'>
        <h1>Flights</h1>
      </div>
      {!state.isLoading && state.alert && (
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
      {!state.isLoading &&
        <div>
          <div>
            <LogbookCard logs={state.flights} mode='flights' />
          </div>
          {state.hasMoreFlights &&
            <div className='flex items-center justify-center mb-5'>
              <button className='btn btn-link' onClick={loadMore}>Load more</button>
            </div>
          }
        </div>
      }
      {state.isLoading && [...Array(5)].map((_element, index) => {
        return (
          <div className='card bg-base-100 border border-base-300 p-2 mb-5'>
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