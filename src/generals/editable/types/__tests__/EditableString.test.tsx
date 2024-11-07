import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditableString from '../EditableString';

describe('EditableString', () => {
    it('renders with the correct initial value', () => {
        render(<EditableString value="Hello" setValue={jest.fn()} />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('Hello');
    });

    it('calls setValue with the correct value on change', () => {
        const setValueMock = jest.fn();
        render(<EditableString value="" setValue={setValueMock} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'World' } });

        expect(setValueMock).toHaveBeenCalledWith('World');
    });
});