import React, { Component } from "react";
import { $ } from "redollar";
import Counter from "./Counter";

export default class Timer extends Component {
    constructor(props) {
        super(props);
        props.$self.ref = this;
    }

    render() {
        return (
            <div>
                {this.props.children}
                <Counter {...this.props.$self.items[0].props} />
            </div>
        );
    }
}
