import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Container from '@mui/material/Container';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { getNomeUsuario } from 'src/api/nomeusuario';
import { modificarItens } from 'src/api/movimentositens';
import { novoMovimento, buscaMovimentos, deletaMovimento } from 'src/api/movimentos';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import EntryTableRow from '../entry-table-row';
import TableEmptyRows from '../table-empty-rows';
import EntryTableHead from '../entry-table-head';
import EntryTableToolbar from '../entry-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';


// ----------------------------------------------------------------------

// Estilo da modal
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30%',
  height: '60%',
  bgcolor: '#f7f7fa',
  borderRadius: '8px',
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

  const [tabValue, setTabValue] = useState(0); // Tabs da modal

  const handleTabChange = (event, newValue) => { // Mudar tab do modal
    setTabValue(newValue);
  };

  // Dados do usuário
  const account = getNomeUsuario()

  // Dados das movimentações

  const [idmovimento, setidmovimento] = useState(0)
  const [tipmov, settipmov] = useState('')
  const [idfor, setidfor] = useState(0)

  // Itens das movimentações
  const [itens, setItens] = useState([]);
  // Itens adicionados
  const [novosItens, setNovosItens] = useState([])
  // Estado para o índice do próximo item a ser adicionado
  const [indiceItem, setIndiceItem] = useState(1); 

  // Função que traz todos os movimentos cadastrados
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

  // FUNCOES DE CRUD - TB MOVIMENTOS  E TBMOVIMENTOSITENS

  // SETAR DADOS PARA EDIÇÃO

  const handleEditEntry = (id) => {
    const movimentoEditado = movimentosArray.find(item => item.idmovimento === id)
    const itensAssociados = movimentoEditado.tbmovitens || [];

    // Adiciona um índice crescente para cada item em itensAssociados
    const itensComIndice = itensAssociados.map((item, index) => ({
      ...item,
      seqitem: index + 1,
    }
    ));

    const ultimoIndice = itensComIndice.reduce((maxIndex, item) => Math.max(maxIndex, item.seqitem), 0);

    setTabValue(0)
    setNovosItens([])
    setidmovimento(movimentoEditado.idmovimento)
    settipmov(movimentoEditado.tipmov)
    setidfor(movimentoEditado.idfor)
    setItens(itensComIndice);
    setIndiceItem(ultimoIndice + 1) // Seta o indice do ultimo item do movimento
    setOpen(true);
  }

  // INSERCAO E EDIÇÃO

  const handleCreate = async (e) => {
    e.preventDefault(); // Impede o comportamento padrão de envio do formulário
    console.log(idmovimento)
    const isInsercao = idmovimento === 0
    let formData
    if (isInsercao) // insercao
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
    const movimentonovo = JSON.stringify(formData)
    try {
      const resp = await novoMovimento(movimentonovo, isInsercao)
      // Usar Promise.all para aguardar todas as chamadas assíncronas no map
      // O map é usado para fazer uma requisição na API de adicionar item para cada item novo adicionado.
      await Promise.all(
        novosItens.map(async (item) => {
          const dadositem = {
            idmovimento: resp.idmovimento,
            idproduto: item.idproduto,
            idlocal: item.idlocal,
            quantidade: item.quantidade
          }
          console.log(dadositem)
          const novoitem = JSON.stringify(dadositem);
          console.log(novoitem)
          const resp2 = await modificarItens(novoitem);
          console.log(resp2)
        })
      );
      setmovimentosArray([...movimentosArray, resp]);
      obterMovimentos();
      setidmovimento(0)
      settipmov('');
      setidfor(0);
    } catch (erro) {
      console.error("Ocorreu um erro:", erro);
    }
    handleClose()
  }

  // REMOCAO

  const handleDeleteEntry = async (id) => {
    try {
      const resp = await deletaMovimento(id)
      console.log(resp)
      if (resp) {
        // REMOVE O MOVIMENTO EXCLUIDO 
        setmovimentosArray((prevEntry) => prevEntry.filter((entry) => entry.idmovimento !== id));
      }
    } catch (erro) {
      console.error("Ocorreu um erro:", erro);
    }
  }

  // LIMPA O FORMULARIO
  const handleClear = () => {
    setItens([])
    setNovosItens([])
    setTabValue(0) // Primeira tab da modal
    setidmovimento(0)
    setidfor(0)
    settipmov('')
    setIndiceItem(1)
  }

  // Função para adicionar um novo item à lista de itens
  const handleAddItem = () => {
    const novoItem = {
      idproduto: 0,
      idlocal: 0,
      quantidade: 0,
      dtinc: new Date(),
      seqitem: indiceItem
    };
    setItens((prevItens) => [...prevItens, novoItem]);
    setNovosItens((prevItens) => [...prevItens, novoItem]);
    console.log(novosItens)
    setIndiceItem((prevIndice) => prevIndice + 1);
  };

  // Função para atualizar o vetor de itens com os itens novos

  const handleItemChange = (event, indice, campo) => {
    let mod
    // Atualiza o estado 'itens' corretamente
    setItens((prevItens) => {
      const modificacoes = prevItens.map((item) =>
        item.seqitem === indice
          ? {
            ...item,
            [campo]:
              campo === 'data'
                ? new Date(event.target.value).toISOString()
                : Number(event.target.value),
          }
          : item
      )
      mod = modificacoes
      return modificacoes;
    })

    // Atualiza o estado 'novosItens' apenas para os itens que já existem em 'itens'
    setNovosItens((prevNovosItens) => {
      const novosItensAtualizados = prevNovosItens.map((novoItem) =>
        mod.find((item) => item.seqitem === novoItem.seqitem)
          ? { ...novoItem, [campo]: mod.find((item) => item.seqitem === novoItem.seqitem)[campo] }
          : novoItem
      )
      return novosItensAtualizados;
    })
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
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Detalhes Movimentação" />
              <Tab label="Itens" />
            </Tabs>

            {tabValue === 0 && (
              <div
                style={{
                  marginTop: 15
                }}
              >
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
                  sx={{ marginBottom: 2, marginTop: 5 }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: 2, // Adiciona margem na parte superior dos botões
                  }}
                >
                  <Button
                    onClick={() => handleTabChange(null, 1)}
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="ooui:next-ltr" />}
                    sx={{ backgroundColor: '#98FB98', color: 'black', marginRight: 2 }}
                  >
                    Adicionar itens
                  </Button>
                </Box>
              </div>
            )}

            {tabValue === 1 && (
              // Conteúdo da aba "Itens"
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Índice</TableCell>
                        <TableCell>ID Produto</TableCell>
                        <TableCell>ID Local Estoque</TableCell>
                        <TableCell>Quantidade</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {itens.map((item) => (
                        <TableRow key={item.seqitem}>
                          <TableCell>{item.seqitem}</TableCell>
                          <TableCell>
                            <TextField
                              value={item.idproduto}
                              onChange={(e) => handleItemChange(e, item.seqitem, 'idproduto')}
                              type='number'
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={item.idlocal}
                              onChange={(e) => handleItemChange(e, item.seqitem, 'idlocal')}
                              type='number'
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={item.quantidade}
                              onChange={(e) => handleItemChange(e, item.seqitem, 'quantidade')}
                              type='number'
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button onClick={handleAddItem}>Adicionar Item</Button>

                {/* Botões de ação na aba de Itens */}
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
                    sx={{ backgroundColor: '#FF6347', color: 'black', marginRight: 2 }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type='submit'
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="material-symbols:save" />}
                    sx={{ backgroundColor: '#98FB98', color: 'black' }}
                  >
                    Salvar
                  </Button>
                </Box>
              </div>
            )}
          </form>
        </Box>
      </Modal>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Movimentações</Typography>

        <Button onClick={() => { handleOpen(); handleClear(); }} variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
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
                  { id: 'usuario', label: 'Criada por' },
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
