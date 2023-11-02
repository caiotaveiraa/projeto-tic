import { Helmet } from 'react-helmet-async';

import { MeasureUnitView } from 'src/sections/measureunit/view';
// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Produtos</title>
      </Helmet>

      <MeasureUnitView />
    </>
  );
}
