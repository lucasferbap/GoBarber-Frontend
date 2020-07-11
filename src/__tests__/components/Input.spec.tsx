import React from 'react';

import { render, fireEvent, wait } from '@testing-library/react';
import Input from '../../components/Input';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

describe('Input component', () => {
  it('should be able to render an input', () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    expect(getByPlaceholderText('E-mail')).toBeTruthy();
  });

  it('should render highlight on input focus', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );
    const inputElement = getByPlaceholderText('E-mail');
    const containetElement = getByTestId('input-container');

    fireEvent.focus(inputElement);

    await wait(() => {
      expect(containetElement).toHaveStyle('border-color: #ff9000;');
      expect(containetElement).toHaveStyle('color: #ff9000;');
    });

    fireEvent.blur(inputElement);

    await wait(() => {
      expect(containetElement).not.toHaveStyle('border-color: #ff9000;');
      expect(containetElement).not.toHaveStyle('color: #ff9000;');
    });
  });

  it('should keep border highlight when input is filled', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );
    const inputElement = getByPlaceholderText('E-mail');
    const containetElement = getByTestId('input-container');

    fireEvent.change(inputElement, {
      target: { value: 'jonhdoe@example.com.br' },
    });

    fireEvent.blur(inputElement);

    await wait(() => {
      expect(containetElement).toHaveStyle('color: #ff9000;');
    });
  });
});
