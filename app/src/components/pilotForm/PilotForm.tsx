import { useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  ChevronDownIcon,
  ChevronUpIcon,
  DatePicker,
  Input,
  Option,
  PeoplePicker,
  Select
} from '@noahspan/noahspan-components';
import PilotFormCertificates from '../pilotFormCertificates/PilotFormCertificates';
import PilotFormEndorsements from '../pilotFormEndorsements/PilotFormEndorsements';
import { Person } from '@microsoft/microsoft-graph-types';
import { AxiosInstance, AxiosResponse } from 'axios';
import { useHttpClient } from '../../hooks/httpClient/UseHttpClient';
import { useAccount } from '@azure/msal-react';

const PilotForm: React.FC<unknown> = () => {
  const httpClient: AxiosInstance = useHttpClient();
  const accountInfo = useAccount();
  const [open, setOpen] = useState<number>(0);
  const [peoplePickerResults, setPeoplePickerResults] = useState<Person[]>([]);
  const [isPeoplePickerLoading, setIsPeoplePickerLoading] =
    useState<boolean>(false);
  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };
  const methods = useForm();
  const { control, handleSubmit } = methods;

  const onSubmit = (data: unknown) => {
    console.log(data);
  };

  const handlePeoplePickerOnChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const searchString: string = event.target.value;
    const response: AxiosResponse = await httpClient.get(
      `api/personSearch?search=${searchString}`,
      {
        headers: {
          Authorization: `Bearer ${accountInfo?.idToken}`
        }
      }
    );
  };

  return (
    <FormProvider {...methods}>
      <form className="m-10" onSubmit={handleSubmit(onSubmit)}>
        {/* <Accordion
          open={open === 1}
          icon={open === 1 ? <ChevronDownIcon /> : <ChevronUpIcon />}
        >
          <AccordionHeader onClick={() => handleOpen(1)}>Info</AccordionHeader>
          <AccordionBody>
            <div className="grid grid-cols-1 gap-4">
              <div className="col-span-1">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <PeoplePicker 
                      results={peoplePickerResults}
                      inputProps={{
                        onChange: handlePeoplePickerOnChange
                      }}
                      loading={isPeoplePickerLoading}
                    />
                  )}
                />
              </div>
              <div className="col-span-1">
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      disabled={field.disabled}
                      label="Address"
                      value={field.value}
                    />
                  )}
                />
              </div>
              <div className="col-span-1">
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Input
                      disabled={field.disabled}
                      label="City"
                      value={field.value}
                    />
                  )}
                />
              </div>
              <div className="col-span-1">
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Input
                      disabled={field.disabled}
                      label="State"
                      value={field.value}
                    />
                  )}
                />
              </div>
              <div className="col-span-1">
                <Controller
                  name="postalCode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      disabled={field.disabled}
                      label="Postal Code"
                      value={field.value}
                    />
                  )}
                />
              </div>
            </div>
          </AccordionBody>
        </Accordion> */}
        <Accordion
          open={open === 2}
          icon={open === 2 ? <ChevronDownIcon /> : <ChevronUpIcon />}
        >
          <AccordionHeader onClick={() => handleOpen(2)}>
            Certificates
          </AccordionHeader>
          <AccordionBody>
            <PilotFormCertificates certificates={[]} />
          </AccordionBody>
        </Accordion>
        <Accordion
          open={open === 3}
          icon={open === 3 ? <ChevronDownIcon /> : <ChevronUpIcon />}
        >
          <AccordionHeader onClick={() => handleOpen(3)}>
            Endorsements
          </AccordionHeader>
          <AccordionBody>
            <PilotFormEndorsements endorsements={[]} />
          </AccordionBody>
        </Accordion>
        <Accordion
          open={open === 4}
          icon={open === 4 ? <ChevronDownIcon /> : <ChevronUpIcon />}
        >
          <AccordionHeader onClick={() => handleOpen(4)}>
            Medical
          </AccordionHeader>
          <AccordionBody>
            <div className="grid grid-cols-1 gap-4">
              <div className="col-span1">
                <Controller
                  name="medicalClass"
                  control={control}
                  render={({ field }) => (
                    <Select label="Class" value={field.value}>
                      <Option>First</Option>
                      <Option>Second</Option>
                      <Option>Third</Option>
                      <Option>Basic Med</Option>
                    </Select>
                  )}
                />
              </div>
              <div className="col-span-1">
                <Controller
                  name="medicalExpiration"
                  control={control}
                  render={() => <DatePicker />}
                />
              </div>
            </div>
          </AccordionBody>
        </Accordion>
      </form>
    </FormProvider>
  );
};

export default PilotForm;
