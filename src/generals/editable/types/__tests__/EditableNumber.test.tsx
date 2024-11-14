import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditableTypeNumber from '../EditableTypeNumber';

describe('EditableNumber', () => {
    it('renders with the correct initial value', () => {
        render(<EditableTypeNumber value={42} setValue={jest.fn()} />);
        const input = screen.getByRole('spinbutton');
        expect(input).toHaveValue(42);
    });

    it('calls setValue with the correct value on change', () => {
        const setValueMock = jest.fn();
        render(<EditableTypeNumber value={0} setValue={setValueMock} />);

        const input = screen.getByRole('spinbutton');
        fireEvent.change(input, { target: { value: '100' } });

        expect(setValueMock).toHaveBeenCalledWith(100);
    });
});