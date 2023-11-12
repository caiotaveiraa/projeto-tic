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

import { novoFornecedor, buscaFornecedor } from 'src/api/fornecedor';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-rows';
import SupplierTableRow from '../supplier-table-row';
import SupplierTableHead from '../supplier-table-head';
import SupplierTableToolbar from '../supplier-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#f7f7fa',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
  maxHeight: '80vh', 
  overflowY: 'auto',
};

export default function SupplierPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [fornecedoresArray, setfornecedoresArray] = useState([]);
  const [fornecedoresCarregados, setfornecedoresCarregados] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [idfor, setidfor] = useState(0)
  const [nomefor, setnomefor] = useState('')
  const [fisjur, setfisjur] = useState('')
  const [cnpjcpf, setcnpjcpf] = useState('')
  const [telefone, settelefone] = useState('')
  const [cep, setcep] = useState('')
  const [cidade, setcidade] = useState('')
  const [rua, setrua] = useState('')
  const [bairro, setbairro] = useState('')
  const [numero, setnumero] = useState('')
  const [complemento, setcomplemento] = useState('')
  const [email, setemail] = useState('')



  async function obterFornecedores() {
    try {
      const fornecedores = await buscaFornecedor();
      setfornecedoresArray(fornecedores);
      setfornecedoresCarregados(true);
    } catch (erro) {
      console.error("Ocorreu um erro:", erro);
    }
  }

  useEffect(() => {
    if (!fornecedoresCarregados) {
      obterFornecedores();
    }
  }, [fornecedoresCarregados]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = fornecedoresArray.map((n) => n.nomefor);
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

  const handleDeleteFornecedor = (id) => {
    console.log('Entrou')
    // Atualize o estado excluindo o produto com o ID correspondente
    setfornecedoresArray((prevFornecedores) => prevFornecedores.filter((fornecedor) => fornecedor.idfor !== id));
  }
  const handleEditFornecedor = (id) => {
    console.log('Entrou')
    const fornecedorEditado = fornecedoresArray.find(fornecedor => fornecedor.idfor === id)
    setidfor(fornecedorEditado.idfor)
    setnomefor(fornecedorEditado.nomefor)
    setfisjur(fornecedorEditado.fisjur)
    setcnpjcpf(fornecedorEditado.cnpjcpf)
    settelefone(fornecedorEditado.telefone)
    setemail(fornecedorEditado.email)
    setcep(fornecedorEditado.cep)
    setcidade(fornecedorEditado.cidade)
    setrua(fornecedorEditado.rua)
    setbairro(fornecedorEditado.bairro)
    setnumero(fornecedorEditado.numero)
    setcomplemento(fornecedorEditado.complemento)
    setOpen(true)
  }

    const handleCreate = async (e) => {
      e.preventDefault(); // Impede o comportamento padrão de envio do formulário
      const isInsercao = idfor === 0
      let formData
      if(isInsercao) // insercao
      {
        formData = {
        nomefor,
        fisjur, // Converte para inteiro
        cnpjcpf,
        telefone,
        email,
        cep,
        cidade,
        rua,
        bairro,
        numero,
        complemento
        }
      }
      else // Atualizacao
      {
        formData = {
          idfor,
          nomefor,
          fisjur,
          cnpjcpf,
          telefone,
          email,
          cep,
          cidade,
          rua,
          bairro,
          numero,
          complemento
        }
      
      }
      console.log('Criando')
      console.log(formData)
      console.log(idfor)
      const fornecedornovo = JSON.stringify(formData)
      try {
        const resp = await novoFornecedor(fornecedornovo, isInsercao);
        setfornecedoresArray([...fornecedoresArray, resp]);
        obterFornecedores();
        setnomefor('');
        setfisjur('');
        setidfor(0);
      } catch (erro) {
        console.error("Ocorreu um erro:", erro);
      }
      handleClose()
      console.log(fornecedoresArray)
  }

  const dataFiltered = applyFilter({
    inputData: fornecedoresArray,
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
              value={nomefor}
              onChange={(e) => setnomefor(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField 
              name="fisjur" label="Físico / Jurídico" 
              value={fisjur}
              onChange={(e) => setfisjur(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField 
              name="cnpjcpf" label="CNPJ / CPF" 
              value={cnpjcpf}
              onChange={(e) => setcnpjcpf(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField 
              name="telefone" label="Telefone" 
              value={telefone}
              onChange={(e) => settelefone(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField 
              name="email" label="Email" 
              value={email}
              onChange={(e) => setemail(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField 
              name="cep" label="CEP" 
              value={cep}
              onChange={(e) => setcep(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField 
              name="cidade" label="Cidade" 
              value={cidade}
              onChange={(e) => setcidade(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField 
              name="rua" label="Rua" 
              value={rua}
              onChange={(e) => setrua(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField 
              name="bairro" label="Bairro" 
              value={bairro}
              onChange={(e) => setbairro(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField 
              name="numero" label="Numero" 
              value={numero}
              onChange={(e) => setnumero(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField 
              name="complemento" label="Complemento" 
              value={complemento}
              onChange={(e) => setcomplemento(e.target.value)}
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
        <Typography variant="h4">Fornecedores</Typography>

        <Button onClick={() => { handleOpen(); setidfor(0); }} variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          Novo Fornecedor
        </Button>
      </Stack>

      <Card>
        <SupplierTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <SupplierTableHead
                order={order}
                orderBy={orderBy}
                rowCount={fornecedoresArray.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'id', label: 'Id' },
                  { id: 'nomefor', label: 'Nome' },
                  { id: 'fisjur', label: 'Físico / Jurídico' },
                  { id: 'cnpjcpf', label: 'CNPJ / CPF' },
                  { id: 'telefone', label: 'Telefone' },
                  { id: 'email', label: 'Email' },
                  { id: 'cep', label: 'CEP' },
                  { id: 'cidade', label: 'Cidade' },
                  { id: 'rua', label: 'Rua' },
                  { id: 'bairro', label: 'Bairro' },
                  { id: 'numero', label: 'Numero' },
                  { id: 'complemento', label: 'Complemento' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <SupplierTableRow
                      key={row.idfor}
                      idfor={row.idfor}
                      nomefor={row.nomefor}
                      fisjur={row.fisjur}
                      cnpjcpf={row.cnpjcpf}
                      telefone={row.telefone}
                      email={row.email}
                      cep={row.cep}
                      cidade={row.cidade}
                      rua={row.rua}
                      bairro={row.bairro}
                      numero={row.numero}
                      complemento={row.complemento}
                      selected={selected.indexOf(row.nomefor) !== -1}
                      handleClick={(event) => handleClick(event, row.nomefor)}
                      onDeleteFornecedor={handleDeleteFornecedor}
                      onEditFornecedor={handleEditFornecedor}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, fornecedoresArray.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={fornecedoresArray.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
