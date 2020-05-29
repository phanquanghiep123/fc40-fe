import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import GoodsWeightForm from 'components/GoodsWeight/Form';

import baseStyles from './styles';

export const styles = theme => ({
  ...baseStyles(theme),
  cardContent: {
    ...baseStyles(theme).cardContent,
    height: 'calc(100% - 44px)',
  },
});

export function Section2({
  classes,
  title,
  formik,
  baskets,
  pallets,
  cardProps,
  headerProps,
  contentProps,
  onDefaultClick,
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
        <GoodsWeightForm
          formik={formik}
          baskets={baskets}
          pallets={pallets}
          onDefaultClick={onDefaultClick}
        />
      </CardContent>
    </Card>
  );
}

Section2.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  formik: PropTypes.object,
  baskets: PropTypes.array,
  pallets: PropTypes.array,
  onDefaultClick: PropTypes.func,
};

Section2.defaultProps = {
  title: 'II. Thông Tin Khay Sọt',
  baskets: [],
  pallets: [],
};

export default withStyles(styles)(Section2);
