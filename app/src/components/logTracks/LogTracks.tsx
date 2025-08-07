import { useEffect, useReducer } from "react";
import { Button, Drawer, Grid, Icon, IconButton, IconName, Spinner, TextField, theme, Typography, useMediaQuery } from "@noahspan/noahspan-components";
import { useHttpClient } from "../../hooks/httpClient/UseHttpClient";
import { AxiosInstance, AxiosResponse } from "axios";
import { useAccessToken } from "../../hooks/accessToken/UseAcessToken";
import { LogTracksProps } from "./LogTracksProps.interface";
import { FormMode } from "../../enums/formMode";
import { useIsAuthenticated } from "@azure/msal-react";
import { ILogbookEntry } from "../logbook/ILogbookEntry";
import ConfirmationDialog from "../confirmationDialog/ConfirmationDialog";
import { initialState, reducer } from "./reducer";
import LogTrackMaps from "../logTrackMaps/LogTrackMaps";

const LogTracks = ({ isDrawerOpen, mode, onOpenClose, selectedRowKey }: LogTracksProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const httpClient: AxiosInstance = useHttpClient();
  const { getAccessToken } = useAccessToken();
  const isAuthenticated = useIsAuthenticated();
  
  const isMedium = useMediaQuery(theme.breakpoints.up('md'));

  const getConfig = async () => {
    const config = isAuthenticated
      ? { headers: { Authorization: await getAccessToken() } }
      : {};

    return config
  }

  const getLog = async (): Promise<ILogbookEntry> => {
    const logResponse: AxiosResponse = await httpClient.get(
      `api/logs/${selectedRowKey}`,
      await getConfig()
    );
    const logData: ILogbookEntry = logResponse.data;

    return logData
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      dispatch({ type: 'SET_IS_LOADING', payload: true})

      const file = event.target.files![0]
      const formData = new FormData();
      const config = await getConfig();
      const formDataConfig = {
        headers: {
          ...config.headers,
          'Content-Type': 'multipart/form-data'
        }
      }
      
      formData.append('file', file);

      const uploadResponse: AxiosResponse = await httpClient.post(`api/logs/log/${selectedRowKey}/track`, formData, formDataConfig);
      const uploadUrl = uploadResponse.data.url;
      const log = await getLog();
      const tracks: string[] = log.tracks ? JSON.parse(log.tracks!) : [];

      tracks.push(uploadUrl)
      log.tracks = JSON.stringify(tracks);
      await httpClient.put(`api/logs/log/${selectedRowKey}`, log, config);
      
      const updatedLog = await getLog();

      dispatch({ type: 'SET_TRACKS', payload: JSON.parse(updatedLog.tracks!) })
    } catch (error) {
      console.log(error)
    } finally {
      dispatch({ type: 'SET_IS_LOADING', payload: false });
    }
  }

  const onCancel = () => {
    onOpenClose(FormMode.CANCEL)
  }

  const onDeleteTrack = async (fileName: string, index: number) => {
    dispatch({ type: 'SET_ON_DELETE_TRACK', payload: { isConfirmDialogOpen: true, selectedTrack: { fileName: fileName, index: index }}})
  }

  const onConfirmDialogConfirm = async () => {
    try {
      const config = await getConfig();

      await httpClient.delete(`api/logs/log/${selectedRowKey}/track?fileName=${state.selectedTrack!.fileName}`, config);

      const log = await getLog();
      const tracks: string[] = JSON.parse(log.tracks!);

      tracks.splice(state.selectedTrack!.index, 1);
      log.tracks = JSON.stringify(tracks);
      await httpClient.put(`api/logs/log/${selectedRowKey}`, log, config);

      const updatedLog = await getLog();

      dispatch({ type: 'SET_TRACKS', payload: JSON.parse(updatedLog.tracks!) })
      dispatch({ type: 'SET_IS_CONFIRM_DIALOG_OPEN', payload: false })
    } catch (error) {
      console.log(error);
    }
  }

  const onConfirmDialogCancel = async () => {
    dispatch({ type: 'SET_IS_CONFIRM_DIALOG_OPEN', payload: false })
  }

  useEffect(() => {
    const updateTracks = async () => {
      const log = await getLog();
      
      dispatch({ type: 'SET_TRACKS', payload: JSON.parse(log.tracks!) });
    }

    updateTracks();
  }, [])

  return (
    <Drawer
      open={isDrawerOpen}
      anchor='right'
      PaperProps={{
        sx: {
          padding: '30px',
          width: isMedium ? '33%' : '75%'
        }
      }}
    >
      <Grid container spacing={2}>
        <Grid size={11}>
          <Typography variant="h4">{`${mode.toString().toLowerCase().charAt(0).toUpperCase() + mode.toString().slice(1).toLowerCase()} Tracks`}</Typography>
        </Grid>
        <Grid display="flex" justifyContent="right" size={1}>
          <IconButton disabled={state.isLoading ? true : false} onClick={onCancel}>
            <Icon iconName={IconName.XMARK} />
          </IconButton>
        </Grid>
        {mode === FormMode.EDIT &&
          <>
            {state.isLoading &&
              <>
                <Grid display="flex" justifyContent="center" size={12}>
                  <Spinner />
                </Grid>
                <Grid display="flex" justifyContent="center" size={12}>
                  Loading...
                </Grid>
              </>
            }
            {!state.isLoading && state.tracks.length > 0 && state.tracks.map((track, index) => {
              const trackSplit = track.split('/')
              const filename = trackSplit[trackSplit.length - 1];

              return (
                <>
                  <Grid size={11}>
                    <TextField disabled={true} fullWidth value={filename} />
                  </Grid>
                  <Grid size={1}>
                    <IconButton onClick={() => onDeleteTrack(filename, index)}><Icon iconName={IconName.TRASH} /></IconButton>
                  </Grid>
                </>
              )
            })}
            <Grid display='flex' gap={2} justifyContent='right' size={12}>
              <Button
                disabled={state.isLoading ? true : false}
                startIcon={<Icon iconName={IconName.XMARK} />}
                variant="outlined"
                onClick={onCancel}
                size="small"
              >
                Close
              </Button>
              {mode.toString() !== FormMode.VIEW && (
                <Button
                  component='label'
                  disabled={state.isLoading ? true : false}
                  startIcon={<Icon iconName={IconName.UPLOAD} />}
                  variant='contained'
                >
                  Upload Track
                  <input hidden onChange={handleFileUpload} type='file' />
                </Button>
              )}
            </Grid>
          </>
        }
        {mode === FormMode.VIEW && 
          <LogTrackMaps rowKey={selectedRowKey!} trackUrls={state.tracks} />
        }
      </Grid>
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
      
    </Drawer>
  )
}

export default LogTracks;