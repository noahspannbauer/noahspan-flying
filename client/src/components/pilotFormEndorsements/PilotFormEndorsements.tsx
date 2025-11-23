import { PilotFormEndorsementsProps } from './PilotFormEndorsementsProps.interface';
import {
  Button,
  DatePicker,
  Icon,
  IconButton,
  IconName,
  Select
} from '@noahspan/noahspan-components';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { FormMode } from '../../enums/formMode';

const PilotFormEndorsements = ({
  mode,
  isDisabled
}: PilotFormEndorsementsProps) => {
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
    <div>
      {fields.length > 0 || mode !== FormMode.VIEW &&
        <div>
          <h5>Endorsements</h5>
        </div>
      }
      {fields.length > 0 && (
        <>
          <div>
            <h6>Type</h6>
          </div>
          <div>
            <h6>Date of Issue</h6>
          </div>
          <div></div>
          {fields.map((field, index) => {
            return (
              <>
                <div>
                  <Controller
                    name={`endorsements.${index}.type`}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <Select
                          disabled={isDisabled}
                          onChange={onChange}
                          options={
                            [
                              {
                                label: 'Complex',
                                value: 'complex'
                              },
                              {
                                label: 'High Performance',
                                value: 'highPerfomance'
                              },
                              {
                                label: 'High Altitude',
                                value: 'highAltitude'
                              },
                              {
                                label: 'Tailwheel',
                                value: 'tailwheel'
                              }
                            ]
                          }
                          value={value ? value : ''}
                        />
                      );
                    }}
                  />
                </div>
                <div>
                  <Controller
                    name={`endorsements.${index}.dateOfIssue`}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <DatePicker
                          disabled={isDisabled}
                          onChange={onChange}
                          value={value}
                        />
                      );
                    }}
                  />
                </div>
                <div>
                  <IconButton
                    disabled={isDisabled}
                    onClick={() => remove(index)}
                  >
                    <Icon iconName={IconName.TRASH} size="sm" />
                  </IconButton>
                </div>
              </>
            );
          })}
        </>
      )}
      {!isDisabled && 
        <div>
          <Button
            onClick={() => {
              append({
                type: '',
                dateOfIssue: null
              });
            }}
            startContent={<Icon iconName={IconName.PLUS} />}
          >
            Add Endorsement
          </Button>
        </div>
      }
    </div>
  );
};

export default PilotFormEndorsements;
