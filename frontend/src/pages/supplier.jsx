import { Helmet } from 'react-helmet-async';

import { SupplierView } from 'src/sections/supplier/view';
// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Fornecedores</title>
      </Helmet>

      <SupplierView />
    </>
  );
}
