import { useEffect, useReducer, useState } from 'react';
import PilotForm from '../pilotForm/PilotForm';
import {
  Alert,
  Box,
  Button,
  ColumnDef,
  Grid,
  Icon,
  IconName,
  Table,
  theme,
  Typography,
  useMediaQuery
} from '@noahspan/noahspan-components';
import { useHttpClient } from '../../hooks/httpClient/UseHttpClient';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { useAccessToken } from '../../hooks/accessToken/UseAcessToken';
import { useIsAuthenticated } from '@azure/msal-react';
import { FormMode } from '../../enums/formMode';
import { Pilot } from './Pilot.interface';
import { initialState, reducer } from './reducer';
import ActionMenu from '../actionMenu/ActionMenu';
import ConfirmationDialog from '../confirmationDialog/ConfirmationDialog';
import PilotCard from '../pilotCard/PilotCard';

const Pilots: React.FC<unknown> = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const httpClient: AxiosInstance = useHttpClient();
  const isAuthenticated = useIsAuthenticated();
  const { getAccessToken } = useAccessToken();
  const isMedium = useMediaQuery(theme.breakpoints.up('md'));

  const getPilots = async () => {
    try {
      const response: AxiosResponse = await httpClient.get(
        `api/pilots`
      );
      console.log(response);
      if (response.data.length > 0) {
        dispatch({ type: 'SET_PILOTS', payload: response.data });

        if (state.alert) {
          dispatch({ type: 'SET_ALERT', payload: undefined })
        }
      } else {
        dispatch({ type: 'SET_ALERT', payload: { severity: 'info', message: 'No pilots found.' }})
      }
    } catch (error) {
      const axiosError = error as AxiosError;

      dispatch({
        type: 'SET_ALERT',
        payload: { severity: 'error', message: `Loading of pilots failed with the following message: ${axiosError.message}`}
      })
    } finally {
      dispatch({ type: 'SET_IS_LOADING', payload: false })
    }
  };

  const onOpenClosePilotForm = async (mode: FormMode, pilotId?: string) => {
    switch (mode) {
      case FormMode.ADD:
      case FormMode.EDIT:
      case FormMode.VIEW:
        dispatch({
          type: 'SET_OPEN_CLOSE_ENTRY_FORM',
          payload: {
            formMode: mode,
            selectedPilotId: pilotId,
            isFormOpen: true
          }
        })

        break;
      case FormMode.CANCEL:
        dispatch({
          type: 'SET_OPEN_CLOSE_ENTRY_FORM',
          payload: {
            formMode: mode,
            selectedPilotId: undefined,
            isFormOpen: false
          }
        })

        break;
    }
  };

  const onDeleteEntry = (pilotId: string) => {
    dispatch({
      type: 'SET_DELETE',
      payload: { isConfirmDialogOpen: true, selectedPilotId: pilotId }
    });
  };

  const onConfirmationDialogConfirm = async () => {
    try {
      dispatch({ type: 'SET_IS_CONFIRMATION_DIALOG_LOADING', payload: true });

      const token = await getAccessToken();
      const config = isAuthenticated
        ? { headers: { Authorization: `${token}` } }
        : {};

      await httpClient.delete(`api/pilots/pilot/${state.selectedPilotId}`, config);

      dispatch({
        type: 'SET_DELETE',
        payload: { isConfirmDialogOpen: false, selectedPilotId: undefined }
      });
      await getPilots();
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
      payload: { isConfirmDialogOpen: false, selectedPilotId: undefined }
    });
  };

  const columns: ColumnDef<Pilot>[] = [
    {
      accessorKey: 'name',
      header: 'Name'
    },
    {
      header: 'Actions',
      cell: (info: any) => {
        console.log(info)
        return <ActionMenu 
          id={info.row.original.id} 
          onDelete={onDeleteEntry}
          onOpenCloseForm={onOpenClosePilotForm}
        />
      }
    }
  ];

  useEffect(() => {
    if (!state.isFormOpen) {
      getPilots();
    }
  }, [state.isFormOpen]);

  return (
    <Box sx={{ margin: '20px' }}>
      <Grid container spacing={2}>
        <Grid size={isMedium ? 11 : 6}>
          <Typography variant="h4">Pilots</Typography>
        </Grid>
        <Grid display="flex" justifyContent="right" size={isMedium ? 1 : 6}>
          {isAuthenticated &&
            <Button
              onClick={() => onOpenClosePilotForm(FormMode.ADD)}
              startIcon={<Icon iconName={IconName.PLUS} />}
              variant="contained"
              data-testid="pilot-add-button"
            >
              Add Pilot
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
        <Grid size={12}>
          {isMedium && state.pilots.length > 0 &&
            <Table columns={columns} data={state.pilots} />
          }
          {!isMedium && state.pilots.length > 0 && 
            <PilotCard pilots={state.pilots} onDelete={onDeleteEntry} onOpenCloseForm={onOpenClosePilotForm} />
          }
        </Grid>
      </Grid>
      {state.isFormOpen && (
        <PilotForm
          isDrawerOpen={state.isFormOpen}
          mode={state.formMode}
          onOpenClose={(mode) => onOpenClosePilotForm(mode)}
          pilotId={state.selectedPilotId}
        />
      )}
      {state.isConfirmDialogOpen && (
        <ConfirmationDialog
          contentText="Are you sure you want to delete the pilot entry? Deleting a pilot will delete the pilot and delete all logbook entries for the pilot."
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

export default Pilots;
