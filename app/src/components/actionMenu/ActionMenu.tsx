import { useState } from 'react';
import { IActionMenuProps } from './IActionMenuProps';
import {
  IconButton,
  Icon,
  IconName, 
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem
} from '@noahspan/noahspan-components';
import { FormMode } from '../../enums/formMode';
import { useIsAuthenticated } from '@azure/msal-react';

const ActionMenu = ({ id, onDelete, onOpenCloseForm, onOpenCloseTracks }: IActionMenuProps) => {
  const [anchorElAction, setAnchorElAction] = useState<null | HTMLElement>(
    null
  );
  const isAuthenticated = useIsAuthenticated();

  const onOpenActionMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAction(event.currentTarget);
  };

  const onCloseActionMenu = () => {
    setAnchorElAction(null);
  };

  return (
    <div>
      <IconButton onClick={onOpenActionMenu}>
        <Icon iconName={IconName.ELLIPSIS_VERTICAL} size="sm" />
      </IconButton>
      <Menu
        anchorEl={anchorElAction}
        keepMounted
        open={Boolean(anchorElAction)}
        onClose={onCloseActionMenu}
      >
        {isAuthenticated &&
        <>
          <MenuItem onClick={() => onOpenCloseForm(FormMode.EDIT, id)}>
            <ListItemIcon>
              <Icon iconName={IconName.PEN} size="lg" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => onOpenCloseTracks(FormMode.EDIT, id)}>
            <ListItemIcon>
              <Icon iconName={IconName.MAP_LOCATION_DOT} size="lg" />
            </ListItemIcon>
            <ListItemText>Tracks</ListItemText>
          </MenuItem>
        </>

        }
        <MenuItem onClick={() => onOpenCloseForm(FormMode.VIEW, id)}>
          <ListItemIcon>
            <Icon iconName={IconName.EYE} size="lg" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        {isAuthenticated &&
          <>
            <hr className="my-3" />
            <MenuItem onClick={() => onDelete(id)}>
              <ListItemIcon>
                <Icon iconName={IconName.TRASH} size="lg" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </>    
        }
      </Menu>
    </div>
  );
};

export default ActionMenu;
