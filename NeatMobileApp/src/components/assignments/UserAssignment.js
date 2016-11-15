import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  ListView,
} from 'react-native';

import * as Progress from 'react-native-progress';
import NavigationBar from 'react-native-navbar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import styles from './styles';
import AuthService from '../../utilities/AuthService';

class Assignments extends Component {
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
    this.getAssignments();
  }
  componentWillReceiveProps() {
    this.getAssignments();
  }

  onPressRow(rowData) {
    this.props.navigator.push({
      id: 'AssignmentView',
      title: rowData.assignmentName,
      passProps: {
        onPress: this.AddPressed,
        rowData,
      },
    });
  }

  onAddPressed() {
    this.props.navigator.push({
      id: 'AssignmentForm',
    });
  }
  getAssignments() {
    AuthService.getAssignments((assignmentList) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(assignmentList),
      });
    });
  }

  changeColor(progress, numTasks) {
    let color = '';
    if (numTasks === 0 || progress === 'Not Tracking Yet') {
      color = '#595959';
    } else if (progress === 'Significantly Behind') {
      color = '#F44336';
    } else if (progress === 'Considerably Behind') {
      color = '#ffcc00';
    } else if (progress === 'Slightly Behind') {
      color = '#e6e600';
    } else if (progress === 'On Track') {
      color = '#009688';
    }
    return color;
  }

  _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: adjacentRowHighlighted ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
        }}
      />
    );
  }
  renderRow(rowData) {
    const numberOfTaskLeft = rowData.tasks.filter((task) => !task.isDone).length;
    // let numberOfTaskLeft = 2;
    const smartStatus = rowData['smart status'];

    let progress = rowData.progress; // Math.random();
    if (progress === 0 || rowData.tasks.length === 0) {
      progress = 0.0009;
    }

    return (
      <TouchableHighlight
        onPress={() => this.onPressRow(rowData)}
        underlayColor="#ddd"
      >
        <View style={{ flexDirection: 'column', paddingTop: 12, paddingBottom: 12, paddingLeft: 10, paddingRight: 10 }}>
          <Text style={{ alignItems: 'flex-start', alignSelf: 'flex-start', fontSize: 14, fontWeight: '300', marginBottom: 4 }}> {rowData.assignmentName}</Text>
          <View style={{ flexDirection: 'row', paddingTop: 8 }}>
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Progress.Circle
                style={{ alignSelf: 'flex-start', justifyContent: 'center' }}
                progress={progress}
                size={55}
                indeterminate={false}
                showsText
                color={this.changeColor(smartStatus, rowData.tasks.length)}
                direction="counter-clockwise"
              />
            </View>

            <View style={{ flex: 1, alignItems: 'center', alignSelf: 'auto' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}>
                  {(numberOfTaskLeft > 0) ? `${numberOfTaskLeft}  ` : null}
                </Text>
                <FontAwesome
                  name="puzzle-piece"
                  size={35}
                  color="#32C0B2"
                />
              </View>
              <Text>Open Task</Text>
            </View>

            <View style={{ flex: 1, alignItems: 'flex-end', alignSelf: 'center' }}>
              <Text style={{ fontSize: 18 }}>
                Due
              </Text>
              <Text>
                {moment().isAfter(rowData.dueDate)
                  ? 'Past Due' : `${moment(rowData.dueDate).fromNow()}`}
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
  render() {
    // console.log('current routes', this.props.navigator.getCurrentRoutes(0));
    return (
      <View style={styles.container}>
        <NavigationBar
          title={{
            title: 'Dashboard',
            tintColor: '#32C0B2',
          }}
          rightButton={{
            title: <Icon name="ios-add" size={35} />,
            handler: () => this.onAddPressed(),
            tintColor: '#32C0B2',
          }}
          leftButton={{
            // title: <FontAwesome name="sign-out" size={25} />,
            title: 'Logout',
            handler: () => AuthService.logout(),
            tintColor: '#32C0B2',
          }}
          tintColor="#F5FCFF"
        />
        <Text style={styles.heading}>
          Hello Neat Dev Team!
        </Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          renderSeparator={this._renderSeparator.bind(this)}
          enableEmptySections
        />
      </View>
    );
  }
}

Assignments.propTypes = {
  navigator: React.PropTypes.object,
};

module.exports = Assignments;
