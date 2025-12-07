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
    <div className='drawer drawer-end'
      // closeButton={
      //   <Button isIconOnly>
      //     <FontAwesomeIcon icon={faXmark} />
      //   </Button>
      // }
      // isOpen={logbookContext.state.isDrawerOpen}
      // onClose={onCancel}
    >
      <input type='checkbox' className='drawer-toggle' onChange={() => {}} checked={logbookContext.state.isDrawerOpen} />
      <div className="drawer-side">
        <label
          htmlFor='my-drawer-1'
          aria-label='close-sidebar'
          className='drawer-overlay'
        ></label>
        <div className='menu bg-base-100 text-base-content min-h-full p-4' style={{ width: '50%' }}>
          <FormProvider {...methods}>
            <form className='prose max-w-none' onSubmit={methods.handleSubmit(onSubmit)} style={{ paddingBottom: '50px' }}>
              <h2>
                {`${logbookContext.state.formMode.toString().toLowerCase().charAt(0).toUpperCase() + logbookContext.state.formMode.toString().slice(1).toLowerCase()} Entry`}
              </h2>
                {/* {logbookContext.state.formAlert && (
                  <div className='col-span-12'>
                    <Alert
                      onClose={() =>
                        logbookContext.dispatch({ type: 'SET_FORM_ALERT', payload: undefined })
                      }
                      color={logbookContext.state.formAlert.severity}
                      title={logbookContext.state.formAlert.message}
                    />
                  </div>
                )} */}
                <LogForm />
                {/* <div className='tabs tabs-lift'>
                  <label className='tab'>
                    <input type='radio' name='my_tabs_1' />
                    <FontAwesomeIcon icon={faClock} />
                    Time
                  </label>
                  <div className="tab-content bg-base-100 border-base-300 p-6">
                    <LogForm />
                  </div>
                  <label className='tab'>
                    <input type='radio' name='my_tabs_1' />
                    <FontAwesomeIcon icon={faMapLocationDot} />
                    Tracks
                  </label>
                  <div className="tab-content bg-base-100 border-base-300 p-6">
                    <TracksForm />
                  </div> */}
                  {/* <input type='radio' name='my_tabs_1' className='tab' aria-label='Tracks' /> */}
                  {/* <input
                    key='time'
                    title={
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faClock} />
                        <span>Time</span>
                      </div>
                    }
                  >
                    
                  </Tab>
                  {logbookContext.state.formMode !== FormMode.ADD &&
                    <Tab
                      key='tracks'
                      title={
                        <div className="flex items-center space-x-2">
                          <FontAwesomeIcon icon={faMapLocationDot} />
                          <span>Tracks</span>
                        </div>
                      }
                    >
                      <TracksForm />
                    </Tab>
                  } */}
                </div>
                {activeTab !== 'tracks' &&
                  <div>
                    <div className='grid grid-cols-12 gap-3'>
                      <div className='col-span-12 justify-self-end self-center'>
                        <button
                          className='btn'
                          disabled={
                            logbookContext.state.isFormDisabled && logbookContext.state.formMode.toString() !== FormMode.VIEW
                              ? logbookContext.state.isFormDisabled
                              : false
                          }
                          onClick={onCancel}
                        >
                          <FontAwesomeIcon icon={faXmark} />
                          {logbookContext.state.formMode.toString() !== FormMode.VIEW ? 'Cancel' : 'Close'}
                        </button>
                        {logbookContext.state.formMode.toString() !== FormMode.VIEW && (
                          <button
                            className='btn btn-primary ml-[10px]'
                            disabled={logbookContext.state.isFormDisabled}
                            type="submit"
                          >
                            <FontAwesomeIcon icon={faSave} />
                            Save
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                }
            </form>
          </FormProvider>
        </div>
        </div>
    </div>
  )
}

export default LogbookDrawer