import { useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  ChevronDown,
  ChevronUp,
  DatePicker,
  Input,
  Option,
  Select
} from '@noahspan/noahspan-components';
import PilotFormCertificates from '../pilotFormCertificates/PilotFormCertificates';
import PilotFormEndorsements from '../pilotFormEndorsements/PilotFormEndorsements';

const PilotForm: React.FC<unknown> = () => {
  const [open, setOpen] = useState<number>(0);
  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };
  const methods = useForm();
  const { control, handleSubmit } = methods;

  const onSubmit = (data: unknown) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form className="m-10" onSubmit={handleSubmit(onSubmit)}>
        <Accordion
          open={open === 1}
          icon={open === 1 ? <ChevronDown /> : <ChevronUp />}
        >
          <AccordionHeader onClick={() => handleOpen(1)}>Info</AccordionHeader>
          <AccordionBody>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3">
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      className="w-full"
                      disabled={field.disabled}
                      label="First Name"
                      value={field.value}
                    />
                  )}
                />
              </div>
              <div className="col-span-3">
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      disabled={field.disabled}
                      label="Last Name"
                      value={field.value}
                    />
                  )}
                />
              </div>
              <div className="col-span-3">
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
              <div className="col-span-3">
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
              <div className="col-span-3">
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
              <div className="col-span-3">
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
        </Accordion>
        <Accordion
          open={open === 2}
          icon={open === 2 ? <ChevronDown /> : <ChevronUp />}
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
          icon={open === 3 ? <ChevronDown /> : <ChevronUp />}
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
          icon={open === 4 ? <ChevronDown /> : <ChevronUp />}
        >
          <AccordionHeader onClick={() => handleOpen(4)}>
            Medical
          </AccordionHeader>
          <AccordionBody>
            <div className="grid grid-cols-3 gap-4">
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
            <div className="col-span-3">
              <Controller
                name="medicalExpiration"
                control={control}
                render={() => <DatePicker />}
              />
            </div>
          </AccordionBody>
        </Accordion>
      </form>
    </FormProvider>
  );
};

export default PilotForm;
