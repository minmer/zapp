import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditableTypeTel from '../EditableTypeTel';

describe('EditableTel', () => {
    it('renders with the correct initial value', () => {
        render(<EditableTypeTel value="+1234567890" setValue={jest.fn()} />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('+1234567890');
    });

    it('calls setValue with the correct value on change', () => {
        const setValueMock = jest.fn();
        render(<EditableTypeTel value="" setValue={setValueMock} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '+0987654321' } });

        expect(setValueMock).toHaveBeenCalledWith('+0987654321');
    });
});
