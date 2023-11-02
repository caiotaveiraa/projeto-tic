import { Helmet } from 'react-helmet-async';

import { ProductView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Produtos</title>
      </Helmet>

      <ProductView />
    </>
  );
}
