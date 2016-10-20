import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Navigator,
  TextInput,
  DatePickerIOS,
  TouchableOpacity,
  ListView,
  ScrollView,
  Switch,
} from 'react-native';

import styles from './styles';

var Assignments = require('./Assignments'),
    CONFIG = require('../../config.js');

class AssignmentView extends Component{

    constructor(props) {
        super(props)

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state={
            dataSource: ds,
            assignmentUrl: props.assignmentUrl
        };
    }

    componentDidMount(){
            this.fetchTasks();
          }

    fetchTasks(){

        return fetch(CONFIG.server.host + 'api/task/')
              .then((response) => response.json())
              .then((responseJson) => {
                var taskList = responseJson;
                var display = [];
                var j = 0
                for(var i = 0; i < taskList.length; i++){
                    if(taskList[i].user ===  CONFIG.server.host + 'api/user/1/' && taskList[i].assignment === this.state.assignmentUrl){
                        display[j] = taskList[i];
                        j++;
                    }
                }
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(display)
                })
              })
              .catch((error) => {
                console.error(error);
              });
    }

    onAddTask(){
        this.props.navigator.push({
            id: 'TaskForm',
            passProps:{
                assignmentUrl: this.state.assignmentUrl
            }
        });
    }
    pressDashboard(){
    this.props.navigator.pop();
        //  this.props.navigator.push({
        //     id: 'AssignmentsDash'
        // });
    }
    toogleSwitched(rowData){
        console.log("rowData before is: " + JSON.stringify(rowData));
        rowData.isDone = !rowData.isDone;
        this.forceUpdate();
        console.log("rowData is: " + JSON.stringify(rowData));
        
        fetch(rowData.url, {
              method: "PUT",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                assignment: rowData.assignment,
                user: rowData.user,
                taskName: rowData.taskName,
                isDone: rowData.isDone,
                hoursPlanned: rowData.hoursPlanned,
                hoursCompleted: rowData.hoursCompleted,
                startDate: rowData.startDate,
                endDate: rowData.endDate,
              })
        })
        .then((response) => response.json())
        .then((responseData) => console.log("PUT success with response: " + JSON.stringify(responseData)))
        .catch((errpr) => console.error(error));
        
    }

    renderRow(rowData){
        console.log("Before return render, rowData: " + JSON.stringify(rowData));
        return(
               <View style={styles.List}>
                    <Switch
                        onValueChange={() => {this.toogleSwitched(rowData); console.log("clicked on voluechange")}}
                        style={{paddingLeft: 80, marginBottom: 5}}
                        value={rowData.isDone} />
               <Text>{rowData.taskName}</Text>
            </View>
        );
    }

    render(){
        return(

            <ScrollView>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRow.bind(this)}
            />

            <TouchableHighlight style={styles.button}
                onPress={this.onAddTask.bind(this)}
            >
                <Text style={styles.buttonText}>
                        Add Task
                </Text>
            </TouchableHighlight>

            <TouchableHighlight style={styles.button}
                onPress={this.pressDashboard.bind(this)}
            >
                <Text style={styles.buttonText}>
                        Assignment Dashboard
                </Text>
            </TouchableHighlight>
            </ScrollView>

        );
    }
}

module.exports = AssignmentView;
