'use strict'
/*This are the styles for the Assignment view screen*/
import { StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    button: {
          height: 50,
          backgroundColor: '#48BBEC',
          borderColor: '#48BBEC',
          alignSelf: 'stretch',
          marginTop: 100,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 5,
        },
    List: {
        borderColor: '#48BBEC',
        borderWidth: 1,
        height: 50,
        textAlign: 'center',
        padding: 10
    },
    progress: {
        margin: 10,
    },
    circles: {
        flexDirection: 'row',
        alignItems: 'center',
    },
     input: {
        height: 50,
        padding: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#48bbec',
        borderRadius: 0,
        color: '#48BBEC',

    },

});

  module.exports = styles;