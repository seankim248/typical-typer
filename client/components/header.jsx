import React from 'react';

export default class Header extends React.Component {
  render() {
    return (
      <div className='container'>
        <div className='header-content'>
          <i className='far fa-keyboard'></i>
          <h1 className='title'>typicaltyper</h1>
        </div>
      </div>
    );
  }
}
