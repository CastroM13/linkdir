import { useState } from 'react';
import { ListItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import * as Icons from '@mui/icons-material';
import type { LinkItem as LinkItemType, MaterialIcon, Item } from '../types';
import { AddItemDialog } from './AddItemDialog';
import { ContextMenu } from './ContextMenu';

interface Props {
  item: LinkItemType;
  onEdit?: (item: Item) => void;
  onDelete?: () => void;
  path: string[];
}

export const LinkItem = ({ item, onEdit, onDelete, path }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const { name, url, icon, description } = item;
  const displayName = name || url;

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  const handleEditClick = () => {
    setDialogOpen(true);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      fromPath: [...path, item.name],
      type: 'Link'
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const getHostname = (url: string): string => {
    try {
      return new URL(url).hostname;
    } catch {
      // If URL is invalid, try to extract a hostname-like string
      const match = url.match(/^(?:https?:\/\/)?([^\/]+)/);
      return match ? match[1] : 'unknown';
    }
  };

  const renderIcon = () => {
    if (icon) {
      if (icon.startsWith('http')) {
        return (
          <img
            src={icon}
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
      const Icon = Icons[icon as MaterialIcon];
      if (Icon) {
        return <Icon sx={{ fontSize: 20 }} />;
      }
    }
    return (
      <img
        src={`https://www.google.com/s2/favicons?domain=${getHostname(url)}`}
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
  };

  const getValidUrl = (url: string): string => {
    try {
      new URL(url);
      return url;
    } catch {
      // If URL is invalid, try to make it valid by adding https://
      return url.startsWith('http') ? url : `https://${url}`;
    }
  };

  return (
    <>
      <Tooltip title={description || ''} placement="right">
        <ListItem
          component="a"
          href={getValidUrl(url)}
          target="_blank"
          rel="noopener noreferrer"
          onContextMenu={handleContextMenu}
          draggable
          onDragStart={handleDragStart}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            borderRadius: 1,
            mb: 0.5,
            textDecoration: 'none',
            color: 'text.primary',
          }}
        >
          <ListItemIcon>
            {renderIcon()}
          </ListItemIcon>
          <ListItemText
            primary={displayName}
            secondary={url}
            primaryTypographyProps={{
              sx: { fontWeight: 400 },
            }}
            secondaryTypographyProps={{
              sx: { 
                fontSize: '0.75rem',
                color: 'text.secondary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }
            }}
          />
        </ListItem>
      </Tooltip>

      <AddItemDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onEdit={onEdit}
        onAdd={() => {}}
        itemToEdit={item}
      />

      <ContextMenu
        open={contextMenu !== null}
        mouseX={contextMenu?.mouseX ?? 0}
        mouseY={contextMenu?.mouseY ?? 0}
        onClose={() => setContextMenu(null)}
        onEdit={handleEditClick}
        onDelete={onDelete ?? (() => {})}
        item={item}
      />
    </>
  );
}; 