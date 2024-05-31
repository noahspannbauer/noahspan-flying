import { useState } from 'react';
import SiteNav from '../siteNav/SiteNav';
import PilotForm from '../pilotForm/PilotForm';
import { Button } from '@nextui-org/react';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader
} from '@noahspan/noahspan-components';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Pilots: React.FC<unknown> = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const onOpenCloseDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="container mx-auto">
      <SiteNav />
      <div className="px-6">
        <h1 role="heading">Pilots</h1>
        <Button
          color="default"
          variant="light"
          onClick={onOpenCloseDrawer}
          startContent={<FontAwesomeIcon icon={faPlus} />}
          data-testid="new-pilot-button"
        >
          New
        </Button>
        <Drawer isOpen={isDrawerOpen} data-testid="pilot-drawer">
          <DrawerContent>
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
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default Pilots;
