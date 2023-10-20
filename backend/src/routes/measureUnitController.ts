import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function measureUnitController(server: FastifyInstance) {
    // CRUD Unidades de medidas
    server.get('/unidadeMedida', async () => {        
        const unidadeMedida = await prisma.tbunidademedida.findMany()
    
        return unidadeMedida
    })
    
    server.post('/unidadeMedida/add', async (request) => {
        const postBody = z.object({
            siglaun: z.string(),
            nomeunidade: z.string(),
        })
    
        const {
            siglaun,
            nomeunidade,
        } = postBody.parse(request.body)
    
        const newUnidadeMedida = await prisma.tbunidademedida.create({
            data: {
                siglaun,
                nomeunidade,
            },
        })
    
        return newUnidadeMedida
    })        
    
    server.put('/unidadeMedida/update', async (request) => {
        const putBody = z.object({
            idunidade: z.number(),
            siglaun: z.string(),
            nomeunidade: z.string()
        })
    
        const {
            idunidade,
            siglaun,
            nomeunidade
        } = putBody.parse(request.body)

        const unidadeMedidaUpdate = await prisma.tbunidademedida.update({
            where: {
                idunidade: idunidade,
            },
            data: {
                siglaun,
                nomeunidade
            },
        })
        return unidadeMedidaUpdate ?  unidadeMedidaUpdate :  {}
    })

    server.delete('/unidadeMedida/delete/:idunidade', async (request) => {
        const idParam = z.object({
            idunidade: z.string(),
        })
    
        const { idunidade } = idParam.parse(request.params)
        const UnidadeMedidaID = Number(idunidade)
    
        const unidadeMedidaDeleted = await prisma.tbunidademedida.delete({
            where: {
                idunidade: UnidadeMedidaID,
            },
        })
    
        return unidadeMedidaDeleted
    }) 
}
