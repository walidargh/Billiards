var React = require('react');
var Modal = require('react-modal');


var customStyles = {
	overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(0, 0, 0, 0.75)',
    zIndex 					  : 1000,
  },
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    outline								: '#ccc',
    borderRadius          : '10px',
    transform             : 'translate(-50%, -50%)',
    width 								: '80%'
  }
};


var welcomeModal = React.createClass({

	getInitialState: function () {
		return {modalIsOpen: true, slideNumber: 1, totalSlides: 3};
	},

	openModal: function () {
		this.setState({modalIsOpen: true});
	},

	closeModal: function () {
		this.setState({modalIsOpen: false}, this.props.startGame());
	},

	nextSlide: function () {
		var nextSlideNumber = this.state.slideNumber + 1;	
		nextSlideNumber = 
			nextSlideNumber > this.state.totalSlides ? null : nextSlideNumber;

		nextSlideNumber ? 
			this.setState({slideNumber: nextSlideNumber}) : this.closeModal();
	},

	previousSlide: function () {
		var prevSlideNumber = this.state.slideNumber - 1;
		prevSlideNumber = 
			prevSlideNumber < 0 ? this.state.totalSlides : prevSlideNumber;
		this.setState({slideNumber: prevSlideNumber});
	},

	slideOne: function () {
		return (
			<div className="slick-item">
				<h1>WELCOME TO CANONBALL</h1>
				<p>Your goal is to pocket all the balls except the cue ball, which will result in an automatic loss</p>
				<img src="https://s3-us-west-1.amazonaws.com/owlhowler/howler/cueball.png"/>
			</div>	
		);
	},

	slideTwo: function () {
		return (
			<div className="slick-item">
				<h1>GAME MECHANICS</h1>
				<p>Drag the cue back with your mouse and release to strike the cueball</p>
				<p>The further you pull back the harder it will strike!</p>
				<img src="https://s3-us-west-1.amazonaws.com/owlhowler/howler/cuestrike.png"/>
			</div>
		)	;
	},

	slideThree: function () {
		return (
			<div className="slick-item">
				<h1>CANNONBALLING</h1>
				<p>If you click the cue ball while it is still moving to activate a canonball!</p>
				<p>Be careful the ball will behave unpredictably! But if timed well it can have explosive results</p>
				<p>You will have three canonballs, use them wisely</p>
				<img src="https://s3-us-west-1.amazonaws.com/owlhowler/howler/cannonball.png" />
			</div>
		);
	},

	currentSlide: function () {
		if (this.state.slideNumber === 1) {
			return this.slideOne();
		} 

		if (this.state.slideNumber === 2) {
			return this.slideTwo();
		}

		return this.slideThree();
	},

	render: function () {
		return (
			<Modal 
				isOpen={this.state.modalIsOpen}
				onRequestClose={this.closeModal}
				style={customStyles}>
				<div className="slick-track">
					<button className="previous-slide" onClick={this.previousSlide}>Previous</button>
					{this.currentSlide()}
					<button className="next-slide" onClick={this.nextSlide}>Next</button>
				</div>
			</Modal>
		);
	}

});

module.exports = welcomeModal;