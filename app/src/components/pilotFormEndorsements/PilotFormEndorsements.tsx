import { IPilotFormEndorsements } from './IPilotFormEndorsements';
// import { Button, DatePicker, Input, Select, SelectItem } from '@nextui-org/react';
import {
  Button,
  DatePicker,
  Input,
  Option,
  Select
} from '@noahspan/noahspan-components';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

const PilotFormEndorsements: React.FC<IPilotFormEndorsements> = ({
  endorsements
}: IPilotFormEndorsements) => {
  const {
    control,
    formState: { errors },
    setValue
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: 'endorsements',
    control
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      {fields.map((field, index) => {
        return (
          <>
            <div>
              <Controller
                name={`endorsements.${index}.type`}
                control={control}
                render={({ field }) => {
                  return (
                    <Select label="Type" {...field}>
                      <Option key="complex" value="Complex">
                        Complex
                      </Option>
                      <Option key="highPerformance" value="High Performance">
                        High Performance
                      </Option>
                      <Option key="highAltitude" value="High Altitude">
                        High Altitude
                      </Option>
                      <Option key="tailwheel" value="Tailwheel">
                        Tailwheel
                      </Option>
                    </Select>
                  );
                }}
              />
            </div>
            <div>
              <Controller
                name={`endorsements.${index}.dateOfIssue`}
                control={control}
                render={({ field }) => {
                  return (
                    <DatePicker
                      handleDateChanged={(date: string) => {
                        setValue(`endorsements.${index}.dateOfIssue`, date);
                      }}
                      inputProps={{
                        value: field.value
                      }}
                    />
                  );
                }}
              />
            </div>
            <div>
              <Button onClick={() => remove(index)}>Remove</Button>
            </div>
          </>
        );
      })}
      <Button
        onClick={() => {
          append({
            type: '',
            number: '',
            dateOfIssue: null
          });
        }}
      >
        Add
      </Button>
    </div>
  );
};

export default PilotFormEndorsements;
