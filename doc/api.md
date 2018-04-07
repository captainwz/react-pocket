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