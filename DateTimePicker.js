var React = require('react-native');
var {
  Platform,
  Component,
  PropTypes,
  Modal,
  View,
  DatePickerIOS,
  DatePickerAndroid,
  TimePickerAndroid,
  TouchableHighlight,
  Text,
  StyleSheet
  } = React;

class DateTimePicker extends Component {

  constructor(props) {
    super(props);

    let {initialDate} = props;
    let selectedDate = initialDate ? initialDate : new Date();

    this.state = {
      selectedDate,
      showModal: false,
    };
  }

  _openIOSDatePicker = () => {
    this.setState({showModal: true});
  };

  _openAndroidDatePicker = () => {
    let {onDone, onCancel, initialDate, minDate, maxDate} = this.props;
    let {selectedDate} = this.state;
    DatePickerAndroid.open({date: selectedDate, minDate, maxDate})
      .then((result) => {
        if (result.action === DatePickerAndroid.dateSetAction) {
          initialDate = initialDate || new Date();
          let selectedDate = new Date(
            result.year, result.month, result.day, initialDate.getHours(), initialDate.getMinutes());
          this.setState({selectedDate});
          onDone(selectedDate);
        } else if (result.action === DatePickerAndroid.dismissedAction) {
          onCancel();
        }
      });
  };

  _openAndroidTimePicker = () => {
    let {onDone, onCancel, initialDate, is24Hour} = this.props;
    let {selectedDate} = this.state;
    TimePickerAndroid.open({hour: selectedDate.getHours(), minute: selectedDate.getMinutes(), is24Hour: is24Hour})
      .then((result) => {
        if (result.action === TimePickerAndroid.timeSetAction) {
          initialDate = initialDate || new Date();
          let selectedDate = new Date(
            initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDay(), result.hour, result.minute);
          this.setState({selectedDate});
          onDone(selectedDate);
        } else if (result.action === TimePickerAndroid.dismissedAction) {
          onCancel();
        }
      });
  };

  _openDateTimePicker = () => {
    if (Platform.OS === 'ios') {
      this._openIOSDatePicker();
    } else if (Platform.OS === 'android') {
      if (this.props.mode === 'date') {
        this._openAndroidDatePicker();
      } else {
        this._openAndroidTimePicker();
      }
    }
  };

  _handlePressDone = () => {
    this.setState({showModal: false});
    this.props.onDone(this.state.selectedDate);
  };

  _handlePressCancel = () => {
    this.setState({showModal: false});
    this.props.onCancel();
  };

  _handleDateChange = (selectedDate) => {
    this.setState({selectedDate});
  };

  renderModalIOS = () => {
    if (Platform.OS === 'ios') {
      let {showModal, selectedDate} = this.state;
      let {cancelText, doneText, mode, both} = this.props;
      let iosMode = both ? 'datetime' : mode;
      return (
        <Modal animated={true}
               transparent={true}
               visible={showModal}>
          <View style={styles.modalContainer}>
            <View style={styles.btnContainer}>
              <View style={styles.btn}>
                <TouchableHighlight style={styles.cancel}
                                    underlayColor={'transparent'}
                                    onPress={this._handlePressCancel}>
                  <Text style={[styles.text, this.props.iOSButtonTextStyle]}>{cancelText}</Text>
                </TouchableHighlight>
              </View>
              <View style={styles.btn}>
                <TouchableHighlight style={styles.done}
                                    underlayColor={'transparent'}
                                    onPress={this._handlePressDone}>
                  <Text style={[styles.text, this.props.iOSButtonTextStyle]}>{doneText}</Text>
                </TouchableHighlight>
              </View>
            </View>
            <View style={styles.pickerContainer}>
              <DatePickerIOS style={styles.datePickerIOS}
                             date={selectedDate}
                             mode={iosMode}
                             onDateChange={this._handleDateChange}/>
            </View>
          </View>
        </Modal>
      );
    }

    return null;
  };

  render = () => {
    return (
      <View style={this.props.style}>
        {this.renderModalIOS()}
        <TouchableHighlight style={styles.touchable}
                            onPress={this._openDateTimePicker}
                            underlayColor={'transparent'}>
          <View style={[styles.innerContainer, this.props.innerContainerStyle]}>
            {this.props.children}
          </View>
        </TouchableHighlight>
      </View>
    );
  };
}

DateTimePicker.propTypes = {
  style: View.propTypes.style,
  onDone: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  initialDate: PropTypes.instanceOf(Date),
  is24Hour: PropTypes.bool,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  // 'time' shows a 'time' picker, 'date' shows a date picker
  mode: PropTypes.oneOf(['time', 'date']),
  // When both is set, we show a DatePickerIOS in mode 'datetime' on IOS, ignored on Android
  both: PropTypes.bool,
  cancelText: PropTypes.string,
  doneText: PropTypes.string,
  iOSButtonTextStyle: Text.propTypes.style,
  innerContainerStyle: View.propTypes.style,
};

DateTimePicker.defaultProps = {
  style: {},
  cancelText: 'Cancel',
  doneText: 'Done',
  mode: 'date',
  both: true,
  is24Hour: false,
  onCancel: () => {},
  minDate: new Date(1900, 1, 1),
};


const styles = StyleSheet.create({
  touchable: {
    flexDirection: 'row',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  btnContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingTop: 10,
  },
  datePickerIOS: {
    backgroundColor: 'white'
  },
  pickerContainer: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  btn: {
    flex: 1,
    paddingHorizontal: 15
  },
  cancel: {
    alignItems: 'flex-start'
  },
  done: {
    alignItems: 'flex-end'
  },
  text: {
    color: '#138BE4'
  },
});
export default DateTimePicker;
