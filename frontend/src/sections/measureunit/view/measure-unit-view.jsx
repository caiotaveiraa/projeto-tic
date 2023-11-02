import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { novaUnidade, buscaUnidades } from 'src/api/unidademedida';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-rows';
import MeasureUnitTableRow from '../measure-unit-table-row';
import MeasureUnitTableHead from '../measure-unit-table-head';
import { emptyRows, applyFilter, getComparator } from '../utils';
import MeasureUnitTableToolbar from '../measure-unit-table-toolbar';

// ----------------------------------------------------------------------

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#f7f7fa', // Defina a cor de fundo como cinza (substitua 'gray' pela cor desejada)
  borderRadius: '8px', // Defina o raio das bordas para torná-las arredondadas
  boxShadow: 24,
  p: 4,
};
export default function MeasureUnitPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [unidadesArray, setunidadesArray] = useState([]);
  const [unidadesCarregadas, setunidadesCarregadas] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [idunidade, setidunidade] = useState(0)
  const [siglaun, setsiglaun] = useState('')
  const [nomeunidade, setnomeunidade] = useState('')

  async function obterUnidades() {
    try {
      const unidades = await buscaUnidades();
      setunidadesArray(unidades);
      setunidadesCarregadas(true);
    } catch (erro) {
      console.error("Ocorreu um erro:", erro);
    }
  }

  useEffect(() => {
    if (!unidadesCarregadas) {
      obterUnidades();
    }
  }, [unidadesCarregadas]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = unidadesArray.map((n) => n.nomeunidade);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDeleteUnit = (id) => {
    console.log('Entrou')
    // Atualize o estado excluindo o produto com o ID correspondente
    setunidadesArray((prevUnidades) => prevUnidades.filter((unidade) => unidade.idunidade !== id));
  }
  const handleEditUnit = (id) => {
    console.log('Entrou')
    const unidadeEditada = unidadesArray.find(item => item.idunidade === id)
    setidunidade(unidadeEditada.idunidade)
    setsiglaun(unidadeEditada.siglaun)
    setnomeunidade(unidadeEditada.nomeunidade)
    setOpen(true)
  }

    const handleCreate = async (e) => {
      e.preventDefault(); // Impede o comportamento padrão de envio do formulário
      const isInsercao = idunidade === 0
      let formData
      if(isInsercao) // insercao
      {
        formData = {
        siglaun,
        nomeunidade, // Converte para inteiro
        }
      }
      else // Atualizacao
      {
        formData = {
          idunidade,
          siglaun,
          nomeunidade,
        }
      }
      console.log('Criando')
      console.log(formData)
      console.log(idunidade)
      const unidadenova = JSON.stringify(formData)
      try {
        const resp = await novaUnidade(unidadenova, isInsercao);
        setunidadesArray([...unidadesArray, resp]);
        obterUnidades();
        setsiglaun('');
        setnomeunidade('');
        setidunidade(0);
      } catch (erro) {
        console.error("Ocorreu um erro:", erro);
      }
      handleClose()
      console.log(unidadesArray)
  }

  const dataFiltered = applyFilter({
    inputData: unidadesArray,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleCreate}>
            <TextField 
              name="name" label="Sigla da unidade" 
              value={siglaun}
              onChange={(e) => setsiglaun(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField 
              name="nomeunidade" label="Nome da unidade" 
              value={nomeunidade}
              onChange={(e) => setnomeunidade(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 2, // Adiciona margem na parte superior dos botões
              }}
            >
              <Button 
                onClick={handleClose} 
                variant="contained" 
                color="inherit" 
                startIcon={<Iconify icon="material-symbols:cancel" />}
                sx={{ backgroundColor: '#FF6347', color: 'black', marginRight: 2 }}>
                Cancelar
              </Button>
              <Button 
                type='submit'
                variant="contained" 
                color="inherit" 
                startIcon={<Iconify icon="material-symbols:save" />}
                sx={{ backgroundColor: '#98FB98', color: 'black' }}>
                Salvar
              </Button>
          </Box>
          </form>
        </Box>
      </Modal>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Unidades de Medidas</Typography>

        <Button onClick={() => { handleOpen(); setidunidade(0); }} variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          Nova Unidade
        </Button>
      </Stack>

      <Card>
        <MeasureUnitTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <MeasureUnitTableHead
                order={order}
                orderBy={orderBy}
                rowCount={unidadesArray.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'id', label: 'Id' },
                  { id: 'siglaun', label: 'Sigla da Unidade' },
                  { id: 'nomeunidade', label: 'Nome da Unidade' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <MeasureUnitTableRow
                      key={row.idunidade}
                      idunidade={row.idunidade}
                      siglaun={row.siglaun}
                      nomeunidade={row.nomeunidade}
                      selected={selected.indexOf(row.siglaun) !== -1}
                      handleClick={(event) => handleClick(event, row.siglaun)}
                      onDeleteUnidade={handleDeleteUnit}
                      onEditUnidade={handleEditUnit}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, unidadesArray.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={unidadesArray.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
