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

// import { modificarItensNf } from 'src/api/nfitens';
import { getNomeUsuario } from 'src/api/nomeusuario';
import { novaNf, buscaNf, deletaNf } from 'src/api/nf';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import NfTableRow from '../nf-table-row';
import TableNoData from '../table-no-data';
import NfTableHead from '../nf-table-head';
import TableEmptyRows from '../table-empty-rows';
import NfTableToolbar from '../nf-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';


// ----------------------------------------------------------------------

// Estilo da modal
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
export default function NfPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [nfArray, setnfArray] = useState([]);
  const [nfCarregadas, setnfCarregadas] = useState(false);

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

  const [idnf, setidnf] = useState(0)
  const [idmovimento, setidmovimento] = useState(0)
  // const [idusuario_inclusao, setIdUsuario_Inclusao] = useState(0)
  const [idfor, setidfor] = useState(0)
  const [numnf, setnumnf] = useState(0)
  const [serienf, setserienf] = useState(0)
  const [dtemissao, setdtemissao] = useState(new Date())
  const [vlrtotal, setvlrtotal] = useState(0)
  const [observacao, setobservacao] = useState('')

  const ok = dtemissao
  console.log(ok)


  // Itens das movimentações
  const [itens, setItens] = useState([]);
  // Itens adicionados
  const [novosItens, setNovosItens] = useState([])
  // Estado para o índice do próximo item a ser adicionado
  const [indiceItem, setIndiceItem] = useState(1);

  // Função que traz todos os movimentos cadastrados
  async function obterNf() {
    try {
      const produtos = await buscaNf();
      setnfArray(produtos);
      setnfCarregadas(true);
    } catch (erro) {
      console.error("Ocorreu um erro:", erro);
    }
  }

  useEffect(() => {
    if (!nfCarregadas) {
      obterNf();
    }
  }, [nfCarregadas]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = nfArray.map((n) => n.tipmov);
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

  // FUNCOES DE CRUD - TB NF  E NFITENS

  // SETAR DADOS PARA EDIÇÃO

  const handleEditNf = (id) => {
    const nfEditada = nfArray.find(item => item.idnf === id)
    const itensAssociados = nfEditada.tbmovitens || [];

    // Adiciona um índice crescente para cada item em itensAssociados
    const itensComIndice = itensAssociados.map((item, index) => ({
      ...item,
      seqitem: index + 1,
    }
    ));

    const ultimoIndice = itensComIndice.reduce((maxIndex, item) => Math.max(maxIndex, item.seqitem), 0);

    setTabValue(0)
    setNovosItens([])
    setidnf(nfEditada.idnf)
    setnumnf(nfEditada.numnf)
    setserienf(nfEditada.serienf)
    setidfor(nfEditada.idfor)
    setidmovimento(nfEditada.idmovimento)
    setdtemissao(nfEditada.dtemissao)
    setvlrtotal(nfEditada.vlrtotal)
    setobservacao(nfEditada.observacao)
    setItens(itensComIndice);
    setIndiceItem(ultimoIndice + 1) // Seta o indice do ultimo item
    setOpen(true);
  }

  // INSERCAO E EDIÇÃO

  const handleCreate = async (e) => {
    e.preventDefault(); // Impede o comportamento padrão de envio do formulário
    console.log(idnf)
    const isInsercao = idnf === 0
    let formData
    if (isInsercao) // insercao
    {
      formData = {
        numnf: parseInt(numnf, 10),
        idmovimento: parseInt(idmovimento, 10),
        serienf: parseInt(serienf, 10),
        idfor: parseInt(idfor, 10),
        idusuario_inclusao: parseInt(account.idusuario, 10),
        vlrtotal: parseFloat(vlrtotal),
        observacao
      }
    }
    else // Atualizacao
    {
      formData = {
        idnf,
        numnf: parseInt(numnf, 10),
        idmovimento: parseInt(idmovimento, 10),
        serienf: parseInt(serienf, 10),
        idfor: parseInt(idfor, 10),
        idusuario_inclusao: parseInt(account.idusuario, 10),
        vlrtotal: parseFloat(vlrtotal),
        observacao
      }
    }
    const nfnova = JSON.stringify(formData)
    console.log(nfnova)
    try {
      const resp = await novaNf(nfnova, isInsercao)
      // Usar Promise.all para aguardar todas as chamadas assíncronas no map
      // O map é usado para fazer uma requisição na API de adicionar item para cada item novo adicionado.
      /*
      await Promise.all(
        novosItens.map(async (item) => {
          const dadositem = {
            idnf: resp.idnf,
            idproduto: item.idproduto,
            idlocal: item.idlocal,
            quantidade: item.quantidade
          }
          console.log(dadositem)
          const novoitem = JSON.stringify(dadositem);
          console.log(novoitem)
          const resp2 = await modificarItensNf(novoitem);
          console.log(resp2)
        })
      );
      */
      setnfArray([...nfArray, resp]);
      obterNf();
      setidnf(0)
    } catch (erro) {
      console.error("Ocorreu um erro:", erro);
    }
    handleClose()
  }

  // REMOCAO

  const handleDeleteNf = async (id) => {
    try {
      const resp = await deletaNf(id)
      console.log(resp)
      if (resp) {
        // REMOVE O MOVIMENTO EXCLUIDO 
        setnfArray((prevNf) => prevNf.filter((nf) => nf.idnf !== id));
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
    setidnf(0)
    setnumnf(0)
    setidmovimento(0)
    setserienf(0)
    setidfor(0)
    setdtemissao(new Date())
    setvlrtotal(0)
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
    inputData: nfArray,
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
                  name="numnf" label="Numero da NF"
                  value={numnf}
                  onChange={(e) => setnumnf(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />

                <TextField
                  name="serienf" label="Série da NF"
                  value={serienf}
                  onChange={(e) => setserienf(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />

                <TextField
                  name="idfor" label="Id do Fornecedor"
                  value={idfor}
                  onChange={(e) => setidfor(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />

                <TextField
                  name="idmovimento" label="Id do Movimento Relacionado"
                  value={idmovimento}
                  onChange={(e) => setidmovimento(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />

                <TextField
                  name="vlrtotal" label="Valor Total"
                  value={vlrtotal}
                  onChange={(e) => setvlrtotal(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />

                <TextField
                  name="observacao" label="Observação"
                  value={observacao}
                  onChange={(e) => setobservacao(e.target.value)}
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
        <Typography variant="h4">Nfe</Typography>

        <Button onClick={() => { handleOpen(); handleClear(); }} variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          Nova Nfe
        </Button>
      </Stack>

      <Card>
        <NfTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <NfTableHead
                order={order}
                orderBy={orderBy}
                rowCount={nfArray.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'id', label: 'Id' },
                  { id: 'numnf', label: 'Numero da NF' },
                  { id: 'serienf', label: 'Serie' },
                  { id: 'idfor', label: 'Fornecedor' },
                  { id: 'data', label: 'Data de Emissão' },
                  { id: 'idmovimento', label: 'Movimento Relacionado' },
                  { id: 'usuario', label: 'Criada por' },
                  { id: 'vlrtotal', label: 'Valor Total' },
                  { id: 'observacao', label: 'Observacao' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <NfTableRow
                      key={row.idnf}
                      idnf={row.idnf}
                      numnf={row.numnf}
                      serienf={row.serienf}
                      idfor={row.tbfornecedores.nomefor}
                      dtemissao={row.dtemissao}
                      idmovimento={row.idmovimento}
                      idusuario_criacao={row.tbusuarios.usu_login}
                      vlrtotal={row.vlrtotal}
                      observacao={row.observacao}
                      selected={selected.indexOf(row.tipmov) !== -1}
                      handleClick={(event) => handleClick(event, row.tipmov)}
                      onDeleteNf={handleDeleteNf}
                      onEditNf={handleEditNf}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, nfArray.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={nfArray.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
