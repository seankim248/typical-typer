import React from 'react';

export default class Header extends React.Component {
  render() {
    return (
      <div className='container'>
        <div className='header-content'>
          <i className="far fa-keyboard"></i>
          <h1 className='title'>typicaltyper</h1>
          <p className='time-options'>
            time: <span className='selected time-options-number'>15</span> <span className='time-options-number'>30</span> <span className='time-options-number'>45</span> <span className='time-options-number'>60</span> <span className='time-options-number'>120</span>
          </p>
        </div>
      </div>
    );
  }
}
