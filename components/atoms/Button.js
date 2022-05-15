import { styles as style, stylevar } from "../../Style";
import { TouchableOpacity, Text, Image, View } from "react-native";
import React from "react";
import { Haptic } from "../../func/Haptic";
import { InputText } from "./Text";
const styles = style.input; /*- Input styles lies here -*/

class Button extends React.PureComponent {
    constructor(props) {
        super(props);

        this.is_hollow = this.props.hollow;
    }
       
    /*- Render the button -*/
    render() {
        return (
            <TouchableOpacity
                style                = {[styles.submitInput, this.props.style || {}, this.is_hollow ? styles.hollowButton : {}]}
                onPress              = {() => {
                    this.props.onPress();
                    Haptic("medium");
                }}
                activeOpacity	     = {0.8}
            >
                <InputText color={this.is_hollow ? stylevar.colors.main : "#fff"}>{this.props.children}</InputText>
            </TouchableOpacity>
        );
    }
}

class TileButtonContainer extends React.PureComponent {
    constructor(props) {
        super(props);
    }
       
    /*- Render the button-container -*/
    render() {
        return (
            <View style={[styles.tileButtonContainer, this.props.style || {}]}>{this.props.children}</View>
        );
    }
}
/*- Like the button, but can be split into smaller ones next to eachother -*/
class TileButton extends React.PureComponent {
    constructor(props) {
        super(props);

        this.is_hollow = this.props.hollow;
        this.position = this.props.pos;
    }
       
    /*- Render the button -*/
    render() {
        return (
            <TouchableOpacity
                style                = {[
                    styles.tileButton,
                    this.is_hollow ? styles.hollowButton : {},
                    this.props.color ? { backgroundColor: this.props.color } : {},
                    this.position == "left" ? {
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                        marginRight: 5,
                    } : null,
                    this.position == "right" ? {
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                        marginLeft: 5,
                    } : null,
                    this.position == "middle" ? {
                        marginHorizontal: 5,
                    } : null,
                    this.props.customStyle || {},
                ]}
                onPress              = {() => {
                    this.props.onPress();
                    Haptic("medium");
                }}
                activeOpacity	     = {0.8}
            >
                <InputText color={this.is_hollow ? stylevar.colors.main : "#fff"}>{this.props.children}</InputText>
            </TouchableOpacity>
        );
    }
}

/*- A cross in top left -*/
class BackButton extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    
    /*- Render the button -*/
    render() {
        return (
            <TouchableOpacity
                style                = {styles.backButton}
                onPress              = {() => {
                    if (this.props.onPress) this.props.onPress();
                    Haptic("light");
                }}
                activeOpacity	     = {0.8}
            >
                <Image style={{ width:"100%", height:"100%" }} source={{ uri: "https://cdn-icons-png.flaticon.com/128/3917/3917759.png" }} />
            </TouchableOpacity>
        );
    }
}

class StartButton extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    /*- Render the StartButton -*/
    render() {
        return (
            <TouchableOpacity
                style                = {[styles.startButton, this.props.inactive ? styles.inactive : styles.active]}
                onPress              = {() => {
                    if (!this.props.inactive) this.props.onPress();
                    Haptic("medium");
                }}
                activeOpacity	     = { this.props.inactive ? 1 : 0.8 }
            >
                <InputText>{this.props.children}</InputText>
            </TouchableOpacity>
        );
    }
}


export {
    Button,
    StartButton,
    BackButton,
    TileButton,
    TileButtonContainer
}