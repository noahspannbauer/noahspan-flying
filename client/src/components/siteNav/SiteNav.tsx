import { useEffect, useState } from 'react';
import { useAppContext } from '../../hooks/appContext/UseAppContext';
import { AxiosResponse } from 'axios';
import { User } from '@microsoft/microsoft-graph-types';
import { useOidc } from '../../auth/oidcConfig';
import httpClient from '../../httpClient/httpClient'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlane, faSignIn, faSignOut } from '@fortawesome/free-solid-svg-icons'
import { NavLink, useLocation } from 'react-router-dom';
import { useBreakpoints } from '../../hooks/useBreakpoints/UseBreakpoints';
import { ScreenSize } from '../../enums/screenSize';

const SiteNav = () => {
  const [userPhoto, setUserPhoto] = useState<string>();
  const appContext = useAppContext();
  const { screenSize } = useBreakpoints();
  const { isUserLoggedIn, logout, login } = useOidc()
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

  const Brand = () => {
    return (
      <>
        <img
          className='mr-1'
          height={35}
          width={35}
          src='noahspan-logo.png'
        />
        <FontAwesomeIcon className='mt-1' icon={faPlane} size='2x' />
       </>
    )
  }

  const Links = () => {
    return (
      <>
        {pages.map((page) => {
          return (
            <li><NavLink to={page.path}>{page.name}</NavLink></li>
          )
        })}
      </>
    )
  }

  useEffect(() => {
    const setUserProfile = async () => {
      try {
        const userProfile = await getUserProfile();
        // const userPhoto = await getUserPhoto();

        // setUserPhoto(userPhoto);

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

  useEffect(() => {
    console.log(screenSize)
  }, [screenSize])

  return (
    <div className="navbar bg-base-100 shadow-sm w-full">
      <div className={`navbar-start ${screenSize !== ScreenSize.SM && screenSize !== ScreenSize.MD ? 'ml-8' : ''}`}>
        {screenSize === ScreenSize.SM || screenSize === ScreenSize.MD ? ( 
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <FontAwesomeIcon icon={faBars} size='xl' />
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <Links />
            </ul>
          </div>
        ) : (
          <Brand />
        )}
      </div>
      <div className="navbar-center">
        <ul className="menu menu-horizontal px-1">
          {screenSize === ScreenSize.SM || screenSize === ScreenSize.MD ? (
            <Brand />
          ) : (
            <Links />
          )}
        </ul>
      </div>
      <div className={`navbar-end ${screenSize !== ScreenSize.SM && screenSize !== ScreenSize.MD ? 'ml-8' : ''}`}>
        {!isUserLoggedIn &&
          <button className='btn btn-ghost' onClick={() => login()}><FontAwesomeIcon icon={faSignIn} />Sign In</button>
        }
        {isUserLoggedIn &&
          <div className='dropdown dropdown-end'>
            <div tabIndex={0} role='button'>
              <div className={`avatar ${userPhoto ? userPhoto : 'avatar-placeholder'}`}>
                {userPhoto &&
                  <div className='w-12 rounded-full'>
                    <img src={userPhoto} />
                  </div>
                }
                {!userPhoto &&
                  <div className='bg-neutral text-neutral-content w-10 rounded-full'>
                    <span>NS</span>
                  </div>
                }
              </div>
            </div>
            <ul
              tabIndex={0}
              className='dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm border border-base-300'
            >
              <li><a onClick={() => logout({redirectTo: 'specific url', url: '/'})}><FontAwesomeIcon icon={faSignOut} />Sign Out</a></li>
            </ul>
          </div>
        }
      </div>
    </div>
  );
};

export default SiteNav;