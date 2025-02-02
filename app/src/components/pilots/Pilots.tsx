import { useEffect, useState } from 'react';
import PilotForm from '../pilotForm/PilotForm';
import {
  Box,
  Button,
  ColumnDef,
  EllipsisVerticalIcon,
  EyeIcon,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  PenIcon,
  PlusIcon,
  Table,
  TrashIcon,
  Typography
} from '@noahspan/noahspan-components';
import { useHttpClient } from '../../hooks/httpClient/UseHttpClient';
import { AxiosInstance, AxiosResponse } from 'axios';
import { useAccessToken } from '../../hooks/accessToken/UseAcessToken';
import { useIsAuthenticated } from '@azure/msal-react';
import { FormMode } from '../../enums/formMode';

type Pilot = {
  partitionKey: string;
  rowKey: string;
  id: string;
  name: string;
};

const Pilots: React.FC<unknown> = () => {
  const httpClient: AxiosInstance = useHttpClient();
  const isAuthenticated = useIsAuthenticated();
  const { getAccessToken } = useAccessToken();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pilotFormMode, setPilotFormMode] = useState<FormMode>(FormMode.CANCEL);
  const [selectedPilotId, setSelectedPilotId] = useState<string | undefined>();
  const [pilots, setPilots] = useState<Pilot[]>([]);

  const getPilots = async (): Promise<Pilot[]> => {
    try {
      const config = isAuthenticated
        ? { headers: { Authorization: await getAccessToken() } }
        : {};
      const response: AxiosResponse = await httpClient.get(
        `api/pilots`,
        config
      );
      const pilots: Pilot[] = response.data;

      return pilots;
    } catch (error) {
      throw new Error('broken');
    }
  };

  const onOpenClosePilotForm = async (mode: FormMode, pilotId?: string) => {
    switch (mode) {
      case FormMode.ADD:
      case FormMode.EDIT:
      case FormMode.VIEW:
        setPilotFormMode(mode);
        setSelectedPilotId(pilotId);
        setIsDrawerOpen(true);
        break;
      case FormMode.CANCEL:
        const pilots = await getPilots();

        setPilots(pilots);
        setPilotFormMode(mode);
        setSelectedPilotId(undefined);
        setIsDrawerOpen(false);
        break;
    }
  };

  interface ActionMenuProps {
    pilotId: string;
  }

  const ActionMenu = ({ pilotId }: ActionMenuProps) => {
    const [anchorElAction, setAnchorElAction] = useState<null | HTMLElement>(
      null
    );

    const onOpenActionMenu = (event: React.MouseEvent<HTMLElement>) => {
      console.log(event);
      setAnchorElAction(event.currentTarget);
    };

    const onCloseActionMenu = () => {
      setAnchorElAction(null);
    };

    return (
      <div>
        <IconButton onClick={onOpenActionMenu}>
          <EllipsisVerticalIcon size="sm" />
        </IconButton>
        <Menu
          anchorEl={anchorElAction}
          keepMounted
          open={Boolean(anchorElAction)}
          onClose={onCloseActionMenu}
        >
          <MenuItem
            onClick={() => onOpenClosePilotForm(FormMode.EDIT, pilotId)}
          >
            <ListItemIcon>
              <PenIcon size="lg" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => onOpenClosePilotForm(FormMode.VIEW, pilotId)}
          >
            <ListItemIcon>
              <EyeIcon size="lg" />
            </ListItemIcon>
            <ListItemText>View</ListItemText>
          </MenuItem>
          <hr className="my-3" />
          <MenuItem>
            <ListItemIcon>
              <TrashIcon size="lg" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </div>
    );
  };

  const columns: ColumnDef<Pilot>[] = [
    {
      accessorKey: 'name',
      header: 'Name'
    },
    {
      header: 'Actions',
      cell: (info) => <ActionMenu pilotId={info.row.original.rowKey} />
    }
  ];

  useEffect(() => {
    const loadPilots = async () => {
      try {
        const pilots = await getPilots();

        setPilots(pilots);
      } catch (error) {
        console.log(error);
      }
    };

    loadPilots();
  }, []);

  return (
    <Box sx={{ margin: '20px' }}>
      <Grid container spacing={2}>
        <Grid size={11}>
          <Typography variant="h4">Pilots</Typography>
        </Grid>
        <Grid display="flex" justifyContent="right" size={1}>
          <Button
            onClick={() => onOpenClosePilotForm(FormMode.ADD)}
            startIcon={<PlusIcon />}
            variant="contained"
            data-testid="pilot-add-button"
          >
            Add Pilot
          </Button>
        </Grid>
        <Grid size={12}>
          {pilots.length > 0 && <Table columns={columns} data={pilots} />}
        </Grid>
      </Grid>
      <PilotForm
        isDrawerOpen={isDrawerOpen}
        mode={pilotFormMode}
        onOpenClose={(mode) => onOpenClosePilotForm(mode)}
        pilotId={selectedPilotId}
      />
    </Box>
  );
};

export default Pilots;
