import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/appContext/UseAppContext';
import {
  Dropdown,
  Icon, 
  IconName,
  Navbar,
} from '@noahspan/noahspan-components';
import { useHttpClient } from '../../hooks/httpClient/UseHttpClient';
import { AxiosInstance, AxiosResponse } from 'axios';
import { User } from '@microsoft/microsoft-graph-types';
import { getOidc, useOidc } from '../../auth/oidcConfig';

const SiteNav = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userPhoto, setUserPhoto] = useState<string>();
  const [pages, setPages] = useState<{ name: string; url: string; }[]>([]);
  const httpClient: AxiosInstance = useHttpClient();
  const appContext = useAppContext();
  const { isUserLoggedIn, login, logout } = useOidc()
  const navigate = useNavigate();
  const getPages = () => {
    const pages = [
      {
        name: 'Flights',
        url: '/'
      },
      {
        name: 'Logbook',
        url: '/logbook'
      },
      {
        name: 'Pilots',
        url: '/pilots'
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

  const Settings = () => {
    return (
      <div>
        <Icon iconName={IconName.SIGN_OUT} />
        <span>
          Sign Out
        </span>
      </div>
    );
  };

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

  return (
    <Navbar
      authenticated={isUserLoggedIn}
      color='base'
      handlePageClick={handlePageClick}
      handleSignIn={handleSignIn}
      logo={<Icon className='mt-1' iconName={IconName.PLANE} size="2x" />}
      pages={pages}
      settings={<Settings />}
      userPhoto={userPhoto}
    />
  );
};

export default SiteNav;