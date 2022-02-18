import React from 'react';

export default class Modal extends React.Component {
  render() {
    return (
      <div>
        <div className={`overlay ${this.props.openModal}`}></div>
        <div className='modal-container'>
          <div className={`modal ${this.props.openModal}`}>
            <h1 className='wpm-message'>WPM: {this.props.wpm}</h1>
            <br />
            <button onClick={() => {
              this.props.onResetClick();
              this.props.onResetClick2();
            }}>Reset</button>
          </div>
        </div>
      </div>
    );
  }
}
