import { Helmet } from 'react-helmet-async';

import { NfView } from 'src/sections/nf/view';

// ----------------------------------------------------------------------

export default function EntryPage() {
  return (
    <>
      <Helmet>
        <title> Notas Fiscais </title>
      </Helmet>

      <NfView />
    </>
  );
}
