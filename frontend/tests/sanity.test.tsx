import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'

test('Sanity check: Frontend testing infrastructure is working', () => {
    render(<div data-testid="test-div">HessProtector</div>)
    const element = screen.getByTestId('test-div')
    expect(element.textContent).toBe('HessProtector')
})
