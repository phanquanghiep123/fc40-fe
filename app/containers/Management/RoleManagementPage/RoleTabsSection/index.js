import React from 'react';
import PropTypes from 'prop-types';

import BlockUI from 'react-block-ui';
import 'react-block-ui/style.css';

import { withStyles } from '@material-ui/core/styles';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';

import Typography from '@material-ui/core/Typography';

import UserAssignRole from './UserAssignRole';
import RoleIncludeRole from './RoleIncludeRole';
import RoleAccessPrivilege from './RoleAccessPrivilege';
import RoleAccessOrg from './RoleAccessOrg';

export const styles = theme => ({
  root: {
    overflow: 'visible !important',
    boxShadow: theme.shade.light,
    marginBottom: theme.spacing.unit * 3,
  },
  grid: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  tabs: {
    padding: 16,
  },
  tab: {
    minWidth: 100,
    minHeight: 36,
    textTransform: 'capitalize',
  },
  tabLabel: {
    [theme.breakpoints.up('md')]: {
      padding: '6px 12px',
    },
  },
  indicator: {
    height: '100%',
    borderRadius: 999,
  },
  indicatorColor: {
    backgroundColor: 'rgba(71, 111, 144, 0.2)',
  },
  action: {
    padding: theme.spacing.unit * 2,
    marginTop: 16,
    justifyContent: 'flex-end',
  },
  save: {
    width: '10em',
    borderRadius: 0,
  },
});

export class RoleTabsSection extends React.Component {
  state = {
    data: this.getData(this.props),
    tabIndex: 0,
  };

  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(this.getPropData(nextProps.data)) !==
      JSON.stringify(this.getPropData(this.props.data))
    ) {
      this.setState({ data: this.getData(nextProps), tabIndex: -1 }, () =>
        this.changeTabIndex(0),
      );
    }
  }

  getData(props) {
    if (props.data && props.data.roleId) {
      const roleAccessRegionOrgs = [
        ...props.data.roleAccessRegions,
        ...props.data.roleAccessOrgs,
      ];
      return { ...props.data, roleAccessRegionOrgs };
    }
    return {};
  }

  getPropData(data) {
    const {
      userAssignRoles,
      roleIncludes,
      roleAccessOrgs,
      roleAccessRegions,
      roleAccessPrivileges,
      ...nextData
    } = data;
    return nextData;
  }

  getTabProps(props = []) {
    const tabProps = {};

    for (let i = 0; i < props.length; i += 1) {
      const propName = props[i];
      if (propName in this.props) {
        tabProps[propName] = this.props[propName];
      }
    }

    return tabProps;
  }

  getTabByIndex(tabIndex = this.state.tabIndex, tabs) {
    if (tabs && tabs.length > 0) {
      return tabs[tabIndex];
    }
    return null;
  }

  getFilteredTabs(data) {
    const tabs = [
      {
        key: 'users',
        title: 'Người dùng',
        hidden: data.isMaster,
        props: ['usersLoading', 'usersData'],
        component: UserAssignRole,
      },
      {
        key: 'roles',
        title: 'Vai trò con',
        props: ['rolesLoading', 'rolesData'],
        component: RoleIncludeRole,
      },
      {
        key: 'privileges',
        title: 'Quyền',
        props: ['privilegesLoading', 'privilegesData'],
        component: RoleAccessPrivilege,
      },
      {
        key: 'regionOrgs',
        title: 'Đơn vị',
        props: ['regionOrgsLoading', 'regionsData', 'organizationsData'],
        component: RoleAccessOrg,
      },
    ];

    return tabs.filter(tab => !tab.hidden);
  }

  changeTabIndex(tabIndex) {
    if (this.state.tabIndex !== tabIndex) {
      const tabs = this.getFilteredTabs(this.state.data);
      const tabData = this.getTabByIndex(tabIndex, tabs);

      this.setState({ tabIndex }, () =>
        setTimeout(() => {
          if (this.props.onTabSelected) {
            this.props.onTabSelected(tabData);
          }
        }, 500),
      );
    }
  }

  handleSaveClick = () => {
    if (this.props.onSave) {
      this.props.onSave(this.state.data);
    }
  };

  handleTabChange = (e, tabIndex) => {
    this.changeTabIndex(tabIndex);
  };

  handleRoleChange = roleData => {
    this.setState({ data: roleData });
  };

  render() {
    const { data, tabIndex } = this.state;
    const { classes, loading } = this.props;

    if (data && data.roleId > 0 && tabIndex >= 0) {
      const filteredTabs = this.getFilteredTabs(data);
      const selectedTab = filteredTabs[tabIndex];

      return (
        <BlockUI
          blocking={loading}
          message={
            <Typography variant="subtitle1" color="primary">
              Đang tải
            </Typography>
          }
        >
          <Card className={classes.root}>
            <Grid
              container
              alignItems="center"
              justify="space-between"
              className={classes.grid}
            >
              <Grid item>
                <CardHeader
                  title={data.name}
                  subheader={data.value}
                  titleTypographyProps={{
                    variant: 'h6',
                  }}
                  subheaderTypographyProps={{
                    variant: 'caption',
                  }}
                />
              </Grid>
              <Grid item>
                <Tabs
                  value={tabIndex}
                  classes={{
                    root: classes.tabs,
                  }}
                  TabIndicatorProps={{
                    classes: {
                      root: classes.indicator,
                      colorSecondary: classes.indicatorColor,
                    },
                  }}
                  onChange={this.handleTabChange}
                >
                  {filteredTabs.map((tab, i) => (
                    <Tab
                      key={String(i)}
                      label={tab.title}
                      disableRipple
                      classes={{
                        root: classes.tab,
                        labelContainer: classes.tabLabel,
                      }}
                    />
                  ))}
                </Tabs>
              </Grid>
            </Grid>
            <selectedTab.component
              {...this.getTabProps(selectedTab.props)}
              role={data}
              showConfirm={this.props.showConfirm}
              showWarning={this.props.showWarning}
              onRoleChange={this.handleRoleChange}
            />
            <CardActions className={classes.action}>
              <Button
                color="primary"
                variant="contained"
                className={classes.save}
                onClick={this.handleSaveClick}
              >
                Lưu
              </Button>
            </CardActions>
          </Card>
        </BlockUI>
      );
    }
    return null;
  }
}

RoleTabsSection.propTypes = {
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  data: PropTypes.object,
  onSave: PropTypes.func,
  onTabSelected: PropTypes.func,
  showConfirm: PropTypes.func,
  showWarning: PropTypes.func,
};

RoleTabsSection.defaultProps = {
  loading: false,
  data: {
    roleId: 1,
  },
};

export default withStyles(styles)(RoleTabsSection);
