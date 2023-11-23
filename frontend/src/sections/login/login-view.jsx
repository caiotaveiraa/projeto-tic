import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState('')

  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    const loginData = {
        usu_login: username,
        senha: password
    };

    try {
        const response = await fetch('http://localhost:3333/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();
        if (data.success) {
          console.log('Logado')
          localStorage.setItem('nomeUsuario', data.nome)
          localStorage.setItem('idUsuario', data.idusuario)
          router.push('/');
        } else {
          console.log('Usuário ou senha inválidos')
        }
    } catch (error) {
        console.error('Erro:', error);
    }
  }

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField 
          name="email" label="Usuário" 
          value={username}  // Atribua o valor do estado 'username' ao campo de texto
          onChange={(e) => setUsername(e.target.value)}  // Atualize o estado 'username' quando o campo de texto for alterado
        />

        <TextField
          name="password"
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={password}  // Atribua o valor do estado 'password' ao campo de senha
          onChange={(e) => setPassword(e.target.value)}  // Atualize o estado 'password' quando o campo de senha for alterado
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Esqueceu a senha?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleLogin}
      >
        Entrar
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
          <Typography variant="h4">Bem vindo!</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Digite suas credenciais para acessar o site.
          </Typography>
          
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
