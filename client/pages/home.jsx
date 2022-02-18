import React from 'react';
import Header from '../components/header';
import Prompt from '../components/prompt';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 15,
      isCounting: false,
      isHidden: false,
      optionOne: 'right',
      optionTwo: '',
      optionThree: '',
      optionFour: '',
      optionFive: ''
    };
    this.handleTimeClick = this.handleTimeClick.bind(this);
    this.onClick = this.onClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleTimeClick(e) {
    const timeNum = parseInt(e.target.innerText);
    this.setState({ time: timeNum });
  }

  handleKeyDown(e) {
    if (!this.state.isCounting) {
      this.setState({ isCounting: true });
      const countDown = setInterval(() => {
        this.setState({ time: this.state.time - 1 });
        if (this.state.time === 0) {
          clearInterval(countDown);
        }
      }, 1000);
    }
  }

  onClick() {
    this.setState({ isHidden: true });
  }

  render() {
    return (
      <div onKeyDown={this.handleKeyDown}>
        <Header
          onClick={this.handleTimeClick}
          time={this.state.time}
        />
        <Prompt
          time={this.state.time}
          hidden={this.state.isHidden}
          onClick={this.onClick}
          handleKeyDown={this.handleKeyDown}
        />
      </div>
    );
  }
}
