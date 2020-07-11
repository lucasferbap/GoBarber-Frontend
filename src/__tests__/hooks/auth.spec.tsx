import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import { useAuth, AuthProvider } from '../../hooks/Auth';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth Hook', () => {
  it('should be able to sigin', async () => {
    apiMock.onPost('sessions').reply(200, {
      user: {
        id: 'user-id',
        name: 'Jonh Doe',
        email: 'jonhdoe@example.com.br',
      },
      token: 'token-123',
    });

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'jonhdoe@example.com.br',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith('@GoBarber:token', 'token-123');
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify({
        id: 'user-id',
        name: 'Jonh Doe',
        email: 'jonhdoe@example.com.br',
      }),
    );

    expect(result.current.user.email).toEqual('jonhdoe@example.com.br');
  });

  it('should restore saved data from storage when auth inits', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case 'GoBarber:token':
          return 'token-123';

        case 'GoBarber:user':
          return JSON.stringify({
            id: 'user-id',
            name: 'Jonh Doe',
            email: 'jonhdoe@example.com.br',
          });

        default:
          return null;
      }
    });
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual('jonhdoe@example.com.br');
  });

  it('should be able to sign out', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case 'GoBarber:token':
          return 'token-123';

        case 'GoBarber:user':
          return JSON.stringify({
            id: 'user-id',
            name: 'Jonh Doe',
            email: 'jonhdoe@example.com.br',
          });

        default:
          return null;
      }
    });
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });
    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBeUndefined();
  });

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'user-123',
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com.br',
      avatar_url: 'image-test.jpg',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );

    expect(result.current.user).toEqual(user);
  });
});
