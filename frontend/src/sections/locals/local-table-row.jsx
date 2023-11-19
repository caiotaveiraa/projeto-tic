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


export default function LocalTableRow({
  selected,
  idlocal,
  nomelocal,
  handleClick,
  onDeleteLocal,
  onEditLocal,
}) {
    const [open, setOpen] = useState(null);
  
    const handleOpenMenu = (event) => {
      setOpen(event.currentTarget);
    };
  
    const handleCloseMenu = () => {
      setOpen(null);
    };
  
     const handleDeleteLocal = async (id) => {
      const confirmacao = window.confirm("Tem certeza que deseja deletar o local de estoque?");
      // Se o usuário clicou em "OK", chama a função de deletar
      if (confirmacao) {
        onDeleteLocal(id);
      }
      handleCloseMenu()
    }
    const handleEditLocal = async (id) => {
      console.log(id)
      onEditLocal(idlocal)
      handleCloseMenu()
    } 
  
    return (
      <>
        <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
          <TableCell padding="checkbox">
            <Checkbox disableRipple checked={selected} onChange={handleClick} />
          </TableCell>
  
          <TableCell>{idlocal}</TableCell>
  
          <TableCell component="th" scope="row" padding="none">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="subtitle2" noWrap>
                {nomelocal}
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
          <MenuItem onClick={() => handleEditLocal(idlocal)}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Editar
          </MenuItem>
  
          <MenuItem onClick={() => handleDeleteLocal(idlocal)} sx={{ color: 'error.main' }}>
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Deletar
          </MenuItem>

        

        </Popover>
      </>
    );
  }
  
  
  LocalTableRow.propTypes = {
    idlocal: PropTypes.any,
    nomelocal: PropTypes.any,
    handleClick: PropTypes.func,
    selected: PropTypes.any,
    onDeleteLocal: PropTypes.func,
    onEditLocal: PropTypes.func,
  };
  
  