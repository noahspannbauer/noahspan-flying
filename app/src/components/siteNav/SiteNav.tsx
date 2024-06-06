import {
  Avatar,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button
} from '@nextui-org/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useAppContext } from '../../hooks/appContext/UseAppContext';
import { Logo, Plane } from '@noahspan/noahspan-components';

const SiteNav: React.FC<unknown> = () => {
  const isAuthenticated = useIsAuthenticated();
  const { accounts, instance } = useMsal();
  const initializeLogin = () => {
    instance.loginRedirect();
  };
  const appContext = useAppContext();

  return (
    <Navbar
      classNames={{
        base: 'bg-transparent z-0'
      }}
      isBlurred={false}
      maxWidth="full"
      data-testid="flying-navbar"
    >
      <NavbarBrand>
        <Logo className="pr-3" height={50} width={50} data-testid="logo" />
        <Plane size="2xl" />
      </NavbarBrand>
      <NavbarContent justify="center">
        <NavbarItem>
          {appContext.state.featureFlags.find(
            (featureFlag) => featureFlag.key === 'flying-pilots'
          )?.enabled && (
            <Link>
              <ReactRouterLink to="/">Pilots</ReactRouterLink>
            </Link>
          )}
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {!isAuthenticated && (
          <Button
            as={Link}
            color="primary"
            href="#"
            onClick={initializeLogin}
            data-testid="login-link"
          >
            Login
          </Button>
        )}
        {isAuthenticated && <Avatar name={accounts[0]?.username} />}
      </NavbarContent>
    </Navbar>
  );
};

export default SiteNav;
