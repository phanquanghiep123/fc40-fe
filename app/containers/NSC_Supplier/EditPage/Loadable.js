/**
 *
 * Asynchronously loads the component for ImportedStockReceiptPage
 *
 */

import loadable from 'loadable-components';
import LoadingIndicator from 'components/LoadingIndicator/index';

export default loadable(() => import('../CreatePage/index'), {
  LoadingComponent: LoadingIndicator,
});
