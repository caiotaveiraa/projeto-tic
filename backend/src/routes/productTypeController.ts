import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function productTypeController(server: FastifyInstance) {
    // CRUD TIPOS DE PRODUTOS

    server.get('/tiposProdutos', async () => {        
        const tiposProdutos = await prisma.tbtiposprodutos.findMany()
    
        return tiposProdutos
    })
    
    server.post('/tiposProdutos/add', async (request) => {
        const bodyData = z.object({
            nometipprod: z.string()
        })
    
        const {nometipprod} = bodyData.parse(request.body)
    
        const newTipProd = await prisma.tbtiposprodutos.create({
            data: {
                nometipprod,
            },
        })
    
        return newTipProd
    })        
    
    server.put('/tiposProdutos/update', async (request) => {
        const putBody = z.object({
            idtipprod: z.number(),
            nometipprod: z.string()
        })
    
        const {idtipprod,nometipprod} = putBody.parse(request.body)

        const tipoProdutoUpdate = await prisma.tbtiposprodutos.update({
            where: {
                idtipprod: idtipprod,
            },
            data: {
                nometipprod
            },
        })
        return tipoProdutoUpdate ?  tipoProdutoUpdate :  {}
    })

    server.delete('/tiposProdutos/delete/:idtipprod', async (request) => {
        const idParam = z.object({
            idtipprod: z.string(),
        })
    
        const { idtipprod } = idParam.parse(request.params)
        const tipProdId = Number(idtipprod)
    
        const tipProdDeleted = await prisma.tbtiposprodutos.delete({
            where: {
                idtipprod: tipProdId,
            },
        })
    
        return tipProdDeleted
    })
}
