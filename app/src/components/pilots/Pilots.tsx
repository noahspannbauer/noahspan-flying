import { useState } from 'react';
import PilotForm from '../pilotForm/PilotForm';
import {
  Button,
  Card,
  PlusIcon,
  Typography
} from '@noahspan/noahspan-components';

const Pilots: React.FC<unknown> = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const onOpenCloseDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Card className="mt-6 px-6 py-6">
      <div className="grid grid-cols-1 gap-4">
        <Typography variant="h3">Pilots</Typography>
        <Button
          className="flex items-center gap-3"
          variant="filled"
          onClick={onOpenCloseDrawer}
          data-testid="add-pilot-button"
        >
          <PlusIcon size="lg" />
          Add Pilot
        </Button>

        <PilotForm
          isDrawerOpen={isDrawerOpen}
          onOpenCloseDrawer={onOpenCloseDrawer}
        />
      </div>
    </Card>
  );
};

export default Pilots;
