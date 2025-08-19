global.$state = function(initial) {
        const value = initial;
        return new Proxy({ value }, {
                get(target, prop) {
                        return target.value[prop];
                },
                set(target, prop, val) {
                        target.value[prop] = val;
                        return true;
                }
        });
};

global.mockLocalStorage = {
        storage: {},
        setItem(key: string, value: string) {
                this.storage[key] = value;
        },
        getItem(value: string) {
                return this.storage[value];
        },
        removeItem(key: string) {
                delete this.storage[key];
        },
        clear() {
                this.storage = {};
        },
} as any as Storage;

