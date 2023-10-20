import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function compositionController(server: FastifyInstance) {
//CRUD TB PROD COMPOSICAO

server.get('/composicao', async () => {
    const composicoes = await prisma.tbprodcomposicao.findMany()
    return composicoes
})

server.post('/composicao/add', async (request) => {
    const putBody = z.object({
        idproduto: z.number(),
        idprodutocomp: z.number(),
        quantidade: z.number(),
    })

    const {
        idproduto,
        idprodutocomp,
        quantidade //ADICIONAR ESSE CAMPO
    } = putBody.parse(request.body)
    
    const produtos = [idproduto, idprodutocomp]
        //Verifica se existe id do produto
    const confereprodutos = await prisma.tbprodutos.findMany({
        where: {
            idproduto: {
                in: produtos
            }
        },
        });
    
    if(confereprodutos.length === produtos.length){
        const newComp = await prisma.tbprodcomposicao.create({
            data: {
                idproduto: idproduto,
                idprodutocomp: idprodutocomp,
                quantidade: quantidade
            },
        })
    
        return newComp
    }
    else{
        return(`Produtos não encontrados!`)
    }
})

server.put('/compsicao/update', async (request) => {
    const putBody = z.object({
        idcomp: z.number(),
        idproduto: z.number(),
        idprodutocomp: z.number(),
        quantidade: z.number(),
    })
    
    const {
        idcomp,
        idproduto,
        idprodutocomp,
        quantidade
    } = putBody.parse(request.body)

    const produtos = [idproduto, idprodutocomp]

    //Verifica se existe id do produto
    const confereprodutos = await prisma.tbprodutos.findMany({
        where: {
            idproduto: {
                in: produtos
            }
        },
        });
    
    if(confereprodutos.length === produtos.length){
        const compUpdate = await prisma.tbprodcomposicao.update({
            where: {
                idcomp_idproduto_idprodutocomp: {
                    idcomp: idcomp,
                    idproduto: idproduto,
                    idprodutocomp: idprodutocomp
                }
            },
            data: {
                quantidade
            },
        })
        return compUpdate ?  compUpdate :  {}
    }
    else{
        return(`Produtos não encontradosS!`)
    }

})

server.delete('/composicao/delete/:compId/:prodId/:prodcompId', async (request) => {
    const idParam = z.object({
        idcomp: z.string(),
        idproduto: z.string(),
        idprodutocomp: z.string()
    })

    const { idcomp, idproduto, idprodutocomp } = idParam.parse(request.params)

    const compId = Number(idcomp)
    const prodId = Number(idproduto)
    const prodcompId = Number(idprodutocomp)

    const composicaoApagada = await prisma.tbprodcomposicao.delete({
        where: {
            idcomp_idproduto_idprodutocomp: {
                idcomp: compId,
                idproduto: prodId,
                idprodutocomp: prodcompId
            },
        },
    })

    return composicaoApagada
})

}
