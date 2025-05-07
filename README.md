# LinkDir

A modern, intuitive directory management application built with React and Material-UI. LinkDir allows you to organize your links and folders in a hierarchical structure with a beautiful and user-friendly interface.

## Features

- 📁 Create and manage folders and links
- 🔗 Organize links with custom icons and descriptions
- 🎨 Beautiful Material-UI interface with light/dark theme support
- 🖱️ Context menu for quick actions
- 📱 Responsive design
- 🔄 Drag and drop support for reorganizing items
- 💾 Automatic local storage persistence

## Tech Stack

- React 19
- TypeScript
- Material-UI 7
- Vite
- React Window for virtualized lists

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/linkdir.git
cd linkdir
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

### GitHub Pages Deployment

The project is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. The deployment process:

1. Builds the project using Vite
2. Deploys the built files to GitHub Pages
3. The site will be available at `https://yourusername.github.io/LinkDir/`

You can also manually trigger the deployment from the Actions tab in your GitHub repository.

## Usage

- **Adding Items**: Right-click on a folder to add new links or subfolders
- **Editing**: Right-click on any item to edit its properties
- **Dragging**: Drag links to reorganize them between folders
- **Icons**: Choose from Material-UI icons or use custom icon URLs
- **Themes**: Toggle between light and dark themes using the theme switch

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## License

MIT
