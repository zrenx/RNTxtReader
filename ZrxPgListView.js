import React, {PropTypes, Component} from 'react';
import {View, Modal, Text, Button, ListView, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';

class ZrxPgListView extends Component {

  propTypes: {
    rowView: React.PropTypes.func,
    onSelect: React.PropTypes.func,
    data: React.PropTypes.array,
    pageSize: React.PropTypes.number,
    postMount: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.allChapters = [];
    this.pages = [];
    this.contentHeight = 0;
    this.componentMounted = false;
    this.mountedFunc = null;
    this.listShownFunc = null;

    this.state = {
      curPage: 0,
      //dataSource: ds.cloneWithRows(this.props.data),
      dataSource: ds.cloneWithRows([]),
    }
  };

  componentDidMount() {
    console.log("ZrxPgListView dit Mount");
    //this.updateData(this.props.data);
    //console.log(this);
    this.props.postMount(this);
    this.componentMounted = true;
    if (this.mountedFunc && typeof this.mountedFunc == 'function') {
      this.mountedFunc();
    }
  };

  componentWillMount() {
    console.log("ZrxPgListView will Mount");
    //this.updateData(this.props.data);
  }

  setNativeProps(props) {
    this.refs.listView.setNativeProps(props);
  }

  updateData(rows = []) {
    this.allRows = rows;
    if (rows.length <= 0) {
      this.pages = [];
    } else {
      if (this.props.pageSize == 0 || this.props.pageSize > rows.length) {
        this.pages = [rows,];
      } else {
        let pageNum = Math.ceil(rows.length / this.props.pageSize);
        for (let i = 0; i< pageNum; i++) {
          this.pages[i] = rows.slice(i* this.props.pageSize, (i+1) * this.props.pageSize);
        }
      }
    }
    let pageRows = this.pages[this.state.curPage];
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(pageRows),
    });
  };

  goToItem(idx = 0) {
    if (!this.componentMounted && this.pages.length == 0) {
      this.mountedFunc = this.goToItem(idx);
    } else {
      let position = 0;
      if (this.pages.length == 1) {
        let percent = idx / this.pages[0].length;
        this.refs.listView.scrollTo({x:0, y:percent * this.contentHeight, animated:false});
      } else {
        let page = parseInt(idx / this.props.pageSize);
        let percent = (idx % this.props.pageSize) / this.props.pageSize;
        this.setState({
          curPage: page,
          dataSource: this.state.dataSource.cloneWithRows(this.pages[page]),
        });
        if (this.contentHeight == 0) {
          this.listShownFunc = () => {
            this.refs.listView.scrollTo({x:0, y:percent * this.contentHeight, animated:false});
          };
        } else {
          this.refs.listView.scrollTo({x:0, y:percent * this.contentHeight, animated:false});
        }
      }
    }
  };

  goToPage(page = 0) {
    if (this.pages.length == 0) {return}

    this.refs.listView.scrollTo({x:0, y:0, animated:false});
    this.setState({
      curPage: page,
      dataSource: this.state.dataSource.cloneWithRows(this.pages[page]),
    });
  };

  goFirstPage() {
    if (this.pages.length == 0) {return}

    this.refs.listView.scrollTo({x:0, y:0, animated:false});
    this.setState({
      curPage: 0,
      dataSource: this.state.dataSource.cloneWithRows(this.pages[0]),
    });
  };

  goPrevPage() {
    if (this.pages.length == 0) {return}

    this.refs.listView.scrollTo({x:0, y:0, animated:false});
    let page = Math.max(this.state.curPage - 1, 0);
    this.setState({
      curPage: page,
      dataSource: this.state.dataSource.cloneWithRows(this.pages[page]),
    });
  };

  goNextPage() {
    if (this.pages.length == 0) {return}

    this.refs.listView.scrollTo({x:0, y:0, animated:false});
    let page = Math.min(this.state.curPage + 1, this.pages.length - 1);
    this.setState({
      curPage: page,
      dataSource: this.state.dataSource.cloneWithRows(this.pages[page]),
    });
  };

  goLastPage() {
    if (this.pages.length == 0) {return}

    this.refs.listView.scrollTo({x:0, y:0, animated:false});
    let page = this.pages.length - 1;
    this.setState({
      curPage: page,
      dataSource: this.state.dataSource.cloneWithRows(this.pages[page]),
    });
  };

  _renderRow(rowData: string, sectionID: number, rowID: number,) {
    return (
        <TouchableOpacity onPress={() => {
          let idx = +this.state.curPage * this.props.pageSize + +rowID;
          this.props.onSelect(idx);
        }}>
          <Text style={{fontSize: 18, color: "#000", marginVertical: 5,}}>{rowData}</Text>
        </TouchableOpacity>
      );
  };

  _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool,) {
    return (
        <View key={'seprator_'+rowID} style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.1)',}}/>
      );
  };

  render() {
    return (
      <View style={{flex:1, flexDirection: 'column'}} >
        <ListView
          ref="listView"
          onContentSizeChange={(width, height) => {
            this.contentHeight = height;
            if (this.listShownFunc && typeof this.listShownFunc == 'function') {
              this.listShownFunc();
            }
          }}
          enableEmptySections={true}
          initialListSize={this.props.pageSize}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderSeparator={this._renderSeparator.bind(this)}
          />
        <View style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)', marginHorizontal: -10, marginBottom: 10,}}/>
        <View style={{flexDirection: "row", justifyContent: "space-around", alignItems: "stretch"}}>
          <TouchableOpacity style={{flex: 1}} onPress={() => {this.goFirstPage()}}>
            <Text style={{textAlign: 'center', fontWeight: 'bold', color:'#841584',}}>{"|<"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1}} onPress={() => {this.goPrevPage()}}>
            <Text style={{textAlign: 'center', fontWeight: 'bold', color:'#841584',}}>{"<<"}</Text>
          </TouchableOpacity>
          <Text style={{flex: 3, textAlign: 'center', fontWeight: 'bold', color:'#000',}}>{this.state.curPage + 1}</Text>
          <TouchableOpacity style={{flex: 1}} onPress={() => {this.goNextPage()}}>
            <Text style={{textAlign: 'center', fontWeight: 'bold', color:'#841584',}}>{">>"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1}} onPress={() => {this.goLastPage()}}>
            <Text style={{textAlign: 'center', fontWeight: 'bold', color:'#841584',}}>{">|"}</Text>
          </TouchableOpacity>
        </View>
      </View>
      );
  };
};

export default ZrxPgListView;