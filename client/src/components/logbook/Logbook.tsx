import { useEffect, useReducer } from 'react';
import { initialState, reducer } from './reducer';
import { AxiosError, AxiosResponse } from 'axios';
import { FormMode } from '../../enums/formMode';
import { authColumns, unauthColumns } from './columns';
import ConfirmationDialog from '../confirmationDialog/ConfirmationDialog';
import { LogbookEntry } from './LogbookEntry.interface';
import LogbookCard from '../logbookCard/LogbookCard';
import { useOidc } from '../../auth/oidcConfig';
import httpClient from '../../httpClient/httpClient';
import { useUserRole } from '../../hooks/userRole/UseUserRole';
import { UserRole } from '../../enums/userRole';
import { useBreakpoints } from '../../hooks/useBreakpoints/UseBreakpoints';
import { ScreenSize } from '../../enums/screenSize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEllipsisVertical, faPen, faEye, faTrash, faMapLocationDot } from '@fortawesome/free-solid-svg-icons'
import { CellContext, ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, HeaderContext, useReactTable } from '@tanstack/react-table';
import { useLogbookContext } from '../../hooks/logbookContext/UseLogbookContext';
import LogbookDrawer from '../logbookDrawer/LogbookDrawer';
import Alert from '../alert/Alert';

const Logbook: React.FC<unknown> = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const logbookContext = useLogbookContext()
  const { isUserLoggedIn } = useOidc();
  const { userRole } = useUserRole();
  const { screenSize } = useBreakpoints();
  const columnTotal = (info: HeaderContext<LogbookEntry, unknown>): number => {
    const values: number[] = info.table.getPaginationRowModel().rows.map((row: any) => Number(row.getValue(info.column.id))).filter((value: any) => !Number.isNaN(value));
    let total: number = 0;
    
    if (values.length > 0) {
      total = values.reduce((accumulator, currentValue) => accumulator + currentValue, total)
    }
  
    return total;
  } 
  const pilotName: ColumnDef<LogbookEntry> = {
    id: 'pilotName',
    accessorKey: 'pilot',
    header: 'Pilot',
    footer: 'PAGE TOTALS',
    cell: (info: CellContext<LogbookEntry, unknown>) => {
      const pilot: any = info.getValue();
  
      return pilot.name
    }
  }
  const date: ColumnDef<LogbookEntry> = {
    id: 'date',
    accessorKey: 'date',
    header: 'Date',
    cell: (info: CellContext<LogbookEntry, unknown>) => {
      const date = new Date(info.getValue() as string);
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  
      return formattedDate;
    }
  }
  const aircraftMakeModel: ColumnDef<LogbookEntry> = {
    id: 'aircraftMakeModel',
    accessorKey: 'aircraftMakeModel',
    header: 'Aircraft Make & Model'
  }
  const route: ColumnDef<LogbookEntry> = {
    id: 'route',
    header: 'Route of Flight',
    meta: {
      className: 'border-l border-base-300',
      headerAlign: 'text-center'
    },
    columns: [
      {
        id: 'routeFrom',
        accessorKey: 'routeFrom',
        header: 'From',
        meta: {
          className: 'border-l border-base-300',
        }
      },
      {
        id: 'routeTo',
        accessorKey: 'routeTo',
        header: 'To'
      }
    ]
  }
  const durationOfFlight: ColumnDef<LogbookEntry> = {
    id: 'durationOfFlight',
    accessorKey: 'durationOfFlight',
    header: 'Duration Of Flight',
    meta: {
      align: 'text-right',
      className: 'border-l border-base-300',
      headerAlign: 'text-right'
    },
    cell: (info: CellContext<LogbookEntry, unknown>) =>
      info.getValue() ? parseFloat(info.getValue() as string).toFixed(1) : '',
    footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info).toFixed(1) : ''
  }
  const notes: ColumnDef<LogbookEntry> = {
    id: 'notes',
    accessorKey: 'notes',
    header: 'Notes',
    meta: {
      className: 'border-l border-base-300',
    }
  }
  const actions: ColumnDef<LogbookEntry> = {
    id: 'actions',
    header: 'Actions',
    meta: {
      align: 'text-center',
      className: 'border-l border-base-300',
      headerAlign: 'text-center'
    },
    cell: (info: CellContext<LogbookEntry, unknown>) => {
      return (
        <div className='dropdown dropdown-end'>
          <div tabIndex={0} role='button' className='btn btn-ghost'><FontAwesomeIcon icon={faEllipsisVertical} /></div>
          <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm border border-base-300">
            {isUserLoggedIn && userRole === UserRole.WRITE &&
              <li><a onClick={() => onOpenCloseDrawer(FormMode.EDIT, info.row.original.id)}><FontAwesomeIcon icon={faPen} />Edit</a></li>
            }
            <li><a onClick={() => onOpenCloseDrawer(FormMode.VIEW, info.row.original.id)}><FontAwesomeIcon icon={faEye} />View</a></li>
            {isUserLoggedIn && userRole === UserRole.WRITE &&
              <li><a onClick={() => onDeleteLog(info.row.original.id)}><FontAwesomeIcon icon={faTrash} />Delete</a></li>
            }
          </ul>
        </div>
      )
    }
  }
  
  const unauthColumns: ColumnDef<LogbookEntry>[] = [
    pilotName,
    date,
    aircraftMakeModel,
    route,
    durationOfFlight,
    notes
  ]
  
  const authColumns: ColumnDef<LogbookEntry>[] = [
    pilotName,
    date,
    aircraftMakeModel,
    {
      id: 'aircraftIdentity',
      accessorKey: 'aircraftIdentity',
      header: 'Aircraft Identity',
    },
    route,
    durationOfFlight,
    {
      id: 'singleEngineLand',
      accessorKey: 'singleEngineLand',
      header: 'Single Engine Land',
      meta: {
        align: 'text-right',
        headerAlign: 'text-right'
      },
      cell: (info: CellContext<LogbookEntry, unknown>) =>
        info.getValue() ? parseFloat(info.getValue() as string).toFixed(1) : '',
      footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info).toFixed(1) : ''
    },
    {
      id: 'landings',
      header: 'Landings',
      meta: {
        className: 'border-l border-base-300',
        headerAlign: 'text-center'
      },
      columns: [
        {
          id: 'landingsDay',
          accessorKey: 'landingsDay',
          header: 'Day',
          footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info) : '',
          meta: {
            align: 'text-right',
            className: 'border-l border-base-300',
            headerAlign: 'text-right'
          }
        },
        {
          id: 'landingsNight',
          accessorKey: 'landingsNight',
          header: 'Night',
          footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info) : '',
          meta: {
            align: 'text-right',
            headerAlign: 'text-right'
          }
        }
      ]
    },
    {
      id: 'instrument',
      header: 'Instrument',
      meta: {
        className: 'border-l border-base-300',
        headerAlign: 'text-center'
      },
      columns: [
        {
          id: 'instrumentActual',
          accessorKey: 'instrumentActual',
          header: 'Actual',
          footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info).toFixed(1) : '',
          meta: {
            align: 'text-right',
            className: 'border-l border-base-300',
            headerAlign: 'text-right'
          },
          cell: (info: CellContext<LogbookEntry, unknown>) =>
            info.getValue() ? parseFloat(info.getValue() as string).toFixed(1) : '',
        },
        {
          id: 'instrumentSimulated',
          accessorKey: 'instrumentSimulated',
          header: 'Simulated',
          footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info).toFixed(1) : '',
          meta: {
            align: 'text-right',
            headerAlign: 'text-right'
          },
          cell: (info: CellContext<LogbookEntry, unknown>) =>
            info.getValue() ? parseFloat(info.getValue() as string).toFixed(1) : ''
        },
        {
          id: 'instrumentApproaches',
          accessorKey: 'instrumentApproaches',
          header: 'Approaches',
          footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info).toFixed(1) : '',
          meta: {
            align: 'text-right',
            headerAlign: 'text-right'
          }
        },
        {
          id: 'instrumentHolds',
          accessorKey: 'instrumentHolds',
          header: 'Holds',
          footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info).toFixed(1) : '',
          meta: {
            align: 'text-right',
            headerAlign: 'text-right'
          }
        },
        {
          id: 'instrumentNavTrack',
          accessorKey: 'instrumentNavTrack',
          header: 'Nav/Track',
          footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info).toFixed(1) : '',
          meta: {
            align: 'text-right',
            headerAlign: 'text-right'
          }
        }
      ]
    },
    {
      id: 'experienceTraining',
      header: 'Type of pilot experience or training',
      meta: {
        className: 'border-l border-base-300',
        headerAlign: 'text-center'
      },
      columns: [
        {
          id: 'groundTrainingReceived',
          accessorKey: 'groundTrainingReceived',
          header: 'Ground Training Received',
          footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info).toFixed(1) : '',
          meta: {
            align: 'text-right',
            className: 'border-l border-base-300',
            headerAlign: 'text-right'
          },
          cell: (info: CellContext<LogbookEntry, unknown>) =>
            info.getValue() ? parseFloat(info.getValue() as string).toFixed(1) : ''
        },
        {
          id: 'flightTrainingReceived',
          accessorKey: 'flightTrainingReceived',
          header: 'Flight Training Received',
          footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info).toFixed(1) : '',
          meta: {
            align: 'text-right',
            headerAlign: 'text-right'
          },
          cell: (info: CellContext<LogbookEntry, unknown>) =>
            info.getValue() ? parseFloat(info.getValue() as string).toFixed(1) : ''
        },
        {
          id: 'crossCountry',
          accessorKey: 'crossCountry',
          header: 'Cross Country',
          footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info).toFixed(1) : '',
          meta: {
            align: 'text-right',
            headerAlign: 'text-right'
          },
          cell: (info: CellContext<LogbookEntry, unknown>) =>
            info.getValue() ? parseFloat(info.getValue() as string).toFixed(1) : ''
        },
        {
          id: 'night',
          accessorKey: 'night',
          header: 'Night',
          footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info).toFixed(1) : '',
          meta: {
            align: 'text-right',
            headerAlign: 'text-right'
          },
          cell: (info: CellContext<LogbookEntry, unknown>) =>
            info.getValue() ? parseFloat(info.getValue() as string).toFixed(1) : ''
        },
        {
          id: 'solo',
          accessorKey: 'solo',
          header: 'Solo',
          footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info).toFixed(1) : '',
          meta: {
            align: 'text-right',
            headerAlign: 'text-right'
          },
          cell: (info: CellContext<LogbookEntry, unknown>) =>
            info.getValue() ? parseFloat(info.getValue() as string).toFixed(1) : ''
        },
        {
          id: 'pilotInCommand',
          accessorKey: 'pilotInCommand',
          header: 'Pilot In Command',
          footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info).toFixed(1) : '',
          meta: {
            align: 'text-right',
            headerAlign: 'text-right'
          },
          cell: (info: CellContext<LogbookEntry, unknown>) =>
            info.getValue() ? parseFloat(info.getValue() as string).toFixed(1) : ''
        }
      ]
    },
    notes,
    actions
  ]

  const getLogbookEntries = async () => {
    try {
      dispatch({ type: 'SET_IS_LOADING', payload: true });

      const response: AxiosResponse = await httpClient.get(`api/logs`);
      const entries: LogbookEntry[] = response.data;
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

  const onOpenCloseDrawer= (mode: FormMode, logId?: string) => {
    switch (mode) {
      case FormMode.ADD:
      case FormMode.EDIT:
      case FormMode.VIEW:
        logbookContext.dispatch({
          type: 'SET_OPEN_CLOSE_DRAWER',
          payload: {
            formMode: mode,
            selectedLogId: logId!,
            isDrawerOpen: true
          }
        });

        break;
      case FormMode.CANCEL:
        logbookContext.dispatch({
          type: 'SET_OPEN_CLOSE_DRAWER',
          payload: {
            formMode: mode,
            selectedLogId: undefined,
            isDrawerOpen: false
          }
        });

        break;
    }
  };

  const onDeleteLog = (logId: string) => {
    dispatch({ type: 'SET_IS_CONFIRMATION_DIALOG_OPEN', payload: true });
    logbookContext.dispatch({ type: 'SET_SELECTED_LOG_ID', payload: logId })
  };

  const onConfirmationDialogConfirm = async () => {
    try {
      dispatch({ type: 'SET_IS_CONFIRMATION_DIALOG_LOADING', payload: true });

      await httpClient.delete(`api/logs/${logbookContext.state.selectedLogId}`);

      dispatch({
        type: 'SET_IS_CONFIRMATION_DIALOG_OPEN',
        payload: false
      });
      logbookContext.dispatch({ type: 'SET_SELECTED_LOG_ID', payload: '' })
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
      type: 'SET_IS_CONFIRMATION_DIALOG_OPEN',
      payload: false
    });
  };

  // useEffect(() => {
  //   let newColumns: ColumnDef<LogbookEntry>[];

  //   if (userRole === UserRole.WRITE) {
  //     newColumns = [...authColumns];
  //   } else {
  //     newColumns = [...unauthColumns];
  //   }

  //   const actionsColumnExists = newColumns.find((column) => column.id === 'actions');
  //   const tracksColumnExists = newColumns.find((column) => column.id === 'actions');
    
  //   if (!actionsColumnExists) {
  //     newColumns.push(actionsColumn);
  //   }

  //   if (!tracksColumnExists) {
  //     const notesColumnIndex = newColumns.findIndex((column) => column.id === 'notes')

  //     newColumns.splice(notesColumnIndex, 0, tracksColumn)
  //   }

  //   dispatch({ type: 'SET_COLUMNS', payload: newColumns })
  // }, [isUserLoggedIn])

  const table = useReactTable({
    data: state.entries,
    columns: authColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const textAlignment = {
    center: 'text-center',
    left: 'text-start',
    right: 'text-end'
  };

  useEffect(() => {
    if (!logbookContext.state.isDrawerOpen) {
      getLogbookEntries();
    }
  }, [logbookContext.state.isDrawerOpen]);

  return (
    <>
      <div className='mr-10 ml-10 grid grid-cols-12'>
        <div className='prose max-w-none col-span-10 mt-5 mb-5'>
          <h1>Logbook</h1>
        </div>
        <div className='col-span-2 justify-self-end self-center'>
          {userRole === UserRole.WRITE &&
            // <Button
            //   color='primary'
            //   onPress={() => onOpenCloseDrawer(FormMode.ADD)}
            //   startContent={<FontAwesomeIcon icon={faAdd} />}
            //   data-testid="pilot-add-button"
            // >
            //   Add Entry
            // </Button>
            <button className='btn btn-primary'
              onClick={() => onOpenCloseDrawer(FormMode.ADD)}
            >
              <FontAwesomeIcon icon={faAdd} />
              Add Entry
            </button>
          }
        </div>
        {!state.isLoading && state.alert && (
          <div className='col-span-12 mb-5'>
            <Alert
              className='mb-5'
              onClose={() =>
                dispatch({ type: 'SET_ALERT', payload: undefined })
              }
              severity={'info'}
            >
              {state.alert.message}
            </Alert>
          </div>
        )}
        {!state.isLoading && (
          <div className='col-span-12 p-5 bg-base-100 border border-base-100 rounded-lg'>
            {state.entries.length > 0 && screenSize !== ScreenSize.SM && (
              <div className='overflow-x-auto'>
                <table className='table min-w-full h-auto table-auto w-full'>
                  <thead className='bg-base-200'>
                    {table.getHeaderGroups().map((headerGroup, headerGroupIndex) => (
                      <tr className='group/tr outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2' key={headerGroup.id}>
                        {headerGroup.headers.map((header, headerIndex) => {
                          return (
                            <th
                              className={`${header.column.columnDef.meta?.className ? header.column.columnDef.meta?.className : ''} group/th px-3 h-10 align-middle whitespace-nowrap text-foreground-500 text-tiny font-semibold ${headerGroupIndex === 0 ? 'first:rounded-tl-lg last:rounded-tr-lg' : ''} ${headerGroupIndex === table.getHeaderGroups().length - 1 ? 'first:rounded-bl-lg last:rounded-br-lg' : ''} data-[sortable=true]:cursor-pointer data-[hover=true]:text-foreground-400 outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-start`}
                              colSpan={header.colSpan}
                              key={header.id}
                            >
                              {header.isPlaceholder ? null : (
                                <div className={`${header.column.columnDef.meta?.headerAlign ? header.column.columnDef.meta?.headerAlign : ''}`}>
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
                                  className={`py-2 px-3 relative align-middle whitespace-normal text-small font-normal [&>*]:z-1 [&>*]:relative outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 before:pointer-events-none before:content-[''] before:absolute before:z-0 before:inset-0 before:opacity-0 data-[selected=true]:before:opacity-100 group-data-[disabled=true]/tr:text-foreground-300 group-data-[disabled=true]/tr:cursor-not-allowed before:bg-default/60 data-[selected=true]:text-default-foreground first:before:rounded-s-lg last:before:rounded-e-lg text-start`}
                                  key={cell.id}
                                >
                                  <div className={`${cell.column.columnDef.meta?.align ? cell.column.columnDef.meta?.align : ''}`}>
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </>
                  </tbody>
                  <thead className='[&>tr]:first:rounded-lg bg-base-200'>
                    {table.getFooterGroups().map((footerGroup, index) => {
                      if (index === 0) {
                        return (
                          <tr className='group/tr outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2' key={footerGroup.id}>
                            {footerGroup.headers.map((header) => {
                              return (
                                <td
                                  className='group/th px-3 h-10 align-middle bg-default-100 whitespace-nowrap text-foreground-500 text-tiny font-semibold first:rounded-s-lg last:rounded-e-lg data-[sortable=true]:cursor-pointer data-[hover=true]:text-foreground-400 outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-start'
                                  key={header.id}
                                >
                                  <div className={`${header.column.columnDef.meta?.headerAlign ? header.column.columnDef.meta?.headerAlign : ''}`}>
                                    {header.isPlaceholder
                                      ? null
                                      : flexRender(
                                          header.column.columnDef.footer,
                                          header.getContext()
                                        )
                                      }
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      }
                    })}
                  </thead>
                </table>
              </div>
            )}
            {state.entries.length > 0 && screenSize === ScreenSize.SM &&
              <LogbookCard logs={state.entries} onDelete={onDeleteLog} mode='logbook' onOpenCloseForm={onOpenCloseDrawer} />
            }
          </div>
        )}
        {/* {state.isLoading && !state.alert && (
          <>
            <div>
              <Loading size='xl' />
            </div>
            <div>
              Loading...
            </div>
          </>
        )} */}
      </div>
      {logbookContext.state.isDrawerOpen && (
        <LogbookDrawer
          onOpenClose={(mode) => onOpenCloseDrawer(mode)}
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
    </>
  );
};

export default Logbook;
