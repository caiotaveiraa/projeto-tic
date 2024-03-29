import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  idusuario,
  usu_login,
  nome,
  usu_admin,
  dtcriacao,
  handleClick,
  onDeleteUser,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDeleteUser = async (id) => {
    const confirmacao = window.confirm("Tem certeza que deseja deletar o usuário?");
    // Se o usuário clicou em "OK", chama a função de deletar
    if (confirmacao) {
    onDeleteUser(id)
    }
    handleCloseMenu()
  }

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>{idusuario}</TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {usu_login}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align='justify'>{nome}</TableCell>

        <TableCell align='justify'>{usu_admin ? 'Sim' : 'Não'}</TableCell>

        <TableCell align='justify'>{dtcriacao}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
        >

        <MenuItem onClick={() => handleDeleteUser(idusuario)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Deletar
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  idusuario: PropTypes.any,
  usu_login: PropTypes.any,
  nome: PropTypes.any,
  usu_admin: PropTypes.any,
  dtcriacao: PropTypes.any,
  handleClick: PropTypes.func,
  selected: PropTypes.any,
  onDeleteUser: PropTypes.func,
};

