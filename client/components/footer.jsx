import React from 'react';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      joinRoomClicked: false,
      roomId: ''
    };
    this.hideLink = this.hideLink.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  hideLink() {
    if (this.props.testStart === true) {
      return 'hidden';
    } else {
      return '';
    }
  }

  handleJoin() {
    this.setState({ joinRoomClicked: true });
  }

  handleInput(e) {
    if (e.keyCode === 13) {
      this.setState({ roomId: e.target.value });
      this.setState({ joinRoomClicked: false });
      window.location.hash = `#room?roomCode=${e.target.value}`;
    }
  }

  handleRoomRequest() {
    fetch('/api/room', {
      method: 'POST'
    })
      .then(res => res.json())
      .then(room => {
        window.location.hash = `#room?roomCode=${room.roomCode}`;
      });
  }

  render() {
    if (this.state.joinRoomClicked) {
      return (
        <div>
          <div className='overlay'></div>
          <div className='modal-container'>
            <div className='modal'>
              <h1 className='wpm-message'>Room ID:</h1>
              <br />
              <form>
                <input type="text" spellCheck='false' onKeyDown={this.handleInput} />
              </form>
            </div>
          </div>
          <div className={`footer-content ${this.hideLink()}`}>
            <a href='#room' className='links'>Create Room</a>
            <a className='links' onClick={this.onClick}>Join Room</a>
          </div>
        </div>
      );
    }
    return (
        <div className={`footer-content ${this.hideLink()}`}>
          <a className='links' onClick={this.handleRoomRequest} >Create Room</a>
          <a className='links' onClick={this.handleJoin}>Join Room</a>
        </div>
    );
  }
}
