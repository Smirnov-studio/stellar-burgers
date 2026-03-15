import rootReducer from '../rootReducer';
import { initialState as ingredientsInitialState } from '../slices/ingredientsSlice';
import { initialState as userInitialState } from '../slices/userSlice';
import { initialState as ordersInitialState } from '../slices/ordersSlice';
import { initialState as constructorInitialState } from '../slices/constructorSlice';

describe('rootReducer', () => {
  test('должен возвращать начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    const expectedState = {
      ingredients: ingredientsInitialState,
      user: userInitialState,
      orders: ordersInitialState,
      burgerConstructor: constructorInitialState
    };

    const actualState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(actualState).toEqual(expectedState);
  });
});
