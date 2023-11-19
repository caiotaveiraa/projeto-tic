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

import { gerarRelatorioSaldoEstoquePDF } from 'src/api/relatorios';
import { novoLocal, buscaLocais, deletaLocal } from 'src/api/Locais';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import LocalTableRow from '../local-table-row';
import LocalTableHead from '../local-table-head';
import TableEmptyRows from '../table-empty_rows';
import LocalTableToolbar from '../local-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

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
export default function LocalPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [locaisArray, setLocaisArray] = useState([]);
  const [locaisCarregados, setLocaisCarregados] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [idlocal, setIdLocal] = useState(0)
  const [nomelocal, setNomeLocal] = useState('');

  async function obterLocais() {
    try {
      const locais = await buscaLocais();
      setLocaisArray(locais);
      setLocaisCarregados(true);
    } catch (erro) {
      console.error("Ocorreu um erro:", erro);
    }
  }

  useEffect(() => {
    if (!locaisCarregados) {
      obterLocais();
    }
  }, [locaisCarregados]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = locaisArray.map((n) => n.nomelocal);
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

  const handleDeleteLocal = async (id) => {
    try {
      const resp = await deletaLocal(id)
      console.log(resp)
      if (resp) {
        // REMOVE O LOCAL EXCLUIDO 
        setLocaisArray((prevLocais) => prevLocais.filter((local) => local.idlocal !== id));
      }
    } catch (erro) {
      console.error("Ocorreu um erro:", erro);
    }
  }
  const handleEditLocal = (id) => {
    console.log('Entrou')
    const localEditado = locaisArray.find(local => local.idlocal === id)
    setIdLocal(localEditado.idlocal)
    setNomeLocal(localEditado.nomelocal)
    setOpen(true)
  }

    const handleCreate = async (e) => {
      e.preventDefault(); // Impede o comportamento padrão de envio do formulário
      const isInsercao = idlocal === 0
      let formData
      if(isInsercao) // insercao
      {
        formData = {
        nomelocal,
        }
      }
      else // Atualizacao
      {
        formData = {
          idlocal,
          nomelocal,
        }
      }
      console.log('Criando novo local de estoque!')
      console.log(formData)
      console.log(idlocal)
      const localNovo = JSON.stringify(formData)
      try {
        const resp = await novoLocal(localNovo, isInsercao);
        setLocaisArray([...locaisArray, resp]);
        obterLocais();
        setNomeLocal('');
      } catch (erro) {
        console.error("Ocorreu um erro:", erro);
      }
      handleClose()
      console.log(locaisArray)
  }

  const dataFiltered = applyFilter({
    inputData: locaisArray,
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
              name="name" label="Nome" 
              value={nomelocal}
              onChange={(e) => setNomeLocal(e.target.value)}
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
        <Typography variant="h4">Locais de Estoque</Typography>

        <Button onClick={() => { handleOpen(); setIdLocal(0); }} variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          Novo Local de Estoque
        </Button>

        <Button onClick={() => { gerarRelatorioSaldoEstoquePDF(0,0); setIdLocal(0); }} variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          Relatorio
        </Button>

      </Stack>

      <Card>
        <LocalTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <LocalTableHead
                order={order}
                orderBy={orderBy}
                rowCount={locaisArray.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'id', label: 'Id' },
                  { id: 'nomeLocal', label: 'Nome Local de Estoque' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <LocalTableRow
                      key={row.idlocal}
                      idlocal={row.idlocal}
                      nomelocal={row.nomelocal}
                      selected={selected.indexOf(row.nomelocal) !== -1}
                      handleClick={(event) => handleClick(event, row.nomelocal)}
                      onDeleteLocal={handleDeleteLocal}
                      onEditLocal={handleEditLocal}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, locaisArray.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={locaisArray.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
