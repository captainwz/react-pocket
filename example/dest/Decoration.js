import React, { Component } from "react";
import $ from "react-pocket";

export default class Decoration extends Component {
    constructor(props) {
        super(props);
        props.$self.ref = this;
    }

    render() {
        return (
            <h3 style={{ textAlign: "center", color: "#fff" }}>
                {this.props.title}
            </h3>
        );
    }
}
