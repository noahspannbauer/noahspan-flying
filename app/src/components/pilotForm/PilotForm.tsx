import { useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Input
} from '@noahspan/noahspan-components';
// import PilotFormCertificates from '../pilotFormCertificates/PilotFormCertificates';

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
        <Accordion open={open === 1}>
          <AccordionHeader onClick={() => handleOpen(1)}>Info</AccordionHeader>
          <AccordionBody>
            <div className="grid grid-cols-3 gap-4">
              <div className="self-center">
                <label>First Name</label>
              </div>
              <div className="col-span-2">
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <Input disabled={field.disabled} value={field.value} />
                  )}
                />
              </div>
              <div className="self-center">
                <label>Last Name</label>
              </div>
              <div className="col-span-2">
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <Input disabled={field.disabled} value={field.value} />
                  )}
                />
              </div>
              <div className="self-center">
                <label>Address</label>
              </div>
              <div className="col-span-2">
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input disabled={field.disabled} value={field.value} />
                  )}
                />
              </div>
              <div className="self-center">
                <label>City</label>
              </div>
              <div className="col-span-2">
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Input disabled={field.disabled} value={field.value} />
                  )}
                />
              </div>
              <div className="self-center">
                <label>State</label>
              </div>
              <div className="col-span-2">
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Input disabled={field.disabled} value={field.value} />
                  )}
                />
              </div>
              <div className="self-center">
                <label>Postal Code</label>
              </div>
              <div className="col-span-2">
                <Controller
                  name="postalCode"
                  control={control}
                  render={({ field }) => (
                    <Input disabled={field.disabled} value={field.value} />
                  )}
                />
              </div>
            </div>
          </AccordionBody>
        </Accordion>

        {/* <Accordion>
            <AccordionItem title='Certificates'>
                <PilotFormCertificates certificates={[]}/>
            </AccordionItem>
        </Accordion>
        <Accordion>
            <AccordionItem title='Endorsements'>

            </AccordionItem>
        </Accordion>
        <Accordion>
            <AccordionItem title="Medical">
            <div className="grid grid-cols-2 gap-4">
                <div className="self-center">
                <label>Class</label>
                </div>
                <div>
                <Controller
                    name="medicalClass"
                    control={control}
                    render={({ field }) => (
                    <Select value={field.value}>
                        <Option value={first}>
                        First
                        </Option>
                        <Option>
                        Second
                        </Option>
                        <Option>
                        Third
                        </Option>
                        <Option>
                        Basic Med
                        </Option>
                    </Select>
                    )}
                />
                </div>
                <div className="self-center">
                <label>Expires</label>
                </div>
                <div>
                <Controller
                    name="medicalExpiration"
                    control={control}
                    render={({ field }) => <DatePicker />}
                />
                </div>
            </div>
            </AccordionItem>
        </Accordion> */}
      </form>
    </FormProvider>
  );
};

export default PilotForm;
