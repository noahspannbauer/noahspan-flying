import { useEffect, useState } from 'react';
import LogbookEntryForm from '../logbookEntryForm/LogbookEntryForm';
import {
  Box,
  Button,
  ColumnDef,
  Grid,
  PlusIcon,
  Table,
  Typography
} from '@noahspan/noahspan-components';
import { useHttpClient } from '../../hooks/httpClient/UseHttpClient';
import { AxiosInstance, AxiosResponse } from 'axios';
import { useAccessToken } from '../../hooks/accessToken/UseAcessToken';
import { useIsAuthenticated } from '@azure/msal-react';
import { FormMode } from '../../enums/formMode';
import ActionMenu from '../../actionMenu/ActionMenu';

type LogbookEntry = {
  partitionKey: string;
  rowKey: string;
  id: string;
  pilotId: string;
  date: string;
  aircraftMakeModel: string;
  aircraftIdentity: string;
  routeFrom: string;
  routeTo: string;
  durationOfFlight: number | null;
  singleEngineLand: number | null;
  simulatorAtd: number | null;
  landingsDay: number | null;
  landingsNight: number | null;
  instrumentActual: number | null;
  instrumentSimulated: number | null;
  instrumentApproaches: number | null;
  instrumentHolds: number | null;
  instrumentNavTrack: number | null;
  groundTrainingReceived: number;
  flightTrainingReceived: number;
  crossCountry: number | null;
  night: number | null;
  solo: number | null;
  pilotInCommand: number | null;
};

const Logbook: React.FC<unknown> = () => {
  const httpClient: AxiosInstance = useHttpClient();
  const isAuthenticated = useIsAuthenticated();
  const { getAccessToken } = useAccessToken();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [entryFormMode, setEntryFormMode] = useState<FormMode>(FormMode.CANCEL);
  const [selectedEntryId, setSelectedEntryId] = useState<string | undefined>();
  const [entries, setEntries] = useState([]);
  const onOpenCloseEntryForm = (mode: FormMode, entryId?: string) => {
    switch (mode) {
      case FormMode.ADD:
      case FormMode.EDIT:
      case FormMode.VIEW:
        setEntryFormMode(mode);
        setSelectedEntryId(entryId);
        setIsDrawerOpen(true);
        break;
      case FormMode.CANCEL:
        setEntryFormMode(mode);
        setSelectedEntryId(undefined);
        setIsDrawerOpen(false);
        break;
    }
  };

  const columns: ColumnDef<LogbookEntry>[] = [
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
          onOpenCloseForm={onOpenCloseEntryForm}
        />
      )
    }
  ];

  useEffect(() => {
    const getLogbookEntries = async () => {
      try {
        const token = await getAccessToken();
        const config = isAuthenticated
          ? { headers: { Authorization: `${token}` } }
          : {};
        const response: AxiosResponse = await httpClient.get(
          `api/logbook`,
          config
        );

        setEntries(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (isAuthenticated && !isDrawerOpen) {
      getLogbookEntries();
    }
  }, [isAuthenticated, isDrawerOpen]);

  return (
    <Box sx={{ margin: '20px' }}>
      <Grid container spacing={2}>
        <Grid size={11}>
          <Typography variant="h4">Logbook</Typography>
        </Grid>
        <Grid display="flex" justifyContent="right" size={1}>
          <Button
            onClick={() => onOpenCloseEntryForm(FormMode.ADD)}
            startIcon={<PlusIcon />}
            variant="contained"
            data-testid="pilot-add-button"
          >
            Add Entry
          </Button>
        </Grid>
        <Grid size={12}>
          {entries.length > 0 && <Table columns={columns} data={entries} />}
        </Grid>
      </Grid>
      <LogbookEntryForm
        entryId={selectedEntryId}
        isDrawerOpen={isDrawerOpen}
        mode={entryFormMode}
        onOpenClose={(mode) => onOpenCloseEntryForm(mode)}
      />
    </Box>
  );
};

export default Logbook;
