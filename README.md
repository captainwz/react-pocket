## react-pocket 
[![npm version](https://img.shields.io/npm/v/react-pocket.svg?style=flat-square)](https://www.npmjs.com/package/react-pocket)

**A framework that help you do state-management in React without redux or mobx. Light, simple and easy. Just write some intimate jquery-style codes like `$('MyComponent').setProp({foo: 'bar'})` anywhere. That's enough!**

[Why](https://github.com/captainwz/react-pocket/blob/master/doc/why.md)

### Installation
```
npm install --save react-pocket
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


### Usage
**react-pocket is just on its experimental stage** so current procedure may not be that concise.

1.Write your app in **react-pocket Pattern**. Here are some constraints you should notice. In order to follow them readily, just take a look at the [example](https://github.com/captainwz/react-pocket/tree/master/example/src) as well.
> * Your root component's class must extend $.
> * Any component's class whose instance you want to use with $ as ```$('OneComponent')``` later must extend $.
> * You can declare component's properties by declaring class method ```defaultProp``` which should return an object.
> * If you pass a property in jsx element declaration eg ```<OneComponent  foo="bar" />```, it'll be a permenant assignment and you are not able to change it by ```$('OneComponent').setProp({foo: 'tux'})```. It is a rational strategy.
> * You can't contain any element herits from $ in a standard React component's class declaration. 
> * Make sure your entry file is in the top direcotry.
> * Please use ```export default``` instead of  ```module.exports``` to export your class.


2.Then use **react-pocket CLI** to transform the codes. You may use
```
./node_modules/.bin/react-pocket --entry path/to/your/entry/file --output path/to/a/target/directory
```
**Also, you can just monitor file changes just by adding ```--watch```**
```
./node_modules/.bin/react-pocket --entry path/to/your/entry/file --output path/to/a/target/directory --watch
```

This command will scan all your codes and make some necessray modifications, copying all files in the direcotry where your entry file is recursively to the target direcotry. **Still, the outputs are written in ES6 and JSX syntax, not much different from your source codes but a few essential parts.**


3.Do whatever you want to do tackle the outputs like webpack or gulp just to run your app! Good Luck!🎉

### API
react-pocket tries to make its APIs resemble those of jquery. More APIs are being developed. Here are some available now.

---

```js
$(specifier)
```
Initialize the instance. The expecting param could be the name of a class or you can just pass a ```this``` in your class declaration (see the [example](https://github.com/captainwz/react-pocket/blob/master/example/src/Card.js#L13)).

* ```specifier```: ```String|Object``` (required) 

---

```js
$(specifier).get(index)
```

Get the right instance by the given index if there are a few.

* ```index```: ```Number``` (required) 

---

```js
$(specifier).getProp(name)
```
Get value of the property by a name. If it is not given, all properties should return.

* ```name```: ```String``` (optional)

---

```js
$(specifier).setProp(props)
```
Set properties.

* ```props```: ```Object``` (required) 

---

```js
$(specifier).getState(name)
```
Get value of the state by a name. If it is not given, all states should return.

* ```name```: ```String``` (optional)

---

### License

MIT








