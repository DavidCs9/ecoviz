import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Calculator } from '../pages/Calculator'
import { ToastProvider } from '../components/ui/toast'

// Mock the useNavigate hook
const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}))

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}))

const renderCalculator = () => {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <Calculator />
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe('Calculator Component', () => {
  test('renders Calculator component', () => {
    renderCalculator()
    const titleElement = screen.getByText(/Carbon Footprint Calculator/i)
    expect(titleElement).toBeInTheDocument()
  })

  test('initial step is Housing', () => {
    renderCalculator()
    expect(screen.getByText(/Step 1 of 4: Housing/i)).toBeInTheDocument()
  })

  test('can navigate to next step', () => {
    renderCalculator()
    const nextButton = screen.getByText(/Next/i)
    fireEvent.click(nextButton)
    expect(screen.getByText(/Step 2 of 4: Transportation/i)).toBeInTheDocument()
  })

  test('can navigate back to previous step', () => {
    renderCalculator()
    const nextButton = screen.getByText(/Next/i)
    fireEvent.click(nextButton)
    const previousButton = screen.getByText(/Previous/i)
    fireEvent.click(previousButton)
    expect(screen.getByText(/Step 1 of 4: Housing/i)).toBeInTheDocument()
  })
})
