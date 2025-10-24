import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/appContext/UseAppContext';
import { AxiosResponse } from 'axios';
import { User } from '@microsoft/microsoft-graph-types';
import { getOidc, useOidc } from '../../auth/oidcConfig';
import { Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from '@heroui/react';
import httpClient from '../../httpClient/httpClient'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons'
import { useLocation } from 'react-router-dom';

const SiteNav = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userPhoto, setUserPhoto] = useState<string>();
  const [pages, setPages] = useState<{ name: string; path: string; }[]>([]);
  const appContext = useAppContext();
  const { isUserLoggedIn, login, logout } = useOidc()
  const navigate = useNavigate();
  const { pathname } = useLocation()
  const getPages = () => {
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

    setPages(pages)
  };
  const handleSignIn = () => {
    // auth.signinRedirect();
    // auth.signinRedirect({
    //   scope: `api://${import.meta.env.VITE_CLIENT_ID}/user_impersonation`
    // })
    login();
    // console.log(auth.user?.access_token)
  };
  const handleSignOut = () => {
    // auth.signoutRedirect();
    logout()
  };
  const getUserProfile = async (): Promise<User> => {
    try {
      const response: AxiosResponse = await httpClient.get(`api/user/profile`, {
        // headers: {
        //   Authorization: `Bearer ${accessToken}`
        // }
      });
      const userProfile: User = response.data;

      return userProfile;
    } catch (error) {
      throw new Error();
    }
  };
  const getUserPhoto = async (): Promise<string> => {
    try {
      const response: AxiosResponse = await httpClient.get(`api/user/photo`, {
        // headers: {
        //   Authorization: accessToken
        // },
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
  const handlePageClick = (url: string) => {
    navigate(url);
  };

  // const Settings = () => {
  //   return (
  //     <div>
  //       <Icon iconName={IconName.SIGN_OUT} />
  //       <span>
  //         Sign Out
  //       </span>
  //     </div>
  //   );
  // };

  useEffect(() => {
    const setUserProfile = async () => {
      try {
        setLoading(true);

        // const userProfile = await getUserProfile();
        // const userPhoto = await getUserPhoto();

        // setUserPhoto(userPhoto);

        // appContext.dispatch({
        //   type: 'SET_USER_PROFILE',
        //   payload: userProfile
        // });
        const oidc = await getOidc();

        if (oidc.isUserLoggedIn) {
          console.log((await oidc.getTokens()).accessToken)
        }
        
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (
      isUserLoggedIn &&
      Object.keys(appContext.state.userProfile).length === 0
    ) {
      console.log(isUserLoggedIn)
      console.log()
      setUserProfile();
      getPages();
    }
  }, [isUserLoggedIn]);

  useEffect(() => {
    getPages();
  }, [])

  useEffect(() => {
    console.log(pathname)
  }, [pathname])

  return (
    <Navbar isBordered maxWidth='full' position='static'>
      <NavbarBrand>
        <img
          height={35}
          width={35}
          src='noahspan-logo.png'
          style={{ marginRight: '5px' }}
        />
        <FontAwesomeIcon icon={faPlane} size='2x' />
      </NavbarBrand>
      <NavbarContent justify='center'>
        {pages.length > 0 && pages.map((page) => {
          return (
            <NavbarItem isActive={pathname === page.path ? true : false}>
              <Link color={pathname === page.path ? 'primary' : 'foreground'} href={page.path}>
                {page.name}
              </Link>
            </NavbarItem>
          )
        })}
      </NavbarContent>
      <NavbarContent justify='end'>
        <Button color='default' onClick={handleSignIn} variant='flat'>
          Sign In
        </Button>
      </NavbarContent>
    </Navbar>
  );
};

export default SiteNav;