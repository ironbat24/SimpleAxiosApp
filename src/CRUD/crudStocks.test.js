import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CrudStocks from './crudStocks';

test('form-validation', () => {
    render(<CrudStocks />);
    fireEvent.click(screen.getByText('Create new Stock'));
    expect(screen.getByText('ID is required')).toBeInTheDocument();
});

