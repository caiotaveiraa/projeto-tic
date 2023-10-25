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

// import { deletaProdutos } from 'src/api/produtos';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  nomeprod,
  idtipprod,
  idunidade,
  quantminima,
  handleClick,
  idproduto
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDeleteProduct = () => {
    console.log(`Clicou`)
    handleCloseMenu()

  }

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>{idproduto}</TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {nomeprod}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{idtipprod}</TableCell>

        <TableCell>{idunidade}</TableCell>

        <TableCell>{quantminima}</TableCell>

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
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Editar
        </MenuItem>

        <MenuItem onClick={handleDeleteProduct} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Deletar
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  idproduto: PropTypes.any,
  nomeprod: PropTypes.any,
  handleClick: PropTypes.func,
  quantminima: PropTypes.any,
  idtipprod: PropTypes.any,
  idunidade: PropTypes.any,
  selected: PropTypes.any,
};
