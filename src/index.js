import React from 'react';
import ReactDOM from 'react-dom';
import Tabs from './containers/Tabs/Tabs';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store/store';

class Index extends React.Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <Tabs />
        </Provider>
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));
