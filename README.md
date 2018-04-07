## react-pocket 
![logo](https://raw.githubusercontent.com/captainwz/react-pocket/master/doc/logo.png =190)


[![npm version](https://img.shields.io/npm/v/react-pocket.svg?style=flat-square)](https://www.npmjs.com/package/react-pocket)

**A framework that helps you do state-management in React without redux or mobx. Light, simple and easy. Just write some intimate jquery-style codes like `$('MyComponent').setProp({foo: 'bar'})` anywhere. That's enough!**


### Installation
```
npm install --save react-pocket
```

* [Why](https://github.com/captainwz/react-pocket/blob/master/doc/why.md)
* [Usage](https://github.com/captainwz/react-pocket/blob/master/doc/usage.md)
* [API](https://github.com/captainwz/react-pocket/blob/master/doc/api.md)


### Quick Look
Let's take an example. There are three component files ```Card.js```,```Timer.js```,```Counter.js```, which are aggregated to simply play a feature of counting. The following is the structure.
```
-- Card
    |
     -- Timer
          |
           -- Counter
```
**What if you want to change the number of Counter just in ```Card.js```. react-pocket offers you ability to do so!** Here are the code examples.
```jsx
/*Card.js*/

import $ from 'react-pocket';
import Timer from './Timer';

export default class Card extends $ {

    componentDidMount () {

        setInterval(() => {
            
            let num = parseInt($('Counter').getPro('num')) + 1;

            $('Counter').setProp({num});

        }, 1000);

    }

    return (
        <div>
            <Time/>
        </div>
    )
}

```

```jsx
/*Timer.js*/

import $ from 'react-pocket';
import Counter from './Counter';

export default class Timer extends $ {

    return (
        <div>
            <Counter/>
        </div>
    )
}
```

```jsx
/*Counter.js*/

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
            <h3>
                {this.props.num}
            </h3>
        )

    }


}
```

You can get [the full example here](https://github.com/captainwz/react-pocket/tree/master/example/src).

![gif](https://raw.githubusercontent.com/captainwz/react-pocket/master/example/example.gif)


### License

MIT








