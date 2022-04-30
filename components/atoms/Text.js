import { styles } from "../../Style";
import { Text } from "react-native";
import React from "react";

const H1 = ({ children, ...props }) => (
    <Text style={styles.h1} {...props}>
        {children}
    </Text>
);

const H2 = ({ children, ...props }) => (
    <Text style={styles.h2} {...props}>
        {children}
    </Text>
);

export { H1, H2 }