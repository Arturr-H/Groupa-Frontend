import { styles as style } from "../../Style";
import { Text, View } from "react-native";
import React from "react";
const styles = style.text; /*- Text styles lies here -*/

const H1 = ({ children, ...props }) => (
    <Text style={styles.h1} {...props}>
        {children}
    </Text>
);

const H2 = ({ children, ...props }) => (
    <Text numberOfLines={1} style={styles.h2} {...props}>
        {children}
    </Text>
);

const H3 = ({ children, ...props }) => (
    <Text numberOfLines={3} style={styles.h3} {...props}>
        {children}
    </Text>
);

const P = ({ children, ...props }) => (
    <Text style={styles.p} {...props}>
        {children}
    </Text>
);

const HR = ({ children, ...props }) => (
    <View style={[styles.hr, props.margin ?
        { marginBottom: "auto" } : { marginVertical: 10 }]} {...props} />
);

const InputText = ({ children, ...props }) => (
    <Text style={[styles.inputText, props.color && { color: props.color }]} {...props}>
        {children}
    </Text>
);

const BIGTEXT = ({ children, ...props }) => (
    <Text style={styles.bigtext} {...props}>
        {children}
    </Text>
);

export { H1, H2, H3, BIGTEXT, P, HR, InputText };