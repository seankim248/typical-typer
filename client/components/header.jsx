import React from 'react';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 15
    };
    this.handleTimeClick = this.handleTimeClick.bind(this);
  }

  handleTimeClick(e) {
    if (e.target.tagName === 'SPAN') {
      const timeNum = parseInt(e.target.innerText);
      this.setState({ currentTime: timeNum });
    }
  }

  render() {
    const timeArr = [15, 30, 45, 60, 120];
    return (
      <div className='container'>
        <div className='header-content'>
          <i className="far fa-keyboard"></i>
          <h1 className='title'>typicaltyper</h1>
          <p className='time-options' onClick={this.handleTimeClick}>
            time:
            {
              timeArr.map((time, index) => {
                let spanClassName = '';
                if (this.state.currentTime === time) {
                  spanClassName = 'right';
                }
                return <span key={time + index} className={`${spanClassName} time-options-number`} onClick={this.props.onClick}>{time}</span>;
              })
            }
          </p>
        </div>
      </div>
    );
  }
}
