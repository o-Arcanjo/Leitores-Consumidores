export default class AcessoConcorrenteAoBuffer {
    constructor(lengthBuffer = 5, Mutex, Semaphore){
        this.criticalRegion = new Mutex();
        this.lengthBuffer = lengthBuffer;
        this.emptySlots = new Semaphore(this.lengthBuffer);
        this.fullSlots = new Semaphore(0);
        this.buffer = new Array(this.lengthBuffer);
        this.in = 0;
        this.out = 0;
    }

   async produzir(item){
        await this.emptySlots.adquire();
        try{
            await this.criticalRegion.adquire();
            try{
                this.buffer[this.in % this.lengthBuffer] = item;
                this.in++;
            }finally{
                await this.criticalRegion.release();
            }
        }catch(error){
            await this.emptySlots.release();
            throw error;
        }

        await this.fullSlots.release();     
    }

    async consumir() {
        await this.fullSlots.adquire();
        let item;
        
        try {
            await this.criticalRegion.adquire();
            try {
                item = this.buffer[this.out % this.lengthBuffer];
                this.out++;
            } finally {
                await this.criticalRegion.release();
            }
        } catch (error) {
            await this.fullSlots.release();
            throw error;
        }
        
        await this.emptySlots.release();
        return item;
    }
}   
