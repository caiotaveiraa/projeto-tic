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
            SELECT
                tp.idtipprod,
                tp.nometipprod,
                COUNT(DISTINCT e.idproduto)::int AS quantidade
            FROM
                tbtiposprodutos tp
            LEFT JOIN
                tbprodutos p ON tp.idtipprod = p.idtipprod
            INNER JOIN
                tbestoque e ON p.idproduto = e.idproduto
            WHERE e.quantidade > 0
            GROUP BY
                tp.idtipprod, tp.nometipprod
        `;
        return quantidade;
    });

    server.get('/entradasprodutos', async () => {
        const quantidade = await prisma.$queryRaw`
            SELECT COUNT(mi.idproduto)::int AS quantidade
            FROM tbmovitens mi
            INNER JOIN tbmovimentos mo ON mi.idmovimento = mo.idmovimento
            WHERE mo.tipmov = 'EN'
        `;
        return quantidade;
    });

    server.get('/saidasprodutos', async () => {
        const quantidade = await prisma.$queryRaw`
            SELECT COUNT(mi.idproduto)::int AS quantidade
            FROM tbmovitens mi
            INNER JOIN tbmovimentos mo ON mi.idmovimento = mo.idmovimento
            WHERE mo.tipmov = 'SA'
        `;
        return quantidade;
    });

    server.get('/produtosmaiorestoque', async () => {
        const produtosComMaisEstoque = await prisma.$queryRaw`
            SELECT
                p.nomeprod AS label,
                SUM(e.quantidade)::int AS value
            FROM tbestoque e
            INNER JOIN tbprodutos p ON e.idproduto = p.idproduto
            GROUP BY p.nomeprod
            ORDER BY SUM(e.quantidade) DESC
            LIMIT 10;
    `;
        return produtosComMaisEstoque
    });


    server.get('/ultimosmovimentos', async () => {
        const movimentos = await prisma.tbmovimentos.findMany({
            orderBy: {
                idmovimento: 'asc',
            },
        });
        return movimentos;
    });

    server.get('/ultimositens', async () => {
        const ultimosMovimentos = await prisma.$queryRaw`
        SELECT
          m.dtinc AS "postedAt",
          i.idproduto AS id,
          p.nomeprod AS title,
          'Código do movimento: ' || m.idmovimento || ' - Tipo de movimentação: ' ||
            CASE
              WHEN m.tipmov = 'EN' THEN 'Entrada'
              WHEN m.tipmov = 'SA' THEN 'Saída'
              ELSE 'Desconhecido'
            END || ' - Quantidade: ' || i.quantidade AS description,
          '/assets/images/covers/cover_' || (i.idproduto % 5 + 1) || '.jpg' AS image
        FROM
          tbmovitens i
        JOIN
          tbmovimentos m ON i.idmovimento = m.idmovimento
        JOIN
          tbprodutos p ON i.idproduto = p.idproduto
        ORDER BY
          m.dtinc DESC
        LIMIT
          6;
      `;

        return ultimosMovimentos
    });
}
