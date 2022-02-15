import React from 'react';
import Header from '../components/header';
import Prompt from '../components/prompt';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quotes: []
    };
    this.getQuotes = this.getQuotes.bind(this);
  }

  getQuotes() {
    fetch('/')
      .then(response => response.json())
      .then(data => this.setState({ quotes: data }));
  }

  render() {
    return (
      <>
        <Header />
        <Prompt data={this.state.quotes} />
      </>
    );
  }
}
