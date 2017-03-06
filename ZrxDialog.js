import React, {PropTypes, Component} from 'react';
import {View, Modal, Text, Button, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';

class Dialog extends Component {

  propTypes: {
    cancelable: React.PropTypes.bool,
    onCancel: React.PropTypes.func,
    title: React.PropTypes.string,
    buttonActions: React.PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
        visible: true,
    };
  };

  onPress() {
    if (this.props.cancelable) {
        this.props.onCancel();
    }
  }

  onClose() {
    this.setState({visible: false});
    this.props.onCancel();
  }

  close() {
    this.setState({visible: false});
  }

  renderButtons() {
    if (this.props.buttonActions && this.props.buttonActions.length > 0) {
      return (
        <View>
          <View style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)', marginHorizontal: -10, marginBottom: 10,}}/>
          <View style={{flexDirection: "row", justifyContent: "space-around", alignItems: "stretch"}}>
          {
            this.props.buttonActions.map((btnAction) => 
              <TouchableOpacity onPress={btnAction.func} key={btnAction.name}>
              <Text style={{fontWeight: 'bold', color:'#841584',}}>{btnAction.name}</Text>
              </TouchableOpacity>
            )
            //<Button style={{flex: 1}} title={btnAction.name} onPress={btnAction.func} key={btnAction.name}/>
          }
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  render() {
    return (
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.visible}
          onRequestClose={this.onClose.bind(this)}>

          <TouchableWithoutFeedback onPress={this.onPress.bind(this)}>
            <View style={{
                    flex: 1,
                    padding: 50,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  }}>
              <View style={{
                    flex: 1,
                    padding: 10,
                    backgroundColor: '#fff',
                    elevation: 4,
                    borderRadius: 4,
                    borderColor: 'rgba(0,0,0,0.2)',
                    borderWidth: 1,
                  }}>

              <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#000000',
                    textAlign: 'center',
                    marginBottom: 10,
                  }}>{this.props.title}</Text>
              <View style={{
                    height: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    marginHorizontal: -10,
                    elevation: 1,}}/>

              {this.props.children}
              {this.renderButtons()}
              </View>
              </View>
          </TouchableWithoutFeedback>
          </Modal>
        );
  };
};

export default Dialog;