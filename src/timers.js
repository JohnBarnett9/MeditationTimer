import React from "react";
import ReactDOM from "react-dom";
/*
ERROR in ./node_modules/bootstrap/dist/css/bootstrap.min.css 6:3
Module parse failed: Unexpected token (6:3)
You may need an appropriate loader to handle this file type, currently no loader
s are configured to process this file. See https://webpack.js.org/concepts#loade
rs

*/
//import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap';

/*
WARNING in ./src/timers.js 324:66-72
"export 'Button' was not found in 'react-bootstrap/Button'
*/
//import { Button } from 'react-bootstrap/Button';


import Button from 'react-bootstrap/Button';
import { Row, Col, Grid } from 'react-bootstrap';

//using cdn instead
//import 'bootstrap/dist/css/bootstrap.min.css';

/*
ERROR in ./src/timers.js
Module not found: Error: Can't resolve 'bootstrap/css/bootstrap.css' in 'C:\www\
John\React\MeditationTimer\src'
 @ ./src/timers.js 40:0-38
npm ERR! code ELIFECYCLE
npm ERR! errno 2
*/
//require('bootstrap/css/bootstrap.css');

/*
https://medium.com/@victorleungtw/how-to-use-webpack-with-react-and-bootstrap-b94d33765970
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
*/





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
			isRunning: true //true if running, false if paused
		};
		
		this.startOneMinTimer = this.startOneMinTimer.bind(this);
		this.startFiveMinTimer = this.startFiveMinTimer.bind(this);
		this.startThirtyMinTimer = this.startThirtyMinTimer.bind(this);
		this.playPause = this.playPause.bind(this);
		this.timer = this.timer.bind(this);
		this.reset = this.reset.bind(this);
		this.convertTotalSecondsToTimerString = this.convertTotalSecondsToTimerString.bind(this);
		
		/*
		webpack kept giving errors about myCallback() function 
		when using ES6 syntax, trying to solve that error with 
		.bind() and myCallback(dataFromChild)
		*/
		//this.myCallback = this.myCallback.bind(this);
	}
	
	//myCallback(dataFromChild){
	myCallback = (dataFromChild) => {
		//we will use the dataFromChild here
		console.log("dataFromChild=");
		console.dir(dataFromChild);
		console.log("this=");
		console.dir(this);
		this.state.totalSeconds = dataFromChild * 60; //1 or 5 or 30
		let intervalId = setInterval(this.timer, 1000);
		this.setState({intervalId: intervalId });
		
		//if reset is clicked, need a backup of the original amount of seconds
		this.state.totalSecondsForReset = this.state.totalSeconds;
	}
	
	/*
	Given totalSeconds to count down from, countdown to 0 and update the display value.
	Math.floor() is needed to handle case of 0 minutes.
	*/
	timer() {
		if (this.state.isRunning === true) { //if not paused
			if (this.state.totalSeconds === 0) {
				clearInterval(this.state.intervalId);
			}

			this.convertTotalSecondsToTimerString(this.state.totalSeconds);

			/*
			let minutes = Math.floor(this.state.totalSeconds / 60);
			
			//handle case of leading 0
			if (minutes < 10) {
				minutes = "0" + minutes;
			}
			
			let seconds = this.state.totalSeconds % 60;
			
			//handle case of leading 0
			if (seconds < 10) {
				seconds = "0" + seconds;
			}
			
			let display = minutes + ":" + seconds;
			console.log("display = " + display);
			this.setState({ timerString: minutes + ":" + seconds });
			*/
			this.state.totalSeconds = this.state.totalSeconds - 1;
		}
	}

	/*
	sets timer to countdown from 1 minute
	intervalId is stored because the setInterval needs to be exited when
	the timer has reached 0
	*/
	startOneMinTimer(e){
		this.state.totalSeconds = 5;
		let intervalId = setInterval(this.timer, 1000);
		this.setState({intervalId: intervalId });
	}
	
	startFiveMinTimer(){
		this.state.totalSeconds = 7;
		let intervalId = setInterval(this.timer, 1000);
		this.setState({ intervalId: intervalId });
	}
	
	startThirtyMinTimer(){
		this.state.totalSeconds = 9;
		let intervalId = setInterval(this.timer, 1000);
		this.setState({ intervalId: intervalId });
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
	*/
	reset(){
		console.log("in reset");
		clearInterval(this.state.intervalId);
		
		//load amount from backup
		this.convertTotalSecondsToTimerString(this.state.totalSecondsForReset);
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
	Renders the 1 minute button and the display of the timer.
	Need closing <br/>, <br> will not work.
	xs=3, left column takes up 3 of 12 columns
	xs=9, right column takes up 9 of 12 columns
	xs, sm, md, lg are the 4 possible screen sizes
	*/
	render() {
		const displayStyle = {
			fontSize: "100px"
		};
		return (
			<div class="container">
				<Row>
					<Col>
							<TimerButton time=".1" callbackFromParent={this.myCallback}/>
							<TimerButton time="1" callbackFromParent={this.myCallback}/>
							<TimerButton time="5" callbackFromParent={this.myCallback}/>					
							<TimerButton time="30" callbackFromParent={this.myCallback}/>												
					</Col>
					<Col>
							<span style={displayStyle}>{this.state.timerString}</span>
							<br/>
							<button onClick={this.playPause}>
								Play/Pause
							</button>
							<button onClick={this.reset}>
								Reset
							</button>
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
		//this.props.callbackFromParent(9);
		this.props.callbackFromParent(this.props.time);
	}

	//{ this.props.numberOfSeconds }
	render () {
		const tButton = {
			boxShadow: "0px 0px 0px 2px #9fb4f2",
			//background:linearGradient("to bottom", "#7892c2 5%", "#476e9e 100%"),
			backgroundColor:"#7892c2",
			borderRadius:"15px",
			border:"1px solid #4e6096",
			display:"inline-block",
			cursor:"pointer",
			color:"#ffffff",
			fontFamily:"Arial",
			fontSize:"19px",
			padding:"12px 37px",
			textDecoration:"none",
			textShadow:"0px 1px 0px #283966",
			
			margin: "10px 10px 10px 10px"
		};
		return (
			<div>
				<Button variant="primary" size="lg" onClick={this.runTimer}>{this.props.time} Min</Button>
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




