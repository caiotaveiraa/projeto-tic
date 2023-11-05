import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function dashboardController(server: FastifyInstance) {
     //CRUD - Produtos (Conectada a outras entidades)

     server.get('/quantidadeprodutos', async () => {
        const produtos = await prisma.tbprodutos.findMany()
        return produtos.length
    })

    server.get('/quantidademovimentos', async () => {
        const movimentos = await prisma.tbmovimentos.findMany()
        return movimentos.length
    })

    server.get('/quantidadenf', async () => {
        const movimentos = await prisma.tbnf.findMany()
        return movimentos.length
    })

    server.get('/quantidadestipos', async () => {
        const quantidade = await prisma.$queryRaw`
            SELECT tp.idtipprod, tp.nometipprod, COUNT(p.idproduto)::int AS quantidade
            FROM tbtiposprodutos tp
            LEFT JOIN tbprodutos p ON tp.idtipprod = p.idtipprod
            GROUP BY tp.idtipprod, tp.nometipprod
        `;
        return quantidade;
    });

    server.get('/ultimosmovimentos', async () => {
        const movimentos = await prisma.tbmovimentos.findMany()
        return movimentos
    })
}
