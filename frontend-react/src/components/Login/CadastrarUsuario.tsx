import { Button, Grid, TextField, Checkbox, FormControlLabel } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'

export default function CadastrarUsuario() {

    const [nome, setNome] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordconfirm, setPasswordconfirm] = useState('')
    const [checked, setChecked] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    const navigate = useNavigate()

    const handleLogin = async () => {

        if(password === passwordconfirm){
            const data = {
                usu_login: username,
                nome: nome,
                senha: password,
                usu_admin: checked,
            }
            try{
                const resp = await fetch("http://localhost:3333/usuario/add", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json", // Indica que estamos JSON no corpo da solicitação
                    },
                    body: JSON.stringify(data), // Converte o objeto 'data' em JSON e o define como o corpo da solicitação
                })    
        
                .then (resposta => {
                    return resposta.json()
                })
                if (resp === null || resp === undefined) {
                    Swal.fire({
                        title: 'Erro',
                        text: 'Usuário não cadastrado',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                } else {
                    Swal.fire({
                        title: 'Sucesso',
                        text: 'Usuário cadastrado com sucesso',
                        icon: 'success',
                        confirmButtonText: 'OK'
                        })
                        
                        .then((result) => {
                        if (result.isConfirmed) {
                            navigate('/usuarios', { state: { username: username } });
                        }
                        });
                    }
            }
            catch(error) {
                console.log(error)
            }
        }
        else{
            Swal.fire({
                title: 'Erro',
                text: 'As senhas não conferem',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
    }  

    return (
        <div>
            <Grid container style={{ minHeight: '100vh'}}>
                <Grid container item xs={12} sm={6} alignItems="center" direction="column" justifyContent="space-between" style={{padding: 10}}>
                    <div />
                        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 400, minWidth: 300}}>
                            <div>
                                <h2 style={{color:"#000000", fontSize: 30, fontFamily:"Lucida Sans", textAlign:"center"}}>
                                    Crie sua conta.
                                </h2>
                            </div>
                            <TextField label="Nome" margin="normal" value={nome} onChange={(e) => setNome(e.target.value)} />
                            <TextField label="Login" margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
                            <TextField label="Senha" margin="normal" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <TextField label="Repita a Senha" margin="normal" type="password" value={passwordconfirm} onChange={(e) => setPasswordconfirm(e.target.value)} />
                            <FormControlLabel control={<Checkbox checked={checked} onChange={handleChange} color="primary" />}       label={
        <span style={{ color: 'black' }}>Usuario administrador</span>
      } />
                            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 400, minWidth: 300, marginTop: 15}}>
                                <Button type="submit" color="primary" variant="contained" onClick={handleLogin}>
                                    Entrar
                                </Button>
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