import React from 'react';
import {
  Accordion,
  AccordionItem,
  Button,
  DatePicker,
  Input
} from '@nextui-org/react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

const LogbookEntryForm: React.FC<unknown> = () => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data: unknown) => {
    console.log(data);
  };

  return (
    <form className="m-10" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-4">
        <div className="self-center">
          <label>Date</label>
        </div>
        <div>
          <Controller
            name="date"
            control={control}
            render={({ field }) => <DatePicker labelPlacement="outside-left" />}
          />
        </div>
        <div className="self-center">
          <label>Aircraft Type</label>
        </div>
        <div>
          <Controller
            name="aircraftType"
            control={control}
            render={({ field }) => (
              <Input fullWidth={true} labelPlacement="outside-left" />
            )}
          />
        </div>
        <div className="self-center">
          <label>Aircraft Identity</label>
        </div>
        <div>
          <Controller
            name="aircraftIdent"
            control={control}
            render={({ field }) => (
              <Input fullWidth={true} labelPlacement="outside-left" />
            )}
          />
        </div>
        <div className="self-center">
          <label>Route To</label>
        </div>
        <div>
          <Controller
            name="routeTo"
            control={control}
            render={({ field }) => <Input />}
          />
        </div>
        <div className="self-center">
          <label>Route From</label>
        </div>
        <div>
          <Controller
            name="routeFrom"
            control={control}
            render={({ field }) => <Input />}
          />
        </div>
        <div className="self-center">
          <label>Duration of Flight</label>
        </div>
        <div>
          <Controller
            name="flightDuration"
            control={control}
            render={({ field }) => <Input />}
          />
        </div>
        <div className="self-center">
          <label>Single Engine Land</label>
        </div>
        <div>
          <Controller
            name="aircraftSEL"
            control={control}
            render={({ field }) => <Input />}
          />
        </div>
        <div className="col-span-2">
          <Accordion>
            <AccordionItem title="Aircraft Category and Class">
              <div className="self-center">
                <label>Single Engine Land</label>
              </div>
              <div>
                <Controller
                  name="aircraftSEL"
                  control={control}
                  render={({ field }) => <Input />}
                />
              </div>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="col-span-2 justify-self-end">
          <Button color="default">Cancel</Button>
          <Button className="ml-10" color="primary">
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LogbookEntryForm;
