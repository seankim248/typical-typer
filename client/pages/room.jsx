import React from 'react';
import { io } from 'socket.io-client';
import calculateWPM from '../lib/wpm-calculator';

export default class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chars: [],
      words: [],
      usernameCreated: false,
      users: [],
      roomHost: false,
      startGame: false,
      countDown: null,
      currentIndex: 0,
      wrong: false,
      isCounting: false,
      startTime: null,
      endTime: null,
      testFinished: false,
      wpm: null,
      wordsCompleted: 0,
      error: false,
      loaderClass: false
    };

    this.divRef = React.createRef();
    this.getModalClass = this.getModalClass.bind(this);
    this.getCountDownClass = this.getCountDownClass.bind(this);
    this.getCharClass = this.getCharClass.bind(this);
    this.getWPMClass = this.getWPMClass.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleBlinker = this.handleBlinker.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    this.socket = io('/', {
      query: {
        roomCode: this.props.roomCode
      }
    });

    const { socket } = this;

    socket.on('players', users => {
      this.setState({ users: users });
    });

    socket.on('user-joined', user => {
      this.setState({ users: this.state.users.concat(user) });
      if (user.roomHost) {
        this.setState({ roomHost: true });
      }
    });

    socket.on('start', (quote, boolean) => {
      this.setState({
        chars: quote.content.split(''),
        startGame: boolean,
        words: quote.content.split(' ')
      });
    });

    socket.on('start-countdown', count => {
      this.setState({ countDown: count });
    });

    socket.on('user-wpm', updated => {
      this.setState(state => {
        return {
          users: state.users.map(original => original.socketId === updated.socketId ? updated : original)
        };
      });
    });

    socket.on('user-words-completed', updated => {
      this.setState(state => {
        return {
          users: state.users.map(original => original.socketId === updated.socketId ? updated : original)
        };
      });
    });

    socket.on('user-reset', updated => {
      this.setState({
        users: updated,
        startGame: false,
        startTime: null,
        endTime: null,
        countDown: null,
        currentIndex: 0,
        testFinished: false,
        wpm: null,
        wordsCompleted: 0
      });
    });
  }

  componentDidUpdate() {
    if (this.state.countDown === 0) {
      this.divRef.current.focus();
      if (!this.state.startTime) {
        this.setState({ startTime: new Date() });
      }
    }
    if (this.state.testFinished && this.state.wpm === null) {
      const wpm = calculateWPM(this.state.startTime, this.state.endTime, this.state.chars, true, this.state.currentIndex);
      this.socket.emit('wpm', wpm);
      this.setState({ wpm: wpm });
    }
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  handleKeyDown(e) {
    if (this.state.currentIndex >= this.state.chars.length - 1) {
      if (!this.state.endTime) {
        this.setState({ endTime: new Date() });
      }
      this.socket.emit('completed-words', this.state.wordsCompleted + 1);
      this.setState({ testFinished: true });
    }
    if (!this.state.testFinished) {
      if (e.keyCode === 32 && e.key === this.state.chars[this.state.currentIndex]) {
        this.setState({ wordsCompleted: this.state.wordsCompleted + 1 });
        this.socket.emit('completed-words', this.state.wordsCompleted + 1);
      }
      if (e.key === this.state.chars[this.state.currentIndex]) {
        this.setState({ currentIndex: this.state.currentIndex + 1 });
        this.setState({ wrong: false });
      } else if (e.key !== this.state.chars[this.state.currentIndex] && e.keyCode !== 16) {
        this.setState({ wrong: true });
      }
    }
  }

  getCharClass(index) {
    if (index < this.state.currentIndex) {
      return 'right';
    } else if (index === this.state.currentIndex && this.state.wrong) {
      return 'wrong';
    } else {
      return '';
    }
  }

  getWPMClass() {
    if (this.state.testFinished) {
      return '';
    } else {
      return 'hidden';
    }
  }

  handleChange(e) {
    this.setState({ username: e.target.value });
  }

  handleCopy() {
    const input = this.props.roomCode;
    navigator.clipboard.writeText(input).then(() =>
      alert('copied room ID')
    );
  }

  handleReset() {
    this.socket.emit('reset');
  }

  handleStart() {
    fetch(`/api/start/${this.props.roomCode}`, {
      method: 'POST'
    })
      .catch(() => {
        this.setState({ error: true });
      });

    this.setState({ startGame: true, loaderClass: true });
  }

  handleBlinker(index) {
    if (index === this.state.currentIndex && this.state.countDown === 0) {
      return 'blinker';
    }
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

  getCountDownClass() {
    if (this.state.countDown === 0) {
      return 'hidden';
    }
    return '';
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
                  <div className='player-text'>
                    <h1>{user.username}</h1>
                    <h1 className='one-half-rem'>{ user.wpm ? `${user.wpm}wpm` : ''}</h1>
                  </div>
                  <progress max={this.state.words.length} value={user.wordsCompleted}></progress>
                </div>
              ))
            }
          </div>
          { this.state.roomHost &&
            <button className={`copy-button ${this.state.startGame ? 'hidden' : ''}`} onClick={this.handleStart}>START</button>
          }
          { this.state.startGame &&
            <div className='prompt' ref={this.divRef} tabIndex='0' onKeyDown={this.handleKeyDown}>
              {
                this.state.chars.map((char, index) => (
                  <span key={char + index} id={this.handleBlinker(index)} className={this.getCharClass(index)}>{char}</span>
                ))
              }
            </div>
          }
          { this.state.chars.length === 0 && !this.state.error && this.state.loaderClass &&
            <div className='loader'></div>
          }
          { this.state.error &&
            <h1 className='right align-center'>Could not connect to network.</h1>
          }
          { this.state.roomHost && this.state.endTime &&
            <button className={`race-again-button ${!this.state.startTime ? 'hidden' : ''}`} onClick={this.handleReset}>RACE AGAIN</button>
          }
          { this.state.startGame &&
            <h1 className={`right align-center ${this.getCountDownClass()}`}>{this.state.countDown}</h1>
          }
          <div className='room-footer'>
            <h1 className='right inline-block'>Room ID: </h1><button className='copy-button margin-left' onClick={this.handleCopy}>COPY</button>
            <br />
            <a className='links' href="#">Leave Room</a>
          </div>
        </div>
      );
    }
  }
}
