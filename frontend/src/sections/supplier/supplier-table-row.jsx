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

export default function SupplierTableRow({
  selected,
  idfor,
  nomefor,
  fisjur,
  cnpjcpf,
  telefone,
  email,
  cep,
  cidade,
  rua,
  bairro,
  numero,
  complemento,
  handleClick,
  onDeleteFornecedor,
  onEditFornecedor,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDeleteFornecedor = async (id) => {
    const confirmacao = window.confirm("Tem certeza que deseja deletar o fornecedor?");
    // Se o usuário clicou em "OK", chama a função de deletar
    if (confirmacao) {
      onDeleteFornecedor(id);
    }
    handleCloseMenu()
  }
  const handleEditFornecedor = async (id) => {
    console.log(id)
    onEditFornecedor(idfor)
    handleCloseMenu()
  }

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>{idfor}</TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {nomefor}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align='justify'>{fisjur}</TableCell>

        <TableCell align='justify'>{cnpjcpf}</TableCell>

        <TableCell align='justify'>{telefone}</TableCell>

        <TableCell align='justify'>{email}</TableCell>

        <TableCell align='justify'>{cep}</TableCell>

        <TableCell align='justify'>{cidade}</TableCell>

        <TableCell align='justify'>{rua}</TableCell>

        <TableCell align='justify'>{bairro}</TableCell>

        <TableCell align='justify'>{numero}</TableCell>

        <TableCell align='justify'>{complemento}</TableCell>

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
        <MenuItem onClick={() => handleEditFornecedor(idfor)}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Editar
        </MenuItem>

        <MenuItem onClick={() => handleDeleteFornecedor(idfor)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Deletar
        </MenuItem>
      </Popover>
    </>
  );
}

SupplierTableRow.propTypes = {
  idfor: PropTypes.any,
  nomefor: PropTypes.any,
  fisjur: PropTypes.any,
  cnpjcpf: PropTypes.any,
  telefone: PropTypes.any,
  email: PropTypes.any,
  cep: PropTypes.any,
  cidade: PropTypes.any,
  rua: PropTypes.any,
  bairro: PropTypes.any,
  numero: PropTypes.any,
  complemento: PropTypes.any,
  handleClick: PropTypes.func,
  selected: PropTypes.any,
  onDeleteFornecedor: PropTypes.func,
  onEditFornecedor: PropTypes.func,
};
