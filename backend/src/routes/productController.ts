import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function productController(server: FastifyInstance) {
     //CRUD - Produtos (Conectada a outras entidades)

     server.get('/produtos', async () => {
        const produtos = await prisma.tbprodutos.findMany()

        return produtos
    })

    server.post('/produtos/add', async (request) => {
        const putBody = z.object({
            nomeprod: z.string(),
            idtipprod: z.number(),
            idunidade: z.number(),
            quantminima: z.number()
        })

        const {
            nomeprod,
            idtipprod,
            idunidade,
            quantminima,
        } = putBody.parse(request.body)

        //Verifica se existe id de unidade
        const confereIdUnidade = await prisma.tbunidademedida.findUnique({
            where: { idunidade: idunidade },
          });

        //Verifica se existe id de tipo do produto
        const confereIdTipoProd = await prisma.tbtiposprodutos.findUnique({
            where: { idtipprod: idtipprod },
          });

        if(confereIdTipoProd && confereIdUnidade) {
            const newProduto = await prisma.tbprodutos.create({
                data: {
                    nomeprod,
                    idtipprod,
                    idunidade,
                    quantminima
                },
            })
            return newProduto
        }
        else {
            return(`Unidade de medida ou tipo de produto não encontrados!`)
        }
    })

    server.put('/produtos/update', async (request) => {
        const putBody = z.object({
            idproduto: z.number(),
            nomeprod: z.string(),
            idtipprod: z.number(),
            idunidade: z.number(),
            quantminima: z.number()
        })
    
        const { idproduto,
                nomeprod,
                idtipprod,
                idunidade,
                quantminima} = putBody.parse(request.body)

        //Verifica se existe id de unidade
        const confereIdUnidade = await prisma.tbunidademedida.findUnique({
            where: { idunidade: idunidade },
          });

        //Verifica se existe id de tipo do produto
        const confereIdTipoProd = await prisma.tbtiposprodutos.findUnique({
            where: { idtipprod: idtipprod },
          });    

        if(confereIdTipoProd && confereIdUnidade) {
            const produtoUpdate = await prisma.tbprodutos.update({
                where: {
                    idproduto: idproduto,
                },
                data: {
                    nomeprod,
                    idtipprod,
                    idunidade,
                    quantminima
                },
            })
            return produtoUpdate ?  produtoUpdate :  {}
        }
        else {
            return(`Unidade de medida ou tipo de produto não encontrados!`)
        }
    })

    server.delete('/produtos/delete/:produtoId', async (request) => {
        const idParam = z.object({
            produtoId: z.string(),
        })

        const { produtoId } = idParam.parse(request.params)

        const idproduto = Number(produtoId)

        const produtosDeleted = await prisma.tbprodutos.delete({
            where: {
                idproduto: idproduto,
            },
        })

        return produtosDeleted
    })
}
