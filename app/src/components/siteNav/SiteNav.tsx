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

const SiteNav: React.FC<unknown> = () => {
  const isAuthenticated = useIsAuthenticated();
  const { accounts, instance } = useMsal();
  const initializeLogin = () => {
    instance.loginRedirect();
  };
  const appContext = useAppContext();

  console.log(accounts);

  return (
    <Navbar isBordered>
      <NavbarBrand>Site Logo Goes Here</NavbarBrand>
      <NavbarContent justify="center">
        <NavbarItem>
          {appContext.state.featureFlags.find(
            (featureFlag) => featureFlag.id === 'flying-pilots'
          )?.enabled && (
            <Link>
              <ReactRouterLink to="/">Pilots</ReactRouterLink>
            </Link>
          )}
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {!isAuthenticated && (
          <Button as={Link} color="primary" href="#" onClick={initializeLogin}>
            Login
          </Button>
        )}
        {isAuthenticated && <Avatar name={accounts[0]?.username} />}
      </NavbarContent>
    </Navbar>
  );
};

export default SiteNav;
