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

import { novoTipo, buscaTipos, deletaTipo } from 'src/api/tiposprodutos';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-rows';
import ProducTypeTableRow from '../product-type-table-row';
import ProducTypeTableHead from '../product-type-table-head';
import { emptyRows, applyFilter, getComparator } from '../utils';
import ProducTypeTableToolbar from '../product-type-table-toolbar';

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
export default function ProductTypePage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [tiposArray, settiposArray] = useState([]);
  const [tiposCarregados, settiposCarregados] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [idtipprod, setidtipprod] = useState(0)
  const [nometipprod, setnometipprod] = useState('')

  async function obterTipos() {
    try {
      const unidades = await buscaTipos();
      settiposArray(unidades);
      settiposCarregados(true);
    } catch (erro) {
      console.error("Ocorreu um erro:", erro);
    }
  }

  useEffect(() => {
    if (!tiposCarregados) {
      obterTipos();
    }
  }, [tiposCarregados]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tiposArray.map((n) => n.nometipprod);
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

  const handleDeleteTipo = async (id) => {
    try {
      const resp = await deletaTipo(id)
      console.log(resp)
      if (resp) {
        // REMOVE A UNIDADE EXCLUIDA
        settiposArray((prevUnidades) => prevUnidades.filter((unidade) => unidade.idtipprod !== id));
      }
    } catch (erro) {
      console.error("Ocorreu um erro:", erro);
    }
  }
  const handleEditTipo = (id) => {
    console.log('Entrou')
    const tipoEditado = tiposArray.find(item => item.idtipprod === id)
    setidtipprod(tipoEditado.idtipprod)
    setnometipprod(tipoEditado.nometipprod)
    setOpen(true)
  }

  const handleCreate = async (e) => {
    e.preventDefault(); // Impede o comportamento padrão de envio do formulário
    const isInsercao = idtipprod === 0
    let formData
    if (isInsercao) // insercao
    {
      formData = {
        nometipprod, // Converte para inteiro
      }
    }
    else // Atualizacao
    {
      formData = {
        idtipprod,
        nometipprod,
      }
    }
    console.log('Criando')
    console.log(formData)
    console.log(idtipprod)
    const tiponovo = JSON.stringify(formData)
    try {
      const resp = await novoTipo(tiponovo, isInsercao);
      settiposArray([...tiposArray, resp]);
      obterTipos();
      setnometipprod('');
      setidtipprod(0);
    } catch (erro) {
      console.error("Ocorreu um erro:", erro);
    }
    handleClose()
    console.log(tiposArray)
  }

  const handleClear = () => {
    setnometipprod('')
    setidtipprod(0)
  }

  const dataFiltered = applyFilter({
    inputData: tiposArray,
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
              name="nometipprod" label="Nome do Tipo"
              value={nometipprod}
              onChange={(e) => setnometipprod(e.target.value)}
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
        <Typography variant="h4">Tipos de Produtos</Typography>

        <Button onClick={() => { handleOpen(); handleClear(); }} variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          Novo Tipo
        </Button>
      </Stack>

      <Card>
        <ProducTypeTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ProducTypeTableHead
                order={order}
                orderBy={orderBy}
                rowCount={tiposArray.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'id', label: 'Id' },
                  { id: 'nometipprod', label: 'Nome do Tipo' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <ProducTypeTableRow
                      key={row.idtipprod}
                      idtipprod={row.idtipprod}
                      nometipprod={row.nometipprod}
                      selected={selected.indexOf(row.siglaun) !== -1}
                      handleClick={(event) => handleClick(event, row.siglaun)}
                      onDeleteTipo={handleDeleteTipo}
                      onEditTipo={handleEditTipo}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, tiposArray.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={tiposArray.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
