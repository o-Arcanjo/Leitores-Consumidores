import AcessoConcorrenteAoBuffer from './AcessoConcorrenteAoBuffer.js';
import Mutex from './Mutex.js';
import Semaphore from './Semaphore.js';

async function simular(){
     const acessoAoBufferCompartilhado = new AcessoConcorrenteAoBuffer(5, Mutex, Semaphore);
     const produtores = [1,2,3].map(id => produzir(id, acessoAoBufferCompartilhado));
     const consumidores = [1,2,3].map(id => consumir(id, acessoAoBufferCompartilhado));

     await Promise.all([...produtores, ...consumidores]);
}

async function consumir(id, acessoAoBufferCompartilhado){
    for(let i = 0; i < 3; i++){
        const item = await acessoAoBufferCompartilhado.consumir();
        console.log(`[CONSUMIDOR ${id}] Consumiu: ${item}`);
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    }
}

async function produzir(id, acessoAoBufferCompartilhado){
    for(let i = 0; i < 3; i++){
        const item = `Item ${i} produzido por ${id}`;
        await acessoAoBufferCompartilhado.produzir(item);
        console.log(`[PRODUTOR ${id}] Produziu: ${item}`);
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    }
}

simular().catch(console.error);