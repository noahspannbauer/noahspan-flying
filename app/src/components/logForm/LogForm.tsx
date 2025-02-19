import React, { useEffect, useReducer } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  ChevronDownIcon,
  DatePicker,
  Drawer,
  Grid,
  IconButton,
  SaveIcon,
  Select,
  TextField,
  Typography,
  XmarkIcon
} from '@noahspan/noahspan-components';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { ILogFormProps } from './ILogFormProps';
import { initialState, reducer } from './reducer';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { useHttpClient } from '../../hooks/httpClient/UseHttpClient';
import { useAccessToken } from '../../hooks/accessToken/UseAcessToken';
import { useIsAuthenticated } from '@azure/msal-react';
import { FormMode } from '../../enums/formMode';
import { usePilots } from '../../hooks/pilots/UsePilots';

const LogForm: React.FC<ILogFormProps> = ({
  entryId,
  isDrawerOpen,
  mode,
  onOpenClose
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const httpClient: AxiosInstance = useHttpClient();
  const { getAccessToken } = useAccessToken();
  const isAuthenticated = useIsAuthenticated();
  const defaultValues = {
    pilotId: '',
    pilotName: '',
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

  const onCancel = () => {
    methods.reset(defaultValues);
    dispatch({ type: 'SET_IS_DISABLED', payload: false });
    onOpenClose(FormMode.CANCEL);
  };

  const onSubmit = async (data: unknown) => {
    try {
      dispatch({ type: 'SET_IS_LOADING', payload: true });

      const accessToken: string = await getAccessToken();

      if (!entryId) {
        await httpClient.post(`api/logs`, data, {
          headers: {
            Authorization: accessToken
          }
        });
      } else {
        await httpClient.put(`api/logs/log/${entryId}`, data, {
          headers: {
            Authorization: accessToken
          }
        });
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

        const config = isAuthenticated
          ? { headers: { Authorization: await getAccessToken() } }
          : {};
        const response: AxiosResponse = await httpClient.get(
          `api/logs/log/${entryId}`,
          config
        );
        const entry = response.data;

        methods.reset(entry);
      } catch (error) {
        const axiosError = error as AxiosError;

        dispatch({ type: 'SET_ALERT', payload: { severity: 'error', message: axiosError.message }});
      } finally {
        dispatch({ type: 'SET_IS_LOADING', payload: false });
      }
    };

    if (entryId && isDrawerOpen) {
      getEntry();
    }
  }, [entryId]);

  useEffect(() => {
    if (pilots) {
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
      anchor="right"
      PaperProps={{
        sx: {
          padding: '30px',
          width: '33%'
        }
      }}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid size={11}>
              <Typography variant="h4">{`${mode.toString().toLowerCase().charAt(0).toUpperCase() + mode.toString().slice(1).toLowerCase()} Pilot`}</Typography>
            </Grid>
            <Grid display="flex" justifyContent="right" size={1}>
              <IconButton onClick={onCancel}>
                <XmarkIcon />
              </IconButton>
            </Grid>
            {state.alert && (
              <Grid display="flex" justifyContent="center" size={12}>
                <Alert
                  onClose={() =>
                    dispatch({ type: 'SET_ALERT', payload: undefined })
                  }
                  severity={state.alert.severity}
                  sx={{ width: '100%' }}
                >
                  {state.alert.message}
                </Alert>
              </Grid>
            )}
            <Grid alignItems="center" display="flex" size={4}>
              <Typography variant="body1">Pilot *</Typography>
            </Grid>
            <Grid size={8}>
              <Controller
                name="pilotId"
                control={methods.control}
                render={({ field: { onChange, value } }) => {
                  useEffect(() => {
                    if (value && mode !== FormMode.ADD) {
                      const pilot = pilots?.find((pilot) => pilot.id === value);

                      dispatch({
                        type: 'SET_SELECTED_ENTRY_PILOT_NAME',
                        payload: pilot.name
                      });
                    }
                  }, [value]);

                  return (
                    <>
                      {mode === FormMode.ADD && (
                        <Select
                          disabled={state.isDisabled}
                          fullWidth
                          onChange={(event) => {
                            const pilot = pilots?.find(
                              (pilot) => (pilot.id = event.target.value)
                            );

                            if (pilot) {
                              methods.setValue('pilotName', pilot.name);
                            }

                            methods.setValue('pilotId', event.target.value);
                          }}
                          options={
                            state.pilotOptions && state.pilotOptions.length > 0
                              ? state.pilotOptions
                              : []
                          }
                          value={value}
                        />
                      )}
                      {mode !== FormMode.ADD && (
                        <TextField
                          disabled={true}
                          fullWidth
                          value={state.selectedEntryPilotName}
                        />
                      )}
                    </>
                  );
                }}
              />
            </Grid>
            <Grid alignItems="center" display="flex" size={4}>
              <Typography variant="body1">Date *</Typography>
            </Grid>
            <Grid size={8}>
              <Controller
                name="date"
                control={methods.control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    disabled={state.isDisabled}
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Grid>
            <Grid alignItems="center" display="flex" size={4}>
              <Typography variant="body1">Aircraft Make and Model *</Typography>
            </Grid>
            <Grid size={8}>
              <Controller
                name="aircraftMakeModel"
                control={methods.control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    disabled={state.isDisabled}
                    error={methods.formState.errors.address ? true : false}
                    fullWidth
                    helperText={
                      methods.formState.errors.address
                        ? methods.formState.errors.address.message?.toString()
                        : undefined
                    }
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Grid>
            <Grid alignItems="center" display="flex" size={4}>
              <Typography variant="body1">Aircraft Identity *</Typography>
            </Grid>
            <Grid size={8}>
              <Controller
                name="aircraftIdentity"
                control={methods.control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    disabled={state.isDisabled}
                    error={methods.formState.errors.address ? true : false}
                    fullWidth
                    helperText={
                      methods.formState.errors.address
                        ? methods.formState.errors.address.message?.toString()
                        : undefined
                    }
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Grid>
            <Grid alignItems="center" display="flex" size={4}>
              <Typography variant="body1">Route From</Typography>
            </Grid>
            <Grid size={8}>
              <Controller
                name="routeFrom"
                control={methods.control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    disabled={state.isDisabled}
                    error={methods.formState.errors.address ? true : false}
                    fullWidth
                    helperText={
                      methods.formState.errors.address
                        ? methods.formState.errors.address.message?.toString()
                        : undefined
                    }
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Grid>
            <Grid alignItems="center" display="flex" size={4}>
              <Typography variant="body1">Route To</Typography>
            </Grid>
            <Grid size={8}>
              <Controller
                name="routeTo"
                control={methods.control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    disabled={state.isDisabled}
                    error={methods.formState.errors.address ? true : false}
                    fullWidth
                    helperText={
                      methods.formState.errors.address
                        ? methods.formState.errors.address.message?.toString()
                        : undefined
                    }
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Grid>
            <Grid alignItems="center" display="flex" size={4}>
              <Typography variant="body1">Duration Of Flight</Typography>
            </Grid>
            <Grid size={8}>
              <Controller
                name="durationOfFlight"
                control={methods.control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    disabled={state.isDisabled}
                    error={methods.formState.errors.address ? true : false}
                    fullWidth
                    helperText={
                      methods.formState.errors.address
                        ? methods.formState.errors.address.message?.toString()
                        : undefined
                    }
                    onChange={onChange}
                    slotProps={{
                      htmlInput: {
                        step: 0.1
                      }
                    }}
                    type="number"
                    value={value}
                  />
                )}
              />
            </Grid>
            <Grid alignItems="center" display="flex" size={4}>
              <Typography variant="body1">Single Engine Land</Typography>
            </Grid>
            <Grid size={8}>
              <Controller
                name="singleEngineLand"
                control={methods.control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    disabled={state.isDisabled}
                    error={methods.formState.errors.address ? true : false}
                    fullWidth
                    helperText={
                      methods.formState.errors.address
                        ? methods.formState.errors.address.message?.toString()
                        : undefined
                    }
                    onChange={onChange}
                    slotProps={{
                      htmlInput: {
                        step: 0.1
                      }
                    }}
                    type="number"
                    value={value}
                  />
                )}
              />
            </Grid>
            <Grid alignItems="center" display="flex" size={4}>
              <Typography variant="body1">Simulator or ATD</Typography>
            </Grid>
            <Grid size={8}>
              <Controller
                name="simulatorAtd"
                control={methods.control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    disabled={state.isDisabled}
                    error={methods.formState.errors.address ? true : false}
                    fullWidth
                    helperText={
                      methods.formState.errors.address
                        ? methods.formState.errors.address.message?.toString()
                        : undefined
                    }
                    onChange={onChange}
                    slotProps={{
                      htmlInput: {
                        step: 0.1
                      }
                    }}
                    type="number"
                    value={value}
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ChevronDownIcon />}>
                  <Typography variant="body1">Landings</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid alignItems="center" display="flex" size={4}>
                      <Typography variant="body1">Day</Typography>
                    </Grid>
                    <Grid size={8}>
                      <Controller
                        name="landingsDay"
                        control={methods.control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            disabled={state.isDisabled}
                            error={
                              methods.formState.errors.address ? true : false
                            }
                            fullWidth
                            helperText={
                              methods.formState.errors.address
                                ? methods.formState.errors.address.message?.toString()
                                : undefined
                            }
                            onChange={onChange}
                            slotProps={{
                              htmlInput: {
                                step: 1
                              }
                            }}
                            type="number"
                            value={value}
                          />
                        )}
                      />
                    </Grid>
                    <Grid alignItems="center" display="flex" size={4}>
                      <Typography variant="body1">Night</Typography>
                    </Grid>
                    <Grid size={8}>
                      <Controller
                        name="landingsNight"
                        control={methods.control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            disabled={state.isDisabled}
                            error={
                              methods.formState.errors.address ? true : false
                            }
                            fullWidth
                            helperText={
                              methods.formState.errors.address
                                ? methods.formState.errors.address.message?.toString()
                                : undefined
                            }
                            onChange={onChange}
                            slotProps={{
                              htmlInput: {
                                step: 1
                              }
                            }}
                            type="number"
                            value={value}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid size={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDownIcon />}>
                  Instrument
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid alignItems="center" display="flex" size={4}>
                      <Typography variant="body1">Actual</Typography>
                    </Grid>
                    <Grid size={8}>
                      <Controller
                        name="instrumentActual"
                        control={methods.control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            disabled={state.isDisabled}
                            error={
                              methods.formState.errors.address ? true : false
                            }
                            fullWidth
                            helperText={
                              methods.formState.errors.address
                                ? methods.formState.errors.address.message?.toString()
                                : undefined
                            }
                            onChange={onChange}
                            slotProps={{
                              htmlInput: {
                                step: 0.1
                              }
                            }}
                            type="number"
                            value={value}
                          />
                        )}
                      />
                    </Grid>
                    <Grid alignItems="center" display="flex" size={4}>
                      <Typography variant="body1">Simulated</Typography>
                    </Grid>
                    <Grid size={8}>
                      <Controller
                        name="instrumentSimulated"
                        control={methods.control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            disabled={state.isDisabled}
                            error={
                              methods.formState.errors.address ? true : false
                            }
                            fullWidth
                            helperText={
                              methods.formState.errors.address
                                ? methods.formState.errors.address.message?.toString()
                                : undefined
                            }
                            onChange={onChange}
                            slotProps={{
                              htmlInput: {
                                step: 0.1
                              }
                            }}
                            type="number"
                            value={value}
                          />
                        )}
                      />
                    </Grid>
                    <Grid alignItems="center" display="flex" size={4}>
                      <Typography variant="body1">
                        Instrument Approaches
                      </Typography>
                    </Grid>
                    <Grid size={8}>
                      <Controller
                        name="instrumentApproaches"
                        control={methods.control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            disabled={state.isDisabled}
                            error={
                              methods.formState.errors.address ? true : false
                            }
                            fullWidth
                            helperText={
                              methods.formState.errors.address
                                ? methods.formState.errors.address.message?.toString()
                                : undefined
                            }
                            onChange={onChange}
                            slotProps={{
                              htmlInput: {
                                step: 1
                              }
                            }}
                            type="number"
                            value={value}
                          />
                        )}
                      />
                    </Grid>
                    <Grid alignItems="center" display="flex" size={4}>
                      <Typography variant="body1">Holds</Typography>
                    </Grid>
                    <Grid size={8}>
                      <Controller
                        name="instrumentHolds"
                        control={methods.control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            disabled={state.isDisabled}
                            error={
                              methods.formState.errors.address ? true : false
                            }
                            fullWidth
                            helperText={
                              methods.formState.errors.address
                                ? methods.formState.errors.address.message?.toString()
                                : undefined
                            }
                            onChange={onChange}
                            slotProps={{
                              htmlInput: {
                                step: 1
                              }
                            }}
                            type="number"
                            value={value}
                          />
                        )}
                      />
                    </Grid>
                    <Grid alignItems="center" display="flex" size={4}>
                      <Typography variant="body1">Nav / Track</Typography>
                    </Grid>
                    <Grid size={8}>
                      <Controller
                        name="instrumentNavTrack"
                        control={methods.control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            disabled={state.isDisabled}
                            error={
                              methods.formState.errors.address ? true : false
                            }
                            fullWidth
                            helperText={
                              methods.formState.errors.address
                                ? methods.formState.errors.address.message?.toString()
                                : undefined
                            }
                            onChange={onChange}
                            slotProps={{
                              htmlInput: {
                                step: 1
                              }
                            }}
                            type="number"
                            value={value}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid size={12}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ChevronDownIcon />}>
                  Type of Pilot Experience or Training
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid alignItems="center" display="flex" size={4}>
                      <Typography variant="body1">
                        Ground Training Received
                      </Typography>
                    </Grid>
                    <Grid size={8}>
                      <Controller
                        name="groundTrainingReceived"
                        control={methods.control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            disabled={state.isDisabled}
                            error={
                              methods.formState.errors.address ? true : false
                            }
                            fullWidth
                            helperText={
                              methods.formState.errors.address
                                ? methods.formState.errors.address.message?.toString()
                                : undefined
                            }
                            onChange={onChange}
                            slotProps={{
                              htmlInput: {
                                step: 0.1
                              }
                            }}
                            type="number"
                            value={value}
                          />
                        )}
                      />
                    </Grid>
                    <Grid alignItems="center" display="flex" size={4}>
                      <Typography variant="body1">
                        Flight Training Received
                      </Typography>
                    </Grid>
                    <Grid size={8}>
                      <Controller
                        name="flightTrainingReceived"
                        control={methods.control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            disabled={state.isDisabled}
                            error={
                              methods.formState.errors.address ? true : false
                            }
                            fullWidth
                            helperText={
                              methods.formState.errors.address
                                ? methods.formState.errors.address.message?.toString()
                                : undefined
                            }
                            onChange={onChange}
                            slotProps={{
                              htmlInput: {
                                step: 0.1
                              }
                            }}
                            type="number"
                            value={value}
                          />
                        )}
                      />
                    </Grid>
                    <Grid alignItems="center" display="flex" size={4}>
                      <Typography variant="body1">Cross Country</Typography>
                    </Grid>
                    <Grid size={8}>
                      <Controller
                        name="crossCountry"
                        control={methods.control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            disabled={state.isDisabled}
                            error={
                              methods.formState.errors.address ? true : false
                            }
                            fullWidth
                            helperText={
                              methods.formState.errors.address
                                ? methods.formState.errors.address.message?.toString()
                                : undefined
                            }
                            onChange={onChange}
                            slotProps={{
                              htmlInput: {
                                step: 0.1
                              }
                            }}
                            type="number"
                            value={value}
                          />
                        )}
                      />
                    </Grid>
                    <Grid alignItems="center" display="flex" size={4}>
                      <Typography variant="body1">Night</Typography>
                    </Grid>
                    <Grid size={8}>
                      <Controller
                        name="night"
                        control={methods.control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            disabled={state.isDisabled}
                            error={
                              methods.formState.errors.address ? true : false
                            }
                            fullWidth
                            helperText={
                              methods.formState.errors.address
                                ? methods.formState.errors.address.message?.toString()
                                : undefined
                            }
                            onChange={onChange}
                            slotProps={{
                              htmlInput: {
                                step: 0.1
                              }
                            }}
                            type="number"
                            value={value}
                          />
                        )}
                      />
                    </Grid>
                    <Grid alignItems="center" display="flex" size={4}>
                      <Typography variant="body1">Solo</Typography>
                    </Grid>
                    <Grid size={8}>
                      <Controller
                        name="solo"
                        control={methods.control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            disabled={state.isDisabled}
                            error={
                              methods.formState.errors.address ? true : false
                            }
                            fullWidth
                            helperText={
                              methods.formState.errors.address
                                ? methods.formState.errors.address.message?.toString()
                                : undefined
                            }
                            onChange={onChange}
                            slotProps={{
                              htmlInput: {
                                step: 0.1
                              }
                            }}
                            type="number"
                            value={value}
                          />
                        )}
                      />
                    </Grid>
                    <Grid alignItems="center" display="flex" size={4}>
                      <Typography variant="body1">Pilot in Command</Typography>
                    </Grid>
                    <Grid size={8}>
                      <Controller
                        name="pilotInCommand"
                        control={methods.control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            disabled={state.isDisabled}
                            error={
                              methods.formState.errors.address ? true : false
                            }
                            fullWidth
                            helperText={
                              methods.formState.errors.address
                                ? methods.formState.errors.address.message?.toString()
                                : undefined
                            }
                            onChange={onChange}
                            slotProps={{
                              htmlInput: {
                                step: 0.1
                              }
                            }}
                            type="number"
                            value={value}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid size={4}>
              <Typography variant="body1">Notes</Typography>
            </Grid>
            <Grid size={8}>
              <Controller
                name="notes"
                control={methods.control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    disabled={state.isDisabled}
                    error={methods.formState.errors.address ? true : false}
                    fullWidth
                    helperText={
                      methods.formState.errors.address
                        ? methods.formState.errors.address.message?.toString()
                        : undefined
                    }
                    multiline
                    rows={3}
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Grid>
            <Grid display="flex" gap={2} justifyContent="right" size={12}>
              <Button
                disabled={
                  state.isDisabled && mode.toString() !== FormMode.VIEW
                    ? state.isDisabled
                    : false
                }
                startIcon={<XmarkIcon />}
                variant="outlined"
                onClick={onCancel}
                size="small"
              >
                {mode.toString() !== FormMode.VIEW ? 'Cancel' : 'Close'}
              </Button>
              {mode.toString() !== FormMode.VIEW && (
                <Button
                  disabled={state.isDisabled}
                  startIcon={<SaveIcon />}
                  size="small"
                  type="submit"
                  variant="contained"
                >
                  Save
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Drawer>
  );
};

export default LogForm;
