import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

import { storeProfile, saveState, } from './StoreProfile';
import { Army } from '../src/Army';

export class Profile {
    name : string;

    constructor(name: string) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setName(y: string) {
        this.name = y;
    }
}
