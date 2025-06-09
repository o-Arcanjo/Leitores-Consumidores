export default class Semaphore {
    constructor(count){
        this.count = count; 
        this.espera = [];
    }

    adquire(){
        if(this.count <= 0){
            return new Promise((resolve) => this.espera.push(resolve));
        }
        this.count--;
        return Promise.resolve();
    }

    release(){
        if(this.espera.length > 0){
            const resolve = this.espera.shift();
            return resolve();
        }
        this.count++;
    }
}

