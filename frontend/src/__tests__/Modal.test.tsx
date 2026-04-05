import { render, screen } from '@testing-library/react'
import { Modal } from '../components/Modal'

describe('Modal', () => {
  it('renders children when open', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Test Content</div>
      </Modal>
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Test Content</div>
      </Modal>
    )
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
  })

  it('has dialog role and aria attributes when open', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Title">
        <div>Test Content</div>
      </Modal>
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('has accessible close button', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Test Content</div>
      </Modal>
    )
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
  })
})
