import React from 'react';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: ''
    };
    this.hideLink = this.hideLink.bind(this);
  }

  hideLink() {
    if (this.props.testStart === true) {
      return 'hidden';
    } else {
      return '';
    }
  }

  render() {
    return (
        <div className={`footer-content ${this.hideLink()}`}>
          <a href='#room' className='links'>Create Room</a>
        </div>
    );
  }
}
