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
			totalSeconds: 0 //different amount depending on which button clicked
		};
		
		this.startOneMinTimer = this.startOneMinTimer.bind(this);
		this.startFiveMinTimer = this.startFiveMinTimer.bind(this);
		this.startThirtyMinTimer = this.startThirtyMinTimer.bind(this);
		this.playPause = this.playPause.bind(this);
		this.timer = this.timer.bind(this);
	}
	
	/*
	Given totalSeconds to count down from, countdown to 0 and update the display value.
	Math.floor() is needed to handle case of 0 minutes.
	*/
	timer() {
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
		this.setState({ timerString: minutes + ":" + seconds });
		this.state.totalSeconds = this.state.totalSeconds - 1;	
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
	}

	/*
	Renders the 1 minute button and the display of the timer.
	Need closing <br/>, <br> will not work.
	*/
	render() {
		return (
			<div>
				<TimerStart time="1" />
				<TimerStart time="5" />
				
				<span>
					<TimerStart time="30" />					
					{this.state.timerString}
				</span>
				<br/>
				<button onClick={this.playPause}>
					Play/Pause
				</button>
			</div>
		);
	}
}

/*
TimerStart is a button to set a timer.
*/
class TimerStart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	//{ this.props.numberOfSeconds }
	render () {
		return (
			<div>
				<button>asdf {this.props.time}</button>
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




