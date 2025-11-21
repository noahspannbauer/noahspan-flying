import { Key, useEffect, useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { IPilotFormProps } from './IPilotFormProps';
import { AxiosError, AxiosResponse } from 'axios';
import { FormMode } from '../../enums/formMode';
import { Person } from '@microsoft/microsoft-graph-types';
import PilotFormCertificates from '../pilotFormCertificates/PilotFormCertificates';
import PilotFormEndorsements from '../pilotFormEndorsements/PilotFormEndorsements';
import PilotFormMedical from '../pilotFormMedical/PilotFormMedical';
import { useOidc } from '../../auth/oidcConfig';
import httpClient from '../../httpClient/httpClient';
import { Button, Drawer, DrawerHeader, DrawerContent, DrawerBody, DrawerFooter, Input, Autocomplete, AutocompleteItem, SelectItem, Select } from '@heroui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faXmark } from '@fortawesome/free-solid-svg-icons';
import { states } from './states';

const PilotForm: React.FC<IPilotFormProps> = ({
  pilotId,
  isDrawerOpen,
  mode,
  onOpenClose
}: IPilotFormProps) => {
  const [peoplePickerValue, setPeoplePickerValue] = useState<string>('');
  const [peoplePickerResults, setPeoplePickerResults] = useState<Person[]>([]);
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
    userId: ''
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
        const response: AxiosResponse = await httpClient.get(
          `api/msgraph/search?search=${searchString}`
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

  const onPersonSelected = (userPrincipalName: string) => {
    const person: Person | undefined = peoplePickerResults.find((person) => person.userPrincipalName === userPrincipalName as string);

    methods.setValue('name', person?.displayName!);
    methods.setValue('userId', person?.userPrincipalName!);
    setPeoplePickerValue(person?.displayName!);
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

        setPeoplePickerValue(pilot.name);
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
                <Autocomplete
                  inputValue={peoplePickerValue}
                  isLoading={isPeoplePickerLoading}
                  items={peoplePickerResults}
                  onInputChange={onPeoplePickerSearch}
                  onSelectionChange={(key: Key | null) => onPersonSelected(key as string)}
                >
                  {peoplePickerResults.map((person: Person) => (
                    <AutocompleteItem key={person.userPrincipalName}>
                      {person.displayName}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
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
                        <Select
                          onChange={onChange}
                          selectedKeys={[value]}
                        >
                          {states.map((state) => (
                            <SelectItem key={state.value}>{state.label}</SelectItem>
                          ))}
                        </Select>
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
                  startContent={<FontAwesomeIcon icon={faXmark} />}
                  onPress={onCancel}
                  data-testid="pilot-cancel-button"
                >
                  {mode.toString() !== FormMode.VIEW ? 'Cancel' : 'Close'}
                </Button>
                {mode.toString() !== FormMode.VIEW && (
                  <Button
                    color='primary'
                    disabled={isDisabled}
                    startContent={<FontAwesomeIcon icon={faSave} />}
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
