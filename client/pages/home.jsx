import React from 'react';
import Header from '../components/header';
import Prompt from '../components/prompt';

export default class Home extends React.Component {

  render() {
    return (
      <>
        <Header />
        <Prompt />
      </>
    );
  }
}
