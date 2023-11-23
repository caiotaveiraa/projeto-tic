import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const ProductPage = lazy(() => import('src/pages/product'));
export const MeasureUnitPage = lazy(() => import('src/pages/measure-unit'));
export const SupplierPage = lazy(() => import('src/pages/supplier'));
export const StockLocationPage = lazy(() => import('src/pages/locals'))
export const EntryPage = lazy(() => import('src/pages/entry'))
export const NfPage = lazy(() => import('src/pages/nf'))
export const Relatorios = lazy(() => import('src/pages/relatorios'))
export const ProductTypePage = lazy(() => import('src/pages/product-type'))
export const CompositionPage = lazy(() => import('src/pages/composition'))

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'product', element: <ProductPage /> },
        { path: 'measureunit', element: <MeasureUnitPage /> },
        { path: 'producttype', element: <ProductTypePage /> },
        { path: 'entry', element: <EntryPage /> },
        { path: 'supplier', element: <SupplierPage /> },
        { path: 'stocklocation', element: <StockLocationPage />},
        { path: 'nf', element: <NfPage />},
        { path: 'relatorios', element: <Relatorios />},
        { path: 'composition', element: <CompositionPage />},
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'register',
      element: <RegisterPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
