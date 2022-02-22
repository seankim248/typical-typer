import React from 'react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

export default class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameCreated: false,
      username: '',
      roomId: ''
    };

    this.handleInput = this.handleInput.bind(this);
    this.getModalClass = this.getModalClass.bind(this);
  }

  componentDidMount() {
    const roomCode = uuidv4();
    this.socket = io();
    const { socket } = this;
    socket.emit('create-room', roomCode);
    this.setState({ roomId: roomCode });
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  handleInput(e) {
    if (e.keyCode === 13) {
      this.setState({ username: e.target.value });
      this.setState({ usernameCreated: true });
    }
  }

  getModalClass() {
    if (this.state.usernameCreated === true) {
      return 'hidden';
    } else {
      return '';
    }
  }

  render() {
    if (!this.state.username) {
      return (
        <div>
          <div className={`overlay ${this.getModalClass()}`}></div>
          <div className={`modal-container ${this.getModalClass()}`}>
            <div className='modal'>
              <h1 className='wpm-message'>Username:</h1>
              <br />
              <input type="text" maxLength='12' spellCheck='false' onKeyDown={this.handleInput} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className='user-bar'>
            <h1>{this.state.username}</h1>
            <progress max='100' value='0'></progress>
          </div>
          <div className='room-footer'>
            <h1 className='right'>Room ID: {this.state.roomId}</h1>
            <a className='links' href="#">Leave Room</a>
          </div>
        </div>
      );
    }
  }
}
