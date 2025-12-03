import { LogbookCardProps } from "./LogbookCardProps.interface";
import TrackMap from "../trackMap/TrackMap";

const LogbookCard = ({ logs, mode, onDelete, onOpenCloseForm }: LogbookCardProps) => {  
  return (
    <div>
      {logs.map((log) => {
        const date = new Date(log.date);
        const formattedDate: string = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;

        return (
          <div>
            <div className='card bg-base-100 card-border border-base-300 p-5 z-10' key={log.id}>
              <h2 className='card-title font-bold text-2xl'>{formattedDate}</h2>
              <div className='card-body'>    
                {mode === 'flights' && log.tracks && log.tracks.length > 0 &&
                  <div className='mb-5'>
                    <TrackMap
                      height='400px'
                      logId={log.id}
                      tracks={log.tracks}
                    />
                  </div>
                }
                <div tabIndex={0} className='collapse collapse-arrow bg-base-100 border-base-300 border z-50'>
                  <div className='collapse-title font-semibold'>Details</div>
                  <div className='collapse-content'>
                    <div className='grid grid-cols-12 gap-3 mr-[30%] ml-[30%] mt-4 mb-4'>
                      <div className='col-span-6 font-bold'>
                        <span>Aircraft Make and Model</span>
                      </div>
                      <div className='col-span-6'>
                        <span>{log.aircraftMakeModel}</span>
                      </div>
                      <div className='col-span-6 font-bold'>
                        <span>Route From</span>
                      </div>
                      <div className='col-span-6'>
                        <span>{log.routeFrom}</span>
                      </div>
                      <div className='col-span-6 font-bold'>
                        <span>Route To</span>
                      </div>
                      <div className='col-span-6'>
                        <span>{log.routeTo}</span>
                      </div>
                      <div className='col-span-6 font-bold'>
                        <span>Duration Of Flight</span>
                      </div>
                      <div className='col-span-6'>
                        <span>{log.durationOfFlight}</span>
                      </div>
                      {log.notes &&
                        <>
                          <div className='col-span-6 font-bold'>
                            <span>Notes</span>
                          </div>
                          <div className='col-span-6'>
                            <span>{log.notes}</span>
                          </div>
                        </>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default LogbookCard;