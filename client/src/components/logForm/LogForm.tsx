import React, { useEffect, useReducer } from 'react';
import { Alert, Button, DatePicker, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Input, NumberInput, Select, Selection, SelectItem, SharedSelection, Textarea } from '@heroui/react'
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
import { parseAbsolute, parseDate, getLocalTimeZone, CalendarDate, ZonedDateTime } from '@internationalized/date';
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

        dispatch({ type: 'SET_ALERT', payload: { severity: 'danger', message: axiosError.message }});
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
      console.log(newPilotsOptions)
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
              <Select
                aria-labelledby='pilot'
                isDisabled={state.isDisabled}
                fullWidth={true}
                isRequired={true}
                onSelectionChange={(keys: SharedSelection) => {
                  setValue('pilotId', keys.currentKey);
                }}
                selectedKeys={[value]}
                size='lg'
              >
                {state.pilotOptions?.map((pilotOption: { key: string; label: string, }) => {
                return (
                  <SelectItem key={pilotOption.key}>{pilotOption.label}</SelectItem>
                ) 
                })}
              </Select>
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
            const parsedAbsoluteDate = value ? parseAbsolute(value, getLocalTimeZone()) : value

            return(
            <DatePicker
              aria-labelledby='date'
              isDisabled={state.isDisabled}
              isRequired={true}
              onChange={(selectedDate) => {
                let date = selectedDate as CalendarDate;

                setValue('date', date.toDate(getLocalTimeZone()).toISOString())
              }}
              size='lg'
              value={parsedAbsoluteDate ? new CalendarDate(parsedAbsoluteDate.year, parsedAbsoluteDate.month, parsedAbsoluteDate.day) : value}
            />
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
            <Input
              aria-labelledby='aircraftMakeModel'
              isDisabled={state.isDisabled}
              color={formState.errors.address ? 'danger' : undefined}
              errorMessage={
                formState.errors.address
                  ? formState.errors.address.message?.toString()
                  : undefined
              }
              isRequired={true}
              onChange={onChange}
              size='lg'
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
                <Input
                  aria-labelledby='aircraftIdentity'
                  isDisabled={state.isDisabled}
                  color={formState.errors.address ? 'danger' : undefined}
                  errorMessage={
                    formState.errors.address
                      ? formState.errors.address.message?.toString()
                      : undefined
                  }
                  isRequired={true}
                  onChange={onChange}
                  size='lg'
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
            <Input
              aria-labelledby='routeFrom'
              isDisabled={state.isDisabled}
              color={formState.errors.address ? 'danger' : undefined}
              errorMessage={
                formState.errors.address
                  ? formState.errors.address.message?.toString()
                  : undefined
              }
              isRequired={true}
              onChange={onChange}
              size='lg'
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
            <Input
              aria-labelledby='routeTo'
              isDisabled={state.isDisabled}
              color={formState.errors.address ? 'danger' : undefined}
              errorMessage={
                formState.errors.address
                  ? formState.errors.address.message?.toString()
                  : undefined
              }
              isRequired={true}
              onChange={onChange}
              size='lg'
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
            <NumberInput
              aria-labelledby='durationOfFlight'
              isDisabled={state.isDisabled}
              color={formState.errors.address ? 'danger' : undefined}
              errorMessage={
                formState.errors.address
                  ? formState.errors.address.message?.toString()
                  : undefined
              }
              isRequired={true}
              isWheelDisabled={state.isDisabled}
              onChange={onChange}
              radius='lg'
              size='sm'
              type="number"
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
                <NumberInput
                  aria-labelledby='singleEngineLand'
                  isDisabled={state.isDisabled}
                  color={formState.errors.address ? 'danger' : undefined}
                  errorMessage={
                    formState.errors.address
                      ? formState.errors.address.message?.toString()
                      : undefined
                  }
                  isRequired={true}
                  isWheelDisabled={state.isDisabled}
                  onChange={onChange}
                  radius='lg'
                  size='sm'
                  type="number"
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
                <NumberInput
                  aria-labelledby='simulaterAtd'
                  isDisabled={state.isDisabled}
                  color={formState.errors.address ? 'danger' : undefined}
                  errorMessage={
                    formState.errors.address
                      ? formState.errors.address.message?.toString()
                      : undefined
                  }
                  isWheelDisabled={state.isDisabled}
                  onChange={onChange}
                  radius='lg'
                  size='sm'
                  type="number"
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
                <NumberInput
                  aria-labelledby='landingsDay'
                  isDisabled={state.isDisabled}
                  color={
                    formState.errors.address ? 'danger' : undefined
                  }
                  errorMessage={
                    formState.errors.address
                      ? formState.errors.address.message?.toString()
                      : undefined
                  }
                  isWheelDisabled={state.isDisabled}
                  onChange={onChange}
                  radius='lg'
                  size='sm'
                  type="number"
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
                <NumberInput
                  aria-labelledby='landingsNight'
                  isDisabled={state.isDisabled}
                  color={
                    formState.errors.address ? 'danger' : undefined
                  }
                  errorMessage={
                    formState.errors.address
                      ? formState.errors.address.message?.toString()
                      : undefined
                  }
                  isWheelDisabled={state.isDisabled}
                  onChange={onChange}
                  radius='lg'
                  size='sm'
                  type="number"
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
                <NumberInput
                  aria-labelledby='groundTrainingReceived'
                  isDisabled={state.isDisabled}
                  color={
                    formState.errors.address ? 'danger' : undefined
                  }
                  errorMessage={
                    formState.errors.address
                      ? formState.errors.address.message?.toString()
                      : undefined
                  }
                  isWheelDisabled={state.isDisabled}
                  onChange={onChange}
                  radius='lg'
                  size='sm'
                  type="number"
                  value={value}
                  width='w-full'
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
                <NumberInput
                  aria-labelledby='flightTrainingReceived'
                  isDisabled={state.isDisabled}
                  color={
                    formState.errors.address ? 'danger' : undefined
                  }
                  errorMessage={
                    formState.errors.address
                      ? formState.errors.address.message?.toString()
                      : undefined
                  }
                  isWheelDisabled={state.isDisabled}
                  onChange={onChange}
                  radius='lg'
                  size='sm'
                  type="number"
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
                <NumberInput
                  aria-labelledby='crossCountry'
                  isDisabled={state.isDisabled}
                  color={
                    formState.errors.address ? 'danger' : undefined
                  }
                  errorMessage={
                    formState.errors.address
                      ? formState.errors.address.message?.toString()
                      : undefined
                  }
                  isWheelDisabled={state.isDisabled}
                  onChange={onChange}
                  radius='lg'
                  size='sm'
                  type="number"
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
                <NumberInput
                  aria-labelledby='night'
                  isDisabled={state.isDisabled}
                  color={
                    formState.errors.address ? 'danger' : undefined
                  }
                  errorMessage={
                    formState.errors.address
                      ? formState.errors.address.message?.toString()
                      : undefined
                  }
                  isWheelDisabled={state.isDisabled}
                  onChange={onChange}
                  radius='lg'
                  size='sm'
                  type="number"
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
                <NumberInput
                  aria-labelledby='solo'
                  isDisabled={state.isDisabled}
                  color={
                    formState.errors.address ? 'danger' : undefined
                  }
                  errorMessage={
                    formState.errors.address
                      ? formState.errors.address.message?.toString()
                      : undefined
                  }
                  isWheelDisabled={state.isDisabled}
                  onChange={onChange}
                  radius='lg'
                  size='sm'
                  type="number"
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
                <NumberInput
                  aria-labelledby='pilotInCommand'
                  isDisabled={state.isDisabled}
                  color={
                    formState.errors.address ? 'danger' : undefined
                  }
                  errorMessage={
                    formState.errors.address
                      ? formState.errors.address.message?.toString()
                      : undefined
                  }
                  isWheelDisabled={state.isDisabled}
                  onChange={onChange}
                  radius='lg'
                  size='sm'
                  type="number"
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
                <NumberInput
                  aria-labelledby='instrumentActual'
                  isDisabled={state.isDisabled}
                  color={
                    formState.errors.address ? 'danger' : undefined
                  }
                  errorMessage={
                    formState.errors.address
                      ? formState.errors.address.message?.toString()
                      : undefined
                  }
                  isWheelDisabled={state.isDisabled}
                  onChange={onChange}
                  radius='lg'
                  size='sm'
                  type="number"
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
                <NumberInput
                  aria-labelledby='instrumentSimulated'
                  isDisabled={state.isDisabled}
                  color={
                    formState.errors.address ? 'danger' : undefined
                  }
                  errorMessage={
                    formState.errors.address
                      ? formState.errors.address.message?.toString()
                      : undefined
                  }
                  isWheelDisabled={state.isDisabled}
                  onChange={onChange}
                  radius='lg'
                  size='sm'
                  type="number"
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
                <NumberInput
                  aria-labelledby='instrumentApproaches'
                  isDisabled={state.isDisabled}
                  color={
                    formState.errors.address ? 'danger' : undefined
                  }
                  errorMessage={
                    formState.errors.address
                      ? formState.errors.address.message?.toString()
                      : undefined
                  }
                  isWheelDisabled={state.isDisabled}
                  onChange={onChange}
                  radius='lg'
                  size='sm'
                  type="number"
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
                <NumberInput
                  aria-labelledby='instrumentHolds'
                  isDisabled={state.isDisabled}
                  color={
                    formState.errors.address ? 'danger' : undefined
                  }
                  errorMessage={
                    formState.errors.address
                      ? formState.errors.address.message?.toString()
                      : undefined
                  }
                  isWheelDisabled={state.isDisabled}
                  onChange={onChange}
                  radius='lg'
                  size='sm'
                  type="number"
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
                <NumberInput
                  aria-labelledby='instrumentNavTrack'
                  isDisabled={state.isDisabled}
                  color={
                    formState.errors.address ? 'danger' : undefined
                  }
                  errorMessage={
                    formState.errors.address
                      ? formState.errors.address.message?.toString()
                      : undefined
                  }
                  fullWidth={true}
                  isWheelDisabled={state.isDisabled}
                  onChange={onChange}
                  radius='lg'
                  size='sm'
                  type="number"
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
            <Textarea
              aria-labelledby='notes'
              isDisabled={state.isDisabled}
              color={formState.errors.address ? 'danger' : undefined}
              errorMessage={
                formState.errors.address
                  ? formState.errors.address.message?.toString()
                  : undefined
              }
              fullWidth={true}
              onChange={onChange}
              value={value}
            />
          )}
        />
      </div>
    </div>

  );
};

export default LogForm;
