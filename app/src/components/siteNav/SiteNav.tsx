import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/appContext/UseAppContext';
import {
  Button,
  MenuItem,
  Navbar,
  PlaneIcon,
  SignOutIcon,
  Typography
} from '@noahspan/noahspan-components';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useAccessToken } from '../../hooks/accessToken/UseAcessToken';
import { useHttpClient } from '../../hooks/httpClient/UseHttpClient';
import { AxiosInstance, AxiosResponse } from 'axios';
import { User } from '@microsoft/microsoft-graph-types';
import { loginRequest } from '../../hooks/auth/authConfig';

const SiteNav: React.FC<unknown> = () => {
  const [userPhoto, setUserPhoto] = useState<string>();
  const httpClient: AxiosInstance = useHttpClient();
  const appContext = useAppContext();
  // const isAuthenticated = useIsAuthenticated();
  // const { getAccessToken } = useAccessToken();
  const { instance } = useMsal();
  const navigate = useNavigate();
  const pages = [
    {
      name: 'Logbook',
      url: '/'
    },
    {
      name: 'Pilots',
      url: '/pilots'
    }
  ];

  const handleSignInRedirect = async () => {
    await instance
      .loginRedirect({
          ...loginRequest,
          // prompt: 'create',
      })
      .catch((error) => console.log(error));
  };

  const handleSignOutRedirect = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: '/'
    })
    window.location.reload();
  }

  // const getUserProfile = async (accessToken: string): Promise<User> => {
  //   try {
  //     const response: AxiosResponse = await httpClient.get(`api/userProfile`, {
  //       headers: {
  //         Authorization: accessToken
  //       }
  //     });
  //     const userProfile: User = response.data;

  //     return userProfile;
  //   } catch (error) {
  //     throw new Error();
  //   }
  // };

  // const getUserPhoto = async (accessToken: string): Promise<string> => {
  //   try {
  //     const response: AxiosResponse = await httpClient.get(`api/userPhoto`, {
  //       headers: {
  //         Authorization: accessToken
  //       },
  //       responseType: 'arraybuffer'
  //     });
  //     const arrayBufferView = new Uint8Array(response.data);
  //     const blob = new Blob([arrayBufferView], { type: 'image/png' });
  //     const imageUrl = window.URL.createObjectURL(blob);

  //     return imageUrl;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error();
  //   }
  // };
  const handlePageClick = (url: string) => {
    navigate(url);
  };

  const Settings = () => {
    return (
      <MenuItem onClick={handleSignOutRedirect}>
        <SignOutIcon />
        <Typography sx={{ marginLeft: '10px', textAlign: 'center' }}>
          Sign Out
        </Typography>
      </MenuItem>
    );
  };

  // useEffect(() => {
  //   const setUserProfile = async () => {
  //     try {
  //       const accessToken: string = await getAccessToken();
  //       const userProfile = await getUserProfile(accessToken);
  //       const userPhoto = await getUserPhoto(accessToken);

  //       setUserPhoto(userPhoto);

  //       appContext.dispatch({
  //         type: 'SET_USER_PROFILE',
  //         payload: userProfile
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   if (
  //     isAuthenticated &&
  //     Object.keys(appContext.state.userProfile).length === 0
  //   ) {
  //     setUserProfile();
  //   }
  // }, [isAuthenticated]);

  return (
    <Button onClick={handleSignInRedirect}>Sign In</Button>
    // <Navbar
    //   handlePageClick={handlePageClick}
    //   handleSignIn={handleSignInRedirect}
    //   isAuthenticated={isAuthenticated}
    //   logo={<PlaneIcon size="2x" />}
    //   pages={pages}
    //   settings={<Settings />}
    //   userPhoto={userPhoto}
    // />
  );
};

export default SiteNav;
