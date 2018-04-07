import $ from 'react-pocket';

export default class Decoration extends $ {
    
    constructor (props) {
        super(props);
    }

    defaultProp () {
        
        return {
            title: 'no title'
        }
    
    }

    render () {

        return (
            <h3 style={{textAlign: 'center', color: '#fff'}}>{this.props.title}</h3>
        )

    }


}