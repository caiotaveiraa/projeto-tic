import {FastifyInstance} from 'fastify'
import {z} from 'zod'
import {prisma} from './lib/prisma'

export async function AppRoutes(server:FastifyInstance){

    // CRUD Fornecedor
    server.get('/fornecedor', async () => {        
        const fornecedor = await prisma.tbfornecedores.findMany()
    
        return fornecedor
    })
    
    server.post('/fornecedor/add', async (request) => {
        const postBody = z.object({
            nomefor: z.string(),
            email: z.string(),
            cnpjcpf: z.string(),
            telefone: z.string(),
            fisjur: z.string(),
            cep: z.string(),
            rua: z.string(),
            cidade: z.string(),
            bairro: z.string(),
            numero: z.number(),
            complemento: z.string(),
        })
    
        const {
            nomefor,
            email,
            cnpjcpf,
            telefone,
            fisjur,
            cep,
            rua,
            cidade,
            bairro,
            numero,
            complemento,
        } = postBody.parse(request.body)
    
        const newForncedor = await prisma.tbfornecedores.create({
            data: {
                nomefor,
                email,
                cnpjcpf,
                telefone,
                fisjur,
                cep,
                rua,
                cidade,
                bairro,
                numero,
                complemento,
            },
        })
    
        return newForncedor
    })        
    
    server.put('/fornecedor/update', async (request) => {
        const putBody = z.object({
            idfor: z.number(),
            nomefor: z.string(),
            fisjur: z.string(),
            cnpjcpf: z.string(),
            telefone: z.string(),
            cep: z.string(),
            cidade: z.string(),
            rua: z.string(),
            bairro: z.string(),
            numero: z.number(),
            complemento: z.string(),
            email: z.string(),
        })
    
        const {
            idfor,
            nomefor,
            fisjur,
            cnpjcpf,
            telefone,
            cep,
            cidade,
            rua,
            bairro,
            numero,
            complemento,
            email,
        } = putBody.parse(request.body)

        const fornecedorUpdated = await prisma.tbfornecedores.updateMany({
            where: {
                idfor: idfor,
            },
            data: {
                nomefor,
                fisjur,
                cnpjcpf,
                telefone,
                cep,
                cidade,
                rua,
                bairro,
                numero,
                complemento,
                email,
            },
        })
        return (fornecedorUpdated.count >= 1) ?  'Atualização com sucesso' :  'Nada foi atualizado'
    })

    server.delete('/fornecedor/delete/:idfor', async (request) => {
        const idParam = z.object({
            idfor: z.string(),
        })
    
        const { idfor } = idParam.parse(request.params)
        const fornecedorId = Number(idfor)
    
        const fornecedorDeleted = await prisma.tbfornecedores.delete({
            where: {
                idfor: fornecedorId,
            },
        })
    
        return fornecedorDeleted
    })   



    // CRUD Unidades de medidas

    server.get('/unidadeMedida', async () => {        
        const unidadeMedida = await prisma.tbunidademedida.findMany()
    
        return unidadeMedida
    })
    
    server.post('/unidadeMedida/add', async (request) => {
        const postBody = z.object({
            siglaun: z.string(),
            nomeunidade: z.string(),
        })
    
        const {
            siglaun,
            nomeunidade,
        } = postBody.parse(request.body)
    
        const newUnidadeMedida = await prisma.tbunidademedida.create({
            data: {
                siglaun,
                nomeunidade,
            },
        })
    
        return newUnidadeMedida
    })        
    
    server.put('/unidadeMedida/update', async (request) => {
        const putBody = z.object({
            idunidade: z.number(),
            siglaun: z.string(),
            nomeunidade: z.string()
        })
    
        const {
            idunidade,
            siglaun,
            nomeunidade
        } = putBody.parse(request.body)

        const unidadeMedidaUpdate = await prisma.tbunidademedida.updateMany({
            where: {
                idunidade: idunidade,
            },
            data: {
                siglaun,
                nomeunidade
            },
        })
        return (unidadeMedidaUpdate.count >= 1) ?  'Atualização com sucesso' :  'Nada foi atualizado'
    })

    server.delete('/unidadeMedida/delete/:idunidade', async (request) => {
        const idParam = z.object({
            idunidade: z.string(),
        })
    
        const { idunidade } = idParam.parse(request.params)
        const UnidadeMedidaID = Number(idunidade)
    
        const unidadeMedidaDeleted = await prisma.tbunidademedida.delete({
            where: {
                idunidade: UnidadeMedidaID,
            },
        })
    
        return unidadeMedidaDeleted
    }) 
    
    

    // CRUD TIPOS DE PRODUTOS

    server.get('/tiposProdutos', async () => {        
        const tiposProdutos = await prisma.tbtiposprodutos.findMany()
    
        return tiposProdutos
    })
    
    server.post('/tiposProdutos/add', async (request) => {
        const bodyData = z.object({
            nometipprod: z.string()
        })
    
        const {nometipprod} = bodyData.parse(request.body)
    
        const newTipProd = await prisma.tbtiposprodutos.create({
            data: {
                nometipprod,
            },
        })
    
        return newTipProd
    })        
    
    server.put('/tiposProdutos/update', async (request) => {
        const putBody = z.object({
            idtipprod: z.number(),
            nometipprod: z.string()
        })
    
        const {idtipprod,nometipprod} = putBody.parse(request.body)

        const tipoProdutoUpdate = await prisma.tbtiposprodutos.updateMany({
            where: {
                idtipprod: idtipprod,
            },
            data: {
                nometipprod
            },
        })
        return (tipoProdutoUpdate.count >= 1) ?  'Atualização com sucesso' :  'Nada foi atualizado'
    })

    server.delete('/tiposProdutos/delete/:idtipprod', async (request) => {
        const idParam = z.object({
            idtipprod: z.string(),
        })
    
        const { idtipprod } = idParam.parse(request.params)
        const tipProdId = Number(idtipprod)
    
        const tipProdDeleted = await prisma.tbtiposprodutos.delete({
            where: {
                idtipprod: tipProdId,
            },
        })
    
        return tipProdDeleted
    })
    
    // Login

    server.get('/usuarios', async () => {        
        const usuarios = await prisma.tbusuarios.findMany()
    
        return usuarios
    })

    server.get('/usuario/:usu_login', async (request) => {

        const idParam = z.object({
            usu_login: z.string(),
        })

        const { usu_login } = idParam.parse(request.params)

        const usuario = await prisma.tbusuarios.findUnique({
            where: { usu_login: usu_login },
        });
        
        return usuario
    })

    server.post('/usuario/add', async (request) => {
        const postBody = z.object({
            usu_login: z.string(),
            nome: z.string(),
            senha: z.string(),
            usu_admin: z.boolean()
        })

        const dtcriacao = new Date();
    
        const {
            usu_login,
            nome,
            senha,
            usu_admin
        } = postBody.parse(request.body)
    
        const newUsuario = await prisma.tbusuarios.create({
            data: {
                usu_login,
                nome,
                senha,
                dtcriacao,
                usu_admin
            },
        })
    
        return newUsuario
    })

    // server.post('/cadastro/verifica', async (request) => {
    //     const verificaBody = z.object({
    //         usu_login: z.string(),
    //     })

    //     const {usu_login} = verificaBody.parse(request.body)
    //     const result = await prisma.tbusuarios.findFirst({
    //         where: {
    //             usu_login
    //         }
    //     })
    //     return result // retorna null se não encontrar e o objeto se encontra
    // })

    server.post('/usuario/verifica', async (request) => {
        const verificaBody = z.object({
            usu_login: z.string(),
            senha: z.string()
        })
        const {usu_login, senha} = verificaBody.parse(request.body)
        const result = await prisma.tbusuarios.findFirst({
            where: {
                usu_login,
                senha
            }
        })
        return result // retorna null se não encontrar e o objeto se encontra
    })


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
            const produtoUpdate = await prisma.tbprodutos.updateMany({
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
            return (produtoUpdate.count >= 1) ?  'Atualização com sucesso' :  'Nada foi atualizado'
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

    // CRUD Locais de estoque

    server.get('/locaisEstoque', async () => {
        const locaisEstoque = await prisma.tblocais.findMany()

        return locaisEstoque
    })

    server.post('/locaisEstoque/add', async (request) => {
        const bodyData = z.object({
            nomelocal : z.string()
        })

        const {nomelocal} = bodyData.parse(request.body)

        const newLocalEstoque = await prisma.tblocais.create({
            data: {
                nomelocal
            },
        })

        return newLocalEstoque
    })

    server.put('/locaisEstoque/update', async (request) => {
        const putBody = z.object({
            idlocal : z.number(),
            nomelocal : z.string()
        })

        const {idlocal,
              nomelocal} = putBody.parse(request.body)

        const locaisUpdate = await prisma.tblocais.update({
            where: {
                idlocal : idlocal,
            },
            data: {
                nomelocal
            },
        })
        return locaisUpdate ?  locaisUpdate :  {}
    })

    server.delete('/locaisEstoque/delete/:LocalId', async (request) => {
        const idParam = z.object({
            LocalId: z.string(),
        })

        const { LocalId } = idParam.parse(request.params)
        const idlocal = Number(LocalId)

        const locaisDeleted = await prisma.tblocais.delete({
            where: {
                idlocal: idlocal,
            },
        })

        return locaisDeleted
    })

    //CRUD - ESTOQUE (Conectada a outras entidades)

    server.get('/estoque', async () => {
        const estoque = await prisma.tbestoque.findMany()
        return estoque
    })
    
    server.post('/estoque/add', async (request) => {
        const putBody = z.object({
            idproduto: z.number(),
            idlocal: z.number(),
            quantidade: z.number(),
            dtinc: z.date()
        })
    
        const {
            idproduto,
            idlocal,
            quantidade,
            dtinc
        } = putBody.parse(request.body)
    
        //Verifica se existe id do local
        const confereLocal = await prisma.tblocais.findUnique({
            where: { idlocal: idlocal },
            });
    
        //Verifica se existe id do produto
        const confereProduto = await prisma.tbprodutos.findUnique({
            where: { idproduto: idproduto },
            });
        
        if(confereLocal && confereProduto){
            const newEntry = await prisma.tbestoque.create({
                data: {
                    idproduto,
                    idlocal,
                    quantidade,
                    dtinc
                },
            })
        
            return newEntry
        }
        else{
            return(`Produto ou local de estoque não encontrados!`)
        }
    })
    
    server.put('/estoque/update', async (request) => {
        const putBody = z.object({
            idestoque: z.number(),
            idproduto: z.number(),
            idlocal: z.number(),
            quantidade: z.number(),
            dtinc: z.date()
        })
        
        const { idestoque,
                idproduto,
                idlocal,
                quantidade,
                dtinc} = putBody.parse(request.body)
    
        //Verifica se existe id de local
        const confereLocal = await prisma.tblocais.findUnique({
            where: { idlocal: idlocal },
            });
    
        //Verifica se existe id do produto
        const confereProduto = await prisma.tbprodutos.findUnique({
            where: { idproduto: idproduto },
            });
                
        if(confereProduto && confereLocal){
            const estoqueUpdate = await prisma.tbestoque.updateMany({
                where: {
                    idestoque: idestoque,
                },
                data: {
                    idproduto,
                    idlocal,
                    quantidade,
                    dtinc
                },
            })
            return (estoqueUpdate.count >= 1) ?  'Atualização com sucesso' :  'Nada foi atualizado'
        }
        else{
            return(`Produto ou local de estoque não encontrados!`)
        }

    })
    
    server.delete('/estoque/delete/:estoqueId/:prodId', async (request) => {
        const idParam = z.object({
            estoqueId: z.string(),
            prodId: z.string()
        })
    
        const { estoqueId, prodId } = idParam.parse(request.params)
    
        const idestoque = Number(estoqueId)
        const idprod = Number(prodId)
    
        const estoqueApagado = await prisma.tbestoque.delete({
            where: {
                idestoque_idproduto: {
                    idestoque: idestoque,
                    idproduto: idprod
                },
            },
        })
    
        return estoqueApagado
    })

    // CRUD tbmovimentos

    server.get('/movimentos', async () => {
        const movimentos = await prisma.tbmovimentos.findMany()

        return movimentos
    })

    server.post('/movimentos/add', async (request) => {
        const bodyData = z.object({
            tipmov : z.string(),
            idfor: z.number(),
            idusuario_alteracao: z.number(),
            dtinc: z.date()
        })

        const {tipmov, idfor, idusuario_alteracao, dtinc} = bodyData.parse(request.body)

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
            const movimentosUpdate = await prisma.tbmovimentos.updateMany({
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
            return (movimentosUpdate.count >= 1) ?  'Atualização realizada com sucesso!' :  'Nada foi atualizado!'
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
            const movimentosItensUpdate = await prisma.tbmovitens.updateMany({
                where: {
                    seqitem: seqitem,
                    idmovimento: idmovimento,
                },
                data: {
                    seqitem,
                    idmovimento,
                    idproduto,
                    idlocal,
                    dtinc,
                    quantidade                
                },
            })
            return (movimentosItensUpdate.count >= 1) ?  'Atualização com sucesso' :  'Nada foi atualizado'
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


    //CRUD TB NF

    server.get('/nf', async () => {
        const nfs = await prisma.tbnf.findMany()
        return nfs
    })
    
    server.post('/nf/add', async (request) => {
        const putBody = z.object({
            numnf: z.number(),
            idmovimento: z.number(),
            serienf: z.number(),
            idfor: z.number(),
            idusuario_inclusao: z.number(),
            dtemissao: z.date(),
            vlrtotal: z.number(),
            observacao: z.string()
        })
    
        const {
            numnf,
            idmovimento,
            serienf,
            idfor,
            idusuario_inclusao,
            dtemissao,
            vlrtotal,
            //observacao //ADICIONAR ESSE CAMPO
        } = putBody.parse(request.body)
    
        //Verifica se existe id do local
        const conferemovimento = await prisma.tbmovimentos.findUnique({
            where: { idmovimento: idmovimento },
            });
    
            //Verifica se existe id do produto
        const confereuser = await prisma.tbusuarios.findUnique({
            where: { idusuario: idusuario_inclusao },
            });

        const conferefornecedor = await prisma.tbfornecedores.findUnique({
            where: { idfor: idfor },
            });
        
        if(conferemovimento && confereuser && conferefornecedor){
            const newNf = await prisma.tbnf.create({
                data: {
                    numnf,
                    idmovimento,
                    serienf,
                    idfor,
                    idusuario_inclusao,
                    dtemissao,
                    vlrtotal
                },
            })
        
            return newNf
        }
        else{
            return(`Movimento, usuário ou fornecedor não encontrados!`)
        }
    })
    
    server.put('/nf/update', async (request) => {
        const putBody = z.object({
            idnf: z.number(),
            numnf: z.number(),
            idmovimento: z.number(),
            serienf: z.number(),
            idfor: z.number(),
            idusuario_inclusao: z.number(),
            dtemissao: z.date(),
            vlrtotal: z.number()
        })
        
        const { idnf,
                numnf,
                idmovimento,
                serienf,
                idfor,
                idusuario_inclusao,
                dtemissao,
                vlrtotal} = putBody.parse(request.body)
    
        //Verifica se existe id de local
        const conferemovimento = await prisma.tbmovimentos.findUnique({
            where: { idmovimento: idmovimento },
            });
    
            //Verifica se existe id do produto
        const confereuser = await prisma.tbusuarios.findUnique({
            where: { idusuario: idusuario_inclusao },
            });

        const conferefornecedor = await prisma.tbfornecedores.findUnique({
            where: { idfor: idfor },
            });
        
        if(conferemovimento && confereuser && conferefornecedor){
            const nfUpdate = await prisma.tbnf.updateMany({
                where: {
                    idnf: idnf
                },
                data: {
                    numnf,
                    idmovimento,
                    serienf,
                    idfor,
                    idusuario_inclusao,
                    dtemissao,
                    vlrtotal
                },
            })
            return (nfUpdate.count >= 1) ?  'Atualização com sucesso' :  'Nada foi atualizado'
        }
        else{
            return(`Movimento, usuário ou fornecedor não encontrados!`)
        }

    })
    
    server.delete('/nf/delete/:nfId', async (request) => {
        const idParam = z.object({
            idnf: z.string(),
        })
    
        const { idnf } = idParam.parse(request.params)
    
        const nfid = Number(idnf)
    
        const nfApagada = await prisma.tbnf.delete({
            where: {
                idnf: nfid,
            },
        })
    
        return nfApagada
    })


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
            const itemUpdate = await prisma.tbnfitens.updateMany({
                where: {
                    idnf: idnf,
                    seqitem: seqitem,
                    idproduto: idproduto
                },
                data: {
                    idmovimento,
                    vlrunitario,
                    quantidade,
                    vlrtotitem
                },
            })
            return (itemUpdate.count >= 1) ?  'Atualização com sucesso' :  'Nada foi atualizado'
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
            const compUpdate = await prisma.tbprodcomposicao.updateMany({
                where: {
                    idcomp: idcomp,
                    idproduto: idproduto,
                    idprodutocomp: idprodutocomp
                },
                data: {
                    quantidade
                },
            })
            return (compUpdate.count >= 1) ?  'Atualização com sucesso' :  'Nada foi atualizado'
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