import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import baseStyles from './styles';

export const styles = theme => ({
  ...baseStyles(theme),
});

export function Section1({
  classes,
  title,
  children,
  cardProps,
  headerProps,
  contentProps,
}) {
  return (
    <Card
      className={classNames(classes.section, classes.shrink)}
      {...cardProps}
    >
      <CardHeader
        title={title}
        className={classes.cardHeader}
        {...headerProps}
      />
      <CardContent className={classes.cardContent} {...contentProps}>
        {children}
      </CardContent>
    </Card>
  );
}

Section1.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
};

Section1.defaultProps = {
  title: 'I. Thông Tin Hàng Hóa',
};

export default withStyles(styles)(Section1);
