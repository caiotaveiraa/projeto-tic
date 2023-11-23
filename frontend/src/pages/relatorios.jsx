import { Helmet } from 'react-helmet-async';

import { RelatorioView } from 'src/sections/relatorios/view';
// ----------------------------------------------------------------------

export default function localPage() {
  return (
    <>
      <Helmet>
        <title>Relatórios | Minimal UI </title>
      </Helmet>

      <RelatorioView/>
    </>
  );
} 
