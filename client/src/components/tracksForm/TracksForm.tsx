import { useEffect, useReducer } from "react";
// import { Button, Drawer, Icon, IconButton, IconName, Input, Loading } from "@noahspan/noahspan-components";
import { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { TracksFormProps } from "./TracksFormProps.interface";
import { FormMode } from "../../enums/formMode";
import { LogbookEntry } from "../logbook/LogbookEntry.interface";
import ConfirmationDialog from "../confirmationDialog/ConfirmationDialog";
import { initialState, reducer } from "./reducer";
import LogTrackMaps from "../logTrackMaps/LogTrackMaps";
import httpClient from "../../httpClient/httpClient";
import { Button, Drawer, DrawerContent, DrawerBody, DrawerHeader, Input, Spinner, DrawerFooter } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useLogbookContext } from "../../hooks/logbookContext/UseLogbookContext";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";


const TracksForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const logbookContext = useLogbookContext();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('blah')
    try {
      dispatch({ type: 'SET_IS_LOADING', payload: true})

      const file = event.target.files![0]
      const formData = new FormData();
      
      formData.append('file', file);

      httpClient.interceptors.request.use((config) => {
        config.headers["Content-Type"] = 'multipart/form-data'

        return config
      })

      const uploadResponse: AxiosResponse = await httpClient.post(`api/tracks/${logbookContext.state.selectedLogId}/1`, formData);
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

  // const onDeleteTrack = async (index: number) => {
  //   dispatch({ type: 'SET_ON_DELETE_TRACK', payload: { isConfirmDialogOpen: true, selectedTrack: { index: index }}})
  // }

  useEffect(() => {
    const getTracks = async () => {
      try {
        const response: AxiosResponse = await httpClient.get(
          `api/tracks/${logbookContext.state.selectedLogId}`
        )

        const tracks = response.data;

        dispatch({ type: 'SET_TRACKS', payload: tracks })
      } catch (error) {
        const axiosError = error as AxiosError;

        logbookContext.dispatch({ type: 'SET_FORM_ALERT', payload: { severity: 'danger', message: axiosError.message }})
      }
    }

    if (logbookContext.state.selectedLogId) {
      getTracks();
    }
  }, [logbookContext.state.selectedLogId])

  return (
    <div className='grid grid-cols-12 gap-3'>
      <>
        {state.tracks.length > 0 &&
          <>
            <div className='col-span-10'>
              <Input type='text' />
            </div>
            <div className='col-span-2'>
              <Button isIconOnly onPress={() => console.log('delete')}><FontAwesomeIcon icon={faTrash} /></Button>
            </div>
          </>
        }
        <div className='col-span-12'>
          <Button
            as='label'
            disabled={state.isLoading ? true : false}
            fullWidth={true}
            startContent={<FontAwesomeIcon icon={faUpload} />}
          >
            Upload Track
            <input hidden onChange={handleFileUpload} type='file' />
          </Button>
        </div>
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

  // const onConfirmDialogConfirm = async () => {
  //   try {
  //     const config = await getConfig();

  //     await httpClient.delete(`api/logs/log/${selectedRowKey}/track?fileName=${state.selectedTrack!.fileName}`, config);

  //     const log = await getLog();
  //     const tracks: string[] = JSON.parse(log.tracks!);

  //     tracks.splice(state.selectedTrack!.index, 1);
  //     log.tracks = JSON.stringify(tracks);
  //     await httpClient.put(`api/logs/log/${selectedRowKey}`, log, config);

  //     const updatedLog = await getLog();

  //     dispatch({ type: 'SET_TRACKS', payload: JSON.parse(updatedLog.tracks!) })
  //     dispatch({ type: 'SET_IS_CONFIRM_DIALOG_OPEN', payload: false })
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // const onConfirmDialogCancel = async () => {
  //   dispatch({ type: 'SET_IS_CONFIRM_DIALOG_OPEN', payload: false })
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
      {/* {logbookContext.state.formMode === FormMode.VIEW && 
        <LogTrackMaps logId={logbookContext.state.selectedLogId!} tracks={state.tracks} />
      } */}
      {/* {state.isConfirmDialogOpen && (
        <ConfirmationDialog
          contentText="Are you sure you want to delete this track?"
          isLoading={state.isConfirmDialogLoading}
          isOpen={state.isConfirmDialogOpen}
          onCancel={onConfirmDialogCancel}
          onConfirm={onConfirmDialogConfirm}
          title="Confirm Delete"
        />
      )} */}
    //  </div>
//   )
// }

export default TracksForm;