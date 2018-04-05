import React, { Component } from "react"; // import {$} from 'requery';

export default class Counter extends Component {
    constructor(props) {
        super(props);
        props.$self.ref = this;
    }

    render() {
        return (
            <h3
                style={{
                    textAlign: "center",
                    color: "#d7e9e3",
                    fontSize: 30
                }}
            >
                {this.props.num}
            </h3>
        );
    }
}
