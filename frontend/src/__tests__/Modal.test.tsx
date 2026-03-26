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
})