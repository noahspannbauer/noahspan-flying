import { useEffect, useReducer } from "react";
import { Button, Drawer, Icon, IconButton, IconName, Input, Loading } from "@noahspan/noahspan-components";
import { useHttpClient } from "../../hooks/httpClient/UseHttpClient";
import { AxiosInstance, AxiosResponse } from "axios";
import { LogTracksProps } from "./LogTracksProps.interface";
import { FormMode } from "../../enums/formMode";
import { ILogbookEntry } from "../logbook/ILogbookEntry";
import ConfirmationDialog from "../confirmationDialog/ConfirmationDialog";
import { initialState, reducer } from "./reducer";
import LogTrackMaps from "../logTrackMaps/LogTrackMaps";
import { useAuth } from "react-oidc-context";

const LogTracks = ({ isDrawerOpen, mode, onOpenClose, selectedLogId }: LogTracksProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const httpClient: AxiosInstance = useHttpClient();
  const auth = useAuth();

  const getConfig = async () => {
    const config = auth.isAuthenticated
      ? { headers: { Authorization: auth.user?.access_token } }
      : {};

    return config
  }

  // const getLog = async (): Promise<ILogbookEntry> => {
  //   const logResponse: AxiosResponse = await httpClient.get(
  //     `api/tracks/${selectedLogId}`,
  //     await getConfig()
  //   );
  //   const logData: ILogbookEntry = logResponse.data;

  //   return logData
  // }

  // const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, order: number) => {
  //   try {
  //     dispatch({ type: 'SET_IS_LOADING', payload: true})

  //     const file = event.target.files![0]
  //     const formData = new FormData();
  //     const config = await getConfig();
  //     const formDataConfig = {
  //       headers: {
  //         ...config.headers,
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     }
      
  //     formData.append('file', file);

  //     const uploadResponse: AxiosResponse = await httpClient.post(`api/tracks/${selectedLogId}/${order}`, formData, formDataConfig);
  //     const uploadUrl = uploadResponse.data.url;
  //     const tracks: string[] = log.tracks ? JSON.parse(log.tracks!) : [];

  //     tracks.push(uploadUrl)
  //     log.tracks = JSON.stringify(tracks);
  //     await httpClient.put(`api/logs/log/${selectedRowKey}`, log, config);
      
  //     const updatedLog = await getLog();

  //     dispatch({ type: 'SET_TRACKS', payload: JSON.parse(updatedLog.tracks!) })
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     dispatch({ type: 'SET_IS_LOADING', payload: false });
  //   }
  // }

  const onCancel = () => {
    onOpenClose(FormMode.CANCEL)
  }

  const onDeleteTrack = async (fileName: string, index: number) => {
    dispatch({ type: 'SET_ON_DELETE_TRACK', payload: { isConfirmDialogOpen: true, selectedTrack: { fileName: fileName, index: index }}})
  }

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

  const onConfirmDialogCancel = async () => {
    dispatch({ type: 'SET_IS_CONFIRM_DIALOG_OPEN', payload: false })
  }

  // useEffect(() => {
  //   const updateTracks = async () => {
  //     const log = await getLog();
      
  //     dispatch({ type: 'SET_TRACKS', payload: log.tracks! });
  //   }

  //   updateTracks();
  // }, [])

  useEffect(() => {
    if (isDrawerOpen) {
      console.log(selectedLogId)
      const getTracks = async () => {
        const tracks = await httpClient.get(`api/tracks/${selectedLogId}`);

        console.log(tracks);
      }

      getTracks();
    }
  }, [isDrawerOpen])

  return (
    <Drawer
      open={isDrawerOpen}
      position='right'
      width='25%'
    >
      <div>
        <div>
          <h4>{`${mode.toString().toLowerCase().charAt(0).toUpperCase() + mode.toString().slice(1).toLowerCase()} Tracks`}</h4>
        </div>
        <div>
          <IconButton disabled={state.isLoading ? true : false} onClick={onCancel}>
            <Icon iconName={IconName.XMARK} />
          </IconButton>
        </div>
        {mode === FormMode.EDIT &&
          <>
            {state.isLoading &&
              <>
                <div>
                  <Loading size='xl' />
                </div>
                <div>
                  Loading...
                </div>
              </>
            }
            {!state.isLoading && state.tracks.length > 0 && state.tracks.map((track, index) => {
              const trackSplit = track.url.split('/')
              const filename = trackSplit[trackSplit.length - 1];

              return (
                <>
                  <div>
                    <Input disabled={true} value={filename} />
                  </div>
                  <div>
                    <IconButton onClick={() => onDeleteTrack(filename, index)}><Icon iconName={IconName.TRASH} /></IconButton>
                  </div>
                </>
              )
            })}
            <div>
              <Button
                disabled={state.isLoading ? true : false}
                startContent={<Icon iconName={IconName.XMARK} />}
                onClick={onCancel}
                size='sm'
              >
                Close
              </Button>
              {mode.toString() !== FormMode.VIEW && (
                <Button
                  disabled={state.isLoading ? true : false}
                  startContent={<Icon iconName={IconName.UPLOAD} />}
                >
                  Upload Track
                  {/* <input hidden onChange={handleFileUpload} type='file' /> */}
                </Button>
              )}
            </div>
          </>
        }
        {mode === FormMode.VIEW && 
          <LogTrackMaps logId={selectedLogId!} tracks={state.tracks} />
        }
      </div>
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
      
    </Drawer>
  )
}

export default LogTracks;