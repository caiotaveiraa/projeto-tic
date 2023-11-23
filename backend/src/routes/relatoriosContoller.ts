import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function RelatoriosController(server: FastifyInstance) {

/*      Relatórios de Movimentações 
        Filtros: 
        - Entrada(1), Saída(2), Ambos(0);
        - Nr do Movimento
        - Fornecedor
*/

     server.get('/relmovimentos/:tipoMov/:idMovimento/:idFornecedor', async (request) => {
        const idParam = z.object({
            tipoMov: z.string(),
            idMovimento: z.string(),
            idFornecedor:  z.string()
        })

        const { tipoMov, idMovimento, idFornecedor } = idParam.parse(request.params)
        
        
        let EntSai = '0'
        if (tipoMov !== '0') {
            if (tipoMov == '1') {
                EntSai = 'EN' 
            }
            else {
                EntSai = 'SA'
            }

        }

        let idMov = Number(idMovimento) 

        let idForn = Number(idFornecedor) 

        const relmovimentos = await prisma.$queryRaw`
            SELECT MOV.idmovimento,
                   MOV.tipmov,
                   MOV.dtinc,
                   LOC.nomelocal,
                   FORN.idfor,
                   FORN.nomefor,
                   PROD.idproduto,
                   PROD.nomeprod,
                   MOVITENS.quantidade,
                   TPROD.nometipprod,
                   UNID.siglaun  
            FROM tbmovimentos MOV
            JOIN tbmovitens MOVITENS ON (MOV.idmovimento = MOVITENS.idmovimento)
            LEFT JOIN tbfornecedores FORN ON (MOV.idfor = FORN.idfor)
            LEFT JOIN tblocais LOC ON (MOVITENS.idlocal = LOC.idlocal)
            LEFT JOIN tbprodutos PROD ON (MOVITENS.idproduto = PROD.idproduto)
            LEFT JOIN tbtiposprodutos TPROD ON (PROD.idTipProd = TPROD.idTipProd)
            LEFT JOIN tbunidademedida UNID ON (PROD.idunidade = UNID.idunidade)
            WHERE
                1 = 1
                AND MOV.tipmov = CASE WHEN ${EntSai !== '0'} THEN ${EntSai} ELSE MOV.tipmov END
                AND MOV.idmovimento = CASE WHEN ${idMov !== 0} THEN ${idMov} ELSE MOV.idmovimento END
                AND FORN.idfor = CASE WHEN ${idForn !== 0} THEN ${idForn} ELSE FORN.idfor END
                ORDER BY MOV.idmovimento, MOVITENS.seqitem, mov.dtinc
        `;
    
        // Retorna os resultados
        return relmovimentos;
    });
    

    /*      Relatórios de Saldo Produtos por Locais de Estoque 
        Filtros: 
        - Produto
        - Local
    */

    server.get('/relsaldoProdutos/:idProduto/:idLocal', async (request) => {
        const idParam = z.object({
            idProduto: z.string(),
            idLocal: z.string()
        })
    
        const { idProduto, idLocal } = idParam.parse(request.params)
    
        const prodId = Number(idProduto)
        const locId = Number(idLocal)

        // Execute a consulta construída
        const relsaldo = await prisma.$queryRaw`
            SELECT PROD.idproduto,   
                   PROD.nomeprod,      
                   PROD.quantminima,    
                   TPROD.nometipprod,    
                   UNID.nomeunidade,    
                   UNID.siglaun,        
                   EST.quantidade,      
                   LOC.nomelocal       
                FROM tbestoque EST
                JOIN tbLocais LOC ON (EST.idLocal = LOC.idLocal)
                JOIN tbprodutos PROD ON (EST.idProduto = PROD.idProduto)	        
                LEFT JOIN tbtiposprodutos TPROD ON (PROD.idtipprod = TPROD.idtipprod)
                LEFT JOIN tbunidademedida UNID ON (PROD.idunidade = UNID.idunidade)  
                WHERE 
                    PROD.idProduto = CASE WHEN ${prodId !== 0} THEN ${prodId} ELSE PROD.idProduto END
                    AND 
                    EST.idLocal = CASE WHEN ${locId !== 0} THEN ${locId} ELSE EST.idLocal END
                ORDER BY PROD.idproduto, EST.idLocal
        `;
    
        return relsaldo;
    });

    /*      Relatórios de Fornecedores cadastrados
        Filtros: 
        - Codigo
        - nome
        - cnpj
        - 
    */

        server.get('/relFornecedoresCad/:idFornecedor/:fisJur', async (request) => {
            const idParam = z.object({
                idFornecedor: z.string(),
                fisJur: z.string()
            })
        
            const { idFornecedor, fisJur } = idParam.parse(request.params)
        
            const IdForn = Number(idFornecedor)
            
            let TipoFornecedor = '0'
            if (fisJur !== '0') {
                if (fisJur == '1') {
                    TipoFornecedor = 'J' 
                }
                else {
                    TipoFornecedor = 'F'
                }

            }
        
            // Execute a consulta construída
            const relFornecedoresCad = await prisma.$queryRaw`
               SELECT F.idfor,
                      F.nomefor,
                      F.cnpjcpf,
                      F.fisjur,
                      F.telefone,
                      F.cep,
                      F.rua,
                      F.numero,
                      F.bairro,
                      F.complemento,
                      F.cidade,
                      F.email
               FROM tbfornecedores F
               WHERE  
                F.idfor = CASE WHEN ${IdForn !== 0} THEN ${IdForn} ELSE F.idfor END 
                AND F.fisjur = CASE WHEN ${TipoFornecedor !== '0'} THEN ${TipoFornecedor} ELSE F.fisjur END
               ORDER BY IDFOR
            `;
        
            return relFornecedoresCad;
        });


}

