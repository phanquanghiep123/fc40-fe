import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

export const styles = theme => ({
  root: {
    padding: 16,
    boxShadow: theme.shade.light,
    marginBottom: theme.spacing.unit * 3,
  },
  searchInput: {
    width: 400,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  searchButton: {
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    borderRadius: 2,
  },
});

export class SearchInput extends React.PureComponent {
  state = { searchText: '' };

  doSearch = () => {
    if (this.props.onSearchChange) {
      this.props.onSearchChange(this.state.searchText);
    }
  };

  handleChange = event => {
    this.setState({ searchText: event.target.value });
  };

  handleKeyDown = event => {
    if (event.key === 'Enter') {
      this.doSearch();
    }
  };

  render() {
    const { searchText } = this.state;
    const { classes, disabled } = this.props;

    return (
      <Card className={classes.root}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Typography variant="h6">Tìm Kiếm Vai Trò</Typography>
          </Grid>
          <Grid item xs={12} sm="auto">
            <TextField
              className={classes.searchInput}
              value={searchText}
              disabled={disabled}
              placeholder="Nhập từ khóa tìm kiếm"
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
            />
          </Grid>
          <Grid item xs={12} sm="auto">
            <Button
              color="primary"
              variant="contained"
              disabled={disabled}
              className={classes.searchButton}
              onClick={this.doSearch}
            >
              Tìm kiếm
            </Button>
          </Grid>
        </Grid>
      </Card>
    );
  }
}

SearchInput.propTypes = {
  classes: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  onSearchChange: PropTypes.func,
};

SearchInput.defaultProps = {
  disabled: false,
};

export default withStyles(styles)(SearchInput);
