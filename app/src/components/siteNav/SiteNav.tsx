import { useEffect, useState } from 'react';
import { ISiteNavProps } from './ISiteNavProps';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/appContext/UseAppContext';
import {
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Navbar,
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
  const [pages, setPages] = useState<{ name: string; url: string; }[]>([]);
  const httpClient: AxiosInstance = useHttpClient();
  const appContext = useAppContext();
  const isAuthenticated = useIsAuthenticated();
  const { getAccessToken } = useAccessToken();
  const { inProgress, instance } = useMsal();
  const navigate = useNavigate();
  const getPages = () => {
    const pages = [
      {
        name: 'Logbook',
        url: '/'
      }
    ];

    if (isAuthenticated) {
      pages.push({
        name: 'Pilots',
        url: '/pilots'
      })
    }

    setPages(pages)
  };
  const handleSignIn = () => {
    instance.loginRedirect({
      scopes: [`api://${import.meta.env.VITE_CLIENT_ID}/user_impersonation`]
    });
  };
  const handleSignOut = () => {
    instance.logoutRedirect();
  };
  const getUserProfile = async (accessToken: string): Promise<User> => {
    try {
      const response: AxiosResponse = await httpClient.get(`api/user/profile`, {
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
      const response: AxiosResponse = await httpClient.get(`api/user/photo`, {
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
  const handlePageClick = (url: string) => {
    navigate(url);
  };

  const Settings = () => {
    return (
      <MenuItem onClick={handleSignOut}>
        <SignOutIcon />
        <Typography sx={{ marginLeft: '10px', textAlign: 'center' }}>
          Sign Out
        </Typography>
      </MenuItem>
    );
  };

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
      getPages();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    getPages();
  }, [])

  return (
    <Navbar
      handlePageClick={handlePageClick}
      handleSignIn={handleSignIn}
      isAuthenticated={isAuthenticated}
      logo={<PlaneIcon size="2x" />}
      pages={pages}
      settings={<Settings />}
      userPhoto={userPhoto}
    />
  );
};

export default SiteNav;