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
*/
class MeditationTimer extends React.Component {
	constructor(props) {
		super(props);

		this.intervalId = 0; /* to exit countdown timer when timer is 0 */
		this.totalSeconds = 0; /* the timer is based on this number, -1 every second */
		this.totalSecondsForReset = 0; /* used to reset display when Reset button clicked */
		this.isRunning = false; /* true if timer counting down, false if paused or stopped */
		this.isCompleted = false; /* timer has completed, red background */
		this.audio = document.getElementById("myAudio"); /* gong sound happens when timer is 0 */

		this.state = { 
			timerString: "00:00", /* minutes : seconds displayed to user */
			displayStyle: "displayStyleW", /* CSS class display has white or red background */
			debugStyle: "debugHidden" /* CSS, Test button is visible or not. */
		};

		this.playPause = this.playPause.bind(this);
		this.timer = this.timer.bind(this);
		this.reset = this.reset.bind(this);
		this.convertTotalSecondsToTimerString = this.convertTotalSecondsToTimerString.bind(this);
	}

	/*
	Called when blue timer button is clicked.
	*/
	startTimer = (dataFromChild) => {
		clearInterval(this.intervalId);

		let secs = dataFromChild * 60;

		this.isRunning = true;
		this.totalSeconds = secs; //1 or 5 or 30
		this.totalSecondsForReset = secs;

		this.setState({ displayStyle: "displayStyleW" });
		this.convertTotalSecondsToTimerString(this.totalSeconds);
		let intervalid = setInterval(this.timer, 1000);
		this.intervalId = intervalid;
	}

	/*
	When a countdown timer has started,
	this function is called every second.
	*/
	timer() {
		if (this.isRunning === true) {
			this.totalSeconds = this.totalSeconds - 1;
			if (this.totalSeconds === 0) {
				this.state.displayStyle = "displayStyleR";
				this.isRunning = false;
				clearInterval(this.intervalId);
				this.audio.play();
				this.isCompleted = true;
			}
			this.convertTotalSecondsToTimerString(this.totalSeconds);
		}
	}

	/*
	Called when Play/Pause button clicked.
	Plays or Pauses countdown timer.
	*/
	playPause(){
		if (this.isRunning === true) {
			this.isRunning = false;
		} else {
			this.isRunning = true;
		}
	}
	
	/*
	Called when Reset button is clicked.
	Timer display is set to white background and 
	original time is displayed.
	*/
	reset(){
		if (this.totalSecondsForReset === 0) { //initial state
			console.log("1st if");
			return;
		}
		if (this.isCompleted === true) {
			this.state.displayStyle = "displayStyleW";
			this.convertTotalSecondsToTimerString(this.totalSecondsForReset);
			this.audio.pause();
			return;
		}
		if (this.isRunning === true) {
			this.isRunning = false;
			this.convertTotalSecondsToTimerString(this.totalSecondsForReset);
		}
		clearInterval(this.intervalId);
		this.convertTotalSecondsToTimerString(this.totalSecondsForReset);
	}

	
	/*
	When a countdown timer has started,
	the total seconds remaining of the timer is converted 
	to minutes:seconds format with leading zeros.
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
	Renders the User Interface that inclues 
	3 blue timer buttons, the display of time remaining,
	the Play/Pause button, the Reset button,
	and Author.
	*/
	render() {		
		return (
			<div>
				<div className="container bootstrapContainer">
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
					<div className="container authorStyle">
					Author: John Barnett
				</div>
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
	
	/*
	Called when blue timer button is clicked.
	Starts countdown timer.
	*/
	runTimer(event){
		this.props.callbackFromParent(this.props.time);
	}

	/*
	Renders a blue timer button.
	Uses react-bootstrap Button component.
	*/
	render () {
		return (
			<div>
				<Button variant="primary mb-2 mt-2" className="timerButtonStyle" onClick={this.runTimer}>{this.props.time} Min</Button>
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




