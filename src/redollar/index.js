const getObjArr = (specifier) => {

    if (typeof specifier == 'object') {

        if (specifier.props && specifier.props.$self) {
            
            return [specifier.props.$self]
        
        } else {

            throw new Error('Failed to init the instance with the argument of this/object');

        }

    } else if (typeof specifier == 'string') {

        let arr = [];

        const search = (o) => {

            if (o.className == specifier) {
                arr.push(o);
            }

            if (o.items && o.items.length) {
                o.items.forEach(item => {
                    search(item);
                })
            }

        }

        if (!global.$obj) {
            throw new Error('Prop building failed');
        }

        search(global.$obj);

        return arr;

    } else {

        throw new Error('Failed to init the instance with the argument of ' + (typeof specifier));
        
    }


}

class $class {
    
    constructor (specifier) {

        this.objArr = getObjArr(specifier);
        this.cursorIndex = undefined;
    
    }

    setProp (prop) {

        if (typeof prop != 'object') {
            throw new Error('Call setProp with wrong argument of type:' + (typeof prop))
        }

        Object.keys(prop).forEach(name => {

            this.objArr.forEach(obj => {

                obj.props[name] = prop[name];

            })

        })

        global.$obj.wrappedRef.setState(global.$obj);

    }

    getProp (name) {

        if (typeof name != 'string') {
            throw new Error('Call getProp with wrong argument of type:' + (typeof name))
        }

        if (!this.objArr || !this.objArr.length) {
            throw new Error('Can\'t get prop from an empty instance')
        }

        if (this.objArr.length > 1) {
            console.warn('There are more than one instances, only read the property from the first one');
        }

        return this.objArr[0].props[name];

    }

    get (num) {

        if (typeof num != 'number' || !/^\d$/.test(num)) {

            throw new Error('Call get with wrong argument of type:' + (typeof name))

        }

        let obj = this.objArr[parseInt(num)];

        if (!obj) {

            throw new Error('Can\'t get the instance with the index: ' + num);

        }

        this.objArr = [obj];

        return this;

    }

}

const $func = (specifier) => {
    return new $class(specifier);
}

export default $func;