import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditableSelect from '../EditableSelect';

describe('EditableSelect', () => {
    const options = [{ label: 'Option A', value: 'A' }, { label: 'Option B', value: 'B' }];

    it('renders with the correct initial value', () => {
        render(<EditableSelect value="A" setValue={jest.fn()} options={options} />);
        const select = screen.getByRole('combobox');
        expect(select).toHaveValue('A');
    });

    it('calls setValue with the correct value on change', () => {
        const setValueMock = jest.fn();
        render(<EditableSelect value="A" setValue={setValueMock} options={options} />);

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'B' } });

        expect(setValueMock).toHaveBeenCalledWith('B');
    });
});
