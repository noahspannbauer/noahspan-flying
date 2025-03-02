import { PilotFormCertificatesProps } from './PilotFormCertificatesProps.interface';
import {
  Button,
  DatePicker,
  Grid,
  Icon,
  IconButton,
  IconName,
  Select,
  TextField,
  Typography
} from '@noahspan/noahspan-components';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

const PilotFormCertificates = ({
  certificates,
  isDisabled
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
    <Grid
      container
      spacing={2}
    >
      <Grid size={12}>
        <Typography variant="h5">Certificates</Typography>
      </Grid>
      {fields.length > 0 && (
        <>
          <Grid size={4}>
            <Typography variant="h6">Type</Typography>
          </Grid>
          <Grid size={4}>
            <Typography variant="h6">Number</Typography>
          </Grid>
          <Grid size={3}>
            <Typography variant="h6">Date of Issue</Typography>
          </Grid>
          <Grid size={1}>
          </Grid>
          {fields.map((field, index) => {
            return (
              <>
                <Grid size={4}>
                  <Controller
                    name={`certificates.${index}.type`}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <Select
                          disabled={isDisabled}
                          fullWidth
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
                </Grid>
                <Grid size={4}>
                  <Controller
                    name={`certificates.${index}.number`}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <TextField
                          disabled={isDisabled}
                          fullWidth
                          onChange={onChange}
                          value={value}
                        />
                      )
                    }}
                  />
                </Grid>
                <Grid size={3}>
                  <Controller
                    name={`certificates.${index}.dateOfIssue`}
                    control={control}
                    render={({ field: { onChange, value} }) => {
                      return (
                        <DatePicker
                          disabled={isDisabled}
                          onChange={onChange}
                          value={value}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid size={1}>
                  <IconButton
                    disabled={isDisabled}
                    onClick={() => remove(index)}
                    sx={{
                      marginTop: '-5px'
                    }}
                  >
                    <Icon iconName={IconName.TRASH} size='md' />
                  </IconButton>
                </Grid>
              </>
            );
          })}
        </>
      )}
      <Grid display="flex" justifyContent="right" size={12}>
        <Button
          onClick={() => {
            append({
              type: '',
              number: '',
              dateOfIssue: null
            });
          }}
          startIcon={<Icon iconName={IconName.PLUS} />}
          variant="contained"
        >
          Add Certificate
        </Button>
      </Grid>
    </Grid>
  );
};

export default PilotFormCertificates;
