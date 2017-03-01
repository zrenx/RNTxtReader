import React, {Component} from 'react';
import {View, TouchableWithoutFeedback} from 'react-native';
import TimerMixin from 'react-timer-mixin';

class MoreTouchable extends Component {
  mixins: [TimerMixin];

  propTypes: {
    onSinglePress: React.PropTypes.func,
    onDoublePress: React.PropTypes.func,
    onLongPress: React.PropTypes.func,
  };

  constructor(props) {
  	super(props);
  	this.state = {
  		lastPress: 0,
  	};
  	this.timer = null;
  }

  onPress() {
  	var delta = new Date().getTime() - this.state.lastPress;
  	if (delta <= 250) {
  	  TimerMixin.clearTimeout(this.timer);
  	  this.props.onDoublePress();
  	  this.setState({lastPress: 0});
  	} else {
  	  this.timer = TimerMixin.setTimeout(() => {
  	    this.props.onSinglePress();
  	  }, 250);
  	  this.setState({lastPress: new Date().getTime()});
  	}

  };

  render() {
  	return (
  		<TouchableWithoutFeedback onPress={this.onPress.bind(this)} onLongPress={this.props.onLongPress}>
  		  <View>{this.props.children}</View>
  		</TouchableWithoutFeedback>
  		);
  };
};

export default MoreTouchable;