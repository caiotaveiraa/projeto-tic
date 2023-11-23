import { Helmet } from 'react-helmet-async';

import { CompositionView } from 'src/sections/composition/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Composições </title>
      </Helmet>

      <CompositionView />
    </>
  );
}
