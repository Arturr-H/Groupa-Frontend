import { styles } from "../../Style";
import { TextInput as TI } from "react-native";
import React from "react";

const TextInput = (props) => {
    // constructor(props) {
    //     super(props);

    //     /*- Runtime variables -*/
    //     this.state = {
    //         value: this.props.value,
    //         style: styles.input,
    //     }

    //     /*- Bind functions -*/
    //     this.handleFocus  = this.handleFocus.bind(this);
    //     this.handleChange = this.handleChange.bind(this);
    // };

    // /*- When text input is clicked / focused -*/
    // handleFocus = () => {
    //     this.setState({ style: styles.input__focus });
    // };

    // /*- When value changes -*/
    // handleChange = (value) => {
    //     /*- Grab the text from the big ahh object -*/
    //     const TEXT = value.nativeEvent.text;

    //     /*- Set the state and pass it to the user function -*/
    //     this.setState({ value: TEXT });
    //     this.props.onChange(TEXT);
    // };

    // /*- On first render -*/
    // componentDidMount() {
    //     /*- Set the initial value -*/
    //     this.setState({
    //         value: this.props.value,
    //     });
    // };

    /*- Render -*/
    // render() {
        return (
            <TI
                type           = {props.type        || "text"}
                placeholder    = {props.placeholder || ""}
                // onChange       = {(e) => handleChange(e)}
                style          = {styles.input}
                // onFocus        = {handleFocus}
                autoCapitalize = {"none"}
                autoComplete   = {props.autoComplete || ""}
                autoCorrect    = {false}
                spellCheck     = {false}
                keyboardType   = {props.keyboard || ""}
                returnKeyType  = {"next"}
                blurOnSubmit   = {false}
                ref={props.ref}
                {...props}
            />
        );
    // };
}

export {
    TextInput as TextInput,
}