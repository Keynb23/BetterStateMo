import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react'; // <-- Ensure fireEvent is imported here
import '@testing-library/jest-dom';
// Corrected path: Assumes BackendCart.jsx is in src/context/
import { BackendCartProvider, useBackendCart } from '../context/BackendCart';
// Corrected path: Assumes serviceTypes is in the same directory as BackendCart.jsx (i.e., src/context/)
import { serviceTypes } from '../context/serviceTypes';

// Mock the serviceTypes data to ensure consistent test results
// Corrected mock path: Matches the actual import path
jest.mock('../context/serviceTypes', () => ({
  serviceTypes: [
    { id: '1', title: 'Basic Cleaning' },
    { id: '2', title: 'Deep Cleaning' },
    { id: '3', title: 'Window Washing' },
    { id: '4', title: 'Carpet Cleaning' },
  ],
}));

// A helper component to consume the context for testing purposes
const TestComponent = () => {
  const { cart, addService, removeService, clearCart, getSelectedTitles } = useBackendCart();

  return (
    <div>
      <div data-testid="cart-count">Cart Items: {cart.length}</div>
      <div data-testid="cart-items">{JSON.stringify(cart)}</div>
      <div data-testid="selected-titles">{getSelectedTitles().join(', ')}</div>
      <button onClick={() => addService('1')}>Add Service 1</button>
      <button onClick={() => addService('2')}>Add Service 2</button>
      {/* Changed button text to be unique for "Add Service 1 Again" */}
      <button onClick={() => addService('1')}>Add Service 1 (Duplicate)</button>
      <button onClick={() => removeService('1')}>Remove Service 1</button>
      <button onClick={() => removeService('5')}>Remove Non-Existent</button>
      <button onClick={clearCart}>Clear Cart</button>
      {/* Button to add an unknown service to test getSelectedTitles resilience */}
      <button onClick={() => addService('99')}>Add Unknown Service</button>
    </div>
  );
};

describe('BackendCartProvider and useBackendCart', () => {
  beforeEach(() => {
    // Clear mocks before each test if any were used that persist state
    // In this case, since we're testing state directly, we just ensure a fresh render.
    // The serviceTypes mock is handled by jest.mock setup once.
  });

  // Test 1: Provider renders children
  it('renders children components within the provider', () => {
    render(
      <BackendCartProvider>
        <div data-testid="child-component">Hello</div>
      </BackendCartProvider>
    );
    expect(screen.getByTestId('child-component')).toBeInTheDocument();
  });

  // Test 2: Initial cart state is empty
  it('initializes the cart as empty', () => {
    render(
      <BackendCartProvider>
        <TestComponent />
      </BackendCartProvider>
    );
    expect(screen.getByTestId('cart-count')).toHaveTextContent('Cart Items: 0');
    expect(screen.getByTestId('cart-items')).toHaveTextContent('[]');
    expect(screen.getByTestId('selected-titles')).toHaveTextContent('');
  });

  // Test 3: addService functionality
  it('adds a service to the cart', async () => {
    render(
      <BackendCartProvider>
        <TestComponent />
      </BackendCartProvider>
    );

    // Use exact string match for the first button
    const addService1Button = screen.getByRole('button', { name: 'Add Service 1' });

    await act(async () => {
      fireEvent.click(addService1Button);
    });

    expect(screen.getByTestId('cart-count')).toHaveTextContent('Cart Items: 1');
    expect(screen.getByTestId('cart-items')).toHaveTextContent('["1"]');
    expect(screen.getByTestId('selected-titles')).toHaveTextContent('Basic Cleaning');
  });

  // Test 4: addService does not add duplicates
  it('does not add duplicate services to the cart', async () => {
    render(
      <BackendCartProvider>
        <TestComponent />
      </BackendCartProvider>
    );

    const addService1Button = screen.getByRole('button', { name: 'Add Service 1' });
    const addService2Button = screen.getByRole('button', { name: 'Add Service 2' });
    const addService1DuplicateButton = screen.getByRole('button', { name: 'Add Service 1 (Duplicate)' }); // Exact match for duplicate

    // Add service 1
    await act(async () => {
      fireEvent.click(addService1Button);
    });
    console.log('After adding Service 1:', screen.getByTestId('cart-items').textContent); // Debugging log
    expect(screen.getByTestId('cart-count')).toHaveTextContent('Cart Items: 1');

    // Add service 2
    await act(async () => {
      fireEvent.click(addService2Button);
    });
    console.log('After adding Service 2:', screen.getByTestId('cart-items').textContent); // Debugging log
    expect(screen.getByTestId('cart-count')).toHaveTextContent('Cart Items: 2');
    expect(screen.getByTestId('cart-items')).toHaveTextContent(JSON.stringify(['1', '2']));


    // Attempt to add service 1 again (duplicate)
    await act(async () => {
      fireEvent.click(addService1DuplicateButton);
    });
    console.log('After attempting to add Service 1 (Duplicate):', screen.getByTestId('cart-items').textContent); // Debugging log

    // The cart count should still be 2, as the duplicate should not be added
    expect(screen.getByTestId('cart-count')).toHaveTextContent('Cart Items: 2');
    expect(screen.getByTestId('cart-items')).toHaveTextContent(JSON.stringify(['1', '2']));
    expect(screen.getByTestId('selected-titles')).toHaveTextContent('Basic Cleaning, Deep Cleaning');
  });

  // Test 5: removeService functionality
  it('removes a service from the cart', async () => {
    render(
      <BackendCartProvider>
        <TestComponent />
      </BackendCartProvider>
    );

    const addService1Button = screen.getByRole('button', { name: 'Add Service 1' });
    const addService2Button = screen.getByRole('button', { name: 'Add Service 2' });
    const removeService1Button = screen.getByRole('button', { name: 'Remove Service 1' });

    await act(async () => {
      fireEvent.click(addService1Button);
    });
    await act(async () => {
      fireEvent.click(addService2Button);
    });
    await act(async () => {
      fireEvent.click(removeService1Button);
    });


    expect(screen.getByTestId('cart-count')).toHaveTextContent('Cart Items: 1');
    expect(screen.getByTestId('cart-items')).toHaveTextContent('["2"]');
    expect(screen.getByTestId('selected-titles')).toHaveTextContent('Deep Cleaning');
  });

  // Test 6: removeService handles non-existent services gracefully
  it('does nothing when trying to remove a non-existent service', async () => {
    render(
      <BackendCartProvider>
        <TestComponent />
      </BackendCartProvider>
    );

    const addService1Button = screen.getByRole('button', { name: 'Add Service 1' });
    const removeNonExistentButton = screen.getByRole('button', { name: 'Remove Non-Existent' });

    await act(async () => {
      fireEvent.click(addService1Button); // Add one service
    });
    await act(async () => {
      fireEvent.click(removeNonExistentButton); // Try to remove one that's not there
    });


    expect(screen.getByTestId('cart-count')).toHaveTextContent('Cart Items: 1');
    expect(screen.getByTestId('cart-items')).toHaveTextContent('["1"]'); // Should still contain '1'
  });


  // Test 7: clearCart functionality
  it('clears all services from the cart', async () => {
    render(
      <BackendCartProvider>
        <TestComponent />
      </BackendCartProvider>
    );

    const addService1Button = screen.getByRole('button', { name: 'Add Service 1' });
    const addService2Button = screen.getByRole('button', { name: 'Add Service 2' });
    const clearCartButton = screen.getByRole('button', { name: 'Clear Cart' });

    await act(async () => {
      fireEvent.click(addService1Button);
    });
    await act(async () => {
      fireEvent.click(addService2Button);
    });

    expect(screen.getByTestId('cart-count')).toHaveTextContent('Cart Items: 2');

    await act(async () => {
      fireEvent.click(clearCartButton);
    });

    expect(screen.getByTestId('cart-count')).toHaveTextContent('Cart Items: 0');
    expect(screen.getByTestId('cart-items')).toHaveTextContent('[]');
    expect(screen.getByTestId('selected-titles')).toHaveTextContent('');
  });

  // Test 8: getSelectedTitles returns correct titles
  it('returns correct titles for selected services', async () => {
    render(
      <BackendCartProvider>
        <TestComponent />
      </BackendCartProvider>
    );

    const addService1Button = screen.getByRole('button', { name: 'Add Service 1' }); // Basic Cleaning
    const addService2Button = screen.getByRole('button', { name: 'Add Service 2' }); // Deep Cleaning

    await act(async () => {
      fireEvent.click(addService1Button);
    });
    await act(async () => {
      fireEvent.click(addService2Button);
    });

    expect(screen.getByTestId('selected-titles')).toHaveTextContent('Basic Cleaning, Deep Cleaning');
  });

  // Test 9: getSelectedTitles handles unknown services
  it('returns "Unknown" for service IDs not found in serviceTypes', async () => {
    render(
      <BackendCartProvider>
        <TestComponent />
      </BackendCartProvider>
    );

    const addService1Button = screen.getByRole('button', { name: 'Add Service 1' });
    const addUnknownServiceButton = screen.getByRole('button', { name: 'Add Unknown Service' });

    await act(async () => {
      fireEvent.click(addService1Button);
    });
    await act(async () => {
      fireEvent.click(addUnknownServiceButton); // This adds '99'
    });

    // We expect 'Basic Cleaning' from '1' and 'Unknown' from '99'
    expect(screen.getByTestId('selected-titles')).toHaveTextContent('Basic Cleaning, Unknown');
  });
});
