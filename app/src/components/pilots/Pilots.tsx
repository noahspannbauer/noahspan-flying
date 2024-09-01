import { useState } from 'react';
import PilotForm from '../pilotForm/PilotForm';
import {
  Button,
  Card,
  PlusIcon,
  Typography,
  Menu,
  MenuItem,
  MenuHandler,
  MenuList
} from '@noahspan/noahspan-components';

const Pilots: React.FC<unknown> = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const onOpenCloseDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    // <Card className="mt-6 p-6">
    <div className="grid grid-cols-1 gap-4">
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
        <Menu placement="bottom-end">
          <MenuHandler>
            <div>
              <Button>Menu</Button>
            </div>
          </MenuHandler>
          <MenuList>
            <MenuItem>List Item 1</MenuItem>
          </MenuList>
        </Menu>
      </div>

      <PilotForm
        isDrawerOpen={isDrawerOpen}
        onOpenCloseDrawer={onOpenCloseDrawer}
      />
    </div>
    //</Card>
  );
};

export default Pilots;
