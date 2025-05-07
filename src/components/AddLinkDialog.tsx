import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
} from '@mui/material';
import { Image as ImageIcon } from '@mui/icons-material';
import * as Icons from '@mui/icons-material';
import { useState } from 'react';
import type { Item } from '../types';
import { IconSelector } from './IconSelector';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (item: Item) => void;
}

export const AddLinkDialog = ({ open, onClose, onAdd }: Props) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState<string>('');
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !url.trim()) return;

    const item: Item = {
      type: 'Link',
      name: name.trim(),
      url: url.trim(),
      description: description.trim(),
      icon,
    };

    onAdd(item);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setUrl('');
    setDescription('');
    setIcon('');
    onClose();
  };

  const renderIcon = () => {
    if (icon) {
      if (icon.startsWith('http')) {
        return (
          <img
            src={icon}
            alt=""
            style={{
              width: 24,
              height: 24,
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
      const Icon = (Icons as any)[icon];
      if (Icon) {
        return <Icon />;
      }
    }
    return <ImageIcon />;
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Link</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton
                onClick={() => setIconSelectorOpen(true)}
                sx={{
                  border: icon ? '2px solid' : '1px dashed',
                  borderColor: icon ? 'primary.main' : 'divider',
                  height: 56,
                  width: 56,
                  mr: 1,
                }}
              >
                {renderIcon()}
              </IconButton>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
                autoFocus
              />
            </Box>
            <TextField
              label="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!name.trim() || !url.trim()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <IconSelector
        open={iconSelectorOpen}
        onClose={() => setIconSelectorOpen(false)}
        onSelect={setIcon}
        currentIcon={icon}
      />
    </>
  );
}; 