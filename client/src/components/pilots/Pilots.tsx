import { useEffect, useReducer } from 'react';
import PilotForm from '../pilotForm/PilotForm';
import { AxiosError, AxiosResponse } from 'axios';
import { FormMode } from '../../enums/formMode';
import { initialState, reducer } from './reducer';
import ConfirmationDialog from '../confirmationDialog/ConfirmationDialog';
import PilotCard from '../pilotCard/PilotCard';
import { useUserRole } from '../../hooks/userRole/UseUserRole';
import { UserRole } from '../../enums/userRole';
import httpClient from '../../httpClient/httpClient'
import { ScreenSize } from '../../enums/screenSize';
import { useBreakpoints } from '../../hooks/useBreakpoints/UseBreakpoints';
import { Alert, Button, Dropdown, DropdownItem, DropdownSection, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, DropdownTrigger, DropdownMenu } from '@heroui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faPen, faEye, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

const Pilots: React.FC<unknown> = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { userRole } = useUserRole();
  const { screenSize } = useBreakpoints()

  const getPilots = async () => {
    try {
      let response: AxiosResponse;

      response = await httpClient.get(
        `api/pilots`
      );

      if (response.data.length > 0) {
        dispatch({ type: 'SET_PILOTS', payload: response.data });

        if (state.alert) {
          dispatch({ type: 'SET_ALERT', payload: undefined })
        }
      } else {
        dispatch({ type: 'SET_ALERT', payload: { severity: 'default', message: 'No pilots found.' }})
        dispatch({ type: 'SET_PILOTS', payload: [] });
      }
    } catch (error) {
      const axiosError = error as AxiosError;

      dispatch({
        type: 'SET_ALERT',
        payload: { severity: 'danger', message: `Loading of pilots failed with the following message: ${axiosError.message}`}
      })
    } finally {
      dispatch({ type: 'SET_IS_LOADING', payload: false })
    }
  };

  const onOpenClosePilotForm = async (mode: FormMode, pilotId?: string) => {
    console.log(pilotId)
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

  const onDeletePilot = (pilotId: string) => {
    dispatch({
      type: 'SET_DELETE',
      payload: { isConfirmDialogOpen: true, selectedPilotId: pilotId }
    });
  };

  const onConfirmationDialogConfirm = async () => {
    try {
      dispatch({ type: 'SET_IS_CONFIRMATION_DIALOG_LOADING', payload: true });

      await httpClient.delete(`api/pilots/${state.selectedPilotId}`);

      dispatch({
        type: 'SET_DELETE',
        payload: { isConfirmDialogOpen: false, selectedPilotId: undefined }
      });
      await getPilots();
    } catch (error) {
      const axiosError = error as AxiosError;

      dispatch({
        type: 'SET_ALERT',
        payload: { severity: 'danger', message: `Loading of logbook entries failed with the following message: ${axiosError.message}`}
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

  const columns = [
    {
      id: 'name',
      name: 'Name'
    },
    {
      id: 'actions',
      name: 'Actions'
    }
  ]

  const renderCell = (pilot: any, columnKey: any) => {
    const cellValue = pilot[columnKey]

    switch (columnKey) {
      case 'actions': {
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant='light' size='lg'>
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownSection showDivider>
                <DropdownItem 
                  key='edit'
                  onPress={() => onOpenClosePilotForm(FormMode.EDIT, pilot.id)}
                  startContent={<FontAwesomeIcon icon={faPen} />}
                >
                  Edit
                </DropdownItem>
                <DropdownItem 
                  key='view'
                  onPress={() => onOpenClosePilotForm(FormMode.VIEW, pilot.id)}
                  startContent={<FontAwesomeIcon icon={faEye} />}  
                >
                  View
                </DropdownItem>
              </DropdownSection>
                <DropdownSection>
                  <DropdownItem 
                    key='Delete'
                    onPress={() => onDeletePilot(pilot.id)}
                    startContent={<FontAwesomeIcon icon={faTrash} />}
                  >
                    Delete
                  </DropdownItem>
                </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        )
      }
      default: {
        return cellValue
      }
    }
  }

  useEffect(() => {
    if (!state.isFormOpen) {
      getPilots();
    }
  }, [state.isFormOpen]);

  return (
    <>
    <div className='mr-10 ml-10 grid grid-cols-12'>
      <div className='prose max-w-none col-span-10 mt-5 mb-5' >
        <h1>Pilots</h1>
      </div>
      <div className='col-span-2 justify-self-end self-center'>
        {userRole === UserRole.WRITE &&
          <Button
            color='primary'
            onPress={() => onOpenClosePilotForm(FormMode.ADD)}
            startContent={<FontAwesomeIcon icon={faPlus} />}
            data-testid="pilot-add-button"
          >
            Add Pilot
          </Button>
        }
      </div>
      {!state.isLoading && state.alert && (
        <div className='col-span-12'>
          <Alert
            onClose={() =>
              dispatch({ type: 'SET_ALERT', payload: undefined })
            }
            color={state.alert.severity}
            title={state.alert.message}
          />
        </div>
      )}
      <div className='col-span-12'>
        {state.pilots.length > 0 && screenSize !== ScreenSize.SM &&
          <Table>
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.id}
                  align={column.id === "actions" ? "center" : "start"}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={state.pilots}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey => (
                    <TableCell>
                      {renderCell(item, columnKey)}
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </TableBody>
          </Table>
        }
        {state.pilots.length > 0 && screenSize === ScreenSize.SM &&
          <PilotCard pilots={state.pilots} onDelete={onDeletePilot} onOpenCloseForm={onOpenClosePilotForm} />
        }
      </div>
    </div>
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
          contentText="Are you sure you want to delete the pilot entry? Deleting a pilot will delete the pilot and delete all of the pilot's logbook entries."
          isLoading={state.isConfirmDialogLoading}
          isOpen={state.isConfirmDialogOpen}
          onCancel={onConfirmationDialogCancel}
          onConfirm={onConfirmationDialogConfirm}
          title="Confirm Delete"
        />
      )}
    </>  
  );
};

export default Pilots;

