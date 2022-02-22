import React from 'react';
import Home from './pages/home';
import Room from './pages/room';
import parseRoute from './lib/parse-route';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === '') {
      return <Home />;
    }
    if (route.path === 'room') {
      return <Room />;
    }
  }

  render() {
    return (
      <div className='container'>
        <div className='header-content'>
          <i className="far fa-keyboard"></i>
          <a href='#' className='title'>typicaltyper</a>
        </div>
        { this.renderPage() }
      </div>
    );
  }
}
