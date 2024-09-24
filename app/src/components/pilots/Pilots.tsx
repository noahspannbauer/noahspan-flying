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

const Pilots: React.FC<unknown> = () => {
  const httpClient: AxiosInstance = useHttpClient();
  const { getAccessToken } = useAccessToken();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const onOpenCloseDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
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
    }
    // {
    //   id: 'actions',
    //   header: 'Actions',
    //   cellProps: {
    //     className: 'text-center'
    //   },
    //   cell: () => {
    //     return (
    //       <Menu placement="bottom-end">
    //         <MenuHandler>
    //           <div>
    //             <IconButton variant="text">
    //               <EllipsisVerticalIcon size="xl" />
    //             </IconButton>
    //           </div>
    //         </MenuHandler>
    //         <MenuList>
    //           <MenuItem className="flex gap-3">
    //             <PenIcon size="lg" />
    //             Edit
    //           </MenuItem>
    //           <MenuItem className="flex gap-3">
    //             <EyeIcon size="lg" />
    //             View
    //           </MenuItem>
    //           <hr className="my-3" />
    //           <MenuItem className="flex gap-3">
    //             <TrashIcon size="lg" />
    //             Delete
    //           </MenuItem>
    //         </MenuList>
    //       </Menu>
    //     );
    //   },
    //   enableSorting: false
    // }
  ];

  useEffect(() => {
    const getPilots = async () => {
      try {
        const accessToken: string = await getAccessToken();
        const response: AxiosResponse = await httpClient.get(`api/pilots`, {
          headers: {
            Authorization: accessToken
          }
        });
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
            onClick={onOpenCloseDrawer}
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
        onOpenCloseDrawer={onOpenCloseDrawer}
      />
    </>
  );
};

export default Pilots;
