import * as PropTypes from 'prop-types';
import InputEditor from 'components/MuiInput/Editor';
export default class CustomCellEditor extends InputEditor {
  componentWillUnmount() {
    const { context, rowIndex } = this.props;
    const updater = {
      isChanged: true,
    };
    context.props.formik.updateFieldArrayValue('tableData', rowIndex, updater);
  }
}

CustomCellEditor.propTypes = {
  onComponentWillUnmount: PropTypes.func,
};
