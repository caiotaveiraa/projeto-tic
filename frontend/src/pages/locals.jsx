import { Helmet } from 'react-helmet-async';

import { LocalView } from 'src/sections/locals/view';
// ----------------------------------------------------------------------

export default function localPage() {
  return (
    <>
      <Helmet>
        <title> Locais de Estoque | Minimal UI </title>
      </Helmet>

      <LocalView/>
    </>
  );
} 
