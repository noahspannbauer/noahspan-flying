import { useEffect, useReducer } from 'react';
import LogForm from '../logForm/LogForm';
import {
  Alert,
  Box,
  Button,
  ColumnDef,
  Grid,
  PlusIcon,
  Spinner,
  Table,
  Typography
} from '@noahspan/noahspan-components';
import { initialState, reducer } from './reducer';
import { useHttpClient } from '../../hooks/httpClient/UseHttpClient';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { useAccessToken } from '../../hooks/accessToken/UseAcessToken';
import { useIsAuthenticated } from '@azure/msal-react';
import { FormMode } from '../../enums/formMode';
import ActionMenu from '../actionMenu/ActionMenu';
import ConfirmationDialog from '../confirmationDialog/ConfirmationDialog';
import { ILogbookEntry } from './ILogbookEntry';

const Logbook: React.FC<unknown> = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const httpClient: AxiosInstance = useHttpClient();
  const isAuthenticated = useIsAuthenticated();
  const { getAccessToken } = useAccessToken();

  const getLogbookEntries = async () => {
    try {
      dispatch({ type: 'SET_IS_LOADING', payload: true });

      const response: AxiosResponse = await httpClient.get(`api/logs`);
      console.log(response)
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

  const columns: ColumnDef<ILogbookEntry>[] = [
    {
      accessorKey: 'pilotName',
      header: 'Pilot'
    },
    {
      accessorKey: 'date',
      header: 'Date'
    },
    {
      accessorKey: 'aircraftMakeModel',
      header: 'Aircraft Make & Model'
    },
    {
      accessorKey: 'aircraftIdentity',
      header: 'Aircraft Identity'
    },
    {
      id: 'route',
      header: 'Route of Flight',
      meta: {
        headerAlign: 'center'
      },
      columns: [
        {
          accessorKey: 'routeFrom',
          header: 'From'
        },
        {
          accessorKey: 'routeTo',
          header: 'To'
        }
      ]
    },
    {
      accessorKey: 'durationOfFlight',
      header: 'Duration Of Flight',
      meta: {
        align: 'right',
        headerAlign: 'right'
      },
      cell: (info) =>
        info.getValue() !== null
          ? parseFloat(info.getValue()!.toString()).toFixed(1)
          : ''
    },
    {
      accessorKey: 'singleEngineLand',
      header: 'Single Engine Land',
      meta: {
        align: 'right',
        headerAlign: 'right'
      },
      cell: (info) =>
        info.getValue() !== null
          ? parseFloat(info.getValue()!.toString()).toFixed(1)
          : null
    },
    {
      id: 'landings',
      header: 'Landings',
      meta: {
        headerAlign: 'center'
      },
      columns: [
        {
          accessorKey: 'landingsDay',
          header: 'Day',
          meta: {
            align: 'right',
            headerAlign: 'right'
          }
        },
        {
          accessorKey: 'landingsNight',
          header: 'Night',
          meta: {
            align: 'right',
            headerAlign: 'right'
          }
        }
      ]
    },
    {
      id: 'instrument',
      header: 'Instrument',
      meta: {
        headerAlign: 'center'
      },
      columns: [
        {
          accessorKey: 'instrumentActual',
          header: 'Actual',
          meta: {
            align: 'right',
            headerAlign: 'right'
          },
          cell: (info) =>
            info.getValue() !== null
              ? parseFloat(info.getValue()).toFixed(1)
              : ''
        },
        {
          accessorKey: 'instrumentSimulated',
          header: 'Simulated',
          meta: {
            align: 'right',
            headerAlign: 'right'
          },
          cell: (info) =>
            info.getValue() !== null
              ? parseFloat(info.getValue()).toFixed(1)
              : ''
        },
        {
          accessorKey: 'instrumentApproaches',
          header: 'Approaches',
          meta: {
            align: 'right',
            headerAlign: 'right'
          }
        },
        {
          accessorKey: 'instrumentHolds',
          header: 'Holds',
          meta: {
            align: 'right',
            headerAlign: 'right'
          }
        },
        {
          accessorKey: 'instrumentNavTrack',
          header: 'Nav/Track',
          meta: {
            align: 'right',
            headerAlign: 'right'
          }
        }
      ]
    },
    {
      id: 'experienceTraining',
      header: 'Type of pilot experience or training',
      meta: {
        headerAlign: 'center'
      },
      columns: [
        {
          accessorKey: 'groundTrainingReceived',
          header: 'Ground Training Received',
          meta: {
            align: 'right',
            headerAlign: 'right'
          },
          cell: (info) =>
            info.getValue() !== null
              ? parseFloat(info.getValue()).toFixed(1)
              : ''
        },
        {
          accessorKey: 'flightTrainingReceived',
          header: 'Flight Training Received',
          meta: {
            align: 'right',
            headerAlign: 'right'
          },
          cell: (info) =>
            info.getValue() !== null
              ? parseFloat(info.getValue()).toFixed(1)
              : ''
        },
        {
          accessorKey: 'crossCountry',
          header: 'Cross Country',
          meta: {
            align: 'right',
            headerAlign: 'right'
          },
          cell: (info) =>
            info.getValue() !== null
              ? parseFloat(info.getValue()).toFixed(1)
              : ''
        },
        {
          accessorKey: 'night',
          header: 'Night',
          meta: {
            align: 'right',
            headerAlign: 'right'
          },
          cell: (info) =>
            info.getValue() !== null
              ? parseFloat(info.getValue()).toFixed(1)
              : ''
        },
        {
          accessorKey: 'solo',
          header: 'Solo',
          meta: {
            align: 'right',
            headerAlign: 'right'
          },
          cell: (info) =>
            info.getValue() !== null
              ? parseFloat(info.getValue()).toFixed(1)
              : ''
        },
        {
          accessorKey: 'pilotInCommand',
          header: 'Pilot In Command',
          meta: {
            align: 'right',
            headerAlign: 'right'
          },
          cell: (info) =>
            info.getValue() !== null
              ? parseFloat(info.getValue()).toFixed(1)
              : ''
        }
      ]
    },
    {
      accessorKey: 'notes',
      header: 'Notes'
    },
    {
      header: 'Actions',
      meta: {
        align: 'center',
        headerAlign: 'center'
      },
      cell: (info) => (
        <ActionMenu
          id={info.row.original.rowKey}
          onDelete={onDeleteEntry}
          onOpenCloseForm={onOpenCloseEntryForm}
        />
      )
    }
  ];

  useEffect(() => {
    if (!state.isFormOpen) {
      getLogbookEntries();
    }
  }, [state.isFormOpen]);

  return (
    <Box sx={{ margin: '20px' }}>
      <Grid container spacing={2}>
        <Grid size={11}>
          <Typography variant="h4">Logbook</Typography>
        </Grid>
        <Grid display="flex" justifyContent="right" size={1}>
          {isAuthenticated &&
            <Button
              onClick={() => onOpenCloseEntryForm(FormMode.ADD)}
              startIcon={<PlusIcon />}
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
            {state.entries.length > 0 && (
              <Table columns={columns} data={state.entries} />
            )}
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
    </Box>
  );
};

export default Logbook;
