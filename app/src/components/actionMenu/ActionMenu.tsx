import { useState } from 'react';
import { IActionMenuProps } from './IActionMenuProps';
import {
  EllipsisVerticalIcon,
  EyeIcon,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  PenIcon,
  TrashIcon
} from '@noahspan/noahspan-components';
import { FormMode } from '../../enums/formMode';

const ActionMenu = ({ id, onDelete, onOpenCloseForm }: IActionMenuProps) => {
  const [anchorElAction, setAnchorElAction] = useState<null | HTMLElement>(
    null
  );

  const onOpenActionMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAction(event.currentTarget);
  };

  const onCloseActionMenu = () => {
    setAnchorElAction(null);
  };

  return (
    <div>
      <IconButton onClick={onOpenActionMenu}>
        <EllipsisVerticalIcon size="sm" />
      </IconButton>
      <Menu
        anchorEl={anchorElAction}
        keepMounted
        open={Boolean(anchorElAction)}
        onClose={onCloseActionMenu}
      >
        <MenuItem onClick={() => onOpenCloseForm(FormMode.EDIT, id)}>
          <ListItemIcon>
            <PenIcon size="lg" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => onOpenCloseForm(FormMode.VIEW, id)}>
          <ListItemIcon>
            <EyeIcon size="lg" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <hr className="my-3" />
        <MenuItem onClick={() => onDelete(id)}>
          <ListItemIcon>
            <TrashIcon size="lg" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ActionMenu;
