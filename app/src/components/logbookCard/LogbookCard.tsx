import { Card, CardContent, CardHeader, Grid, Typography } from "@noahspan/noahspan-components";
import { LogbookCardProps } from "./LogbookCardProps.interface";
import ActionMenu from "../actionMenu/ActionMenu";
import LogTrackMaps from "../logTrackMaps/LogTrackMaps";


const LogbookCard = ({ logs, mode, onDelete, onOpenCloseForm }: LogbookCardProps) => {  
  return (
    <Grid container spacing={2}>
      {logs.map((log) => {
        console.log(log)
        return (
          <Grid size={12}>
            <Card key={log.rowKey}>
              <CardHeader
                action={mode === 'logbook' ? <ActionMenu id={log.rowKey} onDelete={onDelete!} onOpenCloseForm={onOpenCloseForm!} /> : null}
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
                  {mode === 'flights' && log.tracks && JSON.parse(log.tracks).length > 0 &&
                    <Grid size={12}>
                      <LogTrackMaps 
                        rowKey={log.rowKey}
                        trackUrls={JSON.parse(log.tracks)}
                      />
                    </Grid>
                  }
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
                  {mode === 'logbook' && log.tracks && JSON.parse(log.tracks).length > 0 && 
                    <>
                      <Grid size={12}>
                        <Typography variant="subtitle2">Tracks</Typography>
                      </Grid>
                      {JSON.parse(log.tracks).map((track: string) => {
                        const trackSplit = track.split('/')
                        const filename = trackSplit[trackSplit.length - 1];

                        return (
                          <Grid size={12}>
                            <Typography variant="body1">{filename}</Typography>
                          </Grid>
                        )
                        
                      })}
                    </>
                  }
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