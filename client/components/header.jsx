import React from 'react';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 15
    };
    this.handleTimeClick = this.handleTimeClick.bind(this);
    this.hideTimeOptions = this.hideTimeOptions.bind(this);
  }

  handleTimeClick(e) {
    if (e.target.tagName === 'SPAN') {
      const timeNum = parseInt(e.target.innerText);
      this.setState({ currentTime: timeNum });
    }
  }

  hideTimeOptions() {
    if (this.props.testStart === true) {
      return 'hidden';
    } else {
      return '';
    }
  }

  render() {
    const timeArr = [15, 30, 45, 60, 120];
    return (
      <div className='header-content'>
        <p className={`${this.hideTimeOptions()} time-options`} onClick={this.handleTimeClick}>
          time:
          {
            timeArr.map((time, index) => {
              let spanClassName = '';
              if (this.props.time === time) {
                spanClassName = 'right';
              }
              return <span key={time + index} className={`${spanClassName} time-options-number`} onClick={this.props.onClick}>{time}</span>;
            })
          }
        </p>
      </div>
    );
  }
}
