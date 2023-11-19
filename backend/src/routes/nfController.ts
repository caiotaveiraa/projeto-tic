import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function nfController(server: FastifyInstance) {
    //CRUD TB NF

    server.get('/nf', async () => {
        const nfs = await prisma.tbnf.findMany({
            include: {
                tbfornecedores: {
                    select: {
                        nomefor: true
                    }
                },
                tbusuarios: {
                    select: {
                        usu_login: true
                    }
                }
            }
        })
        return nfs
    })

    server.post('/nf/add', async (request) => {
        const putBody = z.object({
            numnf: z.number(),
            idmovimento: z.number(),
            serienf: z.number(),
            idfor: z.number(),
            idusuario_inclusao: z.number(),
            vlrtotal: z.number(),
            observacao: z.string()
        })

        const {
            numnf,
            idmovimento,
            serienf,
            idfor,
            idusuario_inclusao,
            vlrtotal,
            observacao
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

        if (conferemovimento && confereuser && conferefornecedor) {
            const newNf = await prisma.tbnf.create({
                data: {
                    numnf,
                    idmovimento,
                    serienf,
                    idfor,
                    idusuario_inclusao,
                    dtemissao: new Date(),
                    vlrtotal,
                    observacao,
                },
            })

            return newNf
        }
        else {
            return (`Movimento, usuário ou fornecedor não encontrados!`)
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
            vlrtotal } = putBody.parse(request.body)

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

        if (conferemovimento && confereuser && conferefornecedor) {
            const nfUpdate = await prisma.tbnf.update({
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
            return nfUpdate ? nfUpdate : {}
        }
        else {
            return (`Movimento, usuário ou fornecedor não encontrados!`)
        }

    })

    server.delete('/nf/delete/:nfId', async (request) => {
        const idParam = z.object({
            nfId: z.string(),  // Corrigido para nfId
        })
        
        const { nfId } = idParam.parse(request.params)
        const nfid = Number(nfId)        

        const nfApagada = await prisma.tbnf.delete({
            where: {
                idnf: nfid,
            },
        })

        return nfApagada
    })
}
