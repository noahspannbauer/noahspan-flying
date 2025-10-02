import { Card, CardBody, CardContent, CardHeader } from "@noahspan/noahspan-components";
import { LogbookCardProps } from "./LogbookCardProps.interface";
import ActionMenu from "../actionMenu/ActionMenu";
import LogTrackMaps from "../logTrackMaps/LogTrackMaps";


const LogbookCard = ({ logs, mode, onDelete, onOpenCloseForm }: LogbookCardProps) => {  
  return (
    <div>
      {logs.map((log) => {
        const date = new Date(log.date);
        const formattedDate: string = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;

        return (
          <div>
            <Card key={log.id}>
              <CardBody>
                <CardHeader><ActionMenu id={log.id} onDelete={onDelete!} onOpenCloseForm={onOpenCloseForm!} /></CardHeader>
                <CardContent>
                  <div>
                    {mode === 'flights' && log.tracks && log.tracks.length > 0 &&
                      <div>
                        <LogTrackMaps 
                          logId={log.id}
                          tracks={log.tracks}
                        />
                      </div>
                    }
                    <div>
                      <span>Aircraft Make and Model</span>
                    </div>
                    <div>
                      <span>{log.aircraftMakeModel}</span>
                    </div>
                    <div>
                      <span>Route From</span>
                    </div>
                    <div>
                      <span>{log.routeFrom}</span>
                    </div>
                    <div>
                      <span>Route To</span>
                    </div>
                    <div>
                      <span>{log.routeTo}</span>
                    </div>
                    <div>
                      <span>Duration Of Flight</span>
                    </div>
                    <div>
                      <span>{log.durationOfFlight}</span>
                    </div>
                    {mode === 'logbook' && log.tracks && log.tracks.length > 0 && 
                      <>
                        <div>
                          <span>Tracks</span>
                        </div>
                        {log.tracks.map((track: { id: string; order: number; url: string}) => {
                          const trackSplit = track.url.split('/')
                          const filename = trackSplit[trackSplit.length - 1];

                          return (
                            <div>
                              <span>{filename}</span>
                            </div>
                          )
                          
                        })}
                      </>
                    }
                    {log.notes &&
                      <>
                        <div>
                          <span>Notes</span>
                        </div>
                        <div>
                          <span>{log.notes}</span>
                        </div>
                      </>
                    }
                  </div>
                  
                </CardContent>
              </CardBody>
            </Card>
          </div>
        )
      })}
    </div>
  )
}

export default LogbookCard;