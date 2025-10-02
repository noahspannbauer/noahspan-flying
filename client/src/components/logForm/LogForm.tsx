import React, { useEffect, useReducer } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Collapse,
  CollapseContent,
  CollapseTitle,
  Alert,
  Button,
  DatePicker,
  Drawer,
  Icon,
  IconButton,
  IconName,
  Input,
  Select
} from '@noahspan/noahspan-components';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { ILogFormProps } from './ILogFormProps';
import { initialState, reducer } from './reducer';
import { AxiosError, AxiosResponse } from 'axios';
import { FormMode } from '../../enums/formMode';
import { usePilots } from '../../hooks/pilots/UsePilots';
import httpClient from '../../httpClient/httpClient';
import { useOidc } from '../../auth/oidcConfig';

const LogForm: React.FC<ILogFormProps> = ({
  logId,
  isDrawerOpen,
  mode,
  onOpenClose
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const defaultValues = {
    pilotId: '',
    date: null,
    aircraftMakeModel: '',
    aircraftIdentity: '',
    routeFrom: '',
    routeTo: '',
    durationOfFlight: null,
    singleEngineLand: null,
    simulatorAtd: null,
    landingsDay: null,
    landingsNight: null,
    groundTrainingReceived: null,
    flightTrainingReceived: null,
    crossCountry: null,
    night: null,
    solo: null,
    pilotInCommand: null,
    instrumentActual: null,
    instrumentSimulated: null,
    instrumentApproaches: null,
    instrumentHolds: null,
    instrumentNavTrack: null,
    notes: ''
  };
  const methods = useForm();
  const { pilots } = usePilots();
  const { isUserLoggedIn } = useOidc();

  const onCancel = () => {
    methods.reset(defaultValues);
    dispatch({ type: 'SET_IS_DISABLED', payload: false });
    onOpenClose(FormMode.CANCEL);
  };

  const onSubmit = async (data: unknown) => {
    try {
      dispatch({ type: 'SET_IS_LOADING', payload: true });

      if (!logId) {
        await httpClient.post(`api/logs`, data);
      } else {
        await httpClient.put(`api/logs/${logId}`, data);
      }

      methods.reset(defaultValues);
      dispatch({ type: 'SET_IS_DISABLED', payload: false });
      onOpenClose(FormMode.CANCEL);
    } catch (error) {
      const axiosError = error as AxiosError;

      dispatch({ type: 'SET_ALERT', payload: { severity: 'error', message: axiosError.message }});
    } finally {
      dispatch({ type: 'SET_IS_LOADING', payload: false });
    }
  };

  useEffect(() => {
    if (mode === FormMode.VIEW) {
      dispatch({ type: 'SET_IS_DISABLED', payload: true });
    }
  }, [mode]);

  useEffect(() => {
    const getEntry = async () => {
      try {
        dispatch({ type: 'SET_IS_LOADING', payload: true });

        const response: AxiosResponse = await httpClient.get(
          `api/logs/${logId}`
        );
        const log = response.data;

        log.pilotId = log.pilot.id
        methods.reset(log);
      } catch (error) {
        const axiosError = error as AxiosError;

        dispatch({ type: 'SET_ALERT', payload: { severity: 'error', message: axiosError.message }});
      } finally {
        dispatch({ type: 'SET_IS_LOADING', payload: false });
      }
    };

    if (logId && isDrawerOpen) {
      getEntry();
    }
  }, [logId]);

  useEffect(() => {
    if (pilots && FormMode.ADD) {
      const newPilotsOptions = pilots.map((pilot) => {
        return {
          label: pilot.name,
          value: pilot.id
        };
      });

      dispatch({ type: 'SET_PILOT_OPTIONS', payload: newPilotsOptions });
    }
  }, [pilots]);

  return (
    <Drawer
      open={isDrawerOpen}
      position='right'
      width='50%'
    >
      <FormProvider {...methods}>
        <form className='prose max-w-none' onSubmit={methods.handleSubmit(onSubmit)} style={{ paddingBottom: '50px' }}>
          <div className='grid grid-cols-12 gap-3'>
            <div className='col-span-10 self-center'>
              <h2 style={{ margin: 0 }}>{`${mode.toString().toLowerCase().charAt(0).toUpperCase() + mode.toString().slice(1).toLowerCase()} Entry`}</h2>
            </div>
            <div className='col-span-2 justify-self-end self-center'>
              <IconButton onClick={onCancel}>
                <Icon iconName={IconName.XMARK} />
              </IconButton>
            </div>
            {state.alert && (
              <div>
                <Alert
                  onClose={() =>
                    dispatch({ type: 'SET_ALERT', payload: undefined })
                  }
                  severity={state.alert.severity}
                >
                  {state.alert.message}
                </Alert>
              </div>
            )}
            <div className='col-span-4 self-center'>
              <span>Pilot *</span>
            </div>
            <div className='col-span-8'>
              <Controller
                name="pilotId"
                control={methods.control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <Select
                      disabled={state.isDisabled}
                      onChange={(event: any) => {
                        const pilot = pilots?.find(
                          (pilot) => (pilot.id = event.target.value)
                        );

                        methods.setValue('pilotId', event.target.value);
                      }}
                      options={
                        state.pilotOptions && state.pilotOptions.length > 0
                          ? state.pilotOptions
                          : []
                      }
                      value={value ? value : ''}
                      width='w-full'
                    />
                  );
                }}
              />
            </div>
            <div className='col-span-4 self-center'>
              <span>Date *</span>
            </div>
            <div className='col-span-8'>
              <Controller
                name="date"
                control={methods.control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    disabled={state.isDisabled}
                    locale='en'
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </div>
            <div className='col-span-4 self-center'>
              <span>Aircraft Make and Model *</span>
            </div>
            <div className='col-span-8'>
              <Controller
                name="aircraftMakeModel"
                control={methods.control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    disabled={state.isDisabled}
                    color={methods.formState.errors.address ? 'error' : undefined}
                    helperText={
                      methods.formState.errors.address
                        ? methods.formState.errors.address.message?.toString()
                        : undefined
                    }
                    onChange={onChange}
                    value={value}
                    width='w-full'
                  />
                )}
              />
            </div>
            {isUserLoggedIn &&
              <>
                <div className='col-span-4 self-center'>
                  <span>Aircraft Identity *</span>
                </div>
                <div className='col-span-8'>
                  <Controller
                    name="aircraftIdentity"
                    control={methods.control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        disabled={state.isDisabled}
                        color={methods.formState.errors.address ? 'error' : undefined}
                        helperText={
                          methods.formState.errors.address
                            ? methods.formState.errors.address.message?.toString()
                            : undefined
                        }
                        onChange={onChange}
                        value={value}
                        width='w-full'
                      />
                    )}
                  />
                </div>
              </>
            }
            <div className='col-span-4 self-center'>
              <span>Route From</span>
            </div>
            <div className='col-span-8'>
              <Controller
                name="routeFrom"
                control={methods.control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    disabled={state.isDisabled}
                    color={methods.formState.errors.address ? 'error' : undefined}
                    helperText={
                      methods.formState.errors.address
                        ? methods.formState.errors.address.message?.toString()
                        : undefined
                    }
                    onChange={onChange}
                    value={value}
                    width='w-full'
                  />
                )}
              />
            </div>
            <div className='col-span-4 self-center'>
              <span>Route To</span>
            </div>
            <div className='col-span-8'>
              <Controller
                name="routeTo"
                control={methods.control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    disabled={state.isDisabled}
                    color={methods.formState.errors.address ? 'error' : undefined}
                    helperText={
                      methods.formState.errors.address
                        ? methods.formState.errors.address.message?.toString()
                        : undefined
                    }
                    onChange={onChange}
                    value={value}
                    width='w-full'
                  />
                )}
              />
            </div>
            <div className='col-span-4 self-center'>
              <span>Duration Of Flight</span>
            </div>
            <div className='col-span-8'>
              <Controller
                name="durationOfFlight"
                control={methods.control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    disabled={state.isDisabled}
                    color={methods.formState.errors.address ? 'error' : undefined}
                    helperText={
                      methods.formState.errors.address
                        ? methods.formState.errors.address.message?.toString()
                        : undefined
                    }
                    onChange={onChange}
                    type="number"
                    value={value}
                    width='w-full'
                  />
                )}
              />
            </div>
            {isUserLoggedIn &&
              <>
                <div className='col-span-4 self-center'>
                  <span>Single Engine Land</span>
                </div>
                <div className='col-span-8'>
                  <Controller
                    name="singleEngineLand"
                    control={methods.control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        disabled={state.isDisabled}
                        color={methods.formState.errors.address ? 'error' : undefined}
                        helperText={
                          methods.formState.errors.address
                            ? methods.formState.errors.address.message?.toString()
                            : undefined
                        }
                        onChange={onChange}
                        type="number"
                        value={value}
                        width='w-full'
                      />
                    )}
                  />
                </div>
              </>
            }
            {isUserLoggedIn &&
              <>
                <div className='col-span-4 self-center'>
                  <span>Simulator or ATD</span>
                </div>
                <div className='col-span-8'>
                  <Controller
                    name="simulatorAtd"
                    control={methods.control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        disabled={state.isDisabled}
                        color={methods.formState.errors.address ? 'error' : undefined}
                        helperText={
                          methods.formState.errors.address
                            ? methods.formState.errors.address.message?.toString()
                            : undefined
                        }
                        onChange={onChange}
                        type="number"
                        value={value}
                        width='w-full'
                      />
                    )}
                  />
                </div>
              </>
            }
            {isUserLoggedIn &&
              <div className='col-span-12'>
                <Collapse
                  onClick={() => dispatch({ type: 'SET_LANDINGS_COLLAPSE_OPEN', payload: !state.landingsCollapseOpen })}
                  open={state.landingsCollapseOpen}
                >
                  <CollapseTitle>
                    <span>Landings</span>
                  </CollapseTitle>
                  <CollapseContent>
                    <div className='grid grid-cols-12 gap-3'>
                      <div className='col-span-4 self-center'>
                        <span>Day</span>
                      </div>
                      <div className='col-span-8'>
                        <Controller
                          name="landingsDay"
                          control={methods.control}
                          render={({ field: { onChange, value } }) => (
                            <Input
                              disabled={state.isDisabled}
                              color={
                                methods.formState.errors.address ? 'error' : undefined
                              }
                              helperText={
                                methods.formState.errors.address
                                  ? methods.formState.errors.address.message?.toString()
                                  : undefined
                              }
                              onChange={onChange}
                              type="number"
                              value={value}
                              width='w-full'
                            />
                          )}
                        />
                      </div>
                      <div className='col-span-4 self-center'>
                        <span>Night</span>
                      </div>
                      <div className='col-span-8'>
                        <Controller
                          name="landingsNight"
                          control={methods.control}
                          render={({ field: { onChange, value } }) => (
                            <Input
                              disabled={state.isDisabled}
                              color={
                                methods.formState.errors.address ? 'error' : undefined
                              }
                              helperText={
                                methods.formState.errors.address
                                  ? methods.formState.errors.address.message?.toString()
                                  : undefined
                              }
                              onChange={onChange}
                              type="number"
                              value={value}
                              width='w-full'
                            />
                          )}
                        />
                      </div>
                    </div>
                  </CollapseContent>
                </Collapse>
              </div>
            }
            {isUserLoggedIn &&
              <div className='col-span-12'>
                <Collapse
                  onClick={() => dispatch({ type: 'SET_EXPERIENCE_COLLAPSE_OPEN', payload: !state.experienceCollapseOpen })}
                  open={state.experienceCollapseOpen}
                >
                  <CollapseTitle>
                    Type of Pilot Experience or Training
                  </CollapseTitle>
                  <CollapseContent>
                    <div className='grid grid-cols-12 gap-3'>
                      <div className='col-span-4 self-center'>
                        <span>
                          Ground Training Received
                        </span>
                      </div>
                      <div className='col-span-8'>
                        <Controller
                          name="groundTrainingReceived"
                          control={methods.control}
                          render={({ field: { onChange, value } }) => (
                            <Input
                              disabled={state.isDisabled}
                              color={
                                methods.formState.errors.address ? 'error' : undefined
                              }
                              helperText={
                                methods.formState.errors.address
                                  ? methods.formState.errors.address.message?.toString()
                                  : undefined
                              }
                              onChange={onChange}
                              type="number"
                              value={value}
                              width='w-full'
                            />
                          )}
                        />
                      </div>
                      <div className='col-span-4 self-center'>
                        <span>
                          Flight Training Received
                        </span>
                      </div>
                      <div className='col-span-8'>
                        <Controller
                          name="flightTrainingReceived"
                          control={methods.control}
                          render={({ field: { onChange, value } }) => (
                            <Input
                              disabled={state.isDisabled}
                              color={
                                methods.formState.errors.address ? 'error' : undefined
                              }
                              helperText={
                                methods.formState.errors.address
                                  ? methods.formState.errors.address.message?.toString()
                                  : undefined
                              }
                              onChange={onChange}
                              type="number"
                              value={value}
                              width='w-full'
                            />
                          )}
                        />
                      </div>
                      <div className='col-span-4 self-center'>
                        <span>Cross Country</span>
                      </div>
                      <div className='col-span-8'>
                        <Controller
                          name="crossCountry"
                          control={methods.control}
                          render={({ field: { onChange, value } }) => (
                            <Input
                              disabled={state.isDisabled}
                              color={
                                methods.formState.errors.address ? 'error' : undefined
                              }
                              helperText={
                                methods.formState.errors.address
                                  ? methods.formState.errors.address.message?.toString()
                                  : undefined
                              }
                              onChange={onChange}
                              type="number"
                              value={value}
                              width='w-full'
                            />
                          )}
                        />
                      </div>
                      <div className='col-span-4 self-center'>
                        <span>Night</span>
                      </div>
                      <div className='col-span-8'>
                        <Controller
                          name="night"
                          control={methods.control}
                          render={({ field: { onChange, value } }) => (
                            <Input
                              disabled={state.isDisabled}
                              color={
                                methods.formState.errors.address ? 'error' : undefined
                              }
                              helperText={
                                methods.formState.errors.address
                                  ? methods.formState.errors.address.message?.toString()
                                  : undefined
                              }
                              onChange={onChange}
                              type="number"
                              value={value}
                              width='w-full'
                            />
                          )}
                        />
                      </div>
                      <div className='col-span-4 self-center'>
                        <span>Solo</span>
                      </div>
                      <div className='col-span-8'>
                        <Controller
                          name="solo"
                          control={methods.control}
                          render={({ field: { onChange, value } }) => (
                            <Input
                              disabled={state.isDisabled}
                              color={
                                methods.formState.errors.address ? 'error' : undefined
                              }
                              helperText={
                                methods.formState.errors.address
                                  ? methods.formState.errors.address.message?.toString()
                                  : undefined
                              }
                              onChange={onChange}
                              type="number"
                              value={value}
                              width='w-full'
                            />
                          )}
                        />
                      </div>
                      <div className='col-span-4 self-center'>
                        <span>Pilot in Command</span>
                      </div>
                      <div className='col-span-8'>
                        <Controller
                          name="pilotInCommand"
                          control={methods.control}
                          render={({ field: { onChange, value } }) => (
                            <Input
                              disabled={state.isDisabled}
                              color={
                                methods.formState.errors.address ? 'error' : undefined
                              }
                              helperText={
                                methods.formState.errors.address
                                  ? methods.formState.errors.address.message?.toString()
                                  : undefined
                              }
                              onChange={onChange}
                              type="number"
                              value={value}
                              width='w-full'
                            />
                          )}
                        />
                      </div>
                    </div>
                  </CollapseContent>
                </Collapse>
              </div>
            }
            {isUserLoggedIn &&
              <div className='col-span-12'>
                <Collapse
                  onClick={() => dispatch({ type: 'SET_INSTRUMENT_COLLAPSE_OPEN', payload: !state.instrumentCollapseOpen })}
                  open={state.instrumentCollapseOpen}
                >
                  <CollapseTitle>
                    Instrument
                  </CollapseTitle>
                  <CollapseContent>
                    <div className='grid grid-cols-12 gap-3'>
                      <div className='col-span-4 self-center'>
                        <span>Actual</span>
                      </div>
                      <div className='col-span-8'>
                        <Controller
                          name="instrumentActual"
                          control={methods.control}
                          render={({ field: { onChange, value } }) => (
                            <Input
                              disabled={state.isDisabled}
                              color={
                                methods.formState.errors.address ? 'error' : undefined
                              }
                              helperText={
                                methods.formState.errors.address
                                  ? methods.formState.errors.address.message?.toString()
                                  : undefined
                              }
                              onChange={onChange}
                              type="number"
                              value={value}
                              width='w-full'
                            />
                          )}
                        />
                      </div>
                      <div className='col-span-4 self-center'>
                        <span>Simulated</span>
                      </div>
                      <div className='col-span-8'>
                        <Controller
                          name="instrumentSimulated"
                          control={methods.control}
                          render={({ field: { onChange, value } }) => (
                            <Input
                              disabled={state.isDisabled}
                              color={
                                methods.formState.errors.address ? 'error' : undefined
                              }
                              helperText={
                                methods.formState.errors.address
                                  ? methods.formState.errors.address.message?.toString()
                                  : undefined
                              }
                              onChange={onChange}
                              type="number"
                              value={value}
                              width='w-full'
                            />
                          )}
                        />
                      </div>
                      <div className='col-span-4 self-center'>
                        <span>
                          Instrument Approaches
                        </span>
                      </div>
                      <div className='col-span-8'>
                        <Controller
                          name="instrumentApproaches"
                          control={methods.control}
                          render={({ field: { onChange, value } }) => (
                            <Input
                              disabled={state.isDisabled}
                              color={
                                methods.formState.errors.address ? 'error' : undefined
                              }
                              helperText={
                                methods.formState.errors.address
                                  ? methods.formState.errors.address.message?.toString()
                                  : undefined
                              }
                              onChange={onChange}
                              type="number"
                              value={value}
                              width='w-full'
                            />
                          )}
                        />
                      </div>
                      <div className='col-span-4 self-center'>
                        <span>Holds</span>
                      </div>
                      <div className='col-span-8'>
                        <Controller
                          name="instrumentHolds"
                          control={methods.control}
                          render={({ field: { onChange, value } }) => (
                            <Input
                              disabled={state.isDisabled}
                              color={
                                methods.formState.errors.address ? 'error' : undefined
                              }
                              helperText={
                                methods.formState.errors.address
                                  ? methods.formState.errors.address.message?.toString()
                                  : undefined
                              }
                              onChange={onChange}
                              type="number"
                              value={value}
                              width='w-full'
                            />
                          )}
                        />
                      </div>
                      <div className='col-span-4 self-center'>
                        <span>Nav / Track</span>
                      </div>
                      <div className='col-span-8'>
                        <Controller
                          name="instrumentNavTrack"
                          control={methods.control}
                          render={({ field: { onChange, value } }) => (
                            <Input
                              disabled={state.isDisabled}
                              color={
                                methods.formState.errors.address ? 'error' : undefined
                              }
                              helperText={
                                methods.formState.errors.address
                                  ? methods.formState.errors.address.message?.toString()
                                  : undefined
                              }
                              onChange={onChange}
                              type="number"
                              value={value}
                              width='w-full'
                            />
                          )}
                        />
                      </div>
                    </div>
                  </CollapseContent>
                </Collapse>
              </div>
            }
            <div className='col-span-12'>
              <span>Notes</span>
            </div>
            <div className='col-span-12'>
              <Controller
                name="notes"
                control={methods.control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    disabled={state.isDisabled}
                    color={methods.formState.errors.address ? 'error' : undefined}
                    helperText={
                      methods.formState.errors.address
                        ? methods.formState.errors.address.message?.toString()
                        : undefined
                    }
                    onChange={onChange}
                    value={value}
                    width='w-full'
                  />
                )}
              />
            </div>
            <div className='col-span-12 justify-self-end self-center'>
              <Button
                disabled={
                  state.isDisabled && mode.toString() !== FormMode.VIEW
                    ? state.isDisabled
                    : false
                }
                startContent={<Icon iconName={IconName.XMARK} />}
                onClick={onCancel}
                outline={true}
              >
                {mode.toString() !== FormMode.VIEW ? 'Cancel' : 'Close'}
              </Button>
              {mode.toString() !== FormMode.VIEW && (
                <Button
                  color='primary'
                  disabled={state.isDisabled}
                  startContent={<Icon iconName={IconName.SAVE} />}
                  type="submit"
                >
                  Save
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </Drawer>
  );
};

export default LogForm;
