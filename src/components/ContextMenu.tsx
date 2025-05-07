import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';
import type { Item } from '../types';

interface Props {
  open: boolean;
  mouseX: number;
  mouseY: number;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddLink?: () => void;
  onAddFolder?: () => void;
  item: Item;
  children?: React.ReactNode;
}

export const ContextMenu = ({
  open,
  mouseX,
  mouseY,
  onClose,
  onEdit,
  onDelete,
  onAddLink,
  onAddFolder,
  children,
}: Props) => {
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={
        open
          ? { top: mouseY, left: mouseX }
          : undefined
      }
      PaperProps={{
        elevation: 0,
        sx: {
          border: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {onAddLink && (
        <MenuItem onClick={onAddLink}>
          <ListItemIcon>
            <LinkIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add Link</ListItemText>
        </MenuItem>
      )}
      {onAddFolder && (
        <MenuItem onClick={onAddFolder}>
          <ListItemIcon>
            <FolderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add Folder</ListItemText>
        </MenuItem>
      )}
      {children}
      <MenuItem onClick={onEdit}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Edit</ListItemText>
      </MenuItem>
      <MenuItem onClick={onDelete}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
  );
}; 