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

import { getNomeUsuario } from 'src/api/nomeusuario';
import { novoMovimento, buscaMovimentos } from 'src/api/movimentos';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import EntryTableRow from '../entry-table-row';
import TableEmptyRows from '../table-empty-rows';
import EntryTableHead from '../entry-table-head';
import EntryTableToolbar from '../entry-table-toolbar';
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
export default function EntryPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [movimentosArray, setmovimentosArray] = useState([]);
  const [movimentosCarregados, setmovimentosCarregados] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [idmovimento, setidmovimento] = useState(0)
  const [tipmov, settipmov] = useState('')
  const [idfor, setidfor] = useState(0)
  const account = getNomeUsuario()

  async function obterMovimentos() {
    try {
      const produtos = await buscaMovimentos();
      setmovimentosArray(produtos);
      setmovimentosCarregados(true);
    } catch (erro) {
      console.error("Ocorreu um erro:", erro);
    }
  }

  useEffect(() => {
    if (!movimentosCarregados) {
      obterMovimentos();
    }
  }, [movimentosCarregados]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = movimentosArray.map((n) => n.tipmov);
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

  const handleDeleteEntry = (id) => {
    console.log('Entrou')
    // Atualize o estado excluindo o produto com o ID correspondente
    setmovimentosArray((prevEntry) => prevEntry.filter((entry) => entry.idmovimento !== id));
  }
  const handleEditEntry = (id) => {
    console.log('Entrou')
    const movimentoEditado = movimentosArray.find(item => item.idmovimento === id)
    setidmovimento(movimentoEditado.idmovimento)
    settipmov(movimentoEditado.tipmov)
    setidfor(movimentoEditado.idfor)
    setOpen(true)
  }

    const handleCreate = async (e) => {
      e.preventDefault(); // Impede o comportamento padrão de envio do formulário
      const isInsercao = idmovimento === 0
      let formData
      if(isInsercao) // insercao
      {
        formData = {
        tipmov,
        idfor: parseInt(idfor, 10), // Converte para inteiro
        idusuario_alteracao: parseInt(account.idusuario, 10)
        }
      }
      else // Atualizacao
      {
        formData = {
          idmovimento,
          tipmov,
          idfor: parseInt(idfor, 10), // Converte para inteiro
          idusuario_alteracao: parseInt(account.idusuario, 10)
        }
      }
      console.log('Criando')
      const movimentonovo = JSON.stringify(formData)
      console.log(movimentonovo)
      console.log(isInsercao)
      try {
        const resp = await novoMovimento(movimentonovo, isInsercao);
        setmovimentosArray([...movimentosArray, resp]);
        obterMovimentos();
        setidmovimento(0)
        settipmov('');
        setidfor(0);
      } catch (erro) {
        console.error("Ocorreu um erro:", erro);
      }
      handleClose()
      console.log(movimentosArray)
  }

  const dataFiltered = applyFilter({
    inputData: movimentosArray,
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
              name="tipmov" label="Tipo de Movimento" 
              value={tipmov}
              onChange={(e) => settipmov(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField 
              name="idfor" label="Id do fornecedor" 
              value={idfor}
              onChange={(e) => setidfor(e.target.value)}
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
        <Typography variant="h4">Movimentações</Typography>

        <Button onClick={() => { handleOpen(); setidmovimento(0); }} variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          Nova Movimentação
        </Button>
      </Stack>

      <Card>
        <EntryTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <EntryTableHead
                order={order}
                orderBy={orderBy}
                rowCount={movimentosArray.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'id', label: 'Id' },
                  { id: 'tipmov', label: 'Tipo de Movimento' },
                  { id: 'fornecedor', label: 'Fornecedor' },
                  { id: 'usuario', label: 'Criada por'},
                  { id: 'data', label: 'Data' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <EntryTableRow
                      key={row.idmovimento}
                      idmovimento={row.idmovimento}
                      tipmov={row.tipmov}
                      idfor={row.tbfornecedores.nomefor}
                      idusuario_alteracao={row.tbusuarios.usu_login}
                      data={row.dtinc}
                      selected={selected.indexOf(row.tipmov) !== -1}
                      handleClick={(event) => handleClick(event, row.tipmov)}
                      onDeleteEntry={handleDeleteEntry}
                      onEditEntry={handleEditEntry}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, movimentosArray.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={movimentosArray.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
