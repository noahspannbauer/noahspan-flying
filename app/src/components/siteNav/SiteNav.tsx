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
  Spinner,
  Typography
} from '@noahspan/noahspan-components';
import { useIsAuthenticated } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';

const SiteNav: React.FC<ISiteNavProps> = ({
  handleSignIn,
  handleSignOut,
  inProgress
}: ISiteNavProps) => {
  const appContext = useAppContext();
  const isAuthenticated = useIsAuthenticated();
  const navItems: NavbarItemProps[] = [
    {
      name: 'Pilots',
      url: '#'
    }
  ];

  return (
    <Navbar className="mt-6">
      <NavbarBrand>
        <img height={40} width={40} src="noahspan-logo.png" />{' '}
        <PlaneIcon size="2x" />
      </NavbarBrand>
      <NavbarLinks items={navItems} />
      <NavbarMenu>
        <div className="flex items-center gap-2 hidden lg:inline-block">
          {isAuthenticated && (
            <Menu placement="bottom-end">
              <MenuHandler>
                <div>
                  <Button variant="text" size="sm">
                    {appContext.state.userProfile.displayName}
                  </Button>
                </div>
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={handleSignOut}>
                  <Typography variant="small">Sign Out</Typography>
                </MenuItem>
              </MenuList>
            </Menu>
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
