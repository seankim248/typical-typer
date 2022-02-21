import React from 'react';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: ''
    };
  }

  render() {
    return (
        <div className='footer-content'>
          <h3>Create Room</h3>
        </div>
    );
  }
}
