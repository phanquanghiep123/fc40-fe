import React from 'react';
import PropTypes from 'prop-types';

import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

import { withStyles } from '@material-ui/core/styles';

import {
  ITEM_TYPES,
  createUltimatePagination,
} from 'react-ultimate-pagination';

export const Page = withStyles({
  root: {
    display: 'inline-block',
  },
  button: {
    height: 0,
    minWidth: 36,
    padding: '50% 5px',
    fontSize: '0.875rem',
    lineHeight: 1.75,
  },
  label: {
    transform: 'translateY(-50%)',
  },
})(({ classes, value, isActive, onClick, isDisabled }) => (
  <div className={classes.root}>
    <IconButton
      classes={{
        root: classes.button,
        label: classes.label,
      }}
      style={{ fontWeight: isActive ? '600' : undefined }}
      onClick={onClick}
      disabled={isDisabled}
    >
      {value}
    </IconButton>
  </div>
));

export const NextPage = ({ isActive, onClick, isDisabled }) => (
  <IconButton
    style={{ padding: 8 }}
    onClick={onClick}
    disabled={isActive || isDisabled}
  >
    <Icon fontSize="small">chevron_right</Icon>
  </IconButton>
);

export const PreviousPage = ({ isActive, onClick, isDisabled }) => (
  <IconButton
    style={{ padding: 8 }}
    onClick={onClick}
    disabled={isActive || isDisabled}
  >
    <Icon fontSize="small">chevron_left</Icon>
  </IconButton>
);

const PaginationProps = {
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
};

Page.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ...PaginationProps,
};
NextPage.propTypes = PaginationProps;
PreviousPage.propTypes = PaginationProps;

export default createUltimatePagination({
  itemTypeToComponent: {
    [ITEM_TYPES.PAGE]: Page,
    [ITEM_TYPES.ELLIPSIS]: props => <Page {...props} value="..." />,
    [ITEM_TYPES.NEXT_PAGE_LINK]: NextPage,
    [ITEM_TYPES.PREVIOUS_PAGE_LINK]: PreviousPage,
  },
  WrapperComponent: React.Fragment,
});
