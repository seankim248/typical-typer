import React from 'react';
import Header from '../components/header';
import Prompt from '../components/prompt';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 15
    };
  }

  render() {
    return (
      <>
        <Header />
        <Prompt />
      </>
    );
  }
}
