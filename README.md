# Kanban Project Manager

A modern, responsive Kanban-style project management application built with Next.js. This project implements a complete MVP with drag-and-drop functionality, persistent data storage, and a professional UI.

## 📁 Project Structure

```
kanban/
├── AGENTS.md          # Project requirements and specifications
├── README.md          # This file - project overview
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── __tests__/     # Unit tests
│   │   └── types.ts       # TypeScript type definitions
│   ├── package.json       # Dependencies and scripts
│   └── README.md          # Frontend-specific documentation
└── .git/              # Git repository
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (preferably 22+)
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ashikuroff/kanban.git
   cd kanban
   ```

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit `http://localhost:3000` to see the application

## 🎯 Features

### Core Functionality
- **5 Fixed Columns**: To Do, In Progress, Review, Testing, Done (all renamable)
- **Drag & Drop**: Intuitive card movement between columns using @dnd-kit
- **Card Management**: Create, edit, delete, and mark cards as completed
- **Persistent Storage**: Automatic localStorage saving and restoration
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### User Experience
- **Modal Dialogs**: Professional forms for adding/editing cards and renaming columns
- **Visual Feedback**: Completed cards show distinct styling with checkmarks
- **Confirmation Prompts**: Prevents accidental deletions
- **Accessibility**: ARIA labels and keyboard navigation support
- **Real-time Updates**: Instant UI updates with state persistence

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Modern React**: Hooks-based architecture with custom hooks
- **Testing**: Jest and React Testing Library setup
- **ESLint**: Code quality enforcement
- **SSR Compatible**: Server-side rendering support with Next.js

## 🎨 Design System

### Color Palette
- **Accent Yellow**: `#ecad0a` - Highlights and accents
- **Blue Primary**: `#209dd7` - Links and key sections
- **Purple Secondary**: `#753991` - Submit buttons and important actions
- **Dark Navy**: `#032147` - Main headings
- **Gray Text**: `#888888` - Supporting text and labels

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.2.1 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- **Testing**: Jest, React Testing Library, @testing-library/jest-dom
- **Linting**: ESLint 9
- **Build Tool**: Turbopack

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **Testing**: Jest, React Testing Library

## 📋 Usage

### Basic Operations
1. **Add Cards**: Click the "+ Add Card" button in any column
2. **Edit Cards**: Double-click any card to edit title and details
3. **Move Cards**: Drag and drop cards between columns
4. **Complete Tasks**: Check the checkbox on cards to mark as completed
5. **Delete Cards**: Click the "✕" button (with confirmation)
6. **Rename Columns**: Click on column headers to rename

### Keyboard Shortcuts
- **Tab**: Navigate through interactive elements
- **Enter/Space**: Activate buttons and checkboxes
- **Escape**: Close modals

### Data Persistence
- All changes are automatically saved to browser localStorage
- Data persists across browser sessions and page refreshes
- No data loss on accidental page closure

## 🧪 Testing

### Run Tests
```bash
cd frontend
npm test
```

### Test Coverage
- Component rendering and interactions
- Modal functionality
- Card display and state management
- Custom hooks behavior

## 🚢 Deployment

### Build for Production
```bash
cd frontend
npm run build
npm run start
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative static hosting
- **Docker**: Containerized deployment possible

## 📚 Documentation

### Project Files
- **[AGENTS.md](./AGENTS.md)**: Complete project requirements and specifications
- **[frontend/README.md](./frontend/README.md)**: Detailed frontend documentation
- **[frontend/package.json](./frontend/package.json)**: Dependencies and scripts

### Key Directories
- **[frontend/src/components/](./frontend/src/components/)**: React components
- **[frontend/src/hooks/](./frontend/src/hooks/)**: Custom React hooks
- **[frontend/src/__tests__/](./frontend/src/__tests__/)**: Unit tests

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes and add tests
4. Run tests: `npm test`
5. Lint code: `npm run lint`
6. Commit changes: `git commit -am 'Add new feature'`
7. Push to branch: `git push origin feature/your-feature`
8. Submit a pull request

### Code Standards
- Follow existing TypeScript and React patterns
- Add tests for new functionality
- Update documentation for API changes
- Maintain accessibility standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [@dnd-kit](https://dndkit.com/) - Drag and drop functionality
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Testing Library](https://testing-library.com/) - Testing utilities

## 📞 Support

For questions, issues, or contributions:
- Create an issue in the repository
- Check existing documentation
- Review the code comments for implementation details

---

**Built with ❤️ using Next.js and TypeScript**

## 🔗 Links

- **Live Demo**: [Deployed Application](https://your-deployment-url.com)
- **GitHub Repository**: [https://github.com/Ashikuroff/kanban](https://github.com/Ashikuroff/kanban)
- **Pull Request**: [PR #1](https://github.com/Ashikuroff/kanban/pull/1)
