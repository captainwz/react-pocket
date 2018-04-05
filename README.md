## Redollar 
[![npm version](https://img.shields.io/npm/v/redollar.svg?style=flat-square)](https://www.npmjs.com/package/redollar)

A totally new pattern that enables you to use intimate querying apis in React.

### Abstract
There are two types of developers. You probably are new to React, fascinated by this state-oriented mode before becoming confused about something. **Data interaction is an issue between components**, especially for those written in different files. That's the moment when you have to embark on a treck of deeper learning and finally get beaten by myriad concepts: redux, reducer, action, dispatch, blah...

On the other hand, you probably are proficient in React and familiar with those senior concepts. There is no doubt that redux is great since it is solid and sophisticated. However, having been suffered from its inerp pattern for several times, you start to doubt **whether it is necessary to apply redux into all kinds of applications**. Let's just get rid of it before it becomes compulsory.

Here is **redollar** 👏👏👏

### Installation
```
npm install --save redollar
```

### Quick Look
Let's take an example. There are three component files ```Card.js```,```Timer.js```,```Counter.js```, which are aggregated to simply play a feature of counting. The following is the structure.
```
-- Card
    |
     -- Timer
          |
           -- Counter
```
What if you want to change the number of Counter just in ```Card.js```. **Redollar offers your ability to do so!**Here are the code examples.
```jsx
/*Card.js*/

import $ from 'redollar';
import Timer from './Timer';

export class Card extends $ {

    componentDidMount () {

        setInterval(() => {
            
            let num = parseInt($('Counter'.getPro('num')) + 1;

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
/**Timer.js**/

import $ from 'redollar';
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
/**Counter.js**/

import $ from 'redollar';
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
You can get the full example [here](https://github.com/captainwz/redollar/tree/master/example/src).

### Usage
**Redollar is just on its experimental stage** so current procedure may be that concise.

1. Write your app in **Redollar Pattern**. Here are some constraints you should notice. In order to follow them readily, just take a look at the [example](https://github.com/captainwz/redollar/tree/master/example/src) as well.
> * Your root component's class must extend $.
> * Any component's class whose instance you want to use with $ as ```$('OneComponent')``` later must extend $.
> * You can declare component's props by declaring class method ```defaultProp``` which should return an object.
> * If you pass a prop in jsx element declaration eg ```<Card  foo="bar" />```, it'll be a permenant assignment and you are not able to change it by ```$('OneComponent').setProp({foo: 'tux'})```. It is a rational policy.
> * You can't contain any element herits from $ in A standard React component's class declaration. 
> * Make sure your entry file is in the top direcotry.








