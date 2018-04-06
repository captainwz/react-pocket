import React, { Component } from "react";
import $ from "redollar";
import Timer from "./Timer";
import Decoration from "./Decoration";

export default class Card extends Component {
    constructor(props) {
        super(props);
        props.$self.ref = this;
    }

    componentDidMount() {
        setInterval(() => {
            let num = parseInt($("Counter").getProp("num")) + 2;
            $("Counter").setProp({ num });

            $(this).setProp({
                backgroundColor: `rgb(${Math.round(
                    Math.random() * 255
                )}, ${Math.round(Math.random() * 255)}, ${Math.round(
                    Math.random() * 255
                )})`
            });
        }, 1000);
    }

    render() {
        const { width, height, backgroundColor } = this.props;

        return (
            <div
                style={{
                    width,
                    height,
                    backgroundColor
                }}
            >
                <Timer {...this.props.$self.items[0].props}>
                    <Decoration
                        {...this.props.$self.items[1].props}
                        title="this is a counter"
                    />
                </Timer>
            </div>
        );
    }
}
