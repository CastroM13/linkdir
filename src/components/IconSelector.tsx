import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Tabs,
  Tab,
  Box,
  Typography,
  InputAdornment,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import { Search as SearchIcon } from '@mui/icons-material';
import { FixedSizeGrid } from 'react-window';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (icon: string) => void;
  currentIcon?: string;
}

const iconCategories = {
  'All': Object.keys(Icons),
  'Navigation': [
    'ArrowBack',
    'ArrowForward',
    'Home',
    'Menu',
    'Search',
    'NavigateNext',
    'NavigateBefore',
    'FirstPage',
    'LastPage',
  ],
  'Content': [
    'Add',
    'Edit',
    'Delete',
    'Save',
    'Download',
    'Upload',
    'Create',
    'ContentCopy',
    'ContentCut',
    'ContentPaste',
  ],
  'Communication': [
    'Email',
    'Message',
    'Phone',
    'Chat',
    'Notifications',
    'Mail',
    'Call',
    'VideoCall',
    'Forum',
  ],
  'Action': [
    'PlayArrow',
    'Pause',
    'Stop',
    'Refresh',
    'Settings',
    'Power',
    'PowerOff',
    'RestartAlt',
    'Tune',
  ],
  'File': [
    'Folder',
    'InsertDriveFile',
    'Description',
    'Article',
    'Note',
    'TextSnippet',
    'Draft',
    'FileCopy',
    'FileDownload',
  ],
  'Device': [
    'Computer',
    'Phone',
    'Tablet',
    'Watch',
    'Headset',
    'Devices',
    'Laptop',
    'Smartphone',
    'Tv',
  ],
};

const ICON_SIZE = 48;
const GRID_PADDING = 16;
const COLUMN_COUNT = 13;

export const IconSelector = ({ open, onClose, onSelect, currentIcon }: Props) => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('All');
  const [customUrl, setCustomUrl] = useState('');

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const handleIconClick = (iconName: string) => {
    onSelect(iconName);
    onClose();
  };

  const handleCustomUrlSubmit = () => {
    if (customUrl) {
      onSelect(customUrl);
      onClose();
    }
  };

  const filteredIcons = useMemo(() => {
    return iconCategories[tab as keyof typeof iconCategories].filter(
      (icon) => icon.toLowerCase().includes(search.toLowerCase())
    );
  }, [tab, search]);

  const renderIcon = useCallback((iconName: string) => {
    const Icon = (Icons as any)[iconName];
    if (!Icon) return null;
    return <Icon />;
  }, []);

  const Cell = useCallback(({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * COLUMN_COUNT + columnIndex;
    const iconName = filteredIcons[index];
    
    if (!iconName) return null;
    
    const icon = renderIcon(iconName);
    if (!icon) return null;

    return (
      <div style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <IconButton
          onClick={() => handleIconClick(iconName)}
          sx={{
            border: currentIcon === iconName ? '2px solid' : 'none',
            borderColor: 'primary.main',
            width: ICON_SIZE,
            height: ICON_SIZE,
            '& svg': {
              fontSize: ICON_SIZE * 0.6
            }
          }}
        >
          {icon}
        </IconButton>
      </div>
    );
  }, [filteredIcons, currentIcon, handleIconClick, renderIcon]);

  const rowCount = Math.ceil(filteredIcons.length / COLUMN_COUNT);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Icon</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tab} onChange={handleTabChange}>
            {Object.keys(iconCategories).map((category) => (
              <Tab key={category} label={category} value={category} />
            ))}
          </Tabs>
        </Box>

        <TextField
          fullWidth
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ 
          height: 400, 
          width: '100%',
          '& > div': {
            width: '100% !important'
          }
        }}>
          <FixedSizeGrid
            columnCount={COLUMN_COUNT}
            columnWidth={ICON_SIZE + GRID_PADDING}
            height={400}
            rowCount={rowCount}
            rowHeight={ICON_SIZE + GRID_PADDING}
            width={COLUMN_COUNT * (ICON_SIZE + GRID_PADDING)}
          >
            {Cell}
          </FixedSizeGrid>
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
          Custom Icon URL
        </Typography>
        <TextField
          fullWidth
          placeholder="Enter icon URL..."
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Button
          variant="outlined"
          onClick={handleCustomUrlSubmit}
          disabled={!customUrl}
        >
          Use Custom URL
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}; 