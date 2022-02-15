import React from 'react';

export default class Prompt extends React.Component {
  render() {
    return (
      <div className='container'>
        <div className='main-content'>
          <h1 className='counter selected'>15</h1>
          <h1 className='prompt'>{this.props.data[0].content}</h1>
        </div>
        <div className="footer-content">
          <h3>Join Room</h3>
          <h3>Create Room</h3>
        </div>
      </div>
    );
  }
}
