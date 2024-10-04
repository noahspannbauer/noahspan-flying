import { useEffect, useState } from 'react';
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
import { useHttpClient } from '../../hooks/httpClient/UseHttpClient';
import { AxiosInstance, AxiosResponse } from 'axios';
import { useAccessToken } from '../../hooks/accessToken/UseAcessToken';
import { useIsAuthenticated } from '@azure/msal-react';
import { PilotFormMode } from '../pilotForm/PilotForm';

const Pilots: React.FC<unknown> = () => {
  const httpClient: AxiosInstance = useHttpClient();
  const isAuthenticated = useIsAuthenticated();
  const { getAccessToken } = useAccessToken();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pilotFormMode, setPilotFormMode] = useState<PilotFormMode>(
    PilotFormMode.CANCEL
  );
  const [selectedPilotId, setSelectedPilotId] = useState<string | undefined>();
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const onOpenClosePilotForm = (mode: PilotFormMode, pilotId?: string) => {
    switch (mode) {
      case PilotFormMode.ADD:
      case PilotFormMode.EDIT:
      case PilotFormMode.VIEW:
        setPilotFormMode(mode);
        setSelectedPilotId(pilotId);
        setIsDrawerOpen(true);
        break;
      case PilotFormMode.CANCEL:
        setPilotFormMode(mode);
        setSelectedPilotId(undefined);
        setIsDrawerOpen(false);
        break;
    }
  };

  type Pilot = {
    partitionKey: string;
    rowKey: string;
    id: string;
    name: string;
  };

  const columns: TableColumnDef[] = [
    {
      accessorKey: 'name',
      header: 'Name'
    },
    {
      id: 'actions',
      header: 'Actions',
      cellProps: {
        className: 'text-end'
      },
      cell: (info: any) => {
        const pilotId = info.row.original.rowKey;
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
              <MenuItem
                className="flex gap-3"
                onClick={() =>
                  onOpenClosePilotForm(PilotFormMode.EDIT, pilotId)
                }
              >
                <PenIcon size="lg" />
                Edit
              </MenuItem>
              <MenuItem
                className="flex gap-3"
                onClick={() =>
                  onOpenClosePilotForm(PilotFormMode.VIEW, pilotId)
                }
              >
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

  useEffect(() => {
    const getPilots = async () => {
      try {
        const config = isAuthenticated
          ? { headers: { Authorization: await getAccessToken() } }
          : {};
        const response: AxiosResponse = await httpClient.get(
          `api/pilots`,
          config
        );
        console.log(response.data);
        setPilots(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getPilots();
  }, []);

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
            onClick={() => onOpenClosePilotForm(PilotFormMode.ADD)}
            data-testid="pilot-add-button"
          >
            <PlusIcon size="lg" />
            Add Pilot
          </Button>
        </div>
        {pilots.length > 0 && <Table defaultData={pilots} columns={columns} />}
      </div>
      <PilotForm
        isDrawerOpen={isDrawerOpen}
        mode={pilotFormMode}
        onOpenClose={(mode) => onOpenClosePilotForm(mode)}
        pilotId={selectedPilotId}
      />
    </>
  );
};

export default Pilots;
