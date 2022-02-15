import React from 'react';
import Header from '../components/header';
import Prompt from '../components/prompt';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quotes: []
    };
  }

  componentDidMount() {
    fetch('/api/home')
      .then(res => res.json())
      .then(data => {
        this.setState({ quotes: data });
      });
  }

  render() {
    if (this.state.quotes) {
      return (
        <>
          <Header />
          <Prompt data={this.state.quotes} />
        </>
      );
    }
  }
}
