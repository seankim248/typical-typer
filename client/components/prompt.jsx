import React from 'react';

export default class Prompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chars: [],
      currentIndex: 0,
      wrong: false,
      isHidden: false
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.getCharClass = this.getCharClass.bind(this);
    this.handleBlinker = this.handleBlinker.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  componentDidMount() {
    fetch('/api/home')
      .then(res => res.json())
      .then(quote => {
        const charArr = quote.content.split('');
        this.setState({ chars: charArr });
      });
  }

  handleKeyDown(e) {
    if (e.key === this.state.chars[this.state.currentIndex]) {
      this.setState({ currentIndex: this.state.currentIndex + 1 });
      this.setState({ wrong: false });
    } else if (e.key !== this.state.chars[this.state.currentIndex] && e.keyCode !== 16) {
      this.setState({ wrong: true });
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

  handleBlinker(index) {
    if (index === this.state.currentIndex && this.state.isHidden) {
      return 'blinker';
    }
  }

  handleOnClick() {
    this.setState({ isHidden: true });
  }

  render() {
    const charList = this.state.chars;
    let h2ClassName;
    if (this.state.isHidden === true) {
      h2ClassName = 'hidden';
    }
    return (
      <div className='container'>
        <div className='main-content'>
          <div className='prompt' onClick={this.handleOnClick} onKeyDown={this.handleKeyDown} tabIndex='0'>
              {
                charList.map((char, index) => (
                  <span key={char + index} id={this.handleBlinker(index)} className={char === ' ' ? 'space' : this.getCharClass(index)}>{char}</span>
                ))
              }
          </div>
          <h2 className={h2ClassName}>Click on the prompt to start!</h2>
        </div>
      </div>
    );
  }
}
