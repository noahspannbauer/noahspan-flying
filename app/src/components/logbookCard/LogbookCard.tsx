import { Card, CardContent, CardHeader, Grid, Typography } from "@noahspan/noahspan-components";
import { LogbookCardProps } from "./LogbookCardProps.interface";
import { useEffect } from "react";
import ActionMenu from "../actionMenu/ActionMenu";


const LogbookCard = ({ logs, onDelete, onOpenCloseForm }: LogbookCardProps) => {  
  return (
    <Grid container spacing={2}>
      {logs.map((log) => {
        return (
          <Grid size={12}>
            <Card key={log.rowKey}>
              <CardHeader
                action={<ActionMenu id={log.rowKey} onDelete={onDelete} onOpenCloseForm={onOpenCloseForm} />}
                subheader={log.pilotName}
                title={log.date}
                slotProps={{
                  subheader: {
                    fontSize: '16px'
                  },
                  title: {
                    fontSize: '24px',
                  }
                }}
              />
              <CardContent>
                <Grid container spacing={1}>
                  <Grid size={12}>
                    <Typography variant="subtitle2">Aircraft Make and Model</Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="body1">{log.aircraftMakeModel}</Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="subtitle2">Route From</Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="body1">{log.routeFrom}</Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="subtitle2">Route To</Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="body1">{log.routeTo}</Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="subtitle2">Duration Of Flight</Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="body1">{log.durationOfFlight}</Typography>
                  </Grid>
                  {log.notes &&
                    <>
                      <Grid size={12}>
                        <Typography variant="subtitle2">Notes</Typography>
                      </Grid>
                      <Grid size={12}>
                        <Typography variant="body1">{log.notes}</Typography>
                      </Grid>
                    </>
                  }
                </Grid>
                
              </CardContent>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default LogbookCard;