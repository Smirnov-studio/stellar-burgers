import ingredientsReducer, {
  fetchIngredients,
  initialState
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Ингредиент 1',
      type: 'bun',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 100,
      image: '',
      image_large: '',
      image_mobile: ''
    }
  ];

  test('должен обрабатывать fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const newState = ingredientsReducer(initialState, action);

    expect(newState.loading).toBe(true);
    expect(newState.error).toBeNull();
  });

  test('должен обрабатывать fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const newState = ingredientsReducer(initialState, action);

    expect(newState.loading).toBe(false);
    expect(newState.items).toEqual(mockIngredients);
    expect(newState.error).toBeNull();
  });

  test('должен обрабатывать fetchIngredients.rejected', () => {
    const errorMessage = 'Ошибка загрузки';
    const action = {
      type: fetchIngredients.rejected.type,
      payload: errorMessage
    };
    const newState = ingredientsReducer(initialState, action);

    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(errorMessage);
  });
});
