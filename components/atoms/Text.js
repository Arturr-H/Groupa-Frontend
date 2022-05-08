import { text as styles } from "../../Style";
import { Text, View } from "react-native";
import React from "react";

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

const P = ({ children, ...props }) => (
    <Text style={styles.p} {...props}>
        {children}
    </Text>
);

const HR = ({ children, ...props }) => (
    <View style={[styles.hr, props.margin ?
        { marginBottom: "auto" } : { marginVertical: 10 }]} {...props} />
);

const BIGTEXT = ({ children, ...props }) => (
    <Text style={styles.bigtext} {...props}>
        {children}
    </Text>
);

export { H1, H2, BIGTEXT, P, HR };