import {
  CellContext,
  ColumnDef,
  HeaderContext,
} from '@noahspan/noahspan-components';
import { LogbookEntry } from './LogbookEntry.interface';

const columnTotal = (info: HeaderContext<LogbookEntry, unknown>): number => {
  const blah = info.table
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
const durationOfFlight: ColumnDef<LogbookEntry> = {
  id: 'durationOfFlight',
  accessorKey: 'durationOfFlight',
  header: 'Duration Of Flight',
  meta: {
    align: 'right',
    headerAlign: 'right'
  },
  cell: (info: CellContext<LogbookEntry, unknown>) =>
    info.getValue() ? parseFloat(info.getValue() as string).toFixed(1) : '',
  footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info).toFixed(1) : ''
}
const notes: ColumnDef<LogbookEntry> = {
  id: 'notes',
  accessorKey: 'notes',
  header: 'Notes'
}

export const unauthColumns: ColumnDef<LogbookEntry>[] = [
  pilotName,
  date,
  aircraftMakeModel,
  route,
  durationOfFlight,
  notes
]

export const authColumns: ColumnDef<LogbookEntry>[] = [
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
    cell: (info: CellContext<LogbookEntry, unknown>) =>
      info.getValue() ? parseFloat(info.getValue() as string).toFixed(1) : '',
    footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info).toFixed(1) : ''
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
        footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info) : '',
        meta: {
          align: 'right',
          headerAlign: 'right'
        }
      },
      {
        id: 'landingsNight',
        accessorKey: 'landingsNight',
        header: 'Night',
        footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info) : '',
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
        footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info).toFixed(1) : '',
        meta: {
          align: 'right',
          headerAlign: 'right'
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
          align: 'right',
          headerAlign: 'right'
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
          align: 'right',
          headerAlign: 'right'
        }
      },
      {
        id: 'instrumentHolds',
        accessorKey: 'instrumentHolds',
        header: 'Holds',
        footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info).toFixed(1) : '',
        meta: {
          align: 'right',
          headerAlign: 'right'
        }
      },
      {
        id: 'instrumentNavTrack',
        accessorKey: 'instrumentNavTrack',
        header: 'Nav/Track',
        footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info).toFixed(1) : '',
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
        footer: (info: HeaderContext<LogbookEntry, unknown>) => columnTotal(info) > 0 ? columnTotal(info).toFixed(1) : '',
        meta: {
          align: 'right',
          headerAlign: 'right'
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
          align: 'right',
          headerAlign: 'right'
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
          align: 'right',
          headerAlign: 'right'
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
          align: 'right',
          headerAlign: 'right'
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
          align: 'right',
          headerAlign: 'right'
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
          align: 'right',
          headerAlign: 'right'
        },
        cell: (info: CellContext<LogbookEntry, unknown>) =>
          info.getValue() ? parseFloat(info.getValue() as string).toFixed(1) : ''
      }
    ]
  },
  notes
]