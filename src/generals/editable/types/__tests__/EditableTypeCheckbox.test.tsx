import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditableTypeCheckbox from '../EditableTypeCheckbox';

describe('EditableTypeCheckbox', () => {
    it('renders with the correct initial value', () => {
        render(<EditableTypeCheckbox value={true} setValue={jest.fn()} />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
    });

    it('calls setValue with the correct value on change', () => {
        const setValueMock = jest.fn();
        render(<EditableTypeCheckbox value={false} setValue={setValueMock} />);

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);

        expect(setValueMock).toHaveBeenCalledWith(true);
    });
});
