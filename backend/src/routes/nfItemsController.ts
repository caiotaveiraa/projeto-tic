import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function nfItemsController(server: FastifyInstance) {
//CRUD TB NFITENS

server.get('/nfitens', async () => {
    const nfitems = await prisma.tbnfitens.findMany()
    return nfitems
})

server.post('/nfitens/add', async (request) => {
    const putBody = z.object({
        idnf: z.number(),
        idmovimento: z.number(),
        seqitem: z.number(),
        idproduto: z.number(),
        vlrunitario: z.number(),
        quantidade: z.number(),
        vlrtotitem: z.number(),
    })

    const {
        idnf,
        idmovimento,
        seqitem,
        idproduto,
        vlrunitario,
        quantidade,
        vlrtotitem //ADICIONAR ESSE CAMPO
    } = putBody.parse(request.body)

    //Verifica se existe id do local
    const conferenf = await prisma.tbnf.findUnique({
        where: { idnf: idnf },
        });

        //Verifica se existe id do produto
    const conferemovimento = await prisma.tbmovimentos.findUnique({
        where: { idmovimento: idmovimento },
        });

    const confereproduto = await prisma.tbprodutos.findUnique({
        where: { idproduto: idproduto },
        });
    
    if(conferenf && conferemovimento && confereproduto){
        const newNfitem = await prisma.tbnfitens.create({
            data: {
                idnf,
                idmovimento,
                seqitem,
                idproduto,
                vlrunitario,
                quantidade,
                vlrtotitem
            },
        })
    
        return newNfitem
    }
    else{
        return(`Nota fiscal, movimento ou produto não encontrados!`)
    }
})

server.put('/nfitens/update', async (request) => {
    const putBody = z.object({
        idnf: z.number(),
        idmovimento: z.number(),
        seqitem: z.number(),
        idproduto: z.number(),
        vlrunitario: z.number(),
        quantidade: z.number(),
        vlrtotitem: z.number(),
    })
    
    const { 
        idnf,
        idmovimento,
        seqitem,
        idproduto,
        vlrunitario,
        quantidade,
        vlrtotitem
    } = putBody.parse(request.body)

    //Verifica se existe id de local
    const conferenf = await prisma.tbnf.findUnique({
        where: { idnf: idnf },
        });

    //Verifica se existe id do produto
    const conferemovimento = await prisma.tbmovimentos.findUnique({
        where: { idmovimento: idmovimento },
        });

    const confereproduto = await prisma.tbprodutos.findUnique({
        where: { idproduto: idproduto },
        });
    
    if(conferenf && conferemovimento && confereproduto){
        const itemUpdate = await prisma.tbnfitens.update({
            where: {
                idnf_seqitem_idproduto: {
                    idnf: idnf,
                    seqitem: seqitem,
                    idproduto: idproduto
                }
            },
            data: {
                idmovimento,
                vlrunitario,
                quantidade,
                vlrtotitem
            },
        })
        return itemUpdate ?  itemUpdate :  {}
    }
    else{
        return(`Nota fiscal, movimento ou produto não encontrados!`)
    }

})

server.delete('/nfitens/delete/:nfId/:seqitem/:produtoId', async (request) => {
    const idParam = z.object({
        idnf: z.string(),
        seqitem: z.string(),
        idproduto: z.string()
    })

    const { idnf, seqitem, idproduto } = idParam.parse(request.params)

    const nfid = Number(idnf)
    const seqItem = Number(seqitem)
    const idProduto = Number(idproduto)

    const itemApagado = await prisma.tbnfitens.delete({
        where: {
            idnf_seqitem_idproduto:{
                idnf: nfid,
                seqitem: seqItem,
                idproduto: idProduto
            },
        },
    })

    return itemApagado
})
}
