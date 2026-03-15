import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  clearOrderData,
  initialState
} from '../constructorSlice';
import { TConstructorIngredient } from '@utils-types';

jest.mock('@reduxjs/toolkit', () => ({
  ...jest.requireActual('@reduxjs/toolkit'),
  nanoid: () => 'test-id-123'
}));

describe('constructorSlice', () => {
  const mockBun: TConstructorIngredient = {
    _id: 'bun-1',
    id: 'test-id-123',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  const mockIngredient: TConstructorIngredient = {
    _id: 'ing-1',
    id: 'test-id-123',
    name: 'Начинка',
    type: 'main',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 50,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  const mockIngredient2: TConstructorIngredient = {
    _id: 'ing-2',
    id: 'ing-2-unique',
    name: 'Начинка 2',
    type: 'main',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 60,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  test('должен возвращать начальное состояние', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  test('должен добавлять булку', () => {
    const action = addIngredient(mockBun);
    const newState = constructorReducer(initialState, action);

    expect(newState.bun?._id).toBe(mockBun._id);
    expect(newState.bun?.name).toBe(mockBun.name);
    expect(newState.bun?.price).toBe(mockBun.price);
    expect(newState.ingredients).toHaveLength(0);
  });

  test('должен добавлять начинку', () => {
    const action = addIngredient(mockIngredient);
    const newState = constructorReducer(initialState, action);

    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]._id).toBe(mockIngredient._id);
    expect(newState.ingredients[0].name).toBe(mockIngredient.name);
  });

  test('должен удалять начинку по id', () => {
    const stateWithIngredient = {
      ...initialState,
      ingredients: [mockIngredient]
    };

    const action = removeIngredient(mockIngredient.id);
    const newState = constructorReducer(stateWithIngredient, action);

    expect(newState.ingredients).toHaveLength(0);
  });

  test('должен перемещать начинку вверх', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [mockIngredient, mockIngredient2]
    };

    const action = moveIngredientUp(1);
    const newState = constructorReducer(stateWithIngredients, action);

    expect(newState.ingredients[0]._id).toBe(mockIngredient2._id);
    expect(newState.ingredients[1]._id).toBe(mockIngredient._id);
  });

  test('должен перемещать начинку вниз', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [mockIngredient, mockIngredient2]
    };

    const action = moveIngredientDown(0);
    const newState = constructorReducer(stateWithIngredients, action);

    expect(newState.ingredients[0]._id).toBe(mockIngredient2._id);
    expect(newState.ingredients[1]._id).toBe(mockIngredient._id);
  });

  test('должен очищать конструктор', () => {
    const stateWithItems = {
      ...initialState,
      bun: mockBun,
      ingredients: [mockIngredient, mockIngredient2],
      orderModalData: { number: 12345 } as any
    };

    const action = clearConstructor();
    const newState = constructorReducer(stateWithItems, action);

    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toHaveLength(0);
    expect(newState.orderModalData).toEqual({ number: 12345 }); // Не очищается!
  });

  test('должен очищать данные заказа', () => {
    const stateWithOrder = {
      ...initialState,
      orderModalData: { number: 12345 } as any,
      orderError: 'error'
    };

    const action = clearOrderData();
    const newState = constructorReducer(stateWithOrder, action);

    expect(newState.orderModalData).toBeNull();
    expect(newState.orderError).toBeNull();
  });
});
