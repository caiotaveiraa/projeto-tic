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

export default function EntryTableRow({
  selected,
  idmovimento,
  tipmov,
  idfor,
  idusuario_alteracao,
  dtinc,
  handleClick,
  onDeleteEntry,
  onEditEntry,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDeleteEntry = async (id) => {
    onDeleteEntry(idmovimento)
    handleCloseMenu()
  }
  const handleEditEntry = async (id) => {
    onEditEntry(idmovimento)
    handleCloseMenu()
  }

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>{idmovimento}</TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {tipmov}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align='justify'>{idfor}</TableCell>

        <TableCell align='justify'>{idusuario_alteracao}</TableCell>

        <TableCell align='justify'>{dtinc}</TableCell>

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
        <MenuItem onClick={() => handleEditEntry(idmovimento)}>
          <Iconify icon="material-symbols:list" sx={{ mr: 2 }} />
          Itens
        </MenuItem>

        <MenuItem onClick={() => handleEditEntry(idmovimento)}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Editar
        </MenuItem>

        <MenuItem onClick={() => handleDeleteEntry(idmovimento)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Deletar
        </MenuItem>
      </Popover>
    </>
  );
}

EntryTableRow.propTypes = {
  idmovimento: PropTypes.any,
  tipmov: PropTypes.any,
  idfor: PropTypes.any,
  idusuario_alteracao: PropTypes.any,
  dtinc: PropTypes.any,
  handleClick: PropTypes.func,
  selected: PropTypes.any,
  onDeleteEntry: PropTypes.func,
  onEditEntry: PropTypes.func,
};
