### Usage
**react-pocket is just on its experimental stage** so current procedure may not be that concise.

1.Write your app in **react-pocket Pattern**. Here are some constraints you should notice. In order to follow them readily, just take a look at the [example](https://github.com/captainwz/react-pocket/tree/master/example/src) as well.
> * Your root component's class must extend $.
> * Any component's class whose instance you want to use with $ as ```$('OneComponent')``` later must extend $.
> * You can declare component's properties by declaring class method ```defaultProp``` which should return an object.
> * If you pass a property in jsx element declaration eg ```<OneComponent  foo="bar" />```, it'll be a permenant assignment and you are not able to change it by ```$('OneComponent').setProp({foo: 'tux'})```. It is a rational strategy.
> * You can't contain any element herits from $ in a standard React component's class declaration. 
> * Make sure your entry file is in the top direcotry.


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