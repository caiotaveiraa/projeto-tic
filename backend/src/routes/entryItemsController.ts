import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function entryItemsController(server: FastifyInstance) {
//CRUD tbmovitens 
server.get('/movimentoItens', async () => {
    const movimentosItens = await prisma.tbmovitens.findMany()

    return movimentosItens
})

server.post('/movimentoItens/add', async (request) => {
    const putBody = z.object({
        seqitem: z.number(),
        idmovimento: z.number(),
        idproduto: z.number(),
        idlocal: z.number(),
        dtinc: z.date(),
        quantidade: z.number()
    })

    const {
        seqitem,
        idmovimento,
        idproduto,
        idlocal,
        dtinc,
        quantidade
    } = putBody.parse(request.body)

    //Verifica se existe id do local
    const confereLocal = await prisma.tblocais.findUnique({
        where: { idlocal: idlocal },
      });

    //Verifica se existe id do produto
    const dadosProduto = await prisma.tbprodutos.findUnique({
        where: { idproduto: idproduto },
      });

    //verififca se existe id da Tmovimentos
    const dadosMovimento = await prisma.tbmovimentos.findUnique({
        where: { idmovimento: idmovimento },
      });

    if(confereLocal && dadosProduto && dadosMovimento){
        const newMovimentoItens = await prisma.tbmovitens.create({
            data: {
                seqitem,
                idmovimento,
                idproduto,
                idlocal,
                dtinc,
                quantidade
            },
        })
        //Quantidade de estoque atual do produto
        const dadosEstoque = await prisma.tbestoque.findUnique({
            where: { idestoque_idproduto: {idestoque: 1, idproduto: idproduto} },
        });
        if (dadosMovimento.tipmov === 'EN') {
            // Se for uma entrada, adicione a quantidade ao estoque
            await prisma.tbestoque.updateMany({
            where: { idproduto: idproduto },
            data: {
                quantidade: {
                increment: quantidade,
                },
            },
            });
        } else if (dadosMovimento.tipmov === 'SA') {
            // Se for uma saída, subtraia a quantidade do estoque
            //Verifica se a quantidade passada é valida
            if((Number(dadosProduto.quantminima) >= Number(dadosEstoque?.quantidade) - quantidade) && (Number(dadosEstoque?.quantidade) >= quantidade))
            {
                await prisma.tbestoque.updateMany({
                    where: { idproduto: idproduto  },
                    data: {
                        quantidade: {
                        decrement: quantidade,
                        },
                    },
                });
            }
            else {
                return(`Quantidade inválida`)
            }
        }
        return newMovimentoItens
    }
    else{
        return(`Local de estoque, produto ou movimento não encontrados`)
    }
})

server.put('/movimentoItens/update', async (request) => {
    const putBody = z.object({
        seqitem: z.number(),
        idmovimento: z.number(),
        idproduto: z.number(),
        idlocal: z.number(),
        dtinc: z.date(),
        quantidade: z.number()
    })

    const { seqitem,
            idmovimento,
            idproduto,
            idlocal,
            dtinc,
            quantidade} = putBody.parse(request.body)

    //Verifica se existe id de local
    const confereLocal = await prisma.tblocais.findUnique({
        where: { idlocal: idlocal },
      });

    //Verifica se existe id de tipo do produto
    const confereProduto = await prisma.tbprodutos.findUnique({
        where: { idproduto: idproduto },
      });

    //verififca se existe id da Tmovimentos
    const confereMovimentoId = await prisma.tbmovimentos.findUnique({
        where: { idmovimento: idmovimento },
      });

    if(confereLocal && confereProduto && confereMovimentoId){
        const movimentosItensUpdate = await prisma.tbmovitens.update({
            where: {
                idmovimento_seqitem_idproduto: {
                    idmovimento: idmovimento,
                    seqitem: seqitem,
                    idproduto: idproduto
                }
            },
            data: {
                idlocal,
                dtinc,
                quantidade                
            },
        })
        return movimentosItensUpdate ?  movimentosItensUpdate :  {}
    }
    else{
        return(`Local de estoque, produto ou movimento não encontrados!`)
    }
})

server.delete('/movimentoItens/delete/:idmovimento/:seqitem/:idproduto', async (request) => {
    const idParam = z.object({
        idmovimento: z.string(),
        seqitem: z.string(),
        idproduto: z.string()
    })

    const { idmovimento, seqitem, idproduto  } = idParam.parse(request.params)

    const seqItem = Number(seqitem)
    const idMovimento = Number(idmovimento)
    const idProduto = Number(idproduto)

    const movimentoItemDeleted = await prisma.tbmovitens.delete({
        where: {
            idmovimento_seqitem_idproduto:
            {
                idmovimento: idMovimento,
                seqitem: seqItem,
                idproduto: idProduto
            },
        },
    })

    return movimentoItemDeleted
})
}
