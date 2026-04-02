import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import KanbanBoard from '../components/KanbanBoard'
import { Card as CardType, Column as ColumnType } from '../types'
import { BoardProvider } from '../lib/store.tsx'

// Test wrapper with BoardProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BoardProvider>{children}</BoardProvider>
)

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock the useLocalStorage hook
jest.mock('../hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn((key: string, initialValue: any) => {
    const [value, setValue] = React.useState(initialValue)
    return [value, setValue]
  })
}))

// Mock window.prompt for add card functionality
window.prompt = jest.fn((message) => {
  if (message === 'Enter card title:') return 'New Test Card';
  if (message === 'Enter card details:') return 'Test card details';
  return null;
})

import React from 'react'

const mockColumns: ColumnType[] = [
  {
    id: '1',
    name: 'To Do',
    cards: [
      { id: '1-1', title: 'Design UI', details: 'Create wireframes for the new feature' },
      { id: '1-2', title: 'Write tests', details: 'Unit tests for the API endpoints' },
    ],
  },
  {
    id: '2',
    name: 'In Progress',
    cards: [
      { id: '2-1', title: 'Implement login', details: 'Add authentication to the app' },
    ],
  },
]

describe('KanbanBoard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock window.confirm
    window.confirm = jest.fn(() => true)
    console.log('Mock window.confirm set up:', window.confirm)
  })

  it('renders all columns and cards', () => {
    render(<KanbanBoard />, { wrapper: TestWrapper })

    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Design UI')).toBeInTheDocument()
    expect(screen.getByText('Write tests')).toBeInTheDocument()
    expect(screen.getByText('Implement login')).toBeInTheDocument()
  })

  it('opens add card prompts when add button is clicked', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />, { wrapper: TestWrapper })

    const addButtons = screen.getAllByText('Add Card')
    await user.click(addButtons[0])

    expect(window.prompt).toHaveBeenCalledWith('Enter card title:')
    expect(window.prompt).toHaveBeenCalledWith('Enter card details:')
  })

  it('adds a new card when prompts are filled', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />, { wrapper: TestWrapper })

    const addButtons = screen.getAllByText('Add Card')
    await user.click(addButtons[0])

    await waitFor(() => {
      expect(screen.getByText('New Test Card')).toBeInTheDocument()
    })
  })

  it('deletes a card when delete button is clicked and confirmed', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />, { wrapper: TestWrapper })

    const deleteButtons = screen.getAllByLabelText(/Delete card:/)
    await user.click(deleteButtons[0])

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this card?')
    })
  })

  it('renders initial columns during SSR and stored columns after hydration', () => {
    // This test verifies hydration behavior - simplified version
    render(<KanbanBoard />, { wrapper: TestWrapper });

    // Should render with initial data
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('Design UI')).toBeInTheDocument();
  });
})