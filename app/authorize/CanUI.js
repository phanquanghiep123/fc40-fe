import { Can } from '@casl/react';
import { createElement } from 'react';
import PropTypes from 'prop-types';

export class Cans extends Can {
  isAllowed() {
    const params = this.props;
    const subject =
      params.of || params.a || params.an || params.this || params.on;
    const can = params.not ? 'cannot' : 'can';
    if (typeof (params.I || params.do) === 'string') {
      const [action, field] = (params.I || params.do).split(/\s+/);
      return params.ability[can](action, subject, field);
    }
    const actions = params.I || params.do;
    if (params.and) {
      return (
        actions.findIndex(item => !params.ability[can](item, subject)) === -1
      );
    }
    return actions.findIndex(item => params.ability[can](item, subject)) !== -1;
  }
}

Cans.propTypes = {
  and: PropTypes.bool,
  I: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  do: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};
Cans.defaultProps = {
  and: false,
};

export default function createContextualCan(Consumer) {
  return function ContextualCan(props) {
    return createElement(Consumer, null, ability =>
      createElement(Cans, {
        ability: props.ability || ability,
        I: props.I || props.do,
        a: props.on || props.a || props.an || props.of || props.this,
        not: props.not,
        children: props.children,
        passThrough: props.passThrough,
        and: props.and,
      }),
    );
  };
}
