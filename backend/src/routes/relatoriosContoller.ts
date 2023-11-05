import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function RelatoriosController(server: FastifyInstance) {
     //CRUD - Produtos (Conectada a outras entidades)

     server.get('/relmovimentos', async () => {
        const relmovimentos = await prisma.$queryRaw`
           SELECT MOV.idmovimento,
                  MOV.tipmov,
                  MOV.dtinc,
                  LOC.nomelocal,
                  FORN.idfor,
                  FORN.nomefor,
                  PROD.idproduto,
                  PROD.nomeprod,
                  TPROD.nometipprod,
                  UNID.siglaun  
           FROM tbmovimentos MOV
           JOIN tbmovitens MOVITENS ON (MOV.idmovimento = MOVITENS.idmovimento)
           LEFT JOIN tbfornecedores FORN ON (MOV.idfor = FORN.idfor)
           LEFT JOIN tblocais LOC ON (MOVITENS.idlocal = LOC.idlocal)
           LEFT JOIN tbprodutos PROD ON (MOVITENS.idproduto = PROD.idproduto)
           LEFT JOIN tbtiposprodutos TPROD ON (PROD.idTipProd = TPROD.idTipProd)
           LEFT JOIN tbunidademedida UNID ON (PROD.idunidade = UNID.idunidade)

        `;
        return relmovimentos;
    });

     server.get('/relsaldoProdutos', async () => {
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
	        LEFT JOIN tbprodutos PROD ON (EST.idProduto = PROD.idProduto)
	        LEFT JOIN tbLocais LOC ON (EST.idLocal = LOC.idLocal)
	        LEFT JOIN tbtiposprodutos TPROD ON (PROD.idtipprod = TPROD.idtipprod)
	        LEFT JOIN tbunidademedida UNID ON (PROD.idunidade = UNID.idunidade)

        `;
        return relsaldo;
    });

    server.get('/relnfrecebidas', async () => {
        const relNFs = await prisma.$queryRaw`
           SELECT FORN.idfor,
	              FORN.nomefor,
	              FORN.cnpjcpf,
	              FORN.telefone,
	              FORN.cep,
	              FORN.cidade,
	              'Logradouro: ' || FORN.rua || ', ' || CAST(FORN.numero AS VARCHAR(10)) || ' Bairro: '|| FORN.bairro || ' Complemento: ' || FORN.complemento AS "Endereço Completo",
	              FORN.email,
	              NF.numnf,
                  NF.serienf,
	              NF.dtemissao,
	              COALESCE(NF.vlrtotal, 0.00) AS "Vr. Total NF'-'E",
	              SUM(COALESCE(NF.vlrtotal, 0.00)) OVER (PARTITION BY NF.idfor) AS "Vr. Total NF'-'E por Fornecedor",
	              NF.observacao,
	              CAST(PROD.idproduto AS VARCHAR) || ' ' || PROD.nomeprod AS "Produto",
	              TPROD.nometipprod AS "Tipo Produto",
	              UNID.siglaun AS "Un. Medida",
	              NFITEM.seqitem AS "Seq. Item",
	              COALESCE(NFITEM.vlrunitario, 0.00) AS "Vr. Uni. Item",
	              NFITEM.quantidade AS "Quantidade",
	              COALESCE(NFITEM.vlrtotitem, 0.00) AS "Vr. Total. Item",
	              COUNT(NF.numnf) OVER (PARTITION BY NF.idfor) AS "Nr. NF'(s)' Fornecedor"
           FROM tbnf NF
           JOIN tbnfitens NFITEM ON (NF.idnf = NFITEM.idnf)
           JOIN Tbfornecedores FORN ON (NF.idfor = FORN.idfor)
           LEFT JOIN tbmovimentos MOV ON (NF.idmovimento = MOV.idmovimento)
           LEFT JOIN tbprodutos PROD ON (NFITEM.idproduto = PROD.idproduto)
           LEFT JOIN tbtiposprodutos TPROD ON (PROD.idTipProd = TPROD.idTipProd)
           LEFT JOIN tbunidademedida UNID ON (PROD.idunidade = UNID.idunidade)
        `;
        return relNFs;
    });


}
