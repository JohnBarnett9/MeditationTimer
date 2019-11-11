import React from "react";
import ReactDOM from "react-dom";

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Row, Col, Grid } from 'react-bootstrap';

import './timers.css';

'use strict';

const e = React.createElement;

/*
Contains 1 minute button,
5 minute button,
30 minute button,
and the Display of the Timer.

In constructor, .bind() is to keep the value of 'this' in the function 
be MeditationTimer object instead of undefined or window.
*/
class MeditationTimer extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			timerString: "00:00",
			minutes: 0, //not needed?
			seconds: 0, //not needed?
			started: false, //not needed?
			intervalId: 0, //to exit setInterval()
			totalSeconds: 0, //different amount depending on which button clicked
			totalSecondesForReset: 0,
			isRunning: false, //true if running, false if paused
			displayStyle: "displayStyleW",
			debugFlag: false, //flag determines which style to use
			debugStyle: "debugHidden"
		};
		//this.setState({displayStyle :  this.state.displayStyleW});
		
		this.playPause = this.playPause.bind(this);
		this.timer = this.timer.bind(this);
		this.reset = this.reset.bind(this);
		this.convertTotalSecondsToTimerString = this.convertTotalSecondsToTimerString.bind(this);
		//this.mouseOut = this.mouseOut.bind(this);
	}

	
	
	
	/*
	clearInterval() prevents countdown running twice as fast 
	when 2 or more Blue buttons are clicked.
	*/
	myCallback = (dataFromChild) => {
		console.log("in myCallback()");
		//if (this.state.isRunning === true) {
			clearInterval(this.state.intervalId);
			this.state.isRunning = true;
		//}
		this.state.totalSeconds = dataFromChild * 60; //1 or 5 or 30
		
		//set background style and color of display 
		this.state.displayStyle = "displayStyleW";
		
		let intervalId = setInterval(this.timer, 1000);
		//1 min clicked, display initialized immediately
		this.convertTotalSecondsToTimerString(this.state.totalSeconds);
		this.setState({intervalId: intervalId });
		
		//if reset is clicked, need a backup of the original amount of seconds
		this.state.totalSecondsForReset = this.state.totalSeconds;
	}
	
	/*
	Given totalSeconds to count down from, countdown to 0 and update the display value.
	Math.floor() is needed to handle case of 0 minutes.
	totalSeconds - 1 happens before convertTotalSecondsToTimerString()
	because solves problem of: click 1 Min, 6:00 appears 2 seconds before counting down.
	totalSeconds - 1 happens before === 0 because prevents display from being negative.
	*/
	timer() {
		if (this.state.isRunning === true) { //if not paused
			this.state.totalSeconds = this.state.totalSeconds - 1;
			if (this.state.totalSeconds === 0) {
				this.state.displayStyle = "displayStyleR";
				//console.log("in timer this.state.displayStyle.backgroundColor = ");
				//console.dir(this.state.displayStyle.backgroundColor);
				this.state.isRunning = false; //used to set color to red
				clearInterval(this.state.intervalId);
				
				var audio = new Audio("./Zen Buddhist Temple Bell-SoundBible.com-331362457.mp3");
				for(var i = 0; i < 4; i++){
					audio.play();
				}				
			}
			
			this.convertTotalSecondsToTimerString(this.state.totalSeconds);			
		}
	}

	/*
	If timer is counting down, pauses timer.
	If timer is paused, continues timer counting down.
	*/
	playPause(){
		console.log("in play pause");
		if (this.state.isRunning === true) {
			this.state.isRunning = false;
		} else {
			this.state.isRunning = true;
		}
	}
	
	/*
	When reset button is clicked while timer 
	is counting down or while timer is paused,
	timer is set back to original time and does not count down.
	If the reset button is clicked with timer is 00:00,
	the timer stays at 00:00.
	If the reset button is clicked any other time, nothing happens.
	=== true prevents NaN:NaN from appearing when click Reset 
	when display is 00:00
	*/
	reset(){
		if (this.state.isRunning === true) {
			this.state.displayStyle = "displayStyleW";
			clearInterval(this.state.intervalId);
			//load amount from backup
			this.convertTotalSecondsToTimerString(this.state.totalSecondsForReset);
		}
	}

	
	/*
	input is an amount of seconds.
	output is the input has been converted to the format of the 
	timerString "00:00".
	*/
	convertTotalSecondsToTimerString(amountOfSeconds){
		let minutes = Math.floor(amountOfSeconds / 60);
		
		//handle case of leading 0
		if (minutes < 10) {
			minutes = "0" + minutes;
		}
		
		let seconds = amountOfSeconds % 60;
		
		//handle case of leading 0
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		
		let display = minutes + ":" + seconds;
		console.log("display = " + display);
		this.setState({ timerString: minutes + ":" + seconds });
	}
	
	/*
	mouseOut(){
		console.log("in mouseOut()");
		this.setState({debugStyle: "debugVisible"});
	}
	*/
	
	
	/*
	Renders the 1 minute button and the display of the timer.
	Need closing <br/>, <br> will not work.
	xs=3, left column takes up 3 of 12 columns
	xs=9, right column takes up 9 of 12 columns
	xs, sm, md, lg are the 4 possible screen sizes
	
	With red, the totalSeconds === 0 is to detect when the
	timer has reached 0.
	The isRunning === false is to make the background red only
	when the timer has reached 0, and not when the display is 0
	before any timers have been started.

	ml-4 and mr-5 are both on Play/Pause button.
	other option:
	Play/Pause ml-4, Reset mr-5
	*/
	render() {		
		return (
			<div class="container" style={{borderStyle:"solid",borderWidth:"1px"}}>
				<Row>
					<Col>

						<TimerButton time="1" callbackFromParent={this.myCallback}/>
						<TimerButton time="5" callbackFromParent={this.myCallback}/>
						<TimerButton time="30" callbackFromParent={this.myCallback}/>
					</Col>
					<Col>
						<span id="displayBackground" className={this.state.displayStyle}>{this.state.timerString}</span>
						<br/>
						<Button variant="success ml-4 mr-5" onClick={this.playPause}>
							Play/Pause
						</Button>
						<Button variant="danger" onClick={this.reset}>
							Reset
						</Button>
						
					</Col>
				</Row>
				<Row>
					<Col md={{ span: 3, offset: 3 }}>
						<div>
							<button 
							type="button"
							className={this.state.debugStyle}
							onMouseOver={() => {
								console.log("in onMouseOver");
								this.setState({ debugStyle: "debugVisible"});
							} }
							onMouseOut={() => {
								console.log("in onMouseOut");
								this.setState({ debugStyle: "debugHidden"});
							}}
							onClick={() => {
								console.log("in onClick");
								this.myCallback(.1);
							}}
							>Test</button>
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}

/*
TimerStart is a button to set a timer.
*/
class TimerButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.runTimer = this.runTimer.bind(this);
	}
	
	runTimer(event){
		console.log("event=");
		console.dir(event.target);
		this.props.callbackFromParent(this.props.time);
	}

	/*
	{ this.props.numberOfSeconds }
	primary mb-2 mt-2, primary means blue, 2 means margin top and bottom
	marginLeft is to have same whitespace distance on both sides of display.
	*/
	render () {
		const buttonWidth = {
			width: "100px",
			marginLeft: "210px"
		};
		return (
			<div>
				<Button variant="primary mb-2 mt-2" style={buttonWidth} onClick={this.runTimer}>{this.props.time} Min</Button>
			</div>
		);
	}
}

// ... the starter code you pasted ...
//const domContainer3 = document.querySelector('#root');
//ReactDOM.render(e(TimerStart), domContainer3);
ReactDOM.render(
	<div>
	<MeditationTimer />
	</div>,
	document.getElementById('root')
);




