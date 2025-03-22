import { useEffect, useReducer } from 'react';
import LogForm from '../logForm/LogForm';
import {
  Alert,
  Box,
  Button,
  ColumnDef,
  Grid,
  Icon,
  IconButton,
  IconName,
  Spinner,
  Table,
  theme,
  Typography,
  useMediaQuery
} from '@noahspan/noahspan-components';
import { initialState, reducer } from './reducer';
import { useHttpClient } from '../../hooks/httpClient/UseHttpClient';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { useAccessToken } from '../../hooks/accessToken/UseAcessToken';
import { useIsAuthenticated } from '@azure/msal-react';
import { FormMode } from '../../enums/formMode';
import { authColumns, unauthColumns } from './columns';
import ActionMenu from '../actionMenu/ActionMenu';
import ConfirmationDialog from '../confirmationDialog/ConfirmationDialog';
import { ILogbookEntry } from './ILogbookEntry';
import LogbookCard from '../logbookCard/LogbookCard';
import LogTracks from '../logTracks/LogTracks';

const Logbook: React.FC<unknown> = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const httpClient: AxiosInstance = useHttpClient();
  const isAuthenticated = useIsAuthenticated();
  const { getAccessToken } = useAccessToken();
  const isMedium = useMediaQuery(theme.breakpoints.up('md'));
  const actionsColumn: ColumnDef<ILogbookEntry> = {
    header: 'Actions',
    meta: {
      align: 'center',
      headerAlign: 'center'
    },
    cell: (info: any) => (
      <ActionMenu
        id={info.row.original.rowKey}
        onDelete={onDeleteEntry}
        onOpenCloseForm={onOpenCloseEntryForm}
        onOpenCloseTracks={onOpenCloseTracks}
      />
    )
  }
  const tracksColumn: ColumnDef<ILogbookEntry> = {
    accessorKey: 'tracks',
    header: 'Tracks',
    cell: (info: any) => {
      if (info.row.original.tracks && info.row.original.tracks.length > 0) {
        return (
          <IconButton onClick={() => onOpenCloseTracks(FormMode.VIEW, info.row.original.rowKey)}><Icon iconName={IconName.MAP_LOCATION_DOT} /></IconButton>
        )
      }
    }
  }

  const getLogbookEntries = async () => {
    try {
      dispatch({ type: 'SET_IS_LOADING', payload: true });

      const config = isAuthenticated
        ? { headers: { Authorization: await getAccessToken() } }
        : {};
      const response: AxiosResponse = await httpClient.get(`api/logs`, config);
      const entries: ILogbookEntry[] = response.data;
      
      entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      if (response.data.length > 0) {
        dispatch({ type: 'SET_ENTRIES', payload: response.data });

        if (state.alert) {
          dispatch({ type: 'SET_ALERT', payload: undefined})
        }
      } else {
        dispatch({ type: 'SET_ALERT', payload: { severity: 'info', message: 'No logbook entries found.'}})
      }
    } catch (error) {
      const axiosError = error as AxiosError;

      dispatch({
        type: 'SET_ALERT',
        payload: { severity: 'error', message: `Loading of logbook entries failed with the following message: ${axiosError.message}`}
      });
    } finally {
      dispatch({ type: 'SET_IS_LOADING', payload: false });
    }
  };

  const onOpenCloseEntryForm = (mode: FormMode, entryId?: string) => {
    switch (mode) {
      case FormMode.ADD:
      case FormMode.EDIT:
      case FormMode.VIEW:
        dispatch({
          type: 'SET_OPEN_CLOSE_ENTRY_FORM',
          payload: {
            formMode: mode,
            selectedEntryId: entryId,
            isFormOpen: true
          }
        });

        break;
      case FormMode.CANCEL:
        dispatch({
          type: 'SET_OPEN_CLOSE_ENTRY_FORM',
          payload: {
            formMode: mode,
            selectedEntryId: undefined,
            isFormOpen: false
          }
        });

        break;
    }
  };

  const onOpenCloseTracks = (mode: FormMode, rowKey?: string) => {
    switch(mode) {
      case FormMode.EDIT:
      case FormMode.VIEW:
        dispatch({
          type: 'SET_OPEN_CLOSE_TRACKS',
          payload: {
            tracksMode: mode,
            isTracksOpen: true,
            selectedRowKey: rowKey
          }
        })

        break;
      case FormMode.CANCEL:
        dispatch({
          type: 'SET_OPEN_CLOSE_TRACKS',
          payload: {
            tracksMode: mode,
            isTracksOpen: false,
            selectedRowKey: undefined
          }
        })

        break;
    }
  }

  const onDeleteEntry = (entryId: string) => {
    dispatch({
      type: 'SET_DELETE',
      payload: { isConfirmationDialogOpen: true, selectedEntryId: entryId }
    });
  };

  const onConfirmationDialogConfirm = async () => {
    try {
      dispatch({ type: 'SET_IS_CONFIRMATION_DIALOG_LOADING', payload: true });

      const token = await getAccessToken();
      const config = isAuthenticated
        ? { headers: { Authorization: `${token}` } }
        : {};

      await httpClient.delete(`api/logs/log/${state.selectedEntryId}`, config);

      dispatch({
        type: 'SET_DELETE',
        payload: { isConfirmationDialogOpen: false, selectedEntryId: undefined }
      });
      await getLogbookEntries();
    } catch (error) {
      const axiosError = error as AxiosError;

      dispatch({
        type: 'SET_ALERT',
        payload: { severity: 'error', message: `Loading of logbook entries failed with the following message: ${axiosError.message}`}
      });
    } finally {
      dispatch({ type: 'SET_IS_CONFIRMATION_DIALOG_LOADING', payload: false });
    }
  };

  const onConfirmationDialogCancel = () => {
    dispatch({
      type: 'SET_DELETE',
      payload: { isConfirmationDialogOpen: false, selectedEntryId: undefined }
    });
  };

  useEffect(() => {
    let newColumns: ColumnDef<ILogbookEntry>[];

    if (isAuthenticated) {
      newColumns = [...authColumns];
    } else {
      newColumns = [...unauthColumns];
    }

    const actionsColumnExists = newColumns.find((column) => column.id === 'actions');
    const tracksColumnExists = newColumns.find((column) => column.id === 'actions');
    
    if (!actionsColumnExists) {
      newColumns.push(actionsColumn);
    }

    if (!tracksColumnExists) {
      const notesColumnIndex = newColumns.findIndex((column) => column.id === 'notes')

      newColumns.splice(notesColumnIndex, 0, tracksColumn)
    }

    dispatch({ type: 'SET_COLUMNS', payload: newColumns })
  }, [isAuthenticated])

  useEffect(() => {
    if (!state.isFormOpen) {
      getLogbookEntries();
    }
  }, [state.isFormOpen, state.isTracksOpen]);

  return (
    <Box sx={{ margin: '20px' }}>
      <Grid container spacing={2}>
        <Grid size={isMedium ? 11 : 6}>
          <Typography variant="h4">Logbook</Typography>
        </Grid>
        <Grid display="flex" justifyContent="right" size={isMedium ? 1 : 6}>
          {isAuthenticated &&
            <Button
              onClick={() => onOpenCloseEntryForm(FormMode.ADD)}
              startIcon={<Icon iconName={IconName.PLUS} />}
              variant="contained"
              data-testid="pilot-add-button"
            >
              Add Entry
            </Button>
          }
        </Grid>
        {!state.isLoading && state.alert && (
          <Grid display="flex" justifyContent="center" size={12}>
            <Alert
              onClose={() =>
                dispatch({ type: 'SET_ALERT', payload: undefined })
              }
              severity={state.alert.severity}
              sx={{ width: '100%' }}
            >
              {state.alert.message}
            </Alert>
          </Grid>
        )}
        {!state.isLoading && (
          <Grid size={12}>
            {isMedium && state.columns && state.columns.length > 0 && state.entries.length > 0 && (
              <Table columns={state.columns} data={state.entries} />
            )}
            {!isMedium && state.entries.length > 0 &&
              <LogbookCard logs={state.entries} onDelete={onDeleteEntry} onOpenCloseForm={onOpenCloseEntryForm} />
            }
          </Grid>
        )}
        {state.isLoading && !state.alert && (
          <>
            <Grid display="flex" justifyContent="center" size={12}>
              <Spinner />
            </Grid>
            <Grid display="flex" justifyContent="center" size={12}>
              Loading...
            </Grid>
          </>
        )}
      </Grid>
      {state.isFormOpen && (
        <LogForm
          entryId={state.selectedEntryId}
          isDrawerOpen={state.isFormOpen}
          mode={state.formMode}
          onOpenClose={(mode) => onOpenCloseEntryForm(mode)}
        />
      )}
      {state.isConfirmDialogOpen && (
        <ConfirmationDialog
          contentText="Are you sure you want to delete the logbook entry?"
          isLoading={state.isConfirmDialogLoading}
          isOpen={state.isConfirmDialogOpen}
          onCancel={onConfirmationDialogCancel}
          onConfirm={onConfirmationDialogConfirm}
          title="Confirm Delete"
        />
      )}
      {state.isTracksOpen && 
        <LogTracks
          isDrawerOpen={state.isTracksOpen}
          mode={state.tracksMode}
          onOpenClose={(mode) => onOpenCloseTracks(mode)}
          selectedRowKey={state.selectedEntryId}
        />
      }
    </Box>
  );
};

export default Logbook;
