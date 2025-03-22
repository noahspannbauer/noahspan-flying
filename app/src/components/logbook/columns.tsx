import {
  ColumnDef,
  Icon,
  IconButton,
  IconName
} from '@noahspan/noahspan-components';
import { ILogbookEntry } from './ILogbookEntry';

const pilotName: ColumnDef<ILogbookEntry> = {
  id: 'pilotName',
  accessorKey: 'pilotName',
  header: 'Pilot'
}
const date: ColumnDef<ILogbookEntry> = {
  id: 'date',
  accessorKey: 'date',
  header: 'Date'
}
const aircraftMakeModel: ColumnDef<ILogbookEntry> = {
  id: 'aircraftMakeModel',
  accessorKey: 'aircraftMakeModel',
  header: 'Aircraft Make & Model'
}
const route: ColumnDef<ILogbookEntry> = {
  id: 'route',
  header: 'Route of Flight',
  meta: {
    headerAlign: 'center'
  },
  columns: [
    {
      id: 'routeFrom',
      accessorKey: 'routeFrom',
      header: 'From'
    },
    {
      id: 'routeTo',
      accessorKey: 'routeTo',
      header: 'To'
    }
  ]
}
const durationOfFlight: ColumnDef<ILogbookEntry> = {
  id: 'durationOfFlight',
  accessorKey: 'durationOfFlight',
  header: 'Duration Of Flight',
  meta: {
    align: 'right',
    headerAlign: 'right'
  },
  cell: (info: any) =>
    info.getValue() ? parseFloat(info.getValue()).toFixed(1) : ''
}
const notes: ColumnDef<ILogbookEntry> = {
  id: 'notes',
  accessorKey: 'notes',
  header: 'Notes'
}

export const unauthColumns: ColumnDef<ILogbookEntry>[] = [
  pilotName,
  date,
  aircraftMakeModel,
  route,
  durationOfFlight,
  notes
]

export const authColumns: ColumnDef<ILogbookEntry>[] = [
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
      align: 'right',
      headerAlign: 'right'
    },
    cell: (info: any) =>
      info.getValue() ? parseFloat(info.getValue()).toFixed(1) : ''
  },
  {
    id: 'landings',
    header: 'Landings',
    meta: {
      headerAlign: 'center'
    },
    columns: [
      {
        id: 'landingsDay',
        accessorKey: 'landingsDay',
        header: 'Day',
        meta: {
          align: 'right',
          headerAlign: 'right'
        }
      },
      {
        id: 'landingsNight',
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
        id: 'instrumentActual',
        accessorKey: 'instrumentActual',
        header: 'Actual',
        meta: {
          align: 'right',
          headerAlign: 'right'
        },
        cell: (info: any) =>
          info.getValue() ? parseFloat(info.getValue()).toFixed(1) : ''
      },
      {
        id: 'instrumentSimulated',
        accessorKey: 'instrumentSimulated',
        header: 'Simulated',
        meta: {
          align: 'right',
          headerAlign: 'right'
        },
        cell: (info: any) =>
          info.getValue() ? parseFloat(info.getValue()).toFixed(1) : ''
      },
      {
        id: 'instrumentApproaches',
        accessorKey: 'instrumentApproaches',
        header: 'Approaches',
        meta: {
          align: 'right',
          headerAlign: 'right'
        }
      },
      {
        id: 'instrumentHolds',
        accessorKey: 'instrumentHolds',
        header: 'Holds',
        meta: {
          align: 'right',
          headerAlign: 'right'
        }
      },
      {
        id: 'instrumentNavTrack',
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
        id: 'groundTrainingReceived',
        accessorKey: 'groundTrainingReceived',
        header: 'Ground Training Received',
        meta: {
          align: 'right',
          headerAlign: 'right'
        },
        cell: (info: any) =>
          info.getValue() ? parseFloat(info.getValue()).toFixed(1) : ''
      },
      {
        id: 'flightTrainingReceived',
        accessorKey: 'flightTrainingReceived',
        header: 'Flight Training Received',
        meta: {
          align: 'right',
          headerAlign: 'right'
        },
        cell: (info: any) =>
          info.getValue() ? parseFloat(info.getValue()).toFixed(1) : ''
      },
      {
        id: 'crossCountry',
        accessorKey: 'crossCountry',
        header: 'Cross Country',
        meta: {
          align: 'right',
          headerAlign: 'right'
        },
        cell: (info: any) =>
          info.getValue() ? parseFloat(info.getValue()).toFixed(1) : ''
      },
      {
        id: 'night',
        accessorKey: 'night',
        header: 'Night',
        meta: {
          align: 'right',
          headerAlign: 'right'
        },
        cell: (info: any) =>
          info.getValue() ? parseFloat(info.getValue()).toFixed(1) : ''
      },
      {
        id: 'solo',
        accessorKey: 'solo',
        header: 'Solo',
        meta: {
          align: 'right',
          headerAlign: 'right'
        },
        cell: (info: any) =>
          info.getValue() ? parseFloat(info.getValue()).toFixed(1) : ''
      },
      {
        id: 'pilotInCommand',
        accessorKey: 'pilotInCommand',
        header: 'Pilot In Command',
        meta: {
          align: 'right',
          headerAlign: 'right'
        },
        cell: (info: any) =>
          info.getValue() ? parseFloat(info.getValue()).toFixed(1) : ''
      }
    ]
  },
  notes
]