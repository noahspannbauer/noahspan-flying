import { useEffect, useReducer, useRef } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { TracksFormProps } from "./TracksFormProps.interface";
import { FormMode } from "../../enums/formMode";
import { LogbookEntry } from "../logbook/LogbookEntry.interface";
import ConfirmationDialog from "../confirmationDialog/ConfirmationDialog";
import { initialState, reducer } from "./reducer";
import TrackMap from "../trackMap/TrackMap";
import httpClient from "../../httpClient/httpClient";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useLogbookContext } from "../../hooks/logbookContext/UseLogbookContext";

const TracksForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const logbookContext = useLogbookContext();

  const getTracks = async () => {
    try {
      const response: AxiosResponse = await httpClient.get(
        `api/tracks/${logbookContext.state.selectedLogId}`
      )

      const tracks = response.data;

      dispatch({ type: 'SET_TRACKS', payload: tracks })
    } catch (error) {
      const axiosError = error as AxiosError;

      logbookContext.dispatch({ type: 'SET_FORM_ALERT', payload: { severity: 'error', message: axiosError.message }})
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      dispatch({ type: 'SET_IS_LOADING', payload: true})

      const file = event.target.files![0]
      const formData = new FormData();
      const order = state.tracks.length + 1
      
      formData.append('file', file);

      httpClient.interceptors.request.use((config) => {
        config.headers["Content-Type"] = 'multipart/form-data'

        return config
      });

      await httpClient.post(`api/tracks/${logbookContext.state.selectedLogId}/${order}`, formData);
      await getTracks();
      // const uploadUrl = uploadResponse.data.url;
      // const tracks: string[] = log.tracks ? JSON.parse(log.tracks!) : [];

      // tracks.push(uploadUrl)
      // log.tracks = JSON.stringify(tracks);
      // await httpClient.put(`api/logs/log/${logbookContext.state.selectedLogId}`, log, config);
      
      // const updatedLog = await getLog();

      // dispatch({ type: 'SET_TRACKS', payload: JSON.parse(updatedLog.tracks!) })
    } catch (error) {
      console.log(error)
    } finally {
      dispatch({ type: 'SET_IS_LOADING', payload: false });
    }
  }

  const onDeleteTrack = async (id: string, filename: string, index: number) => {
    dispatch({ type: 'SET_ON_DELETE_TRACK', payload: { isConfirmDialogOpen: true, selectedTrack: { id: id, filename: filename, index: index }}})
  }

  const onConfirmDialogConfirm = async () => {
    try {
      await httpClient.delete(`api/tracks/${state.selectedTrack!.id}/${state.selectedTrack!.filename}/${logbookContext.state.selectedLogId}`);

      await getTracks();

      // tracks.splice(state.selectedTrack!.index, 1);
      // log.tracks = JSON.stringify(tracks);
      // await httpClient.put(`api/logs/log/${selectedRowKey}`, log, config);

      // const updatedLog = await getLog();

      // dispatch({ type: 'SET_TRACKS', payload: JSON.parse(updatedLog.tracks!) })
      dispatch({ type: 'SET_IS_CONFIRM_DIALOG_OPEN', payload: false })
    } catch (error) {
      console.log(error);
    }
  }

  const onConfirmDialogCancel = async () => {
    dispatch({ type: 'SET_IS_CONFIRM_DIALOG_OPEN', payload: false })
  }

  useEffect(() => {
    if (logbookContext.state.selectedLogId) {
      getTracks();
    }
  }, [logbookContext.state.selectedLogId])

  useEffect(() => {
    if (logbookContext.state.formMode === FormMode.VIEW) {
      dispatch({ type: 'SET_IS_DISABLED', payload: true });
    }
  }, [logbookContext.state.formMode]);

  return (
    <div className='grid grid-cols-12 gap-3'>
      <>
        {state.tracks.length > 0 && state.tracks.map((track, index) => {
          const filename: string = track.url.substring(track.url.lastIndexOf('/') + 1);

          return (
            <>
              <div className='col-span-10'>
                <input className='input w-full' disabled={state.isDisabled} key={index} readOnly type='text' value={filename} />
              </div>
              <div className='col-span-2'>
                <button className='btn w-full' disabled={state.isDisabled} key={index} onClick={() => onDeleteTrack(track.id, filename, index)}><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            </>
          )
        })}
        {logbookContext.state.formMode === FormMode.EDIT &&
          <div className='col-span-12'>
            <label
              className='btn cursor-pointer w-full'
            >
              <FontAwesomeIcon icon={faUpload} />
              Upload Track
              <input className='hidden' id='track-upload' onChange={handleFileUpload} type='file' />
            </label>
          </div>
        }
        {state.isConfirmDialogOpen && (
          <ConfirmationDialog
            contentText="Are you sure you want to delete this track?"
            isLoading={state.isConfirmDialogLoading}
            isOpen={state.isConfirmDialogOpen}
            onCancel={onConfirmDialogCancel}
            onConfirm={onConfirmDialogConfirm}
            title="Confirm Delete"
          />
        )}
      </>
    </div>
  );
}

  // const getConfig = async () => {
  //   const config = auth.isAuthenticated
  //     ? { headers: { Authorization: auth.user?.access_token } }
  //     : {};

  //   return config
  // }

  // const getLog = async (): Promise<ILogbookEntry> => {
  //   const logResponse: AxiosResponse = await httpClient.get(
  //     `api/tracks/${selectedLogId}`,
  //     await getConfig()
  //   );
  //   const logData: ILogbookEntry = logResponse.data;

  //   return logData
  // }



  // const onCancel = () => {
  //   onOpenClose(FormMode.CANCEL)
  // }

  // const onDeleteTrack = async (fileName: string, index: number) => {
  //   dispatch({ type: 'SET_ON_DELETE_TRACK', payload: { isConfirmDialogOpen: true, selectedTrack: { fileName: fileName, index: index }}})
  // }



  // useEffect(() => {
  //   const updateTracks = async () => {
  //     const log = await getLog();
      
  //     dispatch({ type: 'SET_TRACKS', payload: log.tracks! });
  //   }

  //   updateTracks();
  // }, [])

  // return (
  //   <div className='grid grid-cols-12 gap-3'>
  //     {}
  //     {logbookContext.state.formMode === FormMode.EDIT &&
  //       <>
  //         {state.isLoading &&
  //           <>
  //             <div>
  //               <Spinner size='lg' />
  //             </div>
  //             <div>
  //               Loading...
  //             </div>
  //           </>
  //         }
  //         {!state.isLoading && state.tracks.length > 0 && state.tracks.map((track, index) => {
  //           const trackSplit = track.url.split('/')
  //           const filename = trackSplit[trackSplit.length - 1];

  //           return (
  //             <>
  //               <div>
  //                 <Input disabled={true} value={filename} />
  //               </div>
  //               <div>
  //                 <Button isIconOnly onPress={() => onDeleteTrack(filename, index)}><FontAwesomeIcon icon={faTrash} /></Button>
  //               </div>
  //             </>
  //           )
  //         })}
  //       </>
  //     }


    //  </div>
//   )
// }

export default TracksForm;