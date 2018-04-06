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
        this.length = this.objArr.length;
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

        return this;

    }

    getProp (name) {

        if (!this.objArr || !this.objArr.length) {
            throw new Error('Can\'t get prop from an empty instance')
        }

        if (this.objArr.length > 1) {
            console.warn('There are more than one instances, only read the property from the first one');
        }

        if (this.objArr[0].ref) {

            if (typeof name == 'string') {

                return this.objArr[0].ref.props[name];
                
            } else {

                return this.objArr[0].ref.props

            }

        } else if (this.objArr[0].props) {

            if (typeof name == 'string') {

                return this.objArr[0].props[name];
                
            } else {

                return this.objArr[0].props

            }

        } else {

            throw new Error('Can\'t call getProp because failed to get props');

        }


    }

    getState (name) {

        if (!this.objArr || !this.objArr.length) {
            throw new Error('Can\'t get prop from an empty instance')
        }

        if (this.objArr.length > 1) {
            console.warn('There are more than one instances, only read the property from the first one');
        }

        if (this.objArr[0].ref) {

            if (typeof name == 'string') {

                return this.objArr[0].ref.state[name];
                
            } else {

                return this.objArr[0].ref.state

            }

        } else {

            throw new Error('Can\'t call getState because react instance reference is missing');

        }


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
        this.length = 1;

        return this;

    }

    /* Deprecated
    setState (state) {

        if (typeof prop != 'object') {
            throw new Error('Call setState with wrong argument of type:' + (typeof prop))
        }

        this.objArr.forEach(obj => {

            if (!obj.ref) {

                throw new Error('Can\'t call setSate because react instance reference is undefined');

            } else {

                obj.ref.setState(Object.assign(Object.create(null), state));

            }

        })

        return this;

    }*/

}

const $func = (specifier) => {
    return new $class(specifier);
}

export default $func;