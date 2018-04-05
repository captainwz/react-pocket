import Card from "./Card";
import ReactDOM from "react-dom";
import React from "react";

require("./compond.js");
class Wrapped$ extends React.Component {
    constructor(props) {
        super(props);
        this.state = global.$obj;
        global.$obj.wrappedRef = this;
    }
    render() {
        return <Card {...this.state.props} />;
    }
}
ReactDOM.render(<Wrapped$ />, document.getElementById("my-app"));
