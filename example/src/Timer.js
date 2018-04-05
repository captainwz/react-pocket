import {$} from 'redollar';
import Counter from './Counter';

export default class Timer extends $ {
    
    constructor (props) {
        super(props);
    }

    render () {

        return (
            <div>
                {this.props.children}
                <Counter/>
            </div>
        )

    }

}