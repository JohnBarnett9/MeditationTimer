import React from "react";
import ReactDOM from "react-dom";

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Row, Col, Grid } from 'react-bootstrap';

import './timers.css';

'use strict';

const e = React.createElement;

/*
Contains
30 minute button,
5 minute button,
1 minute button,
the display of the timer,
Play/Pause Button,
Reset button,
Test button appears on hover 6 seconds.

In constructor, .bind() is to keep the value of 'this' in the function 
be MeditationTimer object instead of undefined or window.
*/
class MeditationTimer extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			timerString: "00:00", /* minutes : seconds displayed to user */
			minutes: 0, /* converted from totalSeconds, the minutes part of timerString */
			seconds: 0, /* converted from totalSeconds, the seconds part of timerString */
			intervalId: 0, /* to exit countdown timer when timer is 0 */
			totalSeconds: 0, /* the timer is based on this number, -1 every second */
			totalSecondesForReset: 0, /* used to reset display when Reset button clicked */
			isRunning: false, /* true if timer counting down, false if paused or stopped */
			displayStyle: "displayStyleW", /* CSS class display has white or red background */
			debugStyle: "debugHidden", /* CSS, Test button is visible or not. */
			audio: document.getElementById("myAudio")
		};

		this.playPause = this.playPause.bind(this);
		this.timer = this.timer.bind(this);
		this.reset = this.reset.bind(this);
		this.convertTotalSecondsToTimerString = this.convertTotalSecondsToTimerString.bind(this);
	}

	/*
	clearInterval() prevents countdown running twice as fast 
	when 2 or more Blue buttons are clicked.
	isRunning true because timer not paused and not stopped.
	initialize totalseconds
	displayStyle set background style and color of display
	start Interval
	convertTotalSecondsToTimerString() display timer immediately
	save intervalId to be used in clearInterval()
	if reset is clicked, need a backup of the original amount of seconds
	*/
	startTimer = (dataFromChild) => {
		clearInterval(this.state.intervalId);
		this.state.isRunning = true;
		this.state.totalSeconds = dataFromChild * 60; //1 or 5 or 30
		this.state.displayStyle = "displayStyleW";
		let intervalId = setInterval(this.timer, 1000);
		this.convertTotalSecondsToTimerString(this.state.totalSeconds);
		this.setState({intervalId: intervalId });
		this.state.totalSecondsForReset = this.state.totalSeconds;
	}

	/*
	Given totalSeconds to count down from, countdown to 0 and update the display value.
	isRunning === true, happens when timer not paused.
	Math.floor() is needed to handle case of 0 minutes.
	totalSeconds - 1 happens before convertTotalSecondsToTimerString()
	because solves problem of: click 1 Min, 6:00 appears 2 seconds before counting down.
	totalSeconds - 1 happens before === 0 because prevents display from being negative.
	isRunning = false, set color to red.
	play(), gong sound happens 4 times.
	*/
	timer() {
		if (this.state.isRunning === true) {
			this.state.totalSeconds = this.state.totalSeconds - 1;
			if (this.state.totalSeconds === 0) {
				this.state.displayStyle = "displayStyleR";
				this.state.isRunning = false;
				clearInterval(this.state.intervalId);
				this.state.audio.play();
			}
			this.convertTotalSecondsToTimerString(this.state.totalSeconds);			
		}
	}

	/*
	If timer is counting down, pauses timer.
	If timer is paused, continues timer counting down.
	*/
	playPause(){
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
	when display is 00:00.
	If click Reset when timer is finished and has red background,
	|| === displayStyleR resets timer.
	convertTotalSecondsToTimerString(), load amount from backup.
	*/
	reset(){
		if ((this.state.isRunning === true) || (this.state.displayStyle === "displayStyleR")) {
			this.state.displayStyle = "displayStyleW";
			clearInterval(this.state.intervalId);
			this.convertTotalSecondsToTimerString(this.state.totalSecondsForReset);
			this.state.audio.pause();
		}
	}

	
	/*
	input is an amount of seconds.
	output is the input has been converted to the format of the 
	timerString "00:00".
	minutes < 10, handle case of leading 0
	seconds < 10, handle case of leading 0
	*/
	convertTotalSecondsToTimerString(amountOfSeconds){
		let minutes = Math.floor(amountOfSeconds / 60);

		if (minutes < 10) {
			minutes = "0" + minutes;
		}
		
		let seconds = amountOfSeconds % 60;
		
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		
		let display = minutes + ":" + seconds;
		this.setState({ timerString: minutes + ":" + seconds });
	}

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
	
	Top row has 2 columns: 3 Blue buttons, 00:00 display.
	Bottom row has 3 columns:
	left column is padding 
	center column holds Play/Pause and Reset buttons
	right column holds hidden Test button.
	'lg' means column width, 12 total columns in a row
	*/
	render() {		
		return (
			<div>
				<div class="container" style={{borderStyle:"solid",borderWidth:"1px"}}>
					<Row>
						<Col>
							<TimerButton time="30" callbackFromParent={this.startTimer}/>
							<TimerButton time="5" callbackFromParent={this.startTimer}/>
							<TimerButton time="1" callbackFromParent={this.startTimer}/>
						</Col>
						<Col>
							<span id="displayBackground" className={this.state.displayStyle}>{this.state.timerString}</span>
							<br/>
						</Col>
					</Row>
					<Row>
						<Col lg={6}>
						</Col>
						<Col lg={5}>
							<div className="mb-2">
								<Button variant="success ml-4 mr-5" onClick={this.playPause}>
									Play/Pause
								</Button>
								<Button variant="danger" onClick={this.reset}>
									Reset
								</Button>
							</div>
						</Col>
						<Col lg={1}>
							<div>
								<button
								type="button"
								className={this.state.debugStyle}
								onMouseOver={() => {
									this.setState({ debugStyle: "debugVisible"});
								} }
								onMouseOut={() => {
									this.setState({ debugStyle: "debugHidden"});
								}}
								onClick={() => {
									this.startTimer(.1);
								}}
								>Test</button>
							</div>
						</Col>
					</Row>
				</div>
					<div class="container authorStyle">
					Author: John Barnett
				</div>
			</div>
		);
	}
}

/*
TimerStart is a button to set a timer.
Bootstrap used with variant, to set color, margin bottom, margin bottom.
*/
class TimerButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.runTimer = this.runTimer.bind(this);
	}
	
	runTimer(event){
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




