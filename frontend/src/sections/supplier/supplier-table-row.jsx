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

import { deletaUnidade } from 'src/api/unidademedida';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function SupplierTableRow({
  selected,
  idunidade,
  siglaun,
  nomeunidade,
  handleClick,
  onDeleteUnidade,
  onEditUnidade,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDeleteUnidade = async (id) => {
    try {
      const resp = await deletaUnidade(id)
      if(resp)
      {
        console.log(resp)
        onDeleteUnidade(idunidade);
      }
    } catch (erro) {
      console.error("Ocorreu um erro:", erro);
    }
    handleCloseMenu()
  }
  const handleEditUnidade = async (id) => {
    console.log(id)
    onEditUnidade(idunidade)
    handleCloseMenu()
  }

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>{idunidade}</TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {siglaun}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align='justify'>{nomeunidade}</TableCell>

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
        <MenuItem onClick={() => handleEditUnidade(idunidade)}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Editar
        </MenuItem>

        <MenuItem onClick={() => handleDeleteUnidade(idunidade)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Deletar
        </MenuItem>
      </Popover>
    </>
  );
}

SupplierTableRow.propTypes = {
  idunidade: PropTypes.any,
  siglaun: PropTypes.any,
  handleClick: PropTypes.func,
  nomeunidade: PropTypes.any,
  selected: PropTypes.any,
  onDeleteUnidade: PropTypes.func,
  onEditUnidade: PropTypes.func,
};
