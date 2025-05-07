import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
} from '@mui/material';
import { Image as ImageIcon } from '@mui/icons-material';
import * as Icons from '@mui/icons-material';
import type { Item, MaterialIcon } from '../types';
import { IconSelector } from './IconSelector';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (item: Item) => void;
  onEdit?: (item: Item) => void;
  itemToEdit?: Item;
}

export const AddItemDialog = ({ open, onClose, onAdd, onEdit, itemToEdit }: Props) => {
  const [type, setType] = useState<'Folder' | 'Link'>(itemToEdit?.type || 'Folder');
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState<string>('');
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setType(itemToEdit.type);
      setName(itemToEdit.name);
      if (itemToEdit.type === 'Link') {
        setUrl(itemToEdit.url);
        setDescription(itemToEdit.description || '');
      }
      setIcon(itemToEdit.icon || '');
    } else {
      setType('Folder');
      setName('');
      setUrl('');
      setDescription('');
      setIcon('');
    }
  }, [itemToEdit]);

  const handleSubmit = () => {
    if (onEdit && itemToEdit) {
      const updatedItem = {
        ...itemToEdit,
        name,
        icon,
      };
      
      if (itemToEdit.type === 'Link') {
        Object.assign(updatedItem, {
          url,
          description,
        });
      }
      
      onEdit(updatedItem);
    } else {
      const newItem: Item = type === 'Folder' ? {
        name,
        type: 'Folder',
        children: [],
        icon,
      } : {
        name,
        type: 'Link',
        url,
        description,
        icon,
      };
      onAdd(newItem);
    }
    handleClose();
  };

  const handleClose = () => {
    setType('Folder');
    setName('');
    setUrl('');
    setDescription('');
    setIcon('');
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{itemToEdit ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {!itemToEdit && (
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  label="Type"
                  onChange={(e) => setType(e.target.value as 'Folder' | 'Link')}
                >
                  <MenuItem value="Folder">Folder</MenuItem>
                  <MenuItem value="Link">Link</MenuItem>
                </Select>
              </FormControl>
            )}

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton
                onClick={() => setIconSelectorOpen(true)}
                sx={{
                  border: icon ? '2px solid' : '1px dashed',
                  borderColor: icon ? 'primary.main' : 'divider',
                  height: 56,
                  width: 56,
                }}
              >
                {icon ? (
                  icon.startsWith('http') ? (
                    <img src={icon} alt="" style={{ width: 24, height: 24 }} />
                  ) : (
                    (() => {
                      const Icon = Icons[icon as MaterialIcon];
                      return Icon ? <Icon /> : <ImageIcon />;
                    })()
                  )
                ) : (
                  <ImageIcon />
                )}
              </IconButton>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
              />
            </Box>

            {type === 'Link' && (
              <>
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
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!name || (type === 'Link' && !url)}
          >
            {itemToEdit ? 'Save' : 'Add'}
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