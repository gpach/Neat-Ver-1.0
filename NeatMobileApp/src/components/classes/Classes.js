import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  ListView,
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import styles from './styles';
import AuthService from '../../utilities/AuthService';

class Classes extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      levels: 0,
      dataSource: ds,
      authInfo: null,
    };
  }

  componentDidMount() {
    this.setState({ levels: (this.props.navigator.getCurrentRoutes(0).length) });
    // AuthService.getLoginToken((err, authInfo) => {
    //   this.setState({
    //     authInfo,
    //   });
    this.fetchClasses();
  }
  componentWillReceiveProps() {
    this.fetchClasses();
  }

  onAddPressed() {
    this.props.navigator.push({
      type: 'Pop',
      id: 'ClassForm',
    });
  }
  onBackPressed() {
    this.props.navigator.pop();
  }

  onPressRow(rowData) {
    // console.log('class rowData', rowData);

    this.props.navigator.push({
      id: 'ClassView',
      passProps: {
        classUrl: rowData.url,
        className: rowData.className,
      },
    });
  }

  fetchClasses() {
    AuthService.getClasses((responseJson) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseJson),
      });
    });
  }


  renderRow(rowData) {
    return (
      <TouchableHighlight
        onPress={() => this.onPressRow(rowData)}
        underlayColor="#ddd"
      >
        <View style={styles.List}>
          <Text style={styles.rowLabel}>{rowData.className}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title={{
            title: 'Classes',
            tintColor: '#F5FCFF',
          }}
          leftButton={(this.state.levels < 2) ? { title: '' } : {
            title: <FontAwesome name="chevron-left" size={20} />,
            handler: () => this.onBackPressed(),
            tintColor: '#F5FCFF',
          }}
          rightButton={{
            title: <FontAwesome name="plus" size={25} />,
            handler: () => this.onAddPressed(),
            tintColor: '#F5FCFF',
          }}
          tintColor="#2194f3"
        />
        <ListView
          style={{ flex: 1, alignSelf: 'stretch' }}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections
        />
      </View>
    );
  }
}

Classes.propTypes = {
  navigator: React.PropTypes.object,
};

module.exports = Classes;
