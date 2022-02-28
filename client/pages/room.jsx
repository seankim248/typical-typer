import React from 'react';
import { io } from 'socket.io-client';

export default class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameCreated: false,
      users: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getModalClass = this.getModalClass.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
  }

  componentDidMount() {
    this.socket = io('/', {
      query: {
        roomCode: this.props.roomCode
      }
    });

    const { socket } = this;

    socket.on('connect', () => {
      socket.on('players', users => {
        this.setState({ users: users });
      });

      socket.on('user-joined', user => {
        this.setState({ users: this.state.users.concat(user) });
      });
    });
  }

  handleChange(e) {
    this.setState({ username: e.target.value });
  }

  handleCopy() {
    const input = this.props.roomCode;
    navigator.clipboard.writeText(input).then(() =>
      alert('copied')
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ usernameCreated: true });
    this.socket.emit('username-created', this.state.username);
  }

  getModalClass() {
    if (this.state.usernameCreated === true) {
      return 'hidden';
    } else {
      return '';
    }
  }

  render() {
    const users = this.state.users;
    if (!this.state.usernameCreated) {
      return (
        <div>
          <div className={`overlay ${this.getModalClass()}`}></div>
          <div className={`modal-container ${this.getModalClass()}`}>
            <div className='modal'>
              <h1 className='wpm-message'>Username:</h1>
              <br />
              <form onSubmit={this.handleSubmit}>
                <input type="text" maxLength='12' spellCheck='false' value={this.state.username} onChange={this.handleChange} />
              </form>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div>
            {
              users.map(user => (
                <div key={user.socketId} className='player-info'>
                  <h1>{user.username}</h1>
                  <progress max='100' value='0'></progress>
                </div>
              ))
            }
          </div>
          <div className='room-footer'>
            <h1 className='right inline-block'>Room ID: {this.props.roomCode}</h1><button className='copy-button' onClick={this.handleCopy}>COPY</button>
            <br />
            <a className='links' href="#">Leave Room</a>
          </div>
        </div>
      );
    }
  }
}
