import { useEffect, useState } from 'react';
import { ISiteNavProps } from './ISiteNavProps';
// import { Link as ReactRouterLink } from 'react-router-dom';
import { useAppContext } from '../../hooks/appContext/UseAppContext';
import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Navbar,
  NavbarBrand,
  NavbarLinks,
  NavbarMenu,
  NavbarItemProps,
  PlaneIcon,
  SignOutIcon,
  Spinner,
  Typography
} from '@noahspan/noahspan-components';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { useAccessToken } from '../../hooks/accessToken/UseAcessToken';
import { useHttpClient } from '../../hooks/httpClient/UseHttpClient';
import { AxiosInstance, AxiosResponse } from 'axios';
import { User } from '@microsoft/microsoft-graph-types';
import { EventMessage, EventPayload, EventType } from '@azure/msal-browser';

type EventPayloadExtended = EventPayload & { accessToken: string };

const SiteNav: React.FC<unknown> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userPhoto, setUserPhoto] = useState<string>();
  const httpClient: AxiosInstance = useHttpClient();
  const appContext = useAppContext();
  const isAuthenticated = useIsAuthenticated();
  const { getAccessToken } = useAccessToken();
  const { inProgress, instance } = useMsal();
  const navItems: NavbarItemProps[] = [
    {
      name: 'Pilots',
      url: '#'
    }
  ];
  const handleSignIn = async () => {
    await instance.loginRedirect({
      scopes: [`api://${import.meta.env.VITE_CLIENT_ID}/user_impersonation`]
    });
  };
  const handleSignOut = () => {
    instance.logoutRedirect();
  };
  const getUserProfile = async (accessToken: string): Promise<User> => {
    try {
      const response: AxiosResponse = await httpClient.get(`api/userProfile`, {
        headers: {
          Authorization: accessToken
        }
      });
      const userProfile: User = response.data;

      return userProfile;
    } catch (error) {
      throw new Error();
    }
  };
  const getUserPhoto = async (accessToken: string): Promise<string> => {
    try {
      const response: AxiosResponse = await httpClient.get(`api/userPhoto`, {
        headers: {
          Authorization: accessToken
        },
        responseType: 'arraybuffer'
      });
      const arrayBufferView = new Uint8Array(response.data);
      const blob = new Blob([arrayBufferView], { type: 'image/png' });
      const imageUrl = window.URL.createObjectURL(blob);

      return imageUrl;
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  };

  useEffect(() => {
    const callback = instance.addEventCallback(
      async (message: EventMessage) => {
        if (message.eventType === EventType.LOGIN_SUCCESS) {
          try {
            setLoading(true);

            const eventPayload: EventPayloadExtended =
              message.payload as EventPayloadExtended;
            const userProfile: User = await getUserProfile(
              eventPayload.accessToken
            );
            const userPhoto = await getUserPhoto(eventPayload.accessToken);

            appContext.dispatch({
              type: 'SET_USER_PROFILE',
              payload: userProfile
            });
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      if (callback) {
        instance.removeEventCallback(callback);
        appContext.dispatch({ type: 'SET_USER_PROFILE', payload: {} });
      }
    };
  }, []);

  useEffect(() => {
    const setUserProfile = async () => {
      try {
        setLoading(true);

        const accessToken: string = await getAccessToken();
        const userProfile = await getUserProfile(accessToken);
        const userPhoto = await getUserPhoto(accessToken);

        setUserPhoto(userPhoto);

        appContext.dispatch({
          type: 'SET_USER_PROFILE',
          payload: userProfile
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (
      isAuthenticated &&
      Object.keys(appContext.state.userProfile).length === 0
    ) {
      setUserProfile();
    }
  }, [isAuthenticated]);

  return (
    <Navbar className="mt-6">
      <NavbarBrand>
        <img height={40} width={40} src="noahspan-logo.png" />{' '}
        <PlaneIcon size="2x" />
      </NavbarBrand>
      <NavbarLinks items={navItems} />
      <NavbarMenu>
        <div className="flex items-center gap-2 hidden lg:inline-block">
          {!loading && isAuthenticated && (
            <Menu placement="bottom-end">
              <MenuHandler>
                <>
                  {/* {userPhoto && */}
                  {/* <img className='rounded-full' src={userPhoto} /> */}
                  {/* } */}
                  {/* {!userPhoto && */}
                  <div className="rounded-full text-white text-center pt-2 bg-black h-[40px] w-[40px]">
                    NS
                  </div>

                  {/* <div className="flex gap-2">
                  <div className='flex-none'>
                    
                  </div>
                  <Button className='flex-1' variant="text" size="sm">
                    {appContext.state.userProfile.displayName}
                  </Button>
                </div> */}
                </>
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={handleSignOut}>
                  <Typography
                    className="flex justify-center gap-3"
                    variant="small"
                  >
                    <SignOutIcon size="lg" />
                    Sign Out
                  </Typography>
                </MenuItem>
              </MenuList>
            </Menu>
          )}
          {loading && isAuthenticated && (
            <div className="flex justify-center gap-3">
              <Spinner size="xs" />
              <Typography variant="small">Loading...</Typography>
            </div>
          )}
          {!isAuthenticated && (
            <Button
              variant="text"
              size="sm"
              onClick={handleSignIn}
              loading={inProgress === InteractionStatus.Login ? true : false}
            >
              Sign In
            </Button>
          )}
        </div>
        {/* <IconButton
          variant='text'
          className='ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden'
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          <FontAwesomeIcon icon={faBars} size='2x' />
        </IconButton> */}
      </NavbarMenu>
    </Navbar>
  );

  // return (
  //   <Navbar
  //     classNames={{
  //       base: 'bg-transparent z-0'
  //     }}
  //     isBlurred={false}
  //     maxWidth="full"
  //     data-testid="flying-navbar"
  //   >
  //     <NavbarBrand>
  //       <Logo className="pr-3" height={50} width={50} data-testid="logo" />
  //       <Plane size="2xl" />
  //     </NavbarBrand>
  //     <NavbarContent justify="center">
  //       <NavbarItem>
  //         {appContext.state.featureFlags.find(
  //           (featureFlag) => featureFlag.key === 'flying-pilots'
  //         )?.enabled && (
  //           <Link>
  //             <ReactRouterLink to="/">Pilots</ReactRouterLink>
  //           </Link>
  //         )}
  //       </NavbarItem>
  //     </NavbarContent>
  //     <NavbarContent justify='end'>
  //       <Login
  //         loginCompleted={loginCompleted}
  //         loginView='compact'
  //       />
  //     </NavbarContent>
  //   </Navbar>
  // );
};

export default SiteNav;
