import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditableText from '../EditableText';

describe('EditableText', () => {
    it('renders with the correct initial value', () => {
        render(<EditableText value="Initial text" setValue={jest.fn()} />);
        const textarea = screen.getByRole('textbox');
        expect(textarea).toHaveValue('Initial text');
    });

    it('calls setValue with the correct value on change', () => {
        const setValueMock = jest.fn();
        render(<EditableText value="" setValue={setValueMock} />);

        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: 'Updated text' } });

        expect(setValueMock).toHaveBeenCalledWith('Updated text');
    });
});