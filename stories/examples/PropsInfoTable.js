import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line react/prefer-stateless-function
class ExpansionComponent extends React.Component {
  render() {
    const { hasRightAction, classes, title, content } = this.props;
    return (
      <table>
        <thead>
          <tr>
            <th>{hasRightAction}</th>
            <th>{classes}</th>
            <th>{title}</th>
            <th>{content}</th>
          </tr>
        </thead>
      </table>
    );
  }
}

ExpansionComponent.propTypes = {
  /**
   * Cho phép hiển thị một số component khác phía bên phải để có thể thao tác
   */
  hasRightAction: PropTypes.bool,
  /**
   * Chứa các thuộc tính style để style các component
   */
  classes: PropTypes.object.isRequired,
  /**
   * Tiêu đề của Expansion
   */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /**
   * Nội dung của Expansion
   */
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

ExpansionComponent.defaultProps = {
  hasRightAction: false,
};
ExpansionComponent.description = {
  hasRightAction: 'If true will be show',
};
export default ExpansionComponent;
