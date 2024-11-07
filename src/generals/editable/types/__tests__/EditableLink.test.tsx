import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditableLink from '../EditableLink';

describe('EditableLink', () => {
    it('renders with the correct initial value', () => {
        render(<EditableLink value="https://example.com" setValue={jest.fn()} />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('https://example.com');
    });

    it('calls setValue with the correct URL on change', () => {
        const setValueMock = jest.fn();
        render(<EditableLink value="" setValue={setValueMock} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'https://newurl.com' } });

        expect(setValueMock).toHaveBeenCalledWith('https://newurl.com');
    });
});
