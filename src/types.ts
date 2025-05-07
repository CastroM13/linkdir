export interface LinkItem {
  name: string;
  type: 'Link';
  icon?: string;
  url: string;
  description?: string;
}

export interface FolderItem {
  name: string;
  type: 'Folder';
  icon?: string;
  children: (LinkItem | FolderItem)[];
}

export type Item = LinkItem | FolderItem;

export type MaterialIcon = keyof typeof import('@mui/icons-material'); 