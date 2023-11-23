import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

// ----------------------------------------------------------------------


export default function LocalTableRow({
  selected,
  indice,
  nome,
  handleClick,
  onGerarRel,
}) {

    const handleGerarRelatorio = async (id) => {
      console.log(id)
      onGerarRel(id);
    }

    return (
        <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
          <TableCell padding="checkbox">
            <Checkbox disableRipple checked={selected} onChange={handleClick} />
          </TableCell>
  
          <TableCell>{indice}</TableCell>
  
          <TableCell component="th" scope="row" padding="none">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="subtitle2" noWrap>
                {nome}
              </Typography>
            </Stack>
          </TableCell>
  
          <TableCell align="right">
          <IconButton
          onClick={() => handleGerarRelatorio(indice)}
          sx={{backgroundColor: '#98FB98', color: 'black','&:hover': {backgroundColor: '#98FB98',}, borderRadius: 10,  fontSize: '18px', }}
          
        >
          Filtrar Relatório
        </IconButton>
          </TableCell>
        </TableRow>
    );
  }
  
  
  LocalTableRow.propTypes = {
    indice: PropTypes.any,
    nome: PropTypes.any,
    handleClick: PropTypes.func,
    selected: PropTypes.any,
    onGerarRel: PropTypes.func,
  };
  
  