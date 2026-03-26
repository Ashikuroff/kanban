# Kanban Board - Project Management Application

A modern, responsive Kanban-style project management web application built with Next.js. This MVP features drag-and-drop functionality, persistent data storage, and a clean, professional UI.

![Kanban Board Screenshot](https://via.placeholder.com/800x400/032147/ecad0a?text=Kanban+Board+Preview)

## 🚀 Features

### Core Functionality
- **5 Fixed Columns**: To Do, In Progress, Review, Testing, Done (all renamable)
- **Drag & Drop**: Intuitive card movement between columns using @dnd-kit
- **Card Management**: Add, edit, delete, and mark cards as completed
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

### Typography
- **Font Family**: Geist Sans (fallback: system fonts)
- **Responsive Scaling**: Adaptive text sizes for different screen sizes

## 🛠️ Tech Stack

- **Framework**: Next.js 16.2.1 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- **Testing**: Jest, React Testing Library, @testing-library/jest-dom
- **Linting**: ESLint 9
- **Build Tool**: Turbopack

## 📦 Installation

### Prerequisites
- Node.js 18+ (preferably 22+)
- npm or yarn package manager

### Setup
1. **Clone the repository** (if applicable) or navigate to the frontend directory
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start development server**:
   ```bash
   npm run dev
   ```
4. **Open your browser** and visit `http://localhost:3000`

## 🚀 Usage

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
npm test
```

### Test Coverage
- Component rendering and interactions
- Modal functionality
- Card display and state management
- Custom hooks behavior

### Test Structure
```
src/
├── __tests__/
│   ├── Modal.test.tsx
│   └── Card.test.tsx
├── components/
├── hooks/
└── types/
```

## 🏗️ Development

### Project Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── KanbanBoard.tsx
│   │   ├── Column.tsx
│   │   ├── SortableCard.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   └── useModal.ts
│   ├── types/
│   │   └── index.ts
│   └── __tests__/
├── jest.config.mjs
├── jest.setup.js
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb config with React and TypeScript rules
- **Prettier**: Code formatting (via ESLint)
- **Testing**: Minimum test coverage requirements

## 🚢 Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment Variables
No environment variables required for basic functionality. For production deployments, consider:

- `NODE_ENV=production`
- Custom API endpoints (if backend integration added)

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative static hosting
- **Docker**: Containerized deployment possible

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

### Commit Convention
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Testing updates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

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
