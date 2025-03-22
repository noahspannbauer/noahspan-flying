import { useEffect, useState } from "react";
import { Button, Drawer, Grid, Icon, IconButton, IconName, TextField, theme, Typography, useMediaQuery } from "@noahspan/noahspan-components";
import { useHttpClient } from "../../hooks/httpClient/UseHttpClient";
import { AxiosInstance, AxiosResponse } from "axios";
import { useAccessToken } from "../../hooks/accessToken/UseAcessToken";
import { LogTracksProps } from "./LogTracksProps.interface";
import { FormMode } from "../../enums/formMode";
import { useIsAuthenticated } from "@azure/msal-react";
import { ILogbookEntry } from "../logbook/ILogbookEntry";

const LogTracks = ({ isDrawerOpen, mode, onOpenClose, selectedRowKey }: LogTracksProps) => {
  const [tracks, setTracks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      `api/logs/log/${selectedRowKey}`,
      await getConfig()
    );
    const logData: ILogbookEntry = logResponse.data;

    return logData
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true); 

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
      const tracks: string[] = JSON.parse(log.tracks!);

      tracks.push(uploadUrl)
      log.tracks = JSON.stringify(tracks);
      await httpClient.put(`api/logs/log/${selectedRowKey}`, log, config);
      
      const updatedLog = await getLog();

      setTracks(JSON.parse(updatedLog.tracks!))
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }

  const onCancel = () => {
    onOpenClose(FormMode.CANCEL)
  }

  const onDelete = async (fileName: string, index: number) => {
    try {
      const config = await getConfig();

      await httpClient.delete(`api/logs/log/${selectedRowKey}/track?fileName=${fileName}`, config);

      const log = await getLog();
      const tracks: string[] = JSON.parse(log.tracks!);

      tracks.splice(index, 1);
      log.tracks = JSON.stringify(tracks);
      await httpClient.put(`api/logs/log/${selectedRowKey}`, log, config);

      const updatedLog = await getLog();

      setTracks(JSON.parse(updatedLog.tracks!))
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const updateTracks = async () => {
      const log = await getLog();
      
      setTracks(JSON.parse(log.tracks!));
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
          <IconButton onClick={onCancel}>
            <Icon iconName={IconName.XMARK} />
          </IconButton>
        </Grid>
          {tracks.length > 0 && tracks.map((track, index) => {
            const trackSplit = track.split('/')
            const filename = trackSplit[trackSplit.length - 1];

            return (
              <>
                <Grid size={11}>
                  <TextField disabled={true} fullWidth value={filename} />
                </Grid>
                <Grid size={1}>
                  <IconButton onClick={() => onDelete(filename, index)}><Icon iconName={IconName.TRASH} /></IconButton>
                </Grid>
              </>
            )
          })
        }
        <Grid display='flex' gap={2} justifyContent='right' size={12}>
          <Button
            startIcon={<Icon iconName={IconName.XMARK} />}
            variant="outlined"
            onClick={onCancel}
            size="small"
          >
            {mode.toString() !== FormMode.VIEW ? 'Cancel' : 'Close'}
          </Button>
          {mode.toString() !== FormMode.VIEW && (
            <Button
              component='label'
              loading={isLoading}
              startIcon={<Icon iconName={IconName.PLUS} />}
              variant='contained'
            >
              Add Track
              <input hidden onChange={handleFileUpload} type='file' />
            </Button>
          )}
        </Grid>
      </Grid>
    </Drawer>
  )
}

export default LogTracks;