import { Alert, Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Tab, Tabs } from "@heroui/react";
import { LogbookDrawerProps } from "./LogbookDrawerProps.interface";
import LogForm from "../logForm/LogForm";
import TracksForm from "../tracksForm/TracksForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faMapLocationDot, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FormProvider, useForm } from "react-hook-form";
import { FormMode } from "../../enums/formMode";
import httpClient from "../../httpClient/httpClient";
import { AxiosError } from "axios";
import { useLogbookContext } from "../../hooks/logbookContext/UseLogbookContext";
import { Key, useState } from "react";

const LogbookDrawer = ({ onOpenClose }: LogbookDrawerProps) => {
  const [activeTab, setActiveTab] = useState<Key>('time');
  const defaultValues = {
    pilotId: '',
    date: null,
    aircraftMakeModel: '',
    aircraftIdentity: '',
    routeFrom: '',
    routeTo: '',
    durationOfFlight: null,
    singleEngineLand: null,
    simulatorAtd: null,
    landingsDay: null,
    landingsNight: null,
    groundTrainingReceived: null,
    flightTrainingReceived: null,
    crossCountry: null,
    night: null,
    solo: null,
    pilotInCommand: null,
    instrumentActual: null,
    instrumentSimulated: null,
    instrumentApproaches: null,
    instrumentHolds: null,
    instrumentNavTrack: null,
    notes: ''
  };
  const methods = useForm();
  const logbookContext = useLogbookContext()

  const onCancel = () => {
    methods.reset(defaultValues);
    logbookContext.dispatch({ type: 'SET_IS_FORM_DISABLED', payload: false });
    onOpenClose(FormMode.CANCEL);
  };

  const onSubmit = async (data: unknown) => {
    try {
      logbookContext.dispatch({ type: 'SET_IS_FORM_LOADING', payload: true });

      if (!logbookContext.state.selectedLogId) {
        await httpClient.post(`api/logs`, data);
      } else {
        await httpClient.put(`api/logs/${logbookContext.state.selectedLogId}`, data);
      }

      methods.reset(defaultValues);
      logbookContext.dispatch({ type: 'SET_IS_FORM_DISABLED', payload: false });
      logbookContext.dispatch({ type: 'SET_FORM_MODE', payload: FormMode.CANCEL });
    } catch (error) {
      const axiosError = error as AxiosError;

      logbookContext.dispatch({ type: 'SET_FORM_ALERT', payload: { severity: 'danger', message: axiosError.message }});
    } finally {
      logbookContext.dispatch({ type: 'SET_IS_FORM_LOADING', payload: false });
    }
  };

  const onSelectedKeyChanged = (key: React.Key) => {
    setActiveTab(key)
  }

  return (
    <Drawer
      closeButton={
        <Button isIconOnly>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
      }
      isOpen={logbookContext.state.isDrawerOpen}
      onClose={onCancel}
    >
      <DrawerContent>
        <FormProvider {...methods}>
          <form className='prose max-w-none' onSubmit={methods.handleSubmit(onSubmit)} style={{ paddingBottom: '50px' }}>
            <DrawerHeader>
              {`${logbookContext.state.formMode.toString().toLowerCase().charAt(0).toUpperCase() + logbookContext.state.formMode.toString().slice(1).toLowerCase()} Entry`}
            </DrawerHeader>
            <DrawerBody>
              {logbookContext.state.formAlert && (
                <div className='col-span-12'>
                  <Alert
                    onClose={() =>
                      logbookContext.dispatch({ type: 'SET_FORM_ALERT', payload: undefined })
                    }
                    color={logbookContext.state.formAlert.severity}
                    title={logbookContext.state.formAlert.message}
                  />
                </div>
              )}
              <Tabs 
                onSelectionChange={onSelectedKeyChanged}
                selectedKey={activeTab as string}
              >
                <Tabs.ListContainer>
                  <Tabs.List>
                    <Tabs.Tab
                      id='time'
                    >
                      <FontAwesomeIcon icon={faClock} />
                      Time
                      <Tabs.Indicator />
                    </Tabs.Tab>
                    {logbookContext.state.formMode !== FormMode.ADD &&
                      <Tabs.Tab
                        id='tracks'
                      >
                        <FontAwesomeIcon icon={faMapLocationDot} />
                        Tracks
                        <Tabs.Indicator />
                      </Tabs.Tab>
                    }
                  </Tabs.List>
                </Tabs.ListContainer>
                <Tabs.Panel id='time'>
                  <LogForm />
                </Tabs.Panel>
                <Tabs.Panel id='tracks'>
                  <TracksForm />
                </Tabs.Panel>
              </Tabs>
            </DrawerBody>
            {activeTab !== 'tracks' &&
              <DrawerFooter>
                <div className='grid grid-cols-12 gap-3'>
                  <div className='col-span-12 justify-self-end self-center'>
                    <Button
                      isDisabled={
                        logbookContext.state.isFormDisabled && logbookContext.state.formMode.toString() !== FormMode.VIEW
                          ? logbookContext.state.isFormDisabled
                          : false
                      }
                      onPress={onCancel}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                      {logbookContext.state.formMode.toString() !== FormMode.VIEW ? 'Cancel' : 'Close'}
                    </Button>
                    {logbookContext.state.formMode.toString() !== FormMode.VIEW && (
                      <Button
                        className='ml-[10px]'
                        isDisabled={logbookContext.state.isFormDisabled}
                        type="submit"
                        variant='primary'
                      >
                        <FontAwesomeIcon icon={faSave} />
                        Save
                      </Button>
                    )}
                  </div>
                </div>
              </DrawerFooter>
            }
          </form>
        </FormProvider>
      </DrawerContent>
    </Drawer>
  )
}

export default LogbookDrawer