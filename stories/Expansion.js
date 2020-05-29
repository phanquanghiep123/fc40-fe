import React from 'react';
import PropTypes from 'prop-types';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Expansion from '../app/components/Expansion';
const styles = theme => ({
  fab: {
    margin: `0px ${theme.spacing.unit}px`,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  iconHead: {
    borderLeft: `1px solid ${theme.palette.text.secondary}`,
    borderRight: `1px solid ${theme.palette.text.secondary}`,
    padding: `0.5em 1em`,
  },
  textHead: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
  },
  smallText: {
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
    fontSize: theme.typography.pxToRem(12),
  },
  textBig: {
    display: 'flex',
    flexDirection: 'row-reverse',
    marginBottom: 0,
    fontWeight: theme.typography.fontWeightMedium,
  },
});

class ExpansionExample extends React.PureComponent {
  render() {
    const { title, content, classes, hasRightAction } = this.props;
    return hasRightAction ? (
      <Expansion
        title={title}
        content={content}
        rightActions={
          <React.Fragment>
            <div className={classes.iconHead}>
              <Fab
                color="primary"
                aria-label="Add"
                className={classes.fab}
                size="small"
                onClick={() => alert('Thêm mới')}
              >
                <AddIcon />
              </Fab>
            </div>
            <div className={classes.textHead}>
              <Typography
                variant="body2"
                gutterBottom
                color="primary"
                className={classes.textBig}
              >
                THÊM TP LOẠI 2
              </Typography>
              <Typography
                variant="body2"
                gutterBottom
                className={classes.smallText}
              >
                (Chỉ áp dụng cho hàng đi từ farm)
              </Typography>
            </div>
          </React.Fragment>
        }
      />
    ) : (
      <Expansion title={title} content={content} />
    );
  }
}

ExpansionExample.propTypes = {
  hasRightAction: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default withStyles(styles)(ExpansionExample);
