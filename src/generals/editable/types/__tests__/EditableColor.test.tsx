import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditableColor from '../EditableColor';

describe('EditableColor', () => {
    it('renders with the correct initial value', () => {
        render(<EditableColor value="#000000" setValue={jest.fn()} />);
        const input = screen.getByDisplayValue('#000000'); // Access by the current color value
        expect(input).toBeInTheDocument();
    });

    it('calls setValue with the correct value on change', () => {
        const setValueMock = jest.fn();
        render(<EditableColor value="#000000" setValue={setValueMock} />);

        const input = screen.getByDisplayValue('#000000');
        fireEvent.change(input, { target: { value: '#ffffff' } });

        expect(setValueMock).toHaveBeenCalledWith('#ffffff');
    });
});