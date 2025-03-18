import { DatePicker, Grid, Select, theme, Typography, useMediaQuery } from '@noahspan/noahspan-components';
import { Controller, useFormContext } from "react-hook-form"
import { PilotFormMedicalProps } from "./PilotFormMedicalProps.interface";

const PilotFormMedical = ({ isDisabled }: PilotFormMedicalProps) => {
  const {
    control,
    formState: { errors },
    setValue
  } = useFormContext();
  const isMedium = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography variant="h5">Medical</Typography>
      </Grid>
      <Grid size={isMedium ? 3 : 12}>
        <Typography variant="h6">Class</Typography>
      </Grid>
      <Grid size={isMedium ? 9 : 12}>
        <Controller
          name="medicalClass"
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
                      label: 'First',
                      value: 'first'
                    },
                    {
                      label: 'Second',
                      value: 'second'
                    },
                    {
                      label: 'Third',
                      value: 'third'
                    },
                    {
                      label: 'Basic Med',
                      value: 'basicMed'
                    }
                  ]
                }
                value={value ? value : ''}
              />
            );
          }}
        />
      </Grid>
      <Grid size={isMedium ? 3 : 12}>
        <Typography variant="h6">Expiration</Typography>
      </Grid>
      <Grid size={isMedium ? 9 : 12}>
        <Controller
          name="medicalExpiration"
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
    </Grid>
  )
}

export default PilotFormMedical