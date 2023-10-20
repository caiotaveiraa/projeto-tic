import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function stockController(server: FastifyInstance) {
    //CRUD - ESTOQUE (Conectada a outras entidades)

    server.get('/estoque', async () => {
        const estoque = await prisma.tbestoque.findMany()
        return estoque
    })
    
    server.post('/estoque/add', async (request) => {
        const putBody = z.object({
            idproduto: z.number(),
            idlocal: z.number(),
            quantidade: z.number(),
            dtinc: z.date()
        })
    
        const {
            idproduto,
            idlocal,
            quantidade,
            dtinc
        } = putBody.parse(request.body)
    
        //Verifica se existe id do local
        const confereLocal = await prisma.tblocais.findUnique({
            where: { idlocal: idlocal },
            });
    
        //Verifica se existe id do produto
        const confereProduto = await prisma.tbprodutos.findUnique({
            where: { idproduto: idproduto },
            });
        
        if(confereLocal && confereProduto){
            const newEntry = await prisma.tbestoque.create({
                data: {
                    idproduto,
                    idlocal,
                    quantidade,
                    dtinc
                },
            })
        
            return newEntry
        }
        else{
            return(`Produto ou local de estoque não encontrados!`)
        }
    })
    
    server.put('/estoque/update', async (request) => {
        const putBody = z.object({
            idestoque: z.number(),
            idproduto: z.number(),
            idlocal: z.number(),
            quantidade: z.number(),
            dtinc: z.date()
        })
        
        const { idestoque,
                idproduto,
                idlocal,
                quantidade,
                dtinc} = putBody.parse(request.body)
    
        //Verifica se existe id de local
        const confereLocal = await prisma.tblocais.findUnique({
            where: { idlocal: idlocal },
            });
    
        //Verifica se existe id do produto
        const confereProduto = await prisma.tbprodutos.findUnique({
            where: { idproduto: idproduto },
            });
                
        if(confereProduto && confereLocal){
            const estoqueUpdate = await prisma.tbestoque.update({
                where: {
                    idestoque_idproduto: {
                        idestoque: idestoque,
                        idproduto: idproduto
                    }
                },
                data: {
                    idlocal,
                    quantidade,
                    dtinc
                },
            })
            return estoqueUpdate ?  estoqueUpdate :  {}
        }
        else{
            return(`Produto ou local de estoque não encontrados!`)
        }

    })
    
    server.delete('/estoque/delete/:estoqueId/:prodId', async (request) => {
        const idParam = z.object({
            estoqueId: z.string(),
            prodId: z.string()
        })
    
        const { estoqueId, prodId } = idParam.parse(request.params)
    
        const idestoque = Number(estoqueId)
        const idprod = Number(prodId)
    
        const estoqueApagado = await prisma.tbestoque.delete({
            where: {
                idestoque_idproduto: {
                    idestoque: idestoque,
                    idproduto: idprod
                },
            },
        })
    
        return estoqueApagado
    })
}
