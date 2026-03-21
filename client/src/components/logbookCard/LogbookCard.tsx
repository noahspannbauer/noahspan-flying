import { LogbookCardProps } from "./LogbookCardProps.interface";
import TrackMap from "../trackMap/TrackMap";
import { useBreakpoints } from "../../hooks/useBreakpoints/UseBreakpoints";
import { ScreenSize } from "../../enums/screenSize";
import { useEffect } from "react";

const LogbookCard = ({ logs, mode, onDelete, onOpenCloseForm }: LogbookCardProps) => {  
  const { screenSize } = useBreakpoints();
  
  return (
    <div>
      {logs.map((log) => {
        const date = new Date(log.date.replace('Z', ''));
        const formattedDate: string = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

        return (
          <div className='card bg-base-100 border border-base-300 p-2 mb-5'>
            <div className={`card-body ${screenSize === ScreenSize.SM || screenSize === ScreenSize.MD ? 'p-2' : ''}`} key={log.id}>
              <h2 className='card-title font-bold text-2xl'>{formattedDate}</h2>
              <div>    
                {mode === 'flights' && log.tracks && log.tracks.length > 0 &&
                  <div className='mb-5'>
                    <TrackMap
                      height='400px'
                      logId={log.id}
                      tracks={log.tracks}
                    />
                  </div>
                }
              </div>
              <div className='collapse collapse-arrow bg-base-100 border-base-300 border'>
                <input type='checkbox' />
                <div className='collapse-title font-semibold'>Details</div>
                <div className='collapse-content'>
                  <div className={`grid grid-cols-12 gap-3 ${screenSize === ScreenSize.SM || screenSize === ScreenSize.MD ? 'mr-[5%] ml-[5%]' : 'mr-[30%] ml-[30%]'} mt-4 mb-4`}>
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
        )
      })}
    </div>
  )
}

export default LogbookCard;