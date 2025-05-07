import { useState } from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box
} from '@mui/material';
import {
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
} from '@mui/icons-material';
import * as Icons from '@mui/icons-material';
import type { FolderItem as FolderItemType, Item, MaterialIcon } from '../types';
import { LinkItem } from './LinkItem';
import { AddLinkDialog } from './AddLinkDialog';
import { AddFolderDialog } from './AddFolderDialog';
import { AddItemDialog } from './AddItemDialog';
import { ContextMenu } from './ContextMenu';

interface Props {
  item: FolderItemType;
  onAddItem: (path: string[], item: Item) => void;
  onEditItem: (path: string[], item: Item) => void;
  onDeleteItem: (path: string[]) => void;
  onMoveItem: (fromPath: string[], toPath: string[]) => void;
  path?: string[];
}

export const FolderItem = ({ item, onAddItem, onEditItem, onDeleteItem, onMoveItem, path = [] }: Props) => {
  const [open, setOpen] = useState(false);
  const [addLinkDialogOpen, setAddLinkDialogOpen] = useState(false);
  const [addFolderDialogOpen, setAddFolderDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const currentPath = [...path, item.name];

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
    setContextMenu(null);
  };

  const handleAddLinkClick = () => {
    setAddLinkDialogOpen(true);
    setContextMenu(null);
  };

  const handleAddFolderClick = () => {
    setAddFolderDialogOpen(true);
    setContextMenu(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const { fromPath, type } = JSON.parse(data);
        if (fromPath && type === 'Link') {
          // Don't allow dropping onto the same folder
          if (fromPath.slice(0, -1).join('/') === currentPath.join('/')) {
            return;
          }
          onMoveItem(fromPath, currentPath);
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const renderIcon = () => {
    if (item.icon) {
      if (item.icon.startsWith('http')) {
        return (
          <img
            src={item.icon}
            alt=""
            style={{
              width: 20,
              height: 20,
              borderRadius: 2,
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '';
              target.onerror = null;
            }}
          />
        );
      }
      const Icon = Icons[item.icon as MaterialIcon];
      if (Icon) {
        return <Icon sx={{ fontSize: 20 }} />;
      }
    }
    return open ? <FolderOpenIcon sx={{ fontSize: 20 }} /> : <FolderIcon sx={{ fontSize: 20 }} />;
  };

  return (
    <>
      <ListItem
        onContextMenu={handleContextMenu}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => setOpen(!open)}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
          borderRadius: 1,
          mb: 0.5,
          backgroundColor: isDragOver ? 'action.selected' : 'transparent',
          transition: 'background-color 0.2s',
        }}
      >
        <ListItemIcon>
          {renderIcon()}
        </ListItemIcon>
        <ListItemText
          primary={item.name}
          primaryTypographyProps={{
            sx: { fontWeight: 500 },
          }}
        />
      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ pl: 4 }}>
          {item.children.map((child, index) => (
            child.type === 'Folder' ? (
              <FolderItem
                key={index}
                item={child}
                onAddItem={onAddItem}
                onEditItem={onEditItem}
                onDeleteItem={onDeleteItem}
                onMoveItem={onMoveItem}
                path={currentPath}
              />
            ) : (
              <LinkItem
                key={index}
                item={child}
                onEdit={(editedItem) => onEditItem(currentPath, editedItem)}
                onDelete={() => onDeleteItem([...currentPath, child.name])}
                path={currentPath}
              />
            )
          ))}
        </Box>
      </Collapse>

      <AddLinkDialog
        open={addLinkDialogOpen}
        onClose={() => setAddLinkDialogOpen(false)}
        onAdd={(newItem) => onAddItem(currentPath, newItem)}
      />

      <AddFolderDialog
        open={addFolderDialogOpen}
        onClose={() => setAddFolderDialogOpen(false)}
        onAdd={(newItem) => onAddItem(currentPath, newItem)}
      />

      <ContextMenu
        open={contextMenu !== null}
        mouseX={contextMenu?.mouseX ?? 0}
        mouseY={contextMenu?.mouseY ?? 0}
        onClose={() => setContextMenu(null)}
        onEdit={handleEditClick}
        onDelete={() => onDeleteItem(currentPath)}
        onAddLink={handleAddLinkClick}
        onAddFolder={handleAddFolderClick}
        item={item}
      />

      {/* Edit Folder Dialog */}
      <AddItemDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onAdd={() => {}}
        onEdit={(editedItem) => {
          setEditDialogOpen(false);
          onEditItem(currentPath, editedItem);
        }}
        itemToEdit={item}
      />
    </>
  );
}; 