import { render, screen } from '@testing-library/react'
import { Card } from '../components/Card'
import { Card as CardType } from '../types'

const mockCard: CardType = {
  id: '1',
  title: 'Test Card',
  details: 'Test details'
}

describe('Card', () => {
  it('renders card title and details', () => {
    render(<Card card={mockCard} />)
    expect(screen.getByText('Test Card')).toBeInTheDocument()
    expect(screen.getByText('Test details')).toBeInTheDocument()
  })
})