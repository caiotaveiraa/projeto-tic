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
            idmovimento: z.number(),
            idproduto: z.number(),
            idlocal: z.number(),
            quantidade: z.number()
        })

        const {
            idmovimento,
            idproduto,
            idlocal,
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

        if (confereLocal && dadosProduto && dadosMovimento) {
            const newMovimentoItens = await prisma.tbmovitens.create({
                data: {
                    idmovimento,
                    idproduto,
                    idlocal,
                    dtinc: new Date(),
                    quantidade
                },
            })
            //MANIPULANDO QUANTIDADES EM ESTOQUE
            //VERIFICA SE O PRODUTO A SER INSERIDO  JA EXISTE EM ESTOQUE NO LOCAL INFORMADO
            const dadosEstoque = await prisma.tbestoque.findMany({
                where: { idproduto: idproduto, idlocal: idlocal },
            })
            //PRODUTO NAO EXISTE NAQUELE LOCAL, CRIE UM REGISTRO COM A QUANTIDADE EM ESTOQUE INFORMADA
            if (dadosEstoque.length === 0) {
                await prisma.tbestoque.create({
                    data: {
                        idproduto: idproduto,
                        idlocal: idlocal,
                        dtinc: new Date(),
                        quantidade: quantidade,
                    }
                })
            }
            else { //CASO O PRODUTO JA EXISTA NAQUELE LOCAL, ATUALIZE A QUANTIDADE EM ESTOQUE
                if (dadosMovimento.tipmov === 'EN') {
                    // Se for uma entrada, adicione a quantidade ao estoque
                    await prisma.tbestoque.updateMany({
                        where: { idproduto: idproduto, idlocal: idlocal },
                        data: {
                            quantidade: {
                                increment: quantidade,
                            },
                        },
                    });
                } else if (dadosMovimento.tipmov === 'SA') {
                    // Se for uma saída, subtraia a quantidade do estoque
                    //Verifica se a quantidade passada é valida
                    const quantidadeNoEstoque = dadosEstoque.length > 0 ? Number(dadosEstoque[0].quantidade) : 0;
                    if (quantidadeNoEstoque > quantidade && quantidadeNoEstoque - quantidade >= 0) {
                        await prisma.tbestoque.updateMany({
                            where: { idproduto: idproduto, idlocal: idlocal },
                            data: {
                                quantidade: {
                                    decrement: quantidade,
                                },
                            },
                        });
                    }
                    else {
                        return (`Quantidade inválida`)
                    }
                }
            }
            return newMovimentoItens
        }
        else {
            return (`Local de estoque, produto ou movimento não encontrados`)
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
            quantidade } = putBody.parse(request.body)

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

        if (confereLocal && confereProduto && confereMovimentoId) {
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
            return movimentosItensUpdate ? movimentosItensUpdate : {}
        }
        else {
            return (`Local de estoque, produto ou movimento não encontrados!`)
        }
    })

    server.delete('/movimentoItens/delete/:idmovimento/:seqitem/:idproduto', async (request) => {
        const idParam = z.object({
            idmovimento: z.string(),
            seqitem: z.string(),
            idproduto: z.string()
        })

        const { idmovimento, seqitem, idproduto } = idParam.parse(request.params)

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
