import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { gerarRelatorioFornecedorPDF, gerarRelatorioSaldoEstoquePDF, gerarRelatorioMovimentacoesPDF } from 'src/api/relatorios';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty_rowa';
import LocalTableRow from '../relatorios-table-row'; 
import RelatoriosTableHead from '../relatorios-table-head';
import RelatorioTableToolbar from '../relatorios-table-toolbar';
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

  const relatorios = [
    { indice: 1, nome: 'Relatório de Saldo de Produtos Por Local de Estoque' },
    { indice: 2, nome: 'Relatório de Movimentações' },
    { indice: 3, nome: 'Relatório de Fornecedores' }
    
  ];

  // Estados e funções relacionadas à Modal 1
  const [openModal1, setOpenModal1] = useState(false);
  const [idProduto, setIdProduto] = useState('');
  const [idLocalestoque, setIdLocalestoque] = useState('');

  const handleOpenModal1 = () => setOpenModal1(true);
  const handleCloseModal1 = () => setOpenModal1(false);

  // Estados e funções relacionadas à Modal 2
  const [openModal2, setOpenModal2] = useState(false);
  const [tipoMov, setTipoMov] = useState('');
  const [idMovimento, setIdMovimento] = useState('');
  const [idFornecedorModal2, setIdFornecedorModal2] = useState('');

  const handleOpenModal2 = () => setOpenModal2(true);
  const handleCloseModal2 = () => setOpenModal2(false);

  // Estados e funções relacionadas à Modal 3
  const [openModal3, setOpenModal3] = useState(false);
  const [idFornecedorModal3, setIdFornecedorModal3] = useState('');
  const [fisJur, setFisJur] = useState('0');

  const   handleOpenModal3 = () => setOpenModal3(true);
  const handleCloseModal3 = () => setOpenModal3(false);
  
  const handleTipoMovChange = (event) => {
    setTipoMov(event.target.value);
  };

  const handleTipoPessoaChange = (event) => {
    setFisJur(event.target.value);
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {    
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = relatorios.map((n) => n.nomelocal);
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

  
  const handleGerarRelatorio = async (id) => {
    // Lógica para determinar qual modal abrir com base no ID
    if (id === 1) {
      initializeModal1();
      handleOpenModal1();
    } else if (id === 2) {
      initializeModal2();
      handleOpenModal2();
    } else if (id === 3) {
      initializeModal3();
      handleOpenModal3();
    }
  };

  const handleFiltrarModal1 = async () => {
    const idProdutoParam = idProduto?.trim() ||'0';
    const idLocalestoqueParam = idLocalestoque?.trim() || '0';
  
    gerarRelatorioSaldoEstoquePDF(idProdutoParam, idLocalestoqueParam);
    handleCloseModal1();
  };
  
  const handleFiltrarModal2 = async () => {
    const tipoMovParam = tipoMov?.trim() || '0';
    const idMovimentoParam = idMovimento?.trim() || '0';
    const idFornecedorParam = idFornecedorModal2?.trim() || '0';
    
    gerarRelatorioMovimentacoesPDF(tipoMovParam, idMovimentoParam, idFornecedorParam);
    handleCloseModal2();
  };
  
  const handleFiltrarModal3 = async () => {
    const idFornecedorParam = idFornecedorModal3?.trim() || '0';
    const fisJurParam = fisJur?.trim() || '0';
  
    gerarRelatorioFornecedorPDF(idFornecedorParam, fisJurParam);
    handleCloseModal3();
  };
  
  const initializeModal1 = () => {
    setIdProduto('');
    setIdLocalestoque('');
  };

  const initializeModal2 = () => {
    setTipoMov('0'); 
    setIdMovimento('');
    setIdFornecedorModal2('');
    
    setFisJur('0');
    setIdFornecedorModal3('');
  };

  const initializeModal3 = () => {
    setFisJur('0');
    setIdFornecedorModal3('');
  };


  const dataFiltered = applyFilter({
    inputData: relatorios,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      {/* Modal 1 */}
    <Modal
      open={openModal1}
      onClose={handleCloseModal1}
      aria-labelledby="modal1-title"
      aria-describedby="modal1-description"
    >
      <Box sx={style}>
        <form onSubmit={handleFiltrarModal1}>
          <TextField
            label="Cód. do Produto"
            value={idProduto}
            onChange={(e) => setIdProduto(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Cód. Local Estoque"
            value={idLocalestoque}
            onChange={(e) => setIdLocalestoque(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
           <Button 
                onClick={handleCloseModal1 } 
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
                Filtrar e Gerar PDF
          </Button>
        </form>
      </Box>
    </Modal>

    {/* Modal 2 */}
    <Modal
      open={openModal2}
      onClose={handleCloseModal2}
      aria-labelledby="modal2-title"
      aria-describedby="modal2-description"
    >
      <Box sx={style}>
        <form onSubmit={handleFiltrarModal2}>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="tipoMov-label">Tipo de Movimento</InputLabel>
        <Select
          labelId="tipoMov-label"
          id="tipoMov"
          value={tipoMov}
          label="Tipo de Movimento"
          onChange={handleTipoMovChange}
        >
          <MenuItem value="0">Ambos</MenuItem>
          <MenuItem value="1">Entradas</MenuItem>
          <MenuItem value="2">Saídas</MenuItem>
        </Select>
      </FormControl>
          <TextField
            label="Cód. do Movimento"
            value={idMovimento}
            onChange={(e) => setIdMovimento(e.target.value)}
            fullWidth sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Cód. do Fornecedor"
            value={idFornecedorModal2}
            onChange={(e) => setIdFornecedorModal2(e.target.value)}
            fullWidth sx={{ marginBottom: 2 }}
          />
          <Button 
                onClick={handleCloseModal2} 
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
                Filtrar e Gerar PDF
          </Button>

        </form>
      </Box>
    </Modal>

    {/* Modal 3 */}
    <Modal
      open={openModal3}
      onClose={handleCloseModal3}
      aria-labelledby="modal3-title"
      aria-describedby="modal3-description"
    >
      <Box sx={style}>
        <form onSubmit={handleFiltrarModal3}>
          <TextField
            label="Cód. do Fornecedor"
            value={idFornecedorModal3}
            onChange={(e) => setIdFornecedorModal3(e.target.value)}
            fullWidth sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth sx={{ marginBottom: 1 }}>
            <InputLabel id="tipoPessoa-label">Tipo de Pessoa</InputLabel>
            <Select
              labelId="tipoPessoa-label"
              id="tipoPessoa"
              value={fisJur}
              label="Tipo de Pessoa"
              onChange={handleTipoPessoaChange}
            >
              <MenuItem value="0">Ambos</MenuItem>
              <MenuItem value="1">Jurídica</MenuItem>
              <MenuItem value="2">Física</MenuItem>
            </Select>
          </FormControl>
          <Button 
                onClick={handleCloseModal3} 
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
                Filtrar e Gerar PDF
          </Button>

        </form>
      </Box>
    </Modal>


      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Relatórios</Typography>

      </Stack>

      <Card>
        <RelatorioTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <RelatoriosTableHead
                order={order}
                orderBy={orderBy}
                rowCount={relatorios.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'indice', label: 'Indice' },
                  { id: 'nome', label: 'Modelo do Relatório' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <LocalTableRow
                      key={row.idlocal}
                      indice={row.indice}
                      nome={row.nome}
                      selected={selected.indexOf(row.nomelocal) !== -1}
                      handleClick={(event) => handleClick(event, row.nomelocal)}
                      onGerarRel={handleGerarRelatorio}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, relatorios.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={relatorios.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
