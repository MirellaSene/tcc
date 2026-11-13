import React from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <Router>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<SignUp />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/pedido"
          element={<OrderTracking />}
        />

        <Route
          path="/configuracoes"
          element={<Settings />}
        />

      </Routes>

    </Router>
  );
};

export default App;