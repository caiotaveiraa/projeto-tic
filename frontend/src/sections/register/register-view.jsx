import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

export default function RegisterView() {
  const theme = useTheme();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState('')

  const [password, setPassword] = useState('')

  const [name, setName] = useState('')

  const [usu_admin, setUsu_Admin] = useState(false)



  // const [admin, setAdmin] = useState(false)

  const handleRegister = async () => {
    const registerData = {
        usu_login: username,
        nome: name,
        senha: password,
        usu_admin,
    };
    console.log(registerData)
    try {
        const response = await fetch('http://localhost:3333/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });

        const data = await response.json();
        console.log(data)
        if (data.success) {
          localStorage.setItem('nomeUsuario', data.nome)
          localStorage.setItem('idUsuario', data.idusuario)
          router.push('/');
        } else {
          console.log('Usuário não cadastrado')
        }
    } catch (error) {
        console.error('Erro:', error);
    }
  }

  const renderForm = (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* ... outros campos de texto ... */}

          <TextField 
            name="nome" label="Nome Completo" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField 
            name="login" label="Login" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="password"
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {/* ... ícone do olho ... */}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} alignItems="center" container>
          <Checkbox
            checked={usu_admin}
            onChange={(e) => setUsu_Admin(e.target.checked)}
            color="primary"
            inputProps={{ 'aria-label': 'usu_admin checkbox' }}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary', marginLeft: 1 }}>
            Usuário Administrador
          </Typography>
        </Grid>
      </Grid>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleRegister}
      >
        Cadastrar-se
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Cadastre-se</Typography>
          
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
               Digite seus dados
            </Typography>
          </Divider>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
