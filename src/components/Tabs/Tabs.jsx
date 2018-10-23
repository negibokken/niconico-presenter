import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CommentList from '../../containers/CommentList/CommentList';
import CommentView from '../../containers/CommentView/CommentView';

const styles = theme => ({
  root: {
    width: '100%',
    margin: '0',
    padding: '0',
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

class SimpleTabs extends React.Component {
  handleChange = (event, value) => {
    this.props.toggleTabs(value);
    this.props.getUserNum();
  };
  componentDidMount() {
    this.props.getUserNum();
  }
  render() {
    const { classes, tab } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={tab} onChange={this.handleChange}>
            <Tab label="Flow" />
            <Tab label="Comment List" />
          </Tabs>
        </AppBar>
        現在のユーザー数: {this.props.userNum}
        {tab === 0 && <CommentView />}
        {tab === 1 && <CommentList />}
      </div>
    );
  }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleTabs);
