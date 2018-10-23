import { connect } from 'react-redux';
import Tabs from '../../components/Tabs/Tabs';
import { toggleTabs, getUserNum } from '../../actions/actions';

const mapStateToProps = state => {
  return {
    tab: state.tab,
    userNum: state.userNum
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleTabs: value => {
      dispatch(toggleTabs(value));
    },
    getUserNum: async () => {
      dispatch(await getUserNum());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tabs);
