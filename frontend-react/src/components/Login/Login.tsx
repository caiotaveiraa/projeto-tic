import { Button, Grid, TextField } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'

export default function Login() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const handleLogin = async () => {

        const resp = await fetch(`http://localhost:3333/usuario/${username}`, {
            method: 'GET',
        })        

        .then (resposta => {
            return resposta.json()
        })

        if (resp === null || resp === undefined) {
            Swal.fire({
                title: 'Erro',
                text: 'Usuário ou senha estão incorretos',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        } else {
            if (resp.senha !== password) {
                Swal.fire({
                    title: 'Erro',
                    text: 'Usuário ou senha estão incorretos',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            } else {
                Swal.fire({
                    title: 'Sucesso',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/inicio', { state: { username: username } });
                    }
                });
            }
        }
    }

    return (
        <div>
            <Grid container style={{ minHeight: '100vh'}}>
                <Grid container item xs={12} sm={6} alignItems="center" direction="column" justifyContent="space-between" style={{padding: 10}}>
                    <div />
                        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 400, minWidth: 300}}>
                            <div>
                                <h2 style={{color:"#000000", fontSize: 30, fontFamily:"Lucida Sans"}}>
                                    Bem vindo!
                                </h2>
                                <h3 style={{color:"#000000", marginBottom:20, marginTop:5, fontFamily:"Verdana"}}>
                                    Digite suas credenciais para acessar o site.
                                </h3>
                            </div>
                            <TextField label="Login" margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
                            <TextField label="Senha" margin="normal" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 400, minWidth: 300, marginTop: 15}}>
                                <Button type="submit" color="primary" variant="contained" onClick={handleLogin}>
                                    Entrar
                                </Button>
                                <p> Não possui um usuário ainda? <Button style={{ textTransform: 'none', outline: 'none' }}> Cadastre-se </Button></p>
                            </div>
                        </div>
                    <div />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <img 
                        src="src/components/login/login.png" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover'}} 
                        alt="brand"
                    />
                </Grid>
            </Grid>
        </div>
    )
}