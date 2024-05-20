import { Avatar, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from '@nextui-org/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';

const SiteNav: React.FC<unknown> = () => {
    const isAuthenticated = useIsAuthenticated();
    const { accounts, instance } = useMsal();
    const initializeLogin = () => {
        instance.loginRedirect();
    }

    console.log(accounts)

    return (
        <Navbar isBordered>
            <NavbarBrand>
                Site Logo Goes Here
            </NavbarBrand>
            <NavbarContent justify='center'>
                <NavbarItem>
                    <Link>
                        <ReactRouterLink to='/'>Flights</ReactRouterLink>
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link>
                        <ReactRouterLink to='/logbook'>Logbook</ReactRouterLink>
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link>
                        <ReactRouterLink to='/checklists'>Checklists</ReactRouterLink>
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link>
                        <ReactRouterLink to='/pilots'>Pilots</ReactRouterLink>
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify='end'>
                {!isAuthenticated &&
                    <Button as={Link} color='primary' href='#' onClick={initializeLogin}>Login</Button>
                }
                {isAuthenticated &&
                    <Avatar name={accounts[0]?.username} />
                }
            </NavbarContent>
        </Navbar>
    )
}

export default SiteNav;