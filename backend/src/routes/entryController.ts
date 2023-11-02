import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function entryController(server: FastifyInstance) {
 // CRUD tbmovimentos

 server.get('/movimentos', async () => {
    const movimentos = await prisma.tbmovimentos.findMany()

    return movimentos
})

server.post('/movimentos/add', async (request) => {
    const bodyData = z.object({
        tipmov : z.string(),
        idfor: z.number(),
        idusuario_alteracao: z.number()
    })

    const dtcriacao = new Date();
    const dtinc = dtcriacao

    const {tipmov, idfor, idusuario_alteracao} = bodyData.parse(request.body)

    //Verifica se existe id do fornecedor
    const conferefornecedor = await prisma.tbfornecedores.findUnique({
        where: { idfor: idfor },
        });
        
    //Verifica se existe id do usuario
    const confereuser = await prisma.tbusuarios.findUnique({
        where: { idusuario: idusuario_alteracao },
        });
    
    if(conferefornecedor && confereuser) {
        const newMovimento = await prisma.tbmovimentos.create({
            data: {
                tipmov,
                idfor,
                idusuario_alteracao,
                dtinc
            },
        })
        return newMovimento
    }
    else {
        return(`Fornecedor ou usuário nao encontrados!`)
    }
})

server.put('/movimentos/update', async (request) => {
    const putBody = z.object({
        idmovimento : z.number(),
        tipmov : z.string(),
        idfor: z.number(),
        idusuario_alteracao: z.number(),
        dtinc: z.date()
    })

    const {idmovimento,
        tipmov,
        idfor,
        idusuario_alteracao,
        dtinc} = putBody.parse(request.body)

    const conferefornecedor = await prisma.tbfornecedores.findUnique({
        where: { idfor: idfor },
        });
            
    //Verifica se existe id do usuario
    const confereuser = await prisma.tbusuarios.findUnique({
        where: { idusuario: idusuario_alteracao },
        });
        
    if(conferefornecedor && confereuser) {
        const movimentosUpdate = await prisma.tbmovimentos.update({
            where: {
                idmovimento : idmovimento,
            },
            data: {
                idmovimento,
                tipmov,
                idfor,
                idusuario_alteracao,
                dtinc
            },
        })
        return movimentosUpdate ?  movimentosUpdate :  {}
    }
    else {
        return(`Fornecedor ou usuário nao encontrados!`)
    }
})

server.delete('/movimentos/delete/:movID', async (request) => {
    const idParam = z.object({
        movID: z.string(),
    })

    const { movID } = idParam.parse(request.params)
    const idmov = Number(movID)

    const movimentoDeleted = await prisma.tbmovimentos.delete({
        where: {
            idmovimento: idmov,
        },
    })

    return movimentoDeleted
})
}
