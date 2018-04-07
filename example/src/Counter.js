import $ from 'react-pocket';

export default class Counter extends $ {
    
    constructor (props) {
        super(props);
    }

    defaultProp () {
        
        return {
            num: 0
        }
    
    }

    render () {

        return (
            <h3 
                style={{
                    textAlign: 'center', 
                    color: '#d7e9e3', 
                    fontSize: 30
                }}
            >
                {this.props.num}
            </h3>
        )

    }


}