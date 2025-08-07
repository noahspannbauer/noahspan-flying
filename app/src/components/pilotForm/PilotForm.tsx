import { useEffect, useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import {
  Button,
  Drawer,
  Grid,
  Icon,
  IconButton,
  IconName,
  PeoplePicker,
  StateSelect,
  TextField,
  theme,
  Typography,
  useMediaQuery
} from '@noahspan/noahspan-components';
import { IPilotFormProps } from './IPilotFormProps';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { useHttpClient } from '../../hooks/httpClient/UseHttpClient';
import { useAccessToken } from '../../hooks/accessToken/UseAcessToken';
import { useIsAuthenticated } from '@azure/msal-react';
import { FormMode } from '../../enums/formMode';
import { Person } from '@microsoft/microsoft-graph-types';
import PilotFormCertificates from '../pilotFormCertificates/PilotFormCertificates';
import PilotFormEndorsements from '../pilotFormEndorsements/PilotFormEndorsements';
import PilotFormMedical from '../pilotFormMedical/PilotFormMedical';

const PilotForm: React.FC<IPilotFormProps> = ({
  pilotId,
  isDrawerOpen,
  mode,
  onOpenClose
}: IPilotFormProps) => {
  const httpClient: AxiosInstance = useHttpClient();
  const [peoplePickerResults, setPeoplePickerResults] = useState<any[]>([]);
  const [isPeoplePickerLoading, setIsPeoplePickerLoading] =
    useState<boolean>(false);
  const [selectedPerson, setSelectedPerson] = useState<Person>({
    displayName: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getAccessToken } = useAccessToken();
  const isAuthenticated = useIsAuthenticated();
  const defaultValues = {
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    email: '',
    phone: '',
  };
  const methods = useForm({
    defaultValues: defaultValues
  });
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const isMedium = useMediaQuery(theme.breakpoints.up('md'));

  const onPeoplePickerSearch = async (
    _event: React.SyntheticEvent,
    value: string
  ) => {
    setIsPeoplePickerLoading(true);

    try {
      if (value !== '') {
        const searchString: string = value;
        const accessToken: string = await getAccessToken();
        const response: AxiosResponse = await httpClient.get(
          `api/user/search?search=${searchString}`,
          {
            headers: {
              Authorization: accessToken
            }
          }
        );

        setPeoplePickerResults(response.data);
      } else {
        setPeoplePickerResults([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsPeoplePickerLoading(false);
    }
  };

  const onPeoplePickerSelectionChange = (
    _event: React.SyntheticEvent,
    value: Person,
    _reason: string
  ) => {
    methods.setValue('name', value.displayName!.toString());
    setSelectedPerson(value);
  };

  const onCancel = () => {
    methods.reset(defaultValues);
    onOpenClose(FormMode.CANCEL);
    setSelectedPerson({ userPrincipalName: '', displayName: '' });
    setIsDisabled(false)
  };

  const onSubmit = async (data: unknown) => {
    try {
      setIsLoading(true);

      const accessToken: string = await getAccessToken();

      if (!pilotId) {
        await httpClient.post(`api/pilots`, data, {
          headers: {
            Authorization: accessToken
          }
        });
      } else {
        await httpClient.put(`api/pilots/pilot/${pilotId}`, data, {
          headers: {
            Authorization: accessToken
          }
        })
      }

      methods.reset(defaultValues)
      onOpenClose(FormMode.CANCEL);
    } catch (error) {
      const axiosError = error as AxiosError;
      const responseData = axiosError.response?.data as any;

      console.log(responseData.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mode === FormMode.VIEW) {
      setIsDisabled(true);
    }
  }, [mode]);

  useEffect(() => {
    const getPilot = async () => {
      try {
        setIsLoading(true);

        const config = isAuthenticated
          ? { headers: { Authorization: await getAccessToken() } }
          : {};
        const response: AxiosResponse = await httpClient.get(
          `api/pilots/${pilotId}`,
          config
        );
        const pilot = response.data;

        setSelectedPerson({
          displayName: pilot.name
        });
        methods.reset(pilot);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (pilotId) {
      getPilot();
    }
  }, [pilotId]);

  return (
    <Drawer
      open={isDrawerOpen}
      anchor="right"
      data-testid="pilot-drawer"
      PaperProps={{
        sx: {
          padding: '30px',
          width: isMedium ? '33%' : '75%'
        }
      }}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} style={{ paddingBottom: '50px' }}>
          <Grid container spacing={2}>
            <Grid size={11}>
              <Typography variant="h4">{`${mode.toString().toLowerCase().charAt(0).toUpperCase() + mode.toString().slice(1).toLowerCase()} Pilot`}</Typography>
            </Grid>
            <Grid display="flex" justifyContent="right" size={1}>
              <IconButton onClick={onCancel}>
                <Icon iconName={IconName.XMARK} />
              </IconButton>
            </Grid>
            <Grid size={isMedium ? 3 : 12}>
              <Typography variant="h6">Name *</Typography>
            </Grid>
            <Grid size={isMedium ? 9 : 12}>
              <PeoplePicker
                disabled={isDisabled}
                loading={isPeoplePickerLoading}
                onInputChanged={onPeoplePickerSearch}
                onSelectionChanged={onPeoplePickerSelectionChange}
                options={peoplePickerResults}
                value={selectedPerson}
              />
            </Grid>
            {isAuthenticated &&
              <>
                <Grid size={isMedium ? 3 : 12}>
                  <Typography variant="h6">Address *</Typography>
                </Grid>
                <Grid size={isMedium ? 9 : 12}>
                  <Controller
                    name="address"
                    control={methods.control}
                    rules={{ required: 'An address is required' }}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        disabled={isDisabled}
                        error={methods.formState.errors.address ? true : false}
                        fullWidth
                        helperText={
                          methods.formState.errors.address
                            ? methods.formState.errors.address.message
                            : undefined
                        }
                        onChange={onChange}
                        value={value}
                      />
                    )}
                  />
                </Grid>
                <Grid size={isMedium ? 3 : 12}>
                  <Typography variant="h6">City *</Typography>
                </Grid>
                <Grid size={isMedium ? 9 : 12}>
                  <Controller
                    name="city"
                    control={methods.control}
                    rules={{ required: 'A city is required' }}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        disabled={isDisabled}
                        error={methods.formState.errors.city ? true : false}
                        fullWidth
                        helperText={
                          methods.formState.errors.city
                            ? methods.formState.errors.city.message
                            : undefined
                        }
                        onChange={onChange}
                        value={value}
                      />
                    )}
                  />
                </Grid>
                <Grid size={isMedium ? 3 : 12}>
                  <Typography variant="h6">State *</Typography>
                </Grid>
                <Grid size={isMedium ? 9 : 12}>
                  <Controller
                    name="state"
                    control={methods.control}
                    rules={{ required: 'A state must be selected' }}
                    render={({ field: { onChange, value } }) => (
                      <StateSelect
                        disabled={isDisabled}
                        // error={methods.formState.errors.state ? true : false}
                        fullWidth
                        // helperText={
                        //   methods.formState.errors.state
                        //     ? methods.formState.errors.state.message?.toString()
                        //     : undefined
                        // }
                        onChange={onChange}
                        value={value}
                        variant="outlined"
                        data-testid="pilot-form-state-dropdown"
                      />
                    )}
                  />
                </Grid>
                <Grid size={isMedium ? 3 : 12}>
                  <Typography variant="h6">Postal Code *</Typography>
                </Grid>
                <Grid size={isMedium ? 9 : 12}>
                  <Controller
                    name="postalCode"
                    control={methods.control}
                    rules={{ required: 'A postal code is required' }}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        disabled={isDisabled}
                        error={methods.formState.errors.postalCode ? true : false}
                        fullWidth
                        helperText={
                          methods.formState.errors.postalCode
                            ? methods.formState.errors.postalCode.message
                            : undefined
                        }
                        onChange={onChange}
                        value={value}
                      />
                    )}
                  />
                </Grid>
                <Grid size={isMedium ? 3 : 12}>
                  <Typography variant="h6">Email</Typography>
                </Grid>
                <Grid size={isMedium ? 9 : 12}>
                  <Controller
                    name="email"
                    control={methods.control}
                    rules={{
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    }}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        disabled={isDisabled}
                        fullWidth
                        error={methods.formState.errors.email ? true : false}
                        helperText={
                          methods.formState.errors.email
                            ? methods.formState.errors.email.message
                            : undefined
                        }
                        onChange={onChange}
                        value={value}
                      />
                    )}
                  />
                </Grid>
                <Grid size={isMedium ? 3 : 12}>
                  <Typography variant="h6">Phone Number</Typography>
                </Grid>
                <Grid size={isMedium ? 9 : 12}>
                  <Controller
                    name="phone"
                    control={methods.control}
                    rules={{
                      pattern: {
                        value: /^[0-9]{3}[-\s\.][0-9]{3}[-\s\.][0-9]{4}$/i,
                        message: 'Enter phone number as 123-456-7890'
                      }
                    }}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        disabled={isDisabled}
                        fullWidth
                        error={methods.formState.errors.phone ? true : false}
                        helperText={
                          methods.formState.errors.phone
                            ? methods.formState.errors.phone.message
                            : undefined
                        }
                        onChange={onChange}
                        value={value}
                      />
                    )}
                  />
                </Grid>
              </>
            }
            {/* {isAuthenticated &&
              <Grid size={12}>
                <PilotFormMedical
                  isDisabled={isDisabled}
                />
              </Grid>
            }
            <Grid size={12}>
              <PilotFormCertificates isDisabled={isDisabled} mode={mode} />
            </Grid>
            <Grid size={12}>
              <PilotFormEndorsements isDisabled={isDisabled} mode={mode} />
            </Grid> */}
            <Grid display="flex" gap={2} justifyContent="right" size={12}>
              <Button
                disabled={
                  isDisabled && mode.toString() !== FormMode.VIEW
                    ? isDisabled
                    : false
                }
                startIcon={<Icon iconName={IconName.XMARK} />}
                variant="outlined"
                onClick={onCancel}
                data-testid="pilot-cancel-button"
                size="small"
              >
                {mode.toString() !== FormMode.VIEW ? 'Cancel' : 'Close'}
              </Button>
              {mode.toString() !== FormMode.VIEW && (
                <Button
                  disabled={isDisabled}
                  startIcon={<Icon iconName={IconName.SAVE} />}
                  size="small"
                  type="submit"
                  variant="contained"
                  data-testid="pilot-save-button"
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

export default PilotForm;
