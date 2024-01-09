'use strict';

import React from "react";
import { Dispatch, SetStateAction } from "react";

class Contacts<S> {
    private name: string;
    private namespace: string;
    private setStateFun: Dispatch<SetStateAction<S>>;
    private initialState: S;
    constructor(initialState: S, name: string, setStateFun: Dispatch<SetStateAction<S>>, namespace: string) {
        this.initialState = initialState;
        this.name = name;
        this.namespace = namespace;
        this.setStateFun = setStateFun;
    }
    public set = (initialState: S): void => {
        this.initialState = initialState;
        this.setStateFun(initialState);
    };
    public get = (): S => {
        return this.initialState;
    }
}
class Communications {
    private readonly storeMap = new Map<string, Contacts<any>>();
    private namespace: string;
    constructor(namespace: string) {
        this.namespace = namespace;
    }
    public set = (name: string, initialState: any, setFunc: Dispatch<SetStateAction<any>>): void => {
        this.storeMap.set(this.buildKey(name), new Contacts(initialState, name, setFunc, this.namespace));
    }
    public get = (name: string): Contacts<any> | undefined => {
        return this.storeMap.get(this.buildKey(name));
    }
    private buildKey = (name: string): string => {
        return this.namespace + "_" + name;
    }
}
export class Store {
    private namespace: string;
    private phone: Communications;
    constructor(namespace: string) {
        this.namespace = namespace;
        this.phone = new Communications(this.namespace);
    }
    public useOpenState = <S>(initialState: S | (() => S), name: string): [S, Dispatch<SetStateAction<S>>] => {
        const [field, setField] = React.useState(initialState);
        this.phone.set(name, field, setField);
        return [field, setField];
    }
    public callState = <S>(name: string): Function => {
        const mapValue = this.phone.get(name);
        if (!mapValue) return function () { };
        const contacts: Contacts<S> = mapValue;
        return function (exec: S) {
            if (typeof exec === 'function') {
                contacts.set(exec(contacts.get()));
            } else {
                contacts.set(exec);
            }
        }
    }
}

// defalut state function
const store = new Store("__default");
export default store;
export const useOpenState = store.useOpenState;
export const callState = store.callState;