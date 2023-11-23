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

export default function ProductTypeTableRow({
  selected,
  idtipprod,
  nometipprod,
  handleClick,
  onDeleteTipo,
  onEditTipo,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDeleteTipo = async (id) => {
    const confirmacao = window.confirm("Tem certeza que deseja deletar o tipo de produto?");
    // Se o usuário clicou em "OK", chama a função de deletar
    if (confirmacao) {
      onDeleteTipo(id);
    }
    handleCloseMenu()
  }
  const handleEditTipo = async (id) => {
    console.log(id)
    onEditTipo(id)
    handleCloseMenu()
  }

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>{idtipprod}</TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {nometipprod}
            </Typography>
          </Stack>
        </TableCell>

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
        <MenuItem onClick={() => handleEditTipo(idtipprod)}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Editar
        </MenuItem>

        <MenuItem onClick={() => handleDeleteTipo(idtipprod)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Deletar
        </MenuItem>
      </Popover>
    </>
  );
}

ProductTypeTableRow.propTypes = {
  idtipprod: PropTypes.any,
  handleClick: PropTypes.func,
  nometipprod: PropTypes.any,
  selected: PropTypes.any,
  onDeleteTipo: PropTypes.func,
  onEditTipo: PropTypes.func,
};
