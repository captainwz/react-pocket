## Redollar 
[![npm version](https://img.shields.io/npm/v/redollar.svg?style=flat-square)](https://www.npmjs.com/package/redollar)

A totally new pattern that enables you to use intimate querying APIs in React. Just write codes like ```$('MyComponent').setProp({foo: 'bar'})``` in anywhere.

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
**What if you want to change the number of Counter just in ```Card.js```. Redollar offers you ability to do so!** Here are the code examples.
```jsx
/*Card.js*/

import $ from 'redollar';
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
/*Counter.js*/

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
**Redollar is just on its experimental stage** so current procedure may not be that concise.

1.Write your app in **Redollar Pattern**. Here are some constraints you should notice. In order to follow them readily, just take a look at the [example](https://github.com/captainwz/redollar/tree/master/example/src) as well.
> * Your root component's class must extend $.
> * Any component's class whose instance you want to use with $ as ```$('OneComponent')``` later must extend $.
> * You can declare component's properties by declaring class method ```defaultProp``` which should return an object.
> * If you pass a property in jsx element declaration eg ```<OneComponent  foo="bar" />```, it'll be a permenant assignment and you are not able to change it by ```$('OneComponent').setProp({foo: 'tux'})```. It is a rational strategy.
> * You can't contain any element herits from $ in a standard React component's class declaration. 
> * Make sure your entry file is in the top direcotry.
> * Please use ```export default``` instead of  ```module.exports``` to export your class.


2.Then use **Redollar CLI** to transform the codes. You may use
```
./node_modules/.bin/redollar --entry path/to/your/entry/file --output path/to/a/target/directory
```
**Also, you can just monitor file changes just by adding ```--watch```**
```
./node_modules/.bin/redollar --entry path/to/your/entry/file --output path/to/a/target/directory --watch
```

This command will scan all your codes and make some necessray modifications, copying all files in the direcotry where your entry file is recursively to the target direcotry. **Still, the outputs are written in ES6 and JSX syntax, not much different from your source codes but a few essential parts.**


3.Do whatever you want to do tackle the outputs like webpack or gulp just to run your app! Good Luck!🎉

### API
Redollar tries to make its APIs resemble those of jquery. More APIs are being developed. Here are some available now.

---

```js
$(specifier)
```
Initialize the instance. The expecting param could be the name of a class or you can just pass a ```this``` in your class declaration (see the [example](https://github.com/captainwz/redollar/blob/master/example/src/Card.js#L14)).

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

### Lisence

MIT








