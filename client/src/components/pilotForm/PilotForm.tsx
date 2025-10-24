import { useEffect, useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import {
  // Button,
  // Drawer,
  Icon,
  IconButton,
  IconName,
  // Input,
  PeoplePicker,
  StateSelect
} from '@noahspan/noahspan-components';
import { IPilotFormProps } from './IPilotFormProps';
import { AxiosError, AxiosResponse } from 'axios';
import { FormMode } from '../../enums/formMode';
import { Person } from '@microsoft/microsoft-graph-types';
import PilotFormCertificates from '../pilotFormCertificates/PilotFormCertificates';
import PilotFormEndorsements from '../pilotFormEndorsements/PilotFormEndorsements';
import PilotFormMedical from '../pilotFormMedical/PilotFormMedical';
import { useOidc } from '../../auth/oidcConfig';
import { getOidc } from '../../auth/oidcConfig';
import httpClient from '../../httpClient/httpClient';
import { Button, Drawer, DrawerHeader, DrawerContent, DrawerBody, DrawerFooter, Input } from '@heroui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const PilotForm: React.FC<IPilotFormProps> = ({
  pilotId,
  isDrawerOpen,
  mode,
  onOpenClose
}: IPilotFormProps) => {
  const [peoplePickerValue, setPeoplePickerValue] = useState<string>('');
  const [peoplePickerResults, setPeoplePickerResults] = useState<any[]>([]);
  const [isPeoplePickerLoading, setIsPeoplePickerLoading] =
    useState<boolean>(false);
  const [selectedPerson, setSelectedPerson] = useState<Person>({
    displayName: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isUserLoggedIn } = useOidc();
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

  const onPeoplePickerSearch = async (
    value: string
  ) => {
    setIsPeoplePickerLoading(true);
    setPeoplePickerValue(value)
    
    try {
      if (value !== '') {
        const searchString: string = value;
        const oidc = await getOidc();
        const response: AxiosResponse = await httpClient.get(
          `api/msgraph/search?search=${searchString}`, {
            headers: {
              Authorization: oidc.isUserLoggedIn ? `Bearer ${(await oidc.getTokens()).accessToken}` : ''
            }
          }
        );
        console.log(response)
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

  const onPersonSelected = (person: Person) => {
    methods.setValue('name', person.displayName!.toString());
    setPeoplePickerValue(person.displayName!);
    setPeoplePickerResults([])
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

      if (!pilotId) {
        await httpClient.post(`api/pilots`, data);
      } else {
        await httpClient.put(`api/pilots/pilot/${pilotId}`, data)
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

        const response: AxiosResponse = await httpClient.get(
          `api/pilots/${pilotId}`
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
      closeButton={
        <Button isIconOnly>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
      }
      isOpen={isDrawerOpen}
      placement='right'
      data-testid="pilot-drawer"
      onClose={onCancel}
      size='xl'
    >
      <DrawerContent>
        <FormProvider {...methods}>
          <form className='prose max-w-none' onSubmit={methods.handleSubmit(onSubmit)} style={{ paddingBottom: '50px' }}>
            <DrawerHeader>
              {`${mode.toString().toLowerCase().charAt(0).toUpperCase() + mode.toString().slice(1).toLowerCase()} Pilot`}
            </DrawerHeader>
            <DrawerBody>
            <div className='grid grid-cols-12 gap-3'>
              <div className='col-span-3 self-center'>
                <h6>Name *</h6>
              </div>
              <div className='col-span-9'>
                <PeoplePicker
                  disabled={isDisabled}
                  // loading={isPeoplePickerLoading}
                  onInputChanged={onPeoplePickerSearch}
                  onPersonSelected={onPersonSelected}
                  people={peoplePickerResults}
                  value={peoplePickerValue}
                  width='w-full'
                />
              </div>
              {isUserLoggedIn &&
                <>
                  <div className='col-span-3 self-center'>
                    <span>Address *</span>
                  </div>
                  <div className='col-span-9'>
                    <Controller
                      name="address"
                      control={methods.control}
                      rules={{ required: 'An address is required' }}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          disabled={isDisabled}
                          color={methods.formState.errors.address ? 'danger' : undefined}
                          errorMessage={
                            methods.formState.errors.address
                              ? methods.formState.errors.address.message
                              : undefined
                          }
                          fullWidth={true}
                          onChange={onChange}
                          value={value}
                        />
                      )}
                    />
                  </div>
                  <div className='col-span-3 self-center'>
                    <h6>City *</h6>
                  </div>
                  <div className='col-span-9'>
                    <Controller
                      name="city"
                      control={methods.control}
                      rules={{ required: 'A city is required' }}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          disabled={isDisabled}
                          color={methods.formState.errors.city ? 'danger' : undefined}
                          errorMessage={
                            methods.formState.errors.city
                              ? methods.formState.errors.city.message
                              : undefined
                          }
                          fullWidth={true}
                          onChange={onChange}
                          value={value}
                        />
                      )}
                    />
                  </div>
                  <div className='col-span-3 self-center'>
                    <h6>State *</h6>
                  </div>
                  <div className='col-span-9'>
                    <Controller
                      name="state"
                      control={methods.control}
                      rules={{ required: 'A state must be selected' }}
                      render={({ field: { onChange, value } }) => (
                        <StateSelect
                          disabled={isDisabled}
                          // error={methods.formState.errors.state ? true : false}
                          // helperText={
                          //   methods.formState.errors.state
                          //     ? methods.formState.errors.state.message?.toString()
                          //     : undefined
                          // }
                          onChange={onChange}
                          value={value}
                          width='w-full'
                          data-testid="pilot-form-state-dropdown"
                        />
                      )}
                    />
                  </div>
                  <div className='col-span-3 self-center'>
                    <h6>Postal Code *</h6>
                  </div>
                  <div className='col-span-9'>
                    <Controller
                      name="postalCode"
                      control={methods.control}
                      rules={{ required: 'A postal code is required' }}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          disabled={isDisabled}
                          color={methods.formState.errors.postalCode ? 'danger' : undefined}
                          errorMessage={
                            methods.formState.errors.postalCode
                              ? methods.formState.errors.postalCode.message
                              : undefined
                          }
                          fullWidth={true}
                          onChange={onChange}
                          value={value}
                        />
                      )}
                    />
                  </div>
                  <div className='col-span-3 self-center'>
                    <h6>Email</h6>
                  </div>
                  <div className='col-span-9'>
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
                        <Input
                          disabled={isDisabled}
                          color={methods.formState.errors.email ? 'danger' : undefined}
                          errorMessage={
                            methods.formState.errors.email
                              ? methods.formState.errors.email.message
                              : undefined
                          }
                          fullWidth={true}
                          onChange={onChange}
                          value={value}
                        />
                      )}
                    />
                  </div>
                  <div className='col-span-3 self-center'>
                    <h6>Phone Number</h6>
                  </div>
                  <div className='col-span-9'>
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
                        <Input
                          disabled={isDisabled}
                          color={methods.formState.errors.phone ? 'danger' : undefined}
                          errorMessage={
                            methods.formState.errors.phone
                              ? methods.formState.errors.phone.message
                              : undefined
                          }
                          fullWidth={true}
                          onChange={onChange}
                          value={value}
                        />
                      )}
                    />
                  </div>
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
              {/* <div className='col-span-12 justify-self-end self-center'> */}

              {/* </div> */}
            </div>
            </DrawerBody>
              <DrawerFooter>
                <Button
                  disabled={
                    isDisabled && mode.toString() !== FormMode.VIEW
                      ? isDisabled
                      : false
                  }
                  startContent={<Icon iconName={IconName.XMARK} />}
                  onPress={onCancel}
                  data-testid="pilot-cancel-button"
                >
                  {mode.toString() !== FormMode.VIEW ? 'Cancel' : 'Close'}
                </Button>
                {mode.toString() !== FormMode.VIEW && (
                  <Button
                    color='primary'
                    disabled={isDisabled}
                    startContent={<Icon iconName={IconName.SAVE} />}
                    type="submit"
                    data-testid="pilot-save-button"
                  >
                    Save
                  </Button>
                )}
              </DrawerFooter>
          </form>
        </FormProvider>
      </DrawerContent>
    </Drawer>
  );
};

export default PilotForm;
