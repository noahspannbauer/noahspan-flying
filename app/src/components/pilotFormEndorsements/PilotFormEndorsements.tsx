import { IPilotFormEndorsements } from './IPilotFormEndorsements';
import {
  Button,
  DatePicker,
  Input,
  Option,
  PlusIcon,
  Select,
  TrashIcon
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
    <>
      {fields.map((field, index) => {
        return (
          <>
            <div className="col-span-1">
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
            <div className="col-span-1">
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
            <div className="col-span-1">
              <Button
                className="flex items-center gap-3"
                onClick={() => remove(index)}
              >
                <TrashIcon size="lg" />
                Delete
              </Button>
            </div>
          </>
        );
      })}
      <div className="col-span-4">
        <Button
          className="flex items-center gap-3"
          onClick={() => {
            append({
              type: '',
              number: '',
              dateOfIssue: null
            });
          }}
          variant="outlined"
        >
          <PlusIcon size="lg" />
          Add Endorsement
        </Button>
      </div>
    </>
  );
};

export default PilotFormEndorsements;
