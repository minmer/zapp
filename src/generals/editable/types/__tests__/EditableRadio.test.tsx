import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditableRadio from '../EditableRadio';

describe('EditableRadio', () => {
    const options = [{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }];

    it('renders with the correct initial selection', () => {
        render(<EditableRadio value="1" setValue={jest.fn()} options={options} />);
        const option1 = screen.getByLabelText('Option 1');
        expect(option1).toBeChecked();
    });

    it('calls setValue with the correct value on change', () => {
        const setValueMock = jest.fn();
        render(<EditableRadio value="1" setValue={setValueMock} options={options} />);

        const option2 = screen.getByLabelText('Option 2');
        fireEvent.click(option2);

        expect(setValueMock).toHaveBeenCalledWith('2');
    });
});
