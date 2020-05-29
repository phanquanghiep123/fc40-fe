import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  card: {
    width: '100%',
    overflow: 'visible',
  },
  actions: {
    display: 'flex',
    padding: 0,
  },
  heading: {
    // fontSize: theme.typography.pxToRem(24),
    // fontWeight: theme.typography.fontWeightMedium,
    paddingLeft: theme.spacing.unit * 2,
    width: '100%',
    color: theme.palette.text.primary,
    paddingTop: 0,
    paddingBottom: 0,
    margin: 0,
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    padding: theme.spacing.unit * 2,
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  headLeft: {
    width: '50%',
    display: 'flex',
  },
  headRight: {
    width: '50%',
    display: 'flex',
    flexDirection: 'row-reverse',
    height: '3.5em',
    alignItems: 'center',
    paddingRight: theme.spacing.unit * 2,
  },
  noP: {
    padding: '0px !important',
  },
  content: {
    '&:last-child': {
      paddingBottom: theme.spacing.unit * 2,
    },
  },
});

class Expansion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
    };
  }

  // eslint-disable-next-line no-unused-vars
  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.expand && nextProps.expand === 'false') {
      this.setState({
        expanded: false,
      });
    } else {
      this.setState({
        expanded: true,
      });
    }
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if(prevProps.expand === undefined || prevProps.expand === 'true') {
  //
  //   }
  //   if(prevProps.expand && prevProps.expand === 'false') {
  //     this.setState({
  //       expanded: false,
  //     })
  //   }
  // }

  handleExpandClick = () => {
    this.setState(
      state => ({ expanded: !state.expanded }),
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.expanded);
        }
      },
    );
  };

  render() {
    const {
      classes,
      title,
      content,
      noPadding,
      rightActions,
      unmountOnExit,
      headLeftStyle,
      headRightStyle,
      numberHeight,
    } = this.props;

    return (
      <Card className={classes.card} style={{ height: numberHeight }}>
        <CardActions className={classes.actions} disableActionSpacing>
          <div className={classes.headLeft} style={headLeftStyle}>
            <Typography variant="h6" gutterBottom className={classes.heading}>
              {title}
            </Typography>
          </div>
          <div className={classes.headRight} style={headRightStyle}>
            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: this.state.expanded,
              })}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="Show more"
            >
              <ExpandMoreIcon />
            </IconButton>
            {rightActions}
          </div>
        </CardActions>
        <Collapse
          in={this.state.expanded}
          style={{ padding: 0 }}
          timeout="auto"
          unmountOnExit={unmountOnExit}
        >
          <CardContent
            classes={{ root: noPadding ? classes.noP : classes.content }}
          >
            {content}
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

Expansion.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  expand: PropTypes.string,
  noPadding: PropTypes.bool,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  rightActions: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  unmountOnExit: PropTypes.bool,
  onChange: PropTypes.func,
  headLeftStyle: PropTypes.object,
  headRightStyle: PropTypes.object,
  numberHeight: PropTypes.object,
};

Expansion.defaultProps = {
  noPadding: false,
  unmountOnExit: false,
  headLeftStyle: {},
  headRightStyle: {},
};
export default withStyles(styles)(Expansion);
