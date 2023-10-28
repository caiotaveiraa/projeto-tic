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

import { novoProduto, buscaProdutos } from 'src/api/produtos';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
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
export default function UserPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [produtosArray, setProdutosArray] = useState([]);
  const [produtosCarregados, setProdutosCarregados] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [idproduto, setIdProduto] = useState(0)
  const [nomeprod, setnomeprod] = useState('')
  const [idtipprod, setIdTIpProd] = useState(0)
  const [idunidade, setIdUnidade] = useState(0)
  const [quantminima, setQuantMinima] = useState(0)

  async function obterProdutos() {
    try {
      const produtos = await buscaProdutos();
      setProdutosArray(produtos);
      setProdutosCarregados(true);
    } catch (erro) {
      console.error("Ocorreu um erro:", erro);
    }
  }

  useEffect(() => {
    if (!produtosCarregados) {
      obterProdutos();
    }
  }, [produtosCarregados]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = produtosArray.map((n) => n.nomeprod);
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

  const handleDeleteProduct = (id) => {
    console.log('Entrou')
    // Atualize o estado excluindo o produto com o ID correspondente
    setProdutosArray((prevProdutos) => prevProdutos.filter((produto) => produto.idproduto !== id));
  }
  const handleEditProduct = (id) => {
    console.log('Entrou')
    const produtoEditado = produtosArray.find(item => item.idproduto === id)
    setIdProduto(produtoEditado.idproduto)
    setnomeprod(produtoEditado.nomeprod)
    setIdTIpProd(produtoEditado.idtipprod)
    setIdUnidade(produtoEditado.idunidade)
    setQuantMinima(produtoEditado.quantminima)
    setOpen(true)
  }

    const handleCreate = async (e) => {
      e.preventDefault(); // Impede o comportamento padrão de envio do formulário
      const isInsercao = idproduto === 0
      let formData
      if(isInsercao) // insercao
      {
        formData = {
        nomeprod,
        idtipprod: parseInt(idtipprod, 10), // Converte para inteiro
        idunidade: parseInt(idunidade, 10), // Converte para inteiro
        quantminima: parseFloat(quantminima),
        }
      }
      else // Atualizacao
      {
        formData = {
          idproduto,
          nomeprod,
          idtipprod: parseInt(idtipprod, 10), // Converte para inteiro
          idunidade: parseInt(idunidade, 10), // Converte para inteiro
          quantminima: parseFloat(quantminima),
        }
      }
      console.log('Criando')
      console.log(formData)
      console.log(idproduto)
      const produtonovo = JSON.stringify(formData)
      try {
        const resp = await novoProduto(produtonovo, isInsercao);
        setProdutosArray([...produtosArray, resp]);
        obterProdutos();
        setnomeprod('');
        setIdTIpProd(0);
        setIdUnidade(0);
        setQuantMinima(0);
      } catch (erro) {
        console.error("Ocorreu um erro:", erro);
      }
      handleClose()
      console.log(produtosArray)
  }

  const dataFiltered = applyFilter({
    inputData: produtosArray,
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
              value={nomeprod}
              onChange={(e) => setnomeprod(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField 
              name="idtipprod" label="Id do tipo de produto" 
              value={idtipprod}
              onChange={(e) => setIdTIpProd(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField 
              name="idunidade" label="Id da Unidade de Medida" 
              value={idunidade}
              onChange={(e) => setIdUnidade(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField 
              type='number'
              name="quantminima" label="Quantidade minima" 
              value={quantminima}
              onChange={(e) => setQuantMinima(e.target.value)}
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
        <Typography variant="h4">Produtos</Typography>

        <Button onClick={() => { handleOpen(); setIdProduto(0); }} variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          Novo produto
        </Button>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={produtosArray.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'id', label: 'Id' },
                  { id: 'nome', label: 'Nome' },
                  { id: 'idtipprod', label: 'Tipo de Produto' },
                  { id: 'quantminima', label: 'Quantidade Minima'},
                  { id: 'idunidade', label: 'Unidade de Medida' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.idproduto}
                      idproduto={row.idproduto}
                      nomeprod={row.nomeprod}
                      idtipprod={row.tbtiposprodutos.nometipprod}
                      idunidade={row.tbunidademedida.siglaun}
                      quantminima={row.quantminima}
                      selected={selected.indexOf(row.nomeprod) !== -1}
                      handleClick={(event) => handleClick(event, row.nomeprod)}
                      onDeleteProduct={handleDeleteProduct}
                      onEditProduct={handleEditProduct}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, produtosArray.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={produtosArray.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
