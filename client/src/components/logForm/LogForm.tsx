import React, { useEffect, useReducer } from 'react';
import { useForm, Controller, FormProvider, useFormContext } from 'react-hook-form';
import { LogFormProps } from './LogFormProps.interface';
import { initialState, reducer } from './reducer';
import { AxiosError, AxiosResponse } from 'axios';
import { FormMode } from '../../enums/formMode';
import { usePilots } from '../../hooks/pilots/UsePilots';
import { useOidc } from '../../auth/oidcConfig';
import httpClient from '../../httpClient/httpClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useLogbookContext } from '../../hooks/logbookContext/UseLogbookContext';

const LogForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { control, formState, reset, setValue } = useFormContext()
  const { pilots } = usePilots();
  const { isUserLoggedIn } = useOidc();
  const logbookContext = useLogbookContext()

  useEffect(() => {
    if (logbookContext.state.formMode === FormMode.VIEW) {
      dispatch({ type: 'SET_IS_DISABLED', payload: true });
    }
  }, [logbookContext.state.formMode]);

  useEffect(() => {
    const getEntry = async () => {
      try {
        dispatch({ type: 'SET_IS_LOADING', payload: true });

        const response: AxiosResponse = await httpClient.get(
          `api/logs/${logbookContext.state.selectedLogId}`
        );
        const log = response.data;

        reset(log);
      } catch (error) {
        const axiosError = error as AxiosError;

        dispatch({ type: 'SET_ALERT', payload: { severity: 'error', message: axiosError.message }});
      } finally {
        dispatch({ type: 'SET_IS_LOADING', payload: false });
      }
    };

    if (logbookContext.state.selectedLogId) {
      getEntry();
    }
  }, [logbookContext.state.selectedLogId]);

  useEffect(() => {
    if (pilots && FormMode.ADD) {
      const newPilotsOptions = pilots.map((pilot) => {
        return {
          key: pilot.id,
          label: pilot.name,
        };
      });

      dispatch({ type: 'SET_PILOT_OPTIONS', payload: newPilotsOptions });
    }
  }, [pilots]);

  return (
    <div className='grid grid-cols-12 gap-3'>
      <div className={`col-span-4 self-center text-small after:content-['*'] after:text-danger after:ms-0.5`}>
        <span id='pilot'>Pilot</span>
      </div>
      <div className='col-span-8 self-center'>
        <Controller
          name="pilotId"
          control={control}
          render={({ field: { value } }) => {
            return (
              <select
                className='select w-full'
                aria-labelledby='pilot'
                disabled={state.isDisabled}
                // onChange={(keys: SharedSelection) => {
                //   setValue('pilotId', keys.currentKey);
                // }}=
                value={[value]}
              >
                {state.pilotOptions?.map((pilotOption: { key: string; label: string, }) => {
                return (
                  <option key={pilotOption.key}>{pilotOption.label}</option>
                ) 
                })}
              </select>
            );
          }}
        />
      </div>
      <div className={`col-span-4 self-center text-small after:content-['*'] after:text-danger after:ms-0.5`}>
        <span id='date'>Date</span>
      </div>
      <div className='col-span-8'>
        <Controller
          name="date"
          control={control}
          render={({ field: { onChange, value } }) => {
            return(
              <input
                type='date'
                className='input w-full'
                disabled={state.isDisabled}
                onChange={onChange}
                value={value}
              />
              // <DatePicker
              //   aria-labelledby='date'
              //   isDisabled={state.isDisabled}
              //   isRequired={true}
              //   onChange={(selectedDate) => {
              //     let date = selectedDate as CalendarDate;

              //     setValue('date', date.toDate(getLocalTimeZone()).toISOString())
              //   }}
              //   size='lg'
              //   value={parsedAbsoluteDate ? new CalendarDate(parsedAbsoluteDate.year, parsedAbsoluteDate.month, parsedAbsoluteDate.day) : value}
              // />
            )
          }}
        />
      </div>
      <div className= {`col-span-4 self-center text-small after:content-['*'] after:text-danger after:ms-0.5`}>
        <span id='aircraftMakeModle'>Aircraft Make and Model</span>
      </div>
      <div className='col-span-8'>
        <Controller
          name="aircraftMakeModel"
          control={control}
          render={({ field: { onChange, value } }) => (
            <input
              type='text'
              className='input w-full'
              disabled={state.isDisabled}
              onChange={onChange}
              value={value}
            />
          )}
        />
      </div>
      {isUserLoggedIn &&
        <>
          <div className={`col-span-4 self-center text-small after:content-['*'] after:text-danger after:ms-0.5`}>
            <span id='aircraftIdentity'>Aircraft Identity</span>
          </div>
          <div className='col-span-8'>
            <Controller
              name="aircraftIdentity"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  type='text'
                  className='input w-full'
                  disabled={state.isDisabled}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
        </>
      }
      <div className={`col-span-4 self-center text-small after:content-['*'] after:text-danger after:ms-0.5`}>
        <span id='routeFrom'>Route From</span>
      </div>
      <div className='col-span-8'>
        <Controller
          name="routeFrom"
          control={control}
          render={({ field: { onChange, value } }) => (
            <input
              type='text'
              className='input w-full'
              disabled={state.isDisabled}
              onChange={onChange}
              value={value}
            />
          )}
        />
      </div>
      <div className={`col-span-4 self-center text-small after:content-['*'] after:text-danger after:ms-0.5`}>
        <span id='routeTo'>Route To</span>
      </div>
      <div className='col-span-8'>
        <Controller
          name="routeTo"
          control={control}
          render={({ field: { onChange, value } }) => (
            <input
              type='text'
              className='input w-full'
              disabled={state.isDisabled}
              onChange={onChange}
              value={value}
            />
          )}
        />
      </div>
      <div className={`col-span-4 self-center text-small after:content-['*'] after:text-danger after:ms-0.5`}>
        <span id='durationOfFlight'>Duration Of Flight</span>
      </div>
      <div className='col-span-8'>
        <Controller
          name="durationOfFlight"
          control={control}
          render={({ field: { onChange, value } }) => (
            <input
              type='number'
              className='input w-full'
              disabled={state.isDisabled}
              onChange={onChange}
              value={value}
            />
          )}
        />
      </div>
      {isUserLoggedIn &&
        <>
          <div className={`col-span-4 self-center text-small after:content-['*'] after:text-danger after:ms-0.5`}>
            <span id='singleEngineLand'>Single Engine Land</span>
          </div>
          <div className='col-span-8'>
            <Controller
              name="singleEngineLand"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  type='number'
                  className='input w-full'
                  disabled={state.isDisabled}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
          <div className='col-span-4 self-center text-small'>
            <span id='simulatorAtd'>Simulator or ATD</span>
          </div>
          <div className='col-span-8'>
            <Controller
              name="simulatorAtd"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  type='number'
                  className='input w-full'
                  disabled={state.isDisabled}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
          <div className='col-span-12'>
            <h4>Landings</h4>
          </div>
          <div className='col-span-4 self-center text-small'>
            <span id='landingsDay'>Day</span>
          </div>
          <div className='col-span-8'>
            <Controller
              name="landingsDay"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  type='number'
                  className='input w-full'
                  disabled={state.isDisabled}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
          <div className='col-span-4 self-center text-small'>
            <span id='landingsNight'>Night</span>
          </div>
          <div className='col-span-8'>
            <Controller
              name="landingsNight"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  type='number'
                  className='input w-full'
                  disabled={state.isDisabled}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
          <div className='col-span-12'>
            <h4>Type of Training or Experience</h4>
          </div>
          <div className='col-span-4 self-center'>
            <span id='groundTrainingsReceived'>
              Ground Training Received
            </span>
          </div>
          <div className='col-span-8'>
            <Controller
              name="groundTrainingReceived"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  type='number'
                  className='input w-full'
                  disabled={state.isDisabled}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
          <div className='col-span-4 self-center'>
            <span id='flightTrainingReceived'>
              Flight Training Received
            </span>
          </div>
          <div className='col-span-8'>
            <Controller
              name="flightTrainingReceived"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  type='number'
                  className='input w-full'
                  disabled={state.isDisabled}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
          <div className='col-span-4 self-center'>
            <span id='crossCountry'>Cross Country</span>
          </div>
          <div className='col-span-8'>
            <Controller
              name="crossCountry"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  type='number'
                  className='input w-full'
                  disabled={state.isDisabled}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
          <div className='col-span-4 self-center'>
            <span id='night'>Night</span>
          </div>
          <div className='col-span-8'>
            <Controller
              name="night"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  type='number'
                  className='input w-full'
                  disabled={state.isDisabled}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
          <div className='col-span-4 self-center'>
            <span id='solo'>Solo</span>
          </div>
          <div className='col-span-8'>
            <Controller
              name="solo"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  type='number'
                  className='input w-full'
                  disabled={state.isDisabled}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
          <div className='col-span-4 self-center'>
            <span id='pilotInCommand'>Pilot in Command</span>
          </div>
          <div className='col-span-8'>
            <Controller
              name="pilotInCommand"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  type='number'
                  className='input w-full'
                  disabled={state.isDisabled}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
          <div className='col-span-12 self-center'>
            <h4>Instrument</h4>
          </div>
          <div className='col-span-4 self-center'>
            <span id='instrumentActual'>Actual</span>
          </div>
          <div className='col-span-8'>
            <Controller
              name="instrumentActual"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  type='number'
                  className='input w-full'
                  disabled={state.isDisabled}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
          <div className='col-span-4 self-center'>
            <span id='instrumentSimulated'>Simulated</span>
          </div>
          <div className='col-span-8'>
            <Controller
              name="instrumentSimulated"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  type='number'
                  className='input w-full'
                  disabled={state.isDisabled}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
          <div className='col-span-4 self-center'>
            <span id='instrumentApproaches'>
              Instrument Approaches
            </span>
          </div>
          <div className='col-span-8'>
            <Controller
              name="instrumentApproaches"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  type='number'
                  className='input w-full'
                  disabled={state.isDisabled}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
          <div className='col-span-4 self-center'>
            <span id='instrumentHolds'>Holds</span>
          </div>
          <div className='col-span-8'>
            <Controller
              name="instrumentHolds"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  type='number'
                  className='input w-full'
                  disabled={state.isDisabled}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
          <div className='col-span-4 self-center'>
            <span id='instrumentNavTrack'>Nav / Track</span>
          </div>
          <div className='col-span-8'>
            <Controller
              name="instrumentNavTrack"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  type='number'
                  className='input w-full'
                  disabled={state.isDisabled}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
        </>
      }
      <div className='col-span-12'>
        <h4 id='notes'>Notes</h4>
      </div>
      <div className='col-span-12'>
        <Controller
          name="notes"
          control={control}
          render={({ field: { onChange, value } }) => (
            <textarea
              className='textarea w-full'
              disabled={state.isDisabled}
              onChange={onChange}
            ></textarea>
          )}
        />
      </div>
    </div>

  );
};

export default LogForm;
