import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditableRange from '../EditableRange';

describe('EditableRange', () => {
    it('renders with the correct initial value', () => {
        render(<EditableRange value={50} setValue={jest.fn()} min={0} max={100} />);
        const input = screen.getByRole('slider');
        expect(input).toHaveValue('50');
    });

    it('calls setValue with the correct value on change', () => {
        const setValueMock = jest.fn();
        render(<EditableRange value={0} setValue={setValueMock} min={0} max={100} />);

        const input = screen.getByRole('slider');
        fireEvent.change(input, { target: { value: '75' } });

        expect(setValueMock).toHaveBeenCalledWith(75);
    });
});
