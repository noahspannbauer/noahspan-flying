import { useEffect, useState } from 'react';
import {
  useForm,
  Controller,
  FormProvider,
  FieldValues
} from 'react-hook-form';
import {
  Button,
  DatePicker,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerFooter,
  Input,
  Option,
  PeoplePicker,
  SaveIcon,
  Select,
  StateSelect,
  Typography,
  XmarkIcon
} from '@noahspan/noahspan-components';
import { IPilotFormProps } from './IPilotFormProps';
import PilotFormCertificates from '../pilotFormCertificates/PilotFormCertificates';
import PilotFormEndorsements from '../pilotFormEndorsements/PilotFormEndorsements';
import { Person } from '@microsoft/microsoft-graph-types';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { useHttpClient } from '../../hooks/httpClient/UseHttpClient';
import { useAccessToken } from '../../hooks/accessToken/UseAcessToken';
import { IPilotFormCertificates } from '../pilotFormCertificates/IPilotFormCertificates';
import { IPilotFormEndorsements } from '../pilotFormEndorsements/IPilotFormEndorsements';
import { EventMessage, EventPayload, EventType } from '@azure/msal-browser';

const PilotForm: React.FC<IPilotFormProps> = ({
  pilotId,
  isDrawerOpen,
  onOpenCloseDrawer
}: IPilotFormProps) => {
  const httpClient: AxiosInstance = useHttpClient();
  const [peoplePickerResults, setPeoplePickerResults] = useState<Person[]>([]);
  const [isPeoplePickerLoading, setIsPeoplePickerLoading] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getAccessToken } = useAccessToken();
  const methods = useForm();

  const handlePeoplePickerOnClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const divElement: HTMLDivElement = event.target as HTMLDivElement;

    methods.setValue('id', divElement.id);
    methods.setValue('name', divElement.textContent);
    setPeoplePickerResults([]);
  };

  const handlePeoplePickerOnChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsPeoplePickerLoading(true);

    try {
      methods.setValue('name', event.target.value);

      const searchString: string = event.target.value;
      const accessToken: string = await getAccessToken();
      const response: AxiosResponse = await httpClient.get(
        `api/personSearch?search=${searchString}`,
        {
          headers: {
            Authorization: accessToken
          }
        }
      );
      console.log(response);
      setPeoplePickerResults(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsPeoplePickerLoading(false);
    }
  };

  const onSubmit = async (data: unknown) => {
    try {
      setIsLoading(true);

      const accessToken: string = await getAccessToken();
      const response: AxiosResponse = await httpClient.post(
        `api/pilots`,
        data,
        {
          headers: {
            Authorization: accessToken
          }
        }
      );

      if (response) console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errResp = error.response;

        console.log(errResp?.data.message);
      } else {
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(methods.formState.errors);
  }, [methods.formState.errors]);

  return (
    <Drawer
      open={isDrawerOpen}
      placement="right"
      size={1000}
      data-testid="pilot-drawer"
    >
      <FormProvider {...methods}>
        <DrawerHeader text="Add Pilot" onClose={onOpenCloseDrawer} />
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <DrawerBody>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <Typography variant="h6">Name *</Typography>
              </div>
              <div className="col-span-3">
                <Controller
                  name="name"
                  control={methods.control}
                  rules={{ required: 'A name must be selected' }}
                  render={({ field: { disabled, value } }) => (
                    <PeoplePicker
                      results={peoplePickerResults}
                      inputProps={{
                        disabled: disabled,
                        labelProps: {
                          className: 'before:content-none after:content-none'
                        },
                        onChange: (event) => handlePeoplePickerOnChange(event),
                        error: methods.formState.errors.name ? true : false,
                        helperText: methods.formState.errors.name
                          ? methods.formState.errors.name.message?.toString()
                          : undefined,
                        value: value
                      }}
                      listItemProps={{
                        children: null,
                        onClick: handlePeoplePickerOnClick
                      }}
                      loading={isPeoplePickerLoading}
                      data-testid="pilot-form-people-picker"
                    />
                  )}
                />
              </div>
              <div className="col-span-1">
                <Typography variant="h6">Address *</Typography>
              </div>
              <div className="col-span-3">
                <Controller
                  name="address"
                  control={methods.control}
                  rules={{ required: 'An address is required' }}
                  render={({ field: { disabled, onChange, value } }) => (
                    <Input
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                      disabled={disabled}
                      labelProps={{
                        className: 'before:content-none after:content-none'
                      }}
                      error={methods.formState.errors.address ? true : false}
                      helperText={
                        methods.formState.errors.address
                          ? methods.formState.errors.address.message?.toString()
                          : undefined
                      }
                      onChange={onChange}
                      value={value}
                      data-testid="pilot-form-address-input"
                    />
                  )}
                />
              </div>
              <div className="col-span-1">
                <Typography variant="h6">City *</Typography>
              </div>
              <div className="col-span-3">
                <Controller
                  name="city"
                  control={methods.control}
                  rules={{ required: 'A city is required' }}
                  render={({ field: { disabled, onChange, value } }) => (
                    <Input
                      disabled={disabled}
                      labelProps={{
                        className: 'before:content-none after:content-none'
                      }}
                      error={methods.formState.errors.city ? true : false}
                      helperText={
                        methods.formState.errors.city
                          ? methods.formState.errors.city.message?.toString()
                          : undefined
                      }
                      onChange={onChange}
                      value={value}
                      data-testid="pilot-form-city-input"
                    />
                  )}
                />
              </div>
              <div className="col-span-1">
                <Typography variant="h6">State *</Typography>
              </div>
              <div className="col-span-3">
                <Controller
                  name="state"
                  control={methods.control}
                  rules={{ required: 'A state must be selected' }}
                  render={({ field: { disabled, onChange, value } }) => (
                    <StateSelect
                      disabled={disabled}
                      error={methods.formState.errors.state ? true : false}
                      helperText={
                        methods.formState.errors.state
                          ? methods.formState.errors.state.message?.toString()
                          : undefined
                      }
                      onChange={onChange}
                      value={value}
                      variant="outlined"
                      data-testid="pilot-form-state-dropdown"
                    />
                  )}
                />
              </div>
              <div className="col-span-1">
                <Typography variant="h6">Postal Code *</Typography>
              </div>
              <div className="col-span-3">
                <Controller
                  name="postalCode"
                  control={methods.control}
                  rules={{ required: 'A postal code is required' }}
                  render={({ field: { disabled, onChange, value } }) => (
                    <Input
                      disabled={disabled}
                      labelProps={{
                        className: 'before:content-none after:content-none'
                      }}
                      error={methods.formState.errors.postalCode ? true : false}
                      helperText={
                        methods.formState.errors.postalCode
                          ? methods.formState.errors.postalCode.message?.toString()
                          : undefined
                      }
                      onChange={onChange}
                      value={value}
                      data-testid="pilot-form-postal-code-input"
                    />
                  )}
                />
              </div>
              <div className="col-span-1">
                <Typography variant="h6">Email</Typography>
              </div>
              <div className="col-span-3">
                <Controller
                  name="email"
                  control={methods.control}
                  rules={{
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  }}
                  render={({ field: { disabled, onChange, value } }) => (
                    <Input
                      disabled={disabled}
                      labelProps={{
                        className: 'before:content-none after:content-none'
                      }}
                      error={methods.formState.errors.email ? true : false}
                      helperText={
                        methods.formState.errors.email
                          ? methods.formState.errors.email.message?.toString()
                          : undefined
                      }
                      onChange={onChange}
                      value={value}
                      data-testid="pilot-form-email-input"
                    />
                  )}
                />
              </div>
              <div className="col-span-1">
                <Typography variant="h6">Phone Number</Typography>
              </div>
              <div className="col-span-3">
                <Controller
                  name="phone"
                  control={methods.control}
                  rules={{
                    pattern: {
                      value: /^[0-9]{3}[-\s\.][0-9]{3}[-\s\.][0-9]{4}$/i,
                      message: 'Enter phone number as 123-456-7890'
                    }
                  }}
                  render={({ field: { disabled, onChange, value } }) => (
                    <Input
                      disabled={disabled}
                      labelProps={{
                        className: 'before:content-none after:content-none'
                      }}
                      error={methods.formState.errors.phone ? true : false}
                      helperText={
                        methods.formState.errors.phone
                          ? methods.formState.errors.phone.message?.toString()
                          : undefined
                      }
                      onChange={onChange}
                      value={value}
                      data-testid="pilot-form-phone-input"
                    />
                  )}
                />
              </div>
              {pilotId && (
                <>
                  <div className="col-span-1">
                    <Typography variant="h6">Last Review</Typography>
                  </div>
                  <div className="col-span-3">
                    <Controller
                      name="lastReview"
                      control={methods.control}
                      render={({ field }) => {
                        return (
                          <DatePicker
                            handleDateChanged={(date: string) => {
                              methods.setValue('lastReview', date);
                            }}
                            inputProps={{
                              value: field.value
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                </>
              )}
              {pilotId && (
                <>
                  <div className="col-span-4">
                    <Typography variant="h5">Medical</Typography>
                    <hr className="my-3" />
                  </div>
                  <div className="col-span-1">
                    <Typography variant="h6">Class</Typography>
                  </div>
                  <div className="col-span-3">
                    <Controller
                      name="medicalClass"
                      control={methods.control}
                      render={({ field }) => {
                        return (
                          <Select
                            labelProps={{
                              className:
                                'before:content-none after:content-none'
                            }}
                            {...field}
                          >
                            <Option key="first" value="First">
                              First
                            </Option>
                            <Option key="second" value="Second">
                              Second
                            </Option>
                            <Option key="third" value="Third">
                              Third
                            </Option>
                            <Option key="basicMed" value="Basic Med">
                              Basic Med
                            </Option>
                          </Select>
                        );
                      }}
                    />
                  </div>
                  <div className="col-span-1">
                    <Typography variant="h6">Expiration Date</Typography>
                  </div>
                  <div className="col-span-3">
                    <Controller
                      name="medicalExpiration"
                      control={methods.control}
                      render={({ field }) => {
                        return (
                          <DatePicker
                            handleDateChanged={(date: string) => {
                              methods.setValue('medicalExpiration', date);
                            }}
                            inputProps={{
                              value: field.value
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                </>
              )}
              {pilotId && (
                <>
                  <div className="col-span-4">
                    <Typography variant="h5">Certificates</Typography>
                    <hr className="my-3" />
                  </div>
                  <PilotFormCertificates certificates={[]} />
                </>
              )}
              {pilotId && (
                <>
                  <div className="col-span-4">
                    <Typography variant="h5">Endorsements</Typography>
                    <hr className="my-3" />
                  </div>
                  <PilotFormEndorsements endorsements={[]} />
                </>
              )}
            </div>
          </DrawerBody>
          <DrawerFooter>
            <div className="flex gap-2 justify-end justify-self-center pt-4">
              <div>
                <Button
                  className="flex items-center gap-3"
                  variant="outlined"
                  onClick={onOpenCloseDrawer}
                  data-testid="pilot-cancel-button"
                >
                  <XmarkIcon size="lg" />
                  Cancel
                </Button>
              </div>
              <div>
                <Button
                  className="flex items-center gap-3"
                  loading={isLoading}
                  variant="filled"
                  type="submit"
                  data-testid="pilot-save-button"
                >
                  <SaveIcon size="lg" />
                  Save
                </Button>
              </div>
            </div>
          </DrawerFooter>
        </form>
      </FormProvider>
    </Drawer>
  );
};

export default PilotForm;
