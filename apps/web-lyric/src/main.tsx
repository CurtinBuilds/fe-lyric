import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import H5App from './H5App';
import './styles.css';

const ProvinceApp = lazy(() => import('./ProvinceApp'));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/h5" element={<H5App />} />
        <Route path="/h5/province/:slug" element={
          <Suspense fallback={null}>
            <ProvinceApp h5Mode />
          </Suspense>
        } />
        <Route path="/province/:slug" element={
          <Suspense fallback={null}>
            <ProvinceApp />
          </Suspense>
        } />
        <Route path="/province/:slug/h5" element={
          <Suspense fallback={null}>
            <ProvinceApp h5Mode />
          </Suspense>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
