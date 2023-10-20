import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function stockLocationsController(server: FastifyInstance) {
    server.get('/locaisEstoque', async () => {
        const locaisEstoque = await prisma.tblocais.findMany()

        return locaisEstoque
    })

    server.post('/locaisEstoque/add', async (request) => {
        const bodyData = z.object({
            nomelocal : z.string()
        })

        const {nomelocal} = bodyData.parse(request.body)

        const newLocalEstoque = await prisma.tblocais.create({
            data: {
                nomelocal
            },
        })

        return newLocalEstoque
    })

    server.put('/locaisEstoque/update', async (request) => {
        const putBody = z.object({
            idlocal : z.number(),
            nomelocal : z.string()
        })

        const {idlocal,
              nomelocal} = putBody.parse(request.body)

        const locaisUpdate = await prisma.tblocais.update({
            where: {
                idlocal : idlocal,
            },
            data: {
                nomelocal
            },
        })
        return locaisUpdate ?  locaisUpdate :  {}
    })

    server.delete('/locaisEstoque/delete/:LocalId', async (request) => {
        const idParam = z.object({
            LocalId: z.string(),
        })

        const { LocalId } = idParam.parse(request.params)
        const idlocal = Number(LocalId)

        const locaisDeleted = await prisma.tblocais.delete({
            where: {
                idlocal: idlocal,
            },
        })

        return locaisDeleted
    })
}
