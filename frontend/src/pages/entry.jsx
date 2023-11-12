import { Helmet } from 'react-helmet-async';

import { EntryView } from 'src/sections/entry/view';

// ----------------------------------------------------------------------

export default function EntryPage() {
  return (
    <>
      <Helmet>
        <title> Movimentos </title>
      </Helmet>

      <EntryView />
    </>
  );
}
