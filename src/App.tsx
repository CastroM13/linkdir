import { useState, useEffect } from 'react';
import {
  Container,
  List,
  Box,
  Typography,
  Snackbar,
  Alert,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ContentPaste as PasteIcon,
  Delete as DeleteIcon,
  FileUpload as ImportIcon,
  FileDownload as ExportIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Link as LinkIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';
import { FolderItem } from './components/FolderItem';
import { ConfirmDialog } from './components/ConfirmDialog';
import { loadFromStorage, saveToStorage, exportToJson, importFromJson } from './utils/storage';
import type { Item } from './types';
import { useTheme } from './contexts/ThemeContext';
import { LinkItem } from './components/LinkItem';
import { AddLinkDialog } from './components/AddLinkDialog';
import { AddFolderDialog } from './components/AddFolderDialog';

function App() {
  const { mode, toggleTheme } = useTheme();
  const [items, setItems] = useState<Item[]>([]);
  const [message, setMessage] = useState<string>('');
  const [showMessage, setShowMessage] = useState(false);
  const [addLinkDialogOpen, setAddLinkDialogOpen] = useState(false);
  const [addFolderDialogOpen, setAddFolderDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    const savedItems = loadFromStorage();
    setItems(savedItems);

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const handleExport = () => {
    exportToJson(items);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importFromJson(file)
        .then((importedItems) => {
          setItems(importedItems);
          saveToStorage(importedItems);
          setMessage('Import successful!');
          setShowMessage(true);
        })
        .catch((error) => {
          setMessage('Error importing file: ' + error.message);
          setShowMessage(true);
        });
    }
  };

  const handlePasteImport = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const importedItems = JSON.parse(text);
      setItems(importedItems);
      saveToStorage(importedItems);
      setMessage('Import from clipboard successful!');
      setShowMessage(true);
    } catch (error) {
      setMessage('Error importing from clipboard: Invalid JSON');
      setShowMessage(true);
    }
  };

  const handleAddItem = (newItem: Item) => {
    setItems([...items, newItem]);
    saveToStorage([...items, newItem]);
  };

  const handleAddItemToFolder = (path: string[], newItem: Item) => {
    const updateItems = (items: Item[], currentPath: string[]): Item[] => {
      return items.map(item => {
        if (item.type === 'Folder' && item.name === currentPath[0]) {
          if (currentPath.length === 1) {
            return {
              ...item,
              children: [...item.children, newItem],
            };
          }
          return {
            ...item,
            children: updateItems(item.children, currentPath.slice(1)),
          };
        }
        return item;
      });
    };

    const updatedItems = updateItems(items, path);
    setItems(updatedItems);
    saveToStorage(updatedItems);
  };

  const handleEditItem = (path: string[], editedItem: Item) => {
    const updateItems = (items: Item[], currentPath: string[]): Item[] => {
      return items.map(item => {
        if (item.type === 'Folder' && item.name === currentPath[0]) {
          if (currentPath.length === 1) {
            // If we're editing a folder, preserve its children
            if (editedItem.type === 'Folder') {
              return {
                ...item,
                ...editedItem,
                children: item.children,
              };
            }
            // If we're editing a link within this folder, update it
            return {
              ...item,
              children: item.children.map(child => 
                child.name === editedItem.name ? editedItem : child
              ),
            };
          }
          return {
            ...item,
            children: updateItems(item.children, currentPath.slice(1)),
          };
        }
        // If we're at the root level and editing a link, update it
        if (item.name === editedItem.name) {
          return editedItem;
        }
        return item;
      });
    };

    const updatedItems = updateItems(items, path);
    setItems(updatedItems);
    saveToStorage(updatedItems);
  };

  const handleDeleteItem = (path: string[]) => {
    const deleteItem = (items: Item[], currentPath: string[]): Item[] => {
      if (currentPath.length === 1) {
        return items.filter(item => item.name !== currentPath[0]);
      }

      return items.map(item => {
        if (item.type === 'Folder' && item.name === currentPath[0]) {
          return {
            ...item,
            children: deleteItem(item.children, currentPath.slice(1)),
          };
        }
        return item;
      });
    };

    const updatedItems = deleteItem(items, path);
    setItems(updatedItems);
    saveToStorage(updatedItems);
    setMessage('Item deleted successfully!');
    setShowMessage(true);
  };

  const handleClearAll = () => {
    setItems([]);
    saveToStorage([]);
    setMessage('All items cleared successfully!');
    setShowMessage(true);
    setConfirmDialogOpen(false);
  };

  const handleMoveItem = (fromPath: string[], toPath: string[]) => {
    const moveItem = (items: Item[], fromPath: string[], toPath: string[]): Item[] => {
      // First, find and remove the item from its original location
      const removeItem = (items: Item[], path: string[]): [Item[], Item | null] => {
        if (path.length === 1) {
          const index = items.findIndex(item => item.name === path[0]);
          if (index === -1) return [items, null];
          const [item] = items.splice(index, 1);
          return [items, item];
        }

        const folderIndex = items.findIndex(item => item.type === 'Folder' && item.name === path[0]);
        if (folderIndex === -1) return [items, null];

        const folder = items[folderIndex];
        if (folder.type !== 'Folder') return [items, null];

        const [newChildren, item] = removeItem(folder.children, path.slice(1));
        items[folderIndex] = {
          ...folder,
          children: newChildren,
        };
        return [items, item];
      };

      // Then, add the item to its new location
      const addItem = (items: Item[], path: string[], item: Item): Item[] => {
        if (path.length === 0) {
          return [...items, item];
        }

        const folderIndex = items.findIndex(item => item.type === 'Folder' && item.name === path[0]);
        if (folderIndex === -1) return items;

        const folder = items[folderIndex];
        if (folder.type !== 'Folder') return items;

        items[folderIndex] = {
          ...folder,
          children: addItem(folder.children, path.slice(1), item),
        };
        return items;
      };

      const [itemsWithoutItem, item] = removeItem([...items], fromPath);
      if (!item) return items;

      return addItem(itemsWithoutItem, toPath, item);
    };

    const updatedItems = moveItem(items, fromPath, toPath);
    setItems(updatedItems);
    saveToStorage(updatedItems);
    setMessage('Item moved successfully!');
    setShowMessage(true);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
            Link Directory
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
              <IconButton
                onClick={toggleTheme}
                sx={{ 
                  color: 'text.primary',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Add New Link">
              <IconButton
                onClick={() => setAddLinkDialogOpen(true)}
                sx={{ 
                  color: 'text.primary',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <LinkIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add New Folder">
              <IconButton
                onClick={() => setAddFolderDialogOpen(true)}
                sx={{ 
                  color: 'text.primary',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <FolderIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Import from Clipboard">
              <IconButton
                onClick={handlePasteImport}
                sx={{ 
                  color: 'text.primary',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <PasteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Import from File">
              <IconButton
                onClick={() => document.getElementById('import-file')?.click()}
                sx={{ 
                  color: 'text.primary',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <ImportIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export to File">
              <IconButton
                onClick={handleExport}
                sx={{ 
                  color: 'text.primary',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <ExportIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear All">
              <IconButton
                onClick={() => setConfirmDialogOpen(true)}
                sx={{ 
                  color: 'text.primary',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              id="import-file"
              onChange={handleImport}
            />
          </Box>
        </Box>

        <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
          {items.map((item, index) => (
            item.type === 'Folder' ? (
              <FolderItem
                key={index}
                item={item}
                onAddItem={handleAddItemToFolder}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                onMoveItem={handleMoveItem}
              />
            ) : (
              <LinkItem
                key={index}
                item={item}
                onEdit={(editedItem) => handleEditItem([], editedItem)}
                onDelete={() => handleDeleteItem([item.name])}
                path={[]}
              />
            )
          ))}
        </List>
      </Paper>

      <AddLinkDialog
        open={addLinkDialogOpen}
        onClose={() => setAddLinkDialogOpen(false)}
        onAdd={handleAddItem}
      />

      <AddFolderDialog
        open={addFolderDialogOpen}
        onClose={() => setAddFolderDialogOpen(false)}
        onAdd={handleAddItem}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Clear All Items"
        message="Are you sure you want to delete all items? This action cannot be undone."
        onConfirm={handleClearAll}
        onCancel={() => setConfirmDialogOpen(false)}
        confirmText="Clear All"
      />

      <Snackbar
        open={showMessage}
        autoHideDuration={3000}
        onClose={() => setShowMessage(false)}
      >
        <Alert severity="success" onClose={() => setShowMessage(false)}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
