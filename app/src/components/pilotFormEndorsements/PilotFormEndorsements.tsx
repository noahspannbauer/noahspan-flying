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
    formState: { errors }
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: 'endorsements',
    control
  });

  return (
    <div className="grid grid-cols-4 gap-4">
      {fields.map((field, index) => {
        return (
          <>
            {/* // <div key={field.id}> */}
            <div>
              <Controller
                name={`endorsements.${index}.type`}
                control={control}
                render={({ field }) => {
                  return (
                    <Select label="Type" {...field}>
                      <Option key="student" value="Student">
                        Complex
                      </Option>
                      <Option key="private" value="Private">
                        High Performance
                      </Option>
                      <Option key="instrument" value="Instrument">
                        High Altitude
                      </Option>
                      <Option key="recreational" value="Recreational">
                        Tailwheel
                      </Option>
                    </Select>
                  );
                }}
              />
            </div>
            <div>
              <Controller
                name={`endorsements.${index}.number`}
                control={control}
                render={({ field }) => {
                  return <Input label="Number" {...field} />;
                }}
              />
            </div>
            <div>
              <Controller
                name={`endorsements.${index}.dateOfIssue`}
                control={control}
                render={() => {
                  return <DatePicker />;
                }}
              />
            </div>
            <div>
              <Button onClick={() => remove(index)}>Remove</Button>
            </div>
            {/* </div> */}
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
