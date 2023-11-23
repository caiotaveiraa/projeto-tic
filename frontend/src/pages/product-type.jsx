import { Helmet } from 'react-helmet-async';

import { ProductTypeView } from 'src/sections/producttype/view';
// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Unidades de Medida </title>
      </Helmet>

      <ProductTypeView />
    </>
  );
}
