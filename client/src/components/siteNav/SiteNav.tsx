import { useEffect, useState } from 'react';
import { useAppContext } from '../../hooks/appContext/UseAppContext';
import { AxiosResponse } from 'axios';
import { User } from '@microsoft/microsoft-graph-types';
import { useOidc } from '../../auth/oidcConfig';
import { Avatar, Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, DropdownTrigger, DropdownMenu, DropdownItem, Dropdown } from '@heroui/react';
import httpClient from '../../httpClient/httpClient'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faSignIn, faSignOut } from '@fortawesome/free-solid-svg-icons'
import { useLocation } from 'react-router-dom';

const SiteNav = () => {
  const [userPhoto, setUserPhoto] = useState<string>();
  const appContext = useAppContext();
  const { isUserLoggedIn, logout, login } = useOidc()
  const { pathname } = useLocation()
  const pages = [
    {
      name: 'Flights',
      path: '/'
    },
    {
      name: 'Logbook',
      path: '/logbook'
    },
    {
      name: 'Pilots',
      path: '/pilots'
    }
  ];
  const getUserProfile = async (): Promise<User> => {
    try {
      const response: AxiosResponse = await httpClient.get(`api/msgraph/profile`);
      const userProfile: User = response.data;

      return userProfile;
    } catch (error) {
      throw new Error();
    }
  };
  const getUserPhoto = async (): Promise<string> => {
    try {
      const response: AxiosResponse = await httpClient.get(`api/msgraph/photo`, {
        responseType: 'arraybuffer'
      });
      const arrayBufferView = new Uint8Array(response.data);
      const blob = new Blob([arrayBufferView], { type: 'image/png' });
      const imageUrl = window.URL.createObjectURL(blob);

      return imageUrl;
    } catch (error) {
      throw new Error();
    }
  };

  useEffect(() => {
    const setUserProfile = async () => {
      try {
        const userProfile = await getUserProfile();
        const userPhoto = await getUserPhoto();

        setUserPhoto(userPhoto);

        appContext.dispatch({
          type: 'SET_USER_PROFILE',
          payload: userProfile
        });
      } catch (error) {
        console.log(error);
      } 
    };

    if (
      isUserLoggedIn &&
      Object.keys(appContext.state.userProfile).length === 0
    ) {
      setUserProfile();
    }
  }, [isUserLoggedIn]);

  return (
    <Navbar isBordered maxWidth='full' position='static'>
      <NavbarContent>
        <NavbarBrand>
          <img
            height={35}
            width={35}
            src='noahspan-logo.png'
            style={{ marginRight: '5px' }}
          />
          <FontAwesomeIcon icon={faPlane} size='2x' />
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify='center'>
        {pages.length > 0 && pages.map((page, index) => {
          return (
            <NavbarItem isActive={pathname === page.path ? true : false} key={index}>
              <Link color={pathname === page.path ? 'primary' : 'foreground'} href={page.path}>
                {page.name}
              </Link>
            </NavbarItem>
          )
        })}
      </NavbarContent>
      <NavbarContent justify='end'>
        {!isUserLoggedIn &&
          <Button
            color='default'
            onPress={() => login()}
            startContent={<FontAwesomeIcon icon={faSignIn} />}
          >
            Sign In
          </Button>
        }
        {isUserLoggedIn &&
          <Dropdown>
            <DropdownTrigger>
              <Avatar name={appContext.state.userProfile.displayName?.toString()} src={userPhoto}></Avatar>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key='signout' onPress={() => logout({redirectTo: 'specific url', url: '/'})} startContent={<FontAwesomeIcon icon={faSignOut} />}>
                Sign Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        }
      </NavbarContent>
    </Navbar>
  );
};

export default SiteNav;