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
			isRunning: true //true if running, false if paused
		};
		
		this.startOneMinTimer = this.startOneMinTimer.bind(this);
		this.startFiveMinTimer = this.startFiveMinTimer.bind(this);
		this.startThirtyMinTimer = this.startThirtyMinTimer.bind(this);
		this.playPause = this.playPause.bind(this);
		this.timer = this.timer.bind(this);
		this.reset = this.reset.bind(this);
	}
	
	myCallback = (dataFromChild) => {
		//we will use the dataFromChild here
		console.log("dataFromChild=");
		console.dir(dataFromChild);
		console.log("this=");
		console.dir(this);
		this.state.totalSeconds = dataFromChild * 60; //1 or 5 or 30
		let intervalId = setInterval(this.timer, 1000);
		this.setState({intervalId: intervalId });
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
	
	reset(){
		console.log("in reset");
	}

	/*
	Renders the 1 minute button and the display of the timer.
	Need closing <br/>, <br> will not work.
	*/
	render() {
		return (
			<div>
				<TimerButton time=".1" callbackFromParent={this.myCallback}/>
				<TimerButton time="1" callbackFromParent={this.myCallback}/>
				<TimerButton time="5" callbackFromParent={this.myCallback}/>
				
				<span>
					<TimerButton time="30" callbackFromParent={this.myCallback}/>					
					{this.state.timerString}
				</span>
				<br/>
				<button onClick={this.playPause}>
					Play/Pause
				</button>
				<button onClick={this.reset}>
					Reset
				</button>
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
		return (
			<div>
				<button onClick={this.runTimer}>{this.props.time} Min</button>
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




