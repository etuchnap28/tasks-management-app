import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';
import ProtectedRoute from './utils/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* public routes */}
        <Route index element={<Home />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppLayout />}></Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
