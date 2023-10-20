import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function userController(server: FastifyInstance) {
    server.post('/login', async (request) => {
        const postBody = z.object({
            usu_login: z.string(),
            senha: z.string(),
        })
    
        try {
            const { usu_login, senha } = postBody.parse(request.body)
    
            const usuario = await prisma.tbusuarios.findUnique({
                where: {
                    usu_login: usu_login
                },
            })
    
            if (usuario && usuario.senha === senha) {
                return { success: true, message: 'Login bem-sucedido' };
            } else {
                return { success: false, message: 'Credenciais inválidas' };
            }
        } catch (error) {
            // Lidar com erros de validação de entrada
            return { success: false, message: 'Erro de validação' };
        }
    })

    server.get('/usuarios', async () => {        
        const usuarios = await prisma.tbusuarios.findMany({
            select: {
                idusuario: true,
                usu_login: true,
                nome: true,
                usu_admin: true,
                dtcriacao: true
            },
        })
    
        return usuarios
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
    

    //deletar usuario

    server.delete('/usuarios/delete/:userId', async (request) => {
        const idParam = z.object({
            userId: z.string(),
        })

        const { userId } = idParam.parse(request.params)

        const idusuario = Number(userId)

        const userDeleted = await prisma.tbusuarios.delete({
            where: {
                idusuario: idusuario,
            },
        })

        return userDeleted
    })
}
