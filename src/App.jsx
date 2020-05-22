import React, { Component } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// Externals
import { Chart } from 'react-chartjs-2';

// Material helpers
import { ThemeProvider } from '@material-ui/styles';

// ChartJS helpers
import { chartjs } from './helpers';

// Theme
import theme from './theme';

// Styles
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

// Routes
import Routes from './views/routes';

// state imports
import { Provider } from 'react-redux';
import store from './store';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Browser history
const browserHistory = createBrowserHistory();

// Configure ChartJS
Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw
});

toast.configure();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={browserHistory}>
            <Routes />
          </Router>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default App;
