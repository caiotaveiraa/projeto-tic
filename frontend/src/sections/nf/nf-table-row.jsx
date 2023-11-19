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

export default function NfTableRow({
  selected,
  idnf,
  numnf,
  serienf,
  idfor,
  idmovimento,
  dtemissao,
  vlrtotal,
  observacao,
  idusuario_criacao,
  handleClick,
  onDeleteNf,
  onEditNf,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDeleteNf = async (id) => {
    // Exibe um diálogo de confirmação antes de excluir
    const confirmacao = window.confirm("Tem certeza que deseja deletar a nf e todos seus itens relacionados?\nEssa operação é permanente.");

    // Se o usuário clicou em "OK", chama a função de deletar
    if (confirmacao) {
      onDeleteNf(id);
    }

    handleCloseMenu();
  };
  const handleEditNf = async (id) => {
    onEditNf(id)
    handleCloseMenu()
  }

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>{idnf}</TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {numnf}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align='justify'>{serienf}</TableCell>

        <TableCell align='justify'>{idfor}</TableCell>

        <TableCell align='justify'>{dtemissao}</TableCell>

        <TableCell align='justify'>{idmovimento}</TableCell>

        <TableCell align='justify'>{idusuario_criacao}</TableCell>

        <TableCell align='justify'>{vlrtotal}</TableCell>

        <TableCell align='justify'>{observacao}</TableCell>

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
        <MenuItem onClick={() => handleEditNf(idnf)}>
          <Iconify icon="material-symbols:list" sx={{ mr: 2 }} />
          Itens
        </MenuItem>

        <MenuItem onClick={() => handleEditNf(idnf)}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Editar
        </MenuItem>

        <MenuItem onClick={() => handleDeleteNf(idnf)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Deletar
        </MenuItem>
      </Popover>
    </>
  );
}

NfTableRow.propTypes = {
  idnf: PropTypes.any,
  numnf: PropTypes.any,
  serienf: PropTypes.any,
  idfor: PropTypes.any,
  idmovimento: PropTypes.any,
  dtemissao: PropTypes.any,
  vlrtotal: PropTypes.any,
  observacao: PropTypes.any,
  idusuario_criacao: PropTypes.any,
  handleClick: PropTypes.func,
  selected: PropTypes.any,
  onDeleteNf: PropTypes.func,
  onEditNf: PropTypes.func,
};
