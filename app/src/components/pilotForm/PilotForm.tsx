import { useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Button,
  ChevronDownIcon,
  ChevronUpIcon,
  DatePicker,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerFooter,
  Input,
  Option,
  PeoplePicker,
  Select,
  Typography
} from '@noahspan/noahspan-components';
import PilotFormCertificates from '../pilotFormCertificates/PilotFormCertificates';
import PilotFormEndorsements from '../pilotFormEndorsements/PilotFormEndorsements';
import { Person } from '@microsoft/microsoft-graph-types';
import { AxiosInstance, AxiosResponse } from 'axios';
import { useHttpClient } from '../../hooks/httpClient/UseHttpClient';
import { useAccessToken } from '../../hooks/accessToken/UseAcessToken';

interface PilotFormProps {
  isDrawerOpen: boolean;
  onOpenCloseDrawer: () => void;
}

const PilotForm: React.FC<PilotFormProps> = ({
  isDrawerOpen,
  onOpenCloseDrawer
}: PilotFormProps) => {
  const httpClient: AxiosInstance = useHttpClient();
  const [peoplePickerResults, setPeoplePickerResults] = useState<Person[]>([]);
  const [isPeoplePickerLoading, setIsPeoplePickerLoading] =
    useState<boolean>(false);
  const { getAccessToken } = useAccessToken();
  const methods = useForm();

  const onSubmit = (data: unknown) => {
    console.log(data);
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
            <div className="grid grid-cols-1 gap-4">
              <div className="col-span-1">
                <Typography variant="h5">Info</Typography>
                <hr className="my-3" />
              </div>
              <div className="col-span-1">
                <Controller
                  name="name"
                  control={methods.control}
                  render={({ field: { disabled, value } }) => (
                    <PeoplePicker
                      results={peoplePickerResults}
                      inputProps={{
                        disabled: disabled,
                        label: 'Name',
                        onChange: (event) => handlePeoplePickerOnChange(event),
                        value: value
                      }}
                      loading={isPeoplePickerLoading}
                    />
                  )}
                />
              </div>
              <div className="col-span-1">
                <Controller
                  name="address"
                  control={methods.control}
                  render={({ field }) => <Input label="Address" {...field} />}
                />
              </div>
              <div className="col-span-1">
                <Controller
                  name="city"
                  control={methods.control}
                  render={({ field }) => <Input label="City" {...field} />}
                />
              </div>
              <div className="col-span-1">
                <Controller
                  name="state"
                  control={methods.control}
                  render={({ field }) => <Input label="State" {...field} />}
                />
              </div>
              <div className="col-span-1">
                <Controller
                  name="postalCode"
                  control={methods.control}
                  render={({ field }) => (
                    <Input label="Postal Code" {...field} />
                  )}
                />
              </div>
              <div className="col-span-1">
                <Controller
                  name="email"
                  control={methods.control}
                  render={({ field }) => <Input label="Email" {...field} />}
                />
              </div>
              <div className="col-span-1">
                <Controller
                  name="phone"
                  control={methods.control}
                  render={({ field }) => <Input label="Phone" {...field} />}
                />
              </div>
              <div className="col-span-1">
                <Typography variant="h5">Certificates</Typography>
                <hr className="my-3" />
              </div>
              <PilotFormCertificates certificates={[]} />
              <div className="col-span-1">
                <Typography variant="h5">Endorsements</Typography>
                <hr className="my-3" />
              </div>
              <PilotFormEndorsements endorsements={[]} />
              <div className="col-span-1">
                <Typography variant="h5">Medical</Typography>
                <hr className="my-3" />
              </div>
              <div className="col-span1">
                <Controller
                  name="medicalClass"
                  control={methods.control}
                  render={({ field }) => {
                    return (
                      <Select label="Class" {...field}>
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
            </div>
          </DrawerBody>
          <DrawerFooter>
            <div className="flex gap-2 justify-end justify-self-center">
              <div>
                <Button
                  variant="outlined"
                  onClick={onOpenCloseDrawer}
                  data-testid="pilot-drawer-cancel-button"
                >
                  Cancel
                </Button>
              </div>
              <div>
                <Button variant="filled" type="submit">
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
