import { useState } from 'react';
import PilotForm from '../pilotForm/PilotForm';
import { Button, DatePicker, Drawer } from '@noahspan/noahspan-components';

const Pilots: React.FC<unknown> = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const onOpenCloseDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="container mx-auto">
      <div className="px-6">
        <h1 role="heading">Pilots</h1>
        <Button
          variant="filled"
          onClick={onOpenCloseDrawer}
          // startContent={<FontAwesomeIcon icon={faPlus} />}
          data-testid="new-pilot-button"
        >
          New
        </Button>
        <DatePicker />
        <Drawer
          open={isDrawerOpen}
          placement="right"
          size={1000}
          data-testid="pilot-drawer"
        >
          <PilotForm />

          {/* <DrawerContent>
            <DrawerHeader>
              <h2>Add Pilot</h2>
            </DrawerHeader>
            <DrawerBody>
              <PilotForm />
            </DrawerBody>
            <DrawerFooter>
              <div className="flex gap-4 justify-end justify-self-center">
                <div>
                  <Button
                    color="default"
                    onClick={onOpenCloseDrawer}
                    data-testid="pilot-drawer-cancel-button"
                  >
                    Cancel
                  </Button>
                </div>
                <div>
                  <Button color="primary" onClick={onOpenCloseDrawer}>
                    Save
                  </Button>
                </div>
              </div>
            </DrawerFooter>
          </DrawerContent> */}
        </Drawer>
      </div>
    </div>
  );
};

export default Pilots;
