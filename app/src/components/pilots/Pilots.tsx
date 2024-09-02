import { useState } from 'react';
import PilotForm from '../pilotForm/PilotForm';
import {
  Button,
  EllipsisVerticalIcon,
  EyeIcon,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  PenIcon,
  PlusIcon,
  Table,
  TableColumnDef,
  TrashIcon,
  Typography
} from '@noahspan/noahspan-components';

const Pilots: React.FC<unknown> = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const onOpenCloseDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  type Person = {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    status: string;
    progress: number;
  };

  const data: Person[] = [
    {
      firstName: 'tanner',
      lastName: 'linsley',
      age: 24,
      visits: 100,
      status: 'In Relationship',
      progress: 50
    },
    {
      firstName: 'tandy',
      lastName: 'miller',
      age: 40,
      visits: 40,
      status: 'Single',
      progress: 80
    },
    {
      firstName: 'joe',
      lastName: 'dirte',
      age: 45,
      visits: 20,
      status: 'Complicated',
      progress: 10
    }
  ];

  const columns: TableColumnDef[] = [
    {
      accessorKey: 'firstName',
      header: 'First Name',
      cell: ({ getValue }) => (
        <div>
          {getValue<string>().charAt(0).toUpperCase() +
            getValue<string>().slice(1)}
        </div>
      )
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
      cell: ({ getValue }) => (
        <div>
          {getValue<string>().charAt(0).toUpperCase() +
            getValue<string>().slice(1)}
        </div>
      )
    },
    {
      accessorKey: 'age',
      header: 'Age',
      cellProps: {
        className: 'text-right'
      }
    },
    {
      accessorKey: 'visits',
      header: 'Visits',
      cellProps: {
        className: 'text-right'
      }
    },
    {
      accessorKey: 'status',
      header: 'Status'
    },
    {
      accessorKey: 'progress',
      header: 'Progress',
      cellProps: {
        className: 'text-right'
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cellProps: {
        className: 'text-center'
      },
      cell: () => {
        return (
          <Menu placement="bottom-end">
            <MenuHandler>
              <div>
                <IconButton variant="text">
                  <EllipsisVerticalIcon size="xl" />
                </IconButton>
              </div>
            </MenuHandler>
            <MenuList>
              <MenuItem className="flex gap-3">
                <PenIcon size="lg" />
                Edit
              </MenuItem>
              <MenuItem className="flex gap-3">
                <EyeIcon size="lg" />
                View
              </MenuItem>
              <hr className="my-3" />
              <MenuItem className="flex gap-3">
                <TrashIcon size="lg" />
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        );
      },
      enableSorting: false
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 gap-4 w-full rounded-xl py-4 px-8 shadow-md backdrop-saturate-200 backdrop-blur-2xl bg-opacity-80 border border-white/80 bg-white mt-6">
        <div className="col-span-1">
          <Typography variant="h2">Pilots</Typography>
        </div>
        <div className="col-span-1 justify-self-end">
          <Button
            className="flex justify-center gap-3"
            variant="filled"
            onClick={onOpenCloseDrawer}
            data-testid="add-pilot-button"
          >
            <PlusIcon size="lg" />
            Add Pilot
          </Button>
        </div>
        <Table defaultData={data} columns={columns}></Table>
      </div>
      <PilotForm
        isDrawerOpen={isDrawerOpen}
        onOpenCloseDrawer={onOpenCloseDrawer}
      />
    </>
  );
};

export default Pilots;
