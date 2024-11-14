import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditableTypeEmail from '../EditableTypeEmail';

describe('EditableEmail', () => {
    it('renders with the correct initial value', () => {
        render(<EditableTypeEmail value="test@example.com" setValue={jest.fn()} />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('test@example.com');
    });

    it('calls setValue with the correct email on change', () => {
        const setValueMock = jest.fn();
        render(<EditableTypeEmail value="" setValue={setValueMock} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'new@example.com' } });

        expect(setValueMock).toHaveBeenCalledWith('new@example.com');
    });
});
