import Semaphore from './Semaphore.js';
export default class Mutex extends Semaphore {
    constructor(){
        super(1);
    }
}