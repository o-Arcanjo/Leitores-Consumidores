export default class AcessoConcorrenteAoBuffer {
    constructor(legthBuffer = 5, Mutex, Semaphore){
        this.criticalRegion = new Mutex();
        this.emptySlots = new Semaphore(legthBuffer);
        this.fullSlots = new Semaphore(0);
        this.buffer = [];
    }

   async produzir(item){
        await this.emptySlots.adquire();
        try{
            await this.criticalRegion.adquire();
            try{
                this.buffer.push(item);
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
                item = this.buffer.shift();
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