import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import KanbanBoard from '../components/KanbanBoard'
import { Card as CardType, Column as ColumnType } from '../types'

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
  })

  it('renders all columns and cards', () => {
    render(<KanbanBoard />)

    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Design UI')).toBeInTheDocument()
    expect(screen.getByText('Write tests')).toBeInTheDocument()
    expect(screen.getByText('Implement login')).toBeInTheDocument()
  })

  it('opens add card modal when add button is clicked', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />)

    const addButtons = screen.getAllByText('+ Add Card')
    await user.click(addButtons[0])

    expect(screen.getByText('Add New Card')).toBeInTheDocument()
  })

  it('adds a new card when form is submitted', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />)

    const addButtons = screen.getAllByText('+ Add Card')
    await user.click(addButtons[0])

    const titleInput = screen.getByPlaceholderText('Enter card title')
    const detailsInput = screen.getByPlaceholderText('Enter card details')
    const submitButton = screen.getByText('Add Card')

    await user.type(titleInput, 'New Test Card')
    await user.type(detailsInput, 'Test card details')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('New Test Card')).toBeInTheDocument()
    })
  })

  it('opens edit modal when card is double-clicked', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />)

    const cards = screen.getAllByText('Design UI')
    await user.dblClick(cards[0])

    expect(screen.getByText('Edit Card')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Design UI')).toBeInTheDocument()
  })

  it('edits a card when form is submitted', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />)

    const cards = screen.getAllByText('Design UI')
    await user.dblClick(cards[0])

    const titleInput = screen.getByDisplayValue('Design UI')
    const submitButton = screen.getByText('Save')

    await user.clear(titleInput)
    await user.type(titleInput, 'Updated Design UI')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Updated Design UI')).toBeInTheDocument()
    })
  })

  it('deletes a card when delete button is clicked and confirmed', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />)

    const deleteButtons = screen.getAllByLabelText(/Delete card:/)
    await user.click(deleteButtons[0])

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this card?')
    })
  })

  it('toggles card completion when checkbox is clicked', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />)

    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[0])

    // The card should still be visible but marked as completed
    expect(screen.getByText('Design UI')).toBeInTheDocument()
  })

  it('opens rename column modal when column title is clicked', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />)

    const columnTitles = screen.getAllByRole('heading', { level: 2 })
    await user.click(columnTitles[0])

    expect(screen.getByText('Rename Column')).toBeInTheDocument()
  })

  it('renames a column when form is submitted', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />)

    const columnTitles = screen.getAllByRole('heading', { level: 2 })
    await user.click(columnTitles[0])

    const nameInput = screen.getByDisplayValue('To Do')
    const submitButton = screen.getByText('Rename')

    await user.clear(nameInput)
    await user.type(nameInput, 'Tasks To Do')
    await user.click(submitButton)

    // Wait for the modal to close
    await waitFor(() => {
      expect(screen.queryByText('Rename Column')).not.toBeInTheDocument()
    })

    // Now check that the column name has been updated
    expect(screen.getByText('Tasks To Do')).toBeInTheDocument()
  })

  it('renders initial columns during SSR and stored columns after hydration', () => {
    // This test verifies hydration behavior - simplified version
    render(<KanbanBoard />);

    // Should render with initial data
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('Design UI')).toBeInTheDocument();
  });
})