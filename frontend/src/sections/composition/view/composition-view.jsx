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

import { novaComposicao, buscaComposicoes, deletaComposicoes } from 'src/api/composicoes';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-rows';
import CompositionTableRow from '../composition-table-row';
import CompositionTableHead from '../composition-table-head';
import { emptyRows, applyFilter, getComparator } from '../utils';
import CompositionTableToolbar from '../composition-table-toolbar';


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
export default function CompositionPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [composicoesArray, setcomposicoesArray] = useState([]);
  const [composicoesCarregadas, setcomposicoesCarregadas] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [idproduto, setIdProduto] = useState(0)
  const [idprodutocomp, setIdProdutoComp] = useState(0)
  const [quantidade, setQuantidade] = useState(0)

  async function obterComposicoes() {
    try {
      const composicoes = await buscaComposicoes();
      setcomposicoesArray(composicoes);
      setcomposicoesCarregadas(true);
    } catch (erro) {
      console.error("Ocorreu um erro:", erro);
    }
  }

  useEffect(() => {
    if (!composicoesCarregadas) {
      obterComposicoes();
    }
  }, [composicoesCarregadas]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = composicoesArray.map((n) => n.nomeprod);
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

  const handleDeleteComposicao = async (id) => {
    try {
      const resp = await deletaComposicoes(id)
      console.log(resp)
      if (resp) {
        // REMOVE O PRODUTO EXCLUIDO 
        setcomposicoesArray((prevComposicoes) => prevComposicoes.filter((composicao) => composicao.idcomp !== id));
      }
    } catch (erro) {
      console.error("Ocorreu um erro:", erro);
    }
  }
  const handleEditProduct = (id) => {
    console.log('Entrou')
    const composicaoEditada = composicoesArray.find(item => item.idcomp === id)
    setIdProduto(composicaoEditada.idproduto)
    setIdProdutoComp(composicaoEditada.idprodutocomp)
    setQuantidade(composicaoEditada.quantidade)
    setOpen(true)
  }

    const handleCreate = async (e) => {
      e.preventDefault(); // Impede o comportamento padrão de envio do formulário
      const isInsercao = idproduto === 0
      let formData
      if(isInsercao) // insercao
      {
        formData = {
        idproduto: parseInt(idproduto, 10),
        idprodutocomp: parseInt(idprodutocomp, 10), // Converte para inteiro
        quantidade: parseInt(quantidade, 10), // Converte para inteiro
        }
      }
      else // Atualizacao
      {
        formData = {
          idcomp: parseInt(idproduto, 10),
          idproduto: parseInt(idproduto, 10),
          idprodutocomp: parseInt(idprodutocomp, 10), // Converte para inteiro
          quantidade: parseInt(quantidade, 10), // Converte para inteiro
        }
      }
      console.log('Criando')
      console.log(formData)
      console.log(idproduto)
      const composicaonova = JSON.stringify(formData)
      try {
        const resp = await novaComposicao(composicaonova, isInsercao);
        setcomposicoesArray([...composicoesArray, resp]);
        obterComposicoes();
        setIdProduto(0)
        setIdProdutoComp(0)
        setQuantidade(0)
      } catch (erro) {
        console.error("Ocorreu um erro:", erro);
      }
      handleClose()
      console.log(composicoesArray)
  }

  const dataFiltered = applyFilter({
    inputData: composicoesArray,
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
              name="idproduto" label="Id do Produto" 
              value={idproduto}
              onChange={(e) => setIdProduto(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField 
              name="idprodutocomp" label="Id do Produto Composto" 
              value={idprodutocomp}
              onChange={(e) => setIdProdutoComp(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField 
              name="quantidade" label="Quantidade" 
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
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
        <Typography variant="h4">Composições</Typography>

        <Button onClick={() => { handleOpen(); setIdProduto(0); }} variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          Nova Composição
        </Button>
      </Stack>

      <Card>
        <CompositionTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CompositionTableHead
                order={order}
                orderBy={orderBy}
                rowCount={composicoesArray.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'idproduto', label: 'Id Produto' },
                  { id: 'nomeprod', label: 'Nome Produto' },
                  { id: 'idprodutocomp', label: 'Id Produto Composto' },
                  { id: 'nomeprodcomp', label: 'Nome Produto Composto'},
                  { id: 'quantidade', label: 'Quantidade' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <CompositionTableRow
                      key={row.idcomp}
                      idproduto={row.idproduto}
                      nomeprod={row.tbprodutos_tbprodcomposicao_idprodutoTotbprodutos.nomeprod}
                      idprodutocomp={row.idprodutocomp}
                      nomeprodcomp={row.tbprodutos_tbprodcomposicao_idprodutocompTotbprodutos.nomeprod}
                      quantidade={row.quantidade}
                      selected={selected.indexOf(row.nomeprod) !== -1}
                      handleClick={(event) => handleClick(event, row.nomeprod)}
                      onDeleteComposition={handleDeleteComposicao}
                      onEditComposition={handleEditProduct}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, composicoesArray.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={composicoesArray.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
