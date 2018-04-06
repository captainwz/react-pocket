import $ from 'redollar';
import Timer from './Timer';
import Decoration from './Decoration';

export default class Card extends $ {
    
    componentDidMount () {
        
        setInterval(() => {

            let num = parseInt($('Counter').getProp('num')) + 2;
            $('Counter').setProp({num});
            $(this).setProp({
                backgroundColor: `rgb(${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)})`
            })

        }, 1000);

    }

    defaultProp () {

        return {
            width: 200,
            height: 100,
            backgroundColor: '#108ee9'
        }

    }

    render () {

        const {width, height, backgroundColor} = this.props;

        return (

            <div
                style={{
                    width,
                    height,
                    backgroundColor
                }}
            >
                <Timer>
                    <Decoration 
                        title="this is a counter"
                    />
                </Timer>
            </div>

        )

    }




}
