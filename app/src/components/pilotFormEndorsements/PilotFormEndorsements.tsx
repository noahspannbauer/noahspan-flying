import { PilotFormEndorsementsProps } from './PilotFormEndorsementsProps.interface';
import {
  Button,
  DatePicker,
  Grid,
  Icon,
  IconButton,
  IconName,
  Select,
  Typography
} from '@noahspan/noahspan-components';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

const PilotFormEndorsements = ({
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
    <Grid
      container
      spacing={2}
    >
      <Grid size={12}>
        <Typography variant="h5">Endorsements</Typography>
      </Grid>
      {fields.length > 0 && (
        <>
          <Grid size={8}>
            <Typography variant="h6">Type</Typography>
          </Grid>
          <Grid size={3}>
            <Typography variant="h6">Date of Issue</Typography>
          </Grid>
          <Grid size={1}></Grid>
          {fields.map((field, index) => {
            return (
              <>
                <Grid size={8}>
                  <Controller
                    name={`endorsements.${index}.type`}
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
                </Grid>
                <Grid size={3}>
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
                </Grid>
                <Grid size={1}>
                  <IconButton
                    disabled={isDisabled}
                    onClick={() => remove(index)}
                    sx={{
                      marginTop: '-5px'
                    }}
                  >
                    <Icon iconName={IconName.TRASH} size="sm" />
                  </IconButton>
                </Grid>
              </>
            );
          })}
        </>
      )}
      {!isDisabled && 
        <Grid display="flex" justifyContent="right" size={12}>
          <Button
            onClick={() => {
              append({
                type: '',
                dateOfIssue: null
              });
            }}
            startIcon={<Icon iconName={IconName.PLUS} />}
            variant="contained"
          >
            Add Endorsement
          </Button>
        </Grid>
      }
    </Grid>
  );
};

export default PilotFormEndorsements;
