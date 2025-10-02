import { PilotFormCertificatesProps } from './PilotFormCertificatesProps.interface';
import {
  Button,
  DatePicker,
  Icon,
  IconButton,
  IconName,
  Input,
  Select
} from '@noahspan/noahspan-components';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { FormMode } from '../../enums/formMode';

const PilotFormCertificates = ({
  isDisabled,
  mode
}: PilotFormCertificatesProps ) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: 'certificates',
    control
  });

  return (
    <div>
      {fields.length > 0 || mode !== FormMode.VIEW &&
        <div>
          <h5>Certificates</h5>
        </div>
      }
      {fields.length > 0 && (
        <>
          <div>
            <h6>Type</h6>
          </div>
          <div>
            <h6>Number</h6>
          </div>
          <div>
            <h6>Date of Issue</h6>
          </div>
          <div>
          </div>
          {fields.map((field, index) => {
            return (
              <>
                <div>
                  <Controller
                    name={`certificates.${index}.type`}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <Select
                          disabled={isDisabled}
                          onChange={onChange}
                          options={
                            [
                              {
                                label: 'Student',
                                value: 'student'
                              },
                              {
                                label: 'Private',
                                value: 'private'
                              },
                              {
                                label: 'Instrument',
                                value: 'instrument'
                              },
                              {
                                label: 'Recreational',
                                value: 'recreational'
                              },
                              {
                                label: 'Sport',
                                value: 'sport'
                              }
                            ]
                          }
                          value={value}
                        />
                      );
                    }}
                  />
                </div>
                <div>
                  <Controller
                    name={`certificates.${index}.number`}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <Input
                          disabled={isDisabled}
                          onChange={onChange}
                          value={value}
                        />
                      )
                    }}
                  />
                </div>
                <div>
                  <Controller
                    name={`certificates.${index}.dateOfIssue`}
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
                    <Icon iconName={IconName.TRASH} size='sm' />
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
                number: '',
                dateOfIssue: null
              });
            }}
            startContent={<Icon iconName={IconName.PLUS} />}
          >
            Add Certificate
          </Button>
        </div>
      }     
    </div>
  );
};

export default PilotFormCertificates;
