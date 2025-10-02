import { useEffect, useReducer } from 'react';
import LogForm from '../logForm/LogForm';
import {
  Alert,
  Button,
  ColumnDef,
  Icon,
  IconButton,
  IconName,
  Loading,
  Table
} from '@noahspan/noahspan-components';
import { initialState, reducer } from './reducer';
import { useHttpClient } from '../../hooks/httpClient/UseHttpClient';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { FormMode } from '../../enums/formMode';
import { authColumns, unauthColumns } from './columns';
import ActionMenu from '../actionMenu/ActionMenu';
import ConfirmationDialog from '../confirmationDialog/ConfirmationDialog';
import { ILogbookEntry } from './ILogbookEntry';
import LogbookCard from '../logbookCard/LogbookCard';
import LogTracks from '../logTracks/LogTracks';
import { useOidc } from '../../auth/oidcConfig';

const Logbook: React.FC<unknown> = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const httpClient: AxiosInstance = useHttpClient();
  const { isUserLoggedIn } = useOidc()
  const actionsColumn: ColumnDef<ILogbookEntry> = {
    header: 'Actions',
    meta: {
      align: 'center',
      headerAlign: 'center'
    },
    cell: (info: any) => (
      <ActionMenu
        id={info.row.original.id}
        onDelete={onDeleteLog}
        onOpenCloseForm={onOpenCloseLogForm}
        onOpenCloseTracks={onOpenCloseTracks}
      />
    )
  }
  const tracksColumn: ColumnDef<ILogbookEntry> = {
    accessorKey: 'tracks',
    header: 'Tracks',
    cell: (info: any) => {
      if (info.row.original.tracks.length > 0) {
        return (
          <IconButton onClick={() => onOpenCloseTracks(FormMode.VIEW, info.row.original.rowKey)}><Icon iconName={IconName.MAP_LOCATION_DOT} /></IconButton>
        )
      }
    }
  }

  const getLogbookEntries = async () => {
    try {
      dispatch({ type: 'SET_IS_LOADING', payload: true });

      const response: AxiosResponse = await httpClient.get(`api/logs`);
      const entries: ILogbookEntry[] = response.data;
      console.log(entries)
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

  const onOpenCloseLogForm = (mode: FormMode, logId?: string) => {
    switch (mode) {
      case FormMode.ADD:
      case FormMode.EDIT:
      case FormMode.VIEW:
        dispatch({
          type: 'SET_OPEN_CLOSE_LOG_FORM',
          payload: {
            formMode: mode,
            selectedLogId: logId,
            isFormOpen: true
          }
        });

        break;
      case FormMode.CANCEL:
        dispatch({
          type: 'SET_OPEN_CLOSE_LOG_FORM',
          payload: {
            formMode: mode,
            selectedLogId: undefined,
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

  const onDeleteLog = (logId: string) => {
    dispatch({
      type: 'SET_DELETE',
      payload: { isConfirmationDialogOpen: true, selectedLogId: logId }
    });
  };

  const onConfirmationDialogConfirm = async () => {
    try {
      dispatch({ type: 'SET_IS_CONFIRMATION_DIALOG_LOADING', payload: true });

      await httpClient.delete(`api/logs/${state.selectedLogId}`);

      dispatch({
        type: 'SET_DELETE',
        payload: { isConfirmationDialogOpen: false, selectedLogId: undefined }
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
      payload: { isConfirmationDialogOpen: false, selectedLogId: undefined }
    });
  };

  useEffect(() => {
    let newColumns: ColumnDef<ILogbookEntry>[];

    if (isUserLoggedIn) {
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
  }, [isUserLoggedIn])

  useEffect(() => {
    if (!state.isFormOpen) {
      getLogbookEntries();
    }
  }, [state.isFormOpen, state.isTracksOpen]);

  return (
    <>
      <div className='mr-10 ml-10 grid grid-cols-12'>
        <div className='prose max-w-none col-span-10 mt-5 mb-5'>
          <h1>Logbook</h1>
        </div>
        <div className='col-span-2 justify-self-end self-center'>
          {isUserLoggedIn &&
            <Button
              color='primary'
              onClick={() => onOpenCloseLogForm(FormMode.ADD)}
              startContent={<Icon iconName={IconName.PLUS} />}
              data-testid="pilot-add-button"
            >
              Add Entry
            </Button>
          }
        </div>
        {!state.isLoading && state.alert && (
          <div>
            <Alert
              onClose={() =>
                dispatch({ type: 'SET_ALERT', payload: undefined })
              }
              severity={state.alert.severity}
            >
              {state.alert.message}
            </Alert>
          </div>
        )}
        {!state.isLoading && (
          <div>
            {state.columns && state.columns.length > 0 && state.entries.length > 0 && (
              <Table columns={state.columns} data={state.entries} />
            )}
            {state.entries.length > 0 &&
              <LogbookCard logs={state.entries} onDelete={onDeleteLog} mode='logbook' onOpenCloseForm={onOpenCloseLogForm} />
            }
          </div>
        )}
        {state.isLoading && !state.alert && (
          <>
            <div>
              <Loading size='xl' />
            </div>
            <div>
              Loading...
            </div>
          </>
        )}
      </div>
      {state.isFormOpen && (
        <LogForm
          logId={state.selectedLogId}
          isDrawerOpen={state.isFormOpen}
          mode={state.formMode}
          onOpenClose={(mode) => onOpenCloseLogForm(mode)}
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
          selectedLogId={state.selectedLogId}
        />
      }
    </>
  );
};

export default Logbook;
