import { Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/components/routing/ProtectedRoute'
import { DashboardPage } from '@/pages/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { CategoriesPage } from '@/pages/CategoriesPage'
import { ProductsPage } from '@/pages/ProductsPage'
import { RolesPage } from '@/pages/RolesPage'
import { SalesPage } from '@/pages/SalesPage'
import { SalesReportsPage } from '@/pages/SalesReportsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute permissions={['dashboard.view']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="products"
          element={
            <ProtectedRoute permissions={['products.view']}>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="sales"
          element={
            <ProtectedRoute permissions={['sales.create']}>
              <SalesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="sales/reports"
          element={
            <ProtectedRoute permissions={['sales.view']}>
              <SalesReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="products/categories"
          element={
            <ProtectedRoute permissions={['products.view']}>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="roles"
          element={
            <ProtectedRoute adminOnly>
              <RolesPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
