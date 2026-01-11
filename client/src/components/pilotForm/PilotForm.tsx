import { useEffect, useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { IPilotFormProps } from './IPilotFormProps';
import { AxiosError, AxiosResponse } from 'axios';
import { FormMode } from '../../enums/formMode';
import { Person } from '@microsoft/microsoft-graph-types';
// import PilotFormCertificates from '../pilotFormCertificates/PilotFormCertificates';
// import PilotFormEndorsements from '../pilotFormEndorsements/PilotFormEndorsements';
// import PilotFormMedical from '../pilotFormMedical/PilotFormMedical';
import { useOidc } from '../../auth/oidcConfig';
import httpClient from '../../httpClient/httpClient';
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
    <div className='drawer drawer-end'>
      <input type='checkbox' className='drawer-toggle' onChange={() => {}} checked={isDrawerOpen} />
      <div className='drawer-side'>
        <label
          htmlFor='my-drawer-1'
          aria-label='close-sidebar'
          className='drawer-overlay'
        ></label>
        <div className='menu bg-base-100 text-base-content min-h-full p-4' style={{ width: '25%' }}>
          <FormProvider {...methods}>
            <form className='prose max-w-none' onSubmit={methods.handleSubmit(onSubmit)} style={{ paddingBottom: '50px' }}>
              <div className='grid grid-cols-12 gap-3'>
                <div className="col-span-10">
                  <h2 className="mt-0 mb-0 self-center">
                    {`${mode.toString().toLowerCase().charAt(0).toUpperCase() + mode.toString().slice(1).toLowerCase()} Pilot`}
                  </h2>
                </div>
                <div className="col-span-2 justify-self-end self-center">
                  <button className="btn btn-ghost" onClick={onCancel}>
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
                <div className='col-span-3 self-center'>
                  <span>Name *</span>
                </div>
                <div className='col-span-9'>
                  <Controller
                    name="name"
                    control={methods.control}
                    rules={{ required: 'A name is required' }}
                    render={({ field: { onChange, value } }) => (
                      <input
                        type='text'
                        className='input w-full'
                        disabled={isDisabled}
                        onChange={onChange}
                        value={value}
                      />
                    )}
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
                          <input
                            type='text'
                            className='input w-full'
                            disabled={isDisabled}
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
                           <input
                            type='text'
                            className='input w-full'
                            disabled={isDisabled}
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
                          <select
                            className='select w-full'
                            onChange={onChange}
                            value={[value]}
                          >
                            {states.map((state) => (
                              <option key={state.value}>{state.label}</option>
                            ))}
                          </select>
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
                          <input
                            type='text'
                            className='input w-full'
                            disabled={isDisabled}
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
                          <input
                            type='text'
                            className='input w-full'
                            disabled={isDisabled}
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
                          <input
                            type='text'
                            className='input w-full'
                            disabled={isDisabled}
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

              
                <div className='col-span-12 justify-self-end self-center'>
                  <button
                    className='btn'
                    disabled={
                      isDisabled && mode.toString() !== FormMode.VIEW
                        ? isDisabled
                        : false
                    }
                    onClick={onCancel}
                    data-testid="pilot-cancel-button"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                    {mode.toString() !== FormMode.VIEW ? 'Cancel' : 'Close'}
                  </button>
                  {mode.toString() !== FormMode.VIEW && (
                    <button
                      className='btn btn-primary ml-2.5'
                      disabled={isDisabled}
                      type="submit"
                      data-testid="pilot-save-button"
                    >
                      <FontAwesomeIcon icon={faSave} />
                      Save
                    </button>
                  )}
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default PilotForm;
