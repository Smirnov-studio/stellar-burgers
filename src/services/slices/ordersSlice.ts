import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  getFeedsApi,
  getOrdersApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import { RootState } from '../store';

type TOrdersState = {
  feeds: TOrder[];
  userOrders: TOrder[];
  currentOrder: TOrder | null;
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

export const initialState: TOrdersState = {
  feeds: [],
  userOrders: [],
  currentOrder: null,
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

// Получение всех заказов (лента)
export const getFeeds = createAsyncThunk(
  'orders/getFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Получение заказов пользователя
export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Получение заказа по номеру
export const getOrderByNumber = createAsyncThunk(
  'orders/getByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.orders[0];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Feeds
      .addCase(getFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.feeds = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // User orders
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Order by number
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default ordersSlice.reducer;

// Селекторы
export const selectFeeds = (state: RootState) => state.orders.feeds;
export const selectUserOrders = (state: RootState) => state.orders.userOrders;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;
export const selectOrdersTotal = (state: RootState) => state.orders.total;
export const selectOrdersTotalToday = (state: RootState) =>
  state.orders.totalToday;
export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrderByNumber = (number: number) => (state: RootState) =>
  state.orders.feeds.find(
    (order: { number: number }) => order.number === number
  ) ||
  state.orders.userOrders.find(
    (order: { number: number }) => order.number === number
  ) ||
  state.orders.currentOrder;
