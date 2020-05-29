import loadable from 'loadable-components';
import LoadingIndicator from 'components/LoadingIndicator/index';

export default loadable(() => import('./index'), {
  LoadingComponent: LoadingIndicator,
});
