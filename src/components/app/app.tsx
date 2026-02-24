import React, { useEffect, FC, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearOrderData,
  selectOrderModalData
} from '../../services/slices/constructorSlice';
import { OrderDetailsUI } from '@ui';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';

import { AppHeader } from '@components';
import { OrderInfo } from '@components';
import { Modal } from '@components';
import { IngredientDetails } from '@components';
import { ProtectedRoute } from '../protected-route';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import '../../index.css';
import styles from './app.module.css';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { getUser } from '../../services/slices/userSlice';

// Компонент для отображения модального окна с информацией о заказе
const ModalOrderInfo = () => {
  const navigate = useNavigate();
  const { number } = useParams<{ number: string }>();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <Modal title={`Детали заказа #${number}`} onClose={handleClose}>
      <OrderInfo />
    </Modal>
  );
};

// Компонент для отображения модального окна с деталями ингредиента
const ModalIngredientDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <Modal title={`Детали ингредиента`} onClose={handleClose}>
      <IngredientDetails />
    </Modal>
  );
};

// Компонент для отображения модального окна с информацией о заказе в профиле
const ModalProfileOrderInfo = () => {
  const navigate = useNavigate();
  const { number } = useParams<{ number: string }>();

  const handleClose = () => {
    navigate('/profile/orders');
  };

  return (
    <Modal title={'Информация о заказе'} onClose={handleClose}>
      <OrderInfo />
    </Modal>
  );
};

const App = () => {
  const location = useLocation();
  const background = location.state?.background;
  const dispatch = useDispatch();
  const orderModalData = useSelector(selectOrderModalData);

  // Загружаем ингредиенты
  useEffect(() => {
    dispatch(fetchIngredients());
    // Получить данные пользователя по токену
    dispatch(getUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        {/* Главная страница */}
        <Route path='/' element={<ConstructorPage />} />

        {/* Лента заказов */}
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />

        {/* Детали ингредиента */}
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        {/* Защищенные маршруты */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        {/* Страница 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна */}
      {background && (
        <Routes>
          <Route path='/feed/:number' element={<ModalOrderInfo />} />
          <Route path='/ingredients/:id' element={<ModalIngredientDetails />} />
          <Route
            path='/profile/orders/:number'
            element={<ModalProfileOrderInfo />}
          />
        </Routes>
      )}
      {orderModalData && (
        <Modal title={''} onClose={() => dispatch(clearOrderData())}>
          <OrderDetailsUI orderNumber={orderModalData.number} />
        </Modal>
      )}
    </div>
  );
};

const AppWithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWithRouter;
