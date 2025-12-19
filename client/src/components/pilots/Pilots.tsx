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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faPen, faEye, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { CellContext, ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Pilot } from './Pilot.interface';
import Alert from '../alert/Alert';

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

      console.log(response)

      if (response.data.length > 0) {
        dispatch({ type: 'SET_PILOTS', payload: response.data });

        if (state.alert) {
          dispatch({ type: 'SET_ALERT', payload: undefined })
        }
      } else {
        dispatch({ type: 'SET_ALERT', payload: { severity: 'info', message: 'No pilots found.' }})
        dispatch({ type: 'SET_PILOTS', payload: [] });
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

  const columns: ColumnDef<Pilot>[]= [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name'
    },
    {
      id: 'actions',
      header: 'Actions',
      meta: {
        align: 'text-center',
        headerAlign: 'text-center'
      },
      cell: (info: CellContext<Pilot, unknown>) => {
        return (
          <div className='dropdown dropdown-end'>
            <div tabIndex={0} role='button' className='btn btn-ghost'><FontAwesomeIcon icon={faEllipsisVertical} /></div>
            <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm border border-base-300">
              <li><a onClick={() => onOpenClosePilotForm(FormMode.EDIT, info.row.original.id)}><FontAwesomeIcon icon={faPen} />Edit</a></li>
              <li><a onClick={() => onOpenClosePilotForm(FormMode.VIEW, info.row.original.id)}><FontAwesomeIcon icon={faEye} />View</a></li>
              <li><a onClick={() => onDeletePilot(info.row.original.id)}><FontAwesomeIcon icon={faTrash} />Delete</a></li>
            </ul>
          </div>
        )
      }
    }
  ]

  const textAlignment = {
    center: 'text-center',
    left: 'text-start',
    right: 'text-end'
  };

  const table = useReactTable({
    data: state.pilots,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

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
          <button
            className='btn btn-primary'
            onClick={() => onOpenClosePilotForm(FormMode.ADD)}
            data-testid="pilot-add-button"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Pilot
          </button>
        }
      </div>
      {!state.isLoading && state.alert && (
        <div className='col-span-12'>
          <Alert
            className='mb-5'
            onClose={() =>
              dispatch({ type: 'SET_FORM_ALERT', payload: undefined })
            }
            severity={state.alert.severity}
          >
            {state.alert.message}
          </Alert>
        </div>
      )}
      <div className='col-span-12 bg-base-100 p-5 border border-base-100 rounded-lg'>
        {state.pilots.length > 0 && screenSize !== ScreenSize.SM &&
          <table className='table min-w-full h-auto table-auto w-full'>
            <thead className='[&>tr]:first:rounded-lg bg-base-200'>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr  className='group/tr outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2' key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        className={`${header.column.columnDef.meta?.headerAlign ? header.column.columnDef.meta?.headerAlign : ''} group/th px-3 h-10 align-middle bg-default-100 whitespace-nowrap text-foreground-500 text-tiny font-semibold rounded data-[sortable=true]:cursor-pointer data-[hover=true]:text-foreground-400 outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-start`}
                        colSpan={header.colSpan}
                        key={header.id}
                      >
                        {header.isPlaceholder ? null : (
                          <div>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {/* {header.column.getCanFilter() ? (
                              <div>
                                <Filter column={header.column} table={table} />
                              </div>
                            ) : null} */}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              <>
                {table.getRowModel().rows.map((row) => {
                  return (
                    <tr className='group/tr outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2' key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td
                            className={`${cell.column.columnDef.meta?.align ? cell.column.columnDef.meta?.align  : ''} py-2 px-3 relative align-middle whitespace-normal text-small font-normal [&>*]:z-1 [&>*]:relative outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 before:pointer-events-none before:content-[''] before:absolute before:z-0 before:inset-0 before:opacity-0 data-[selected=true]:before:opacity-100 group-data-[disabled=true]/tr:text-foreground-300 group-data-[disabled=true]/tr:cursor-not-allowed before:bg-default/60 data-[selected=true]:text-default-foreground first:before:rounded-s-lg last:before:rounded-e-lg text-start`}
                            key={cell.id}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </>
            </tbody>
          </table>
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

