import { useState } from 'react';
import PilotForm from '../pilotForm/PilotForm';
import { Button, PlusIcon, DatePicker } from '@noahspan/noahspan-components';

const Pilots: React.FC<unknown> = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const onOpenCloseDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const [date, setDate] = useState();

  return (
    <div className="container mx-auto">
      <div className="px-6">
        <h1 role="heading">Pilots</h1>
        <PlusIcon size="2xl" />
        <Button
          className="flex items-center gap-3"
          variant="filled"
          onClick={onOpenCloseDrawer}
          data-testid="add-pilot-button"
        >
          <PlusIcon size="lg" />
          Add Pilot
        </Button>

        <DatePicker
          handleDateChanged={(date) => console.log(date)}
          inputProps={{
            value: date
          }}
        />

        <PilotForm
          isDrawerOpen={isDrawerOpen}
          onOpenCloseDrawer={onOpenCloseDrawer}
        />
      </div>
    </div>
  );
};

export default Pilots;
