import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { buscaUsuarios, deletaUsuario } from 'src/api/usuarios';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';


// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [usuariosArray, setusuariosArray] = useState([]);
  const [usuariosCarregados, setusuariosCarregados] = useState(false);

  /*
  const [idusuario, setidusuario] = useState(0)
  const [usu_login, setusu_login] = useState('')
  const [nome, setnome] = useState('')
  const [usu_admin, setusu_admin] = useState(false)
  const [dtcriacao, setdtcriacao] = useState(new Date())
  */

  async function obterUsuarios() {
    try {
      const usuarios = await buscaUsuarios();
      setusuariosArray(usuarios);
      setusuariosCarregados(true);
    } catch (erro) {
      console.error("Ocorreu um erro:", erro);
    }
  }

  useEffect(() => {
    if (!usuariosCarregados) {
      obterUsuarios();
    }
  }, [usuariosCarregados]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = usuariosArray.map((n) => n.usu_login);
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

  const handleDeleteUsuario = async (id) => {
    try {
      const resp = await deletaUsuario(id)
      console.log(resp)
      if (resp) {
        // REMOVE O USUARIO EXCLUIDO 
        setusuariosArray((prevUsers) => prevUsers.filter((user) => user.idusuario !== id));
      }
    } catch (erro) {
      console.error("Ocorreu um erro:", erro);
    }
  }
  /*
    const handleCreate = async (e) => {
  }
  */

  const dataFiltered = applyFilter({
    inputData: usuariosArray,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Usuários</Typography>

        <Button onClick={() => {}} variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          Novo usuário
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
                rowCount={usuariosArray.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'id', label: 'Id' },
                  { id: 'usu_login', label: 'Login' },
                  { id: 'nome', label: 'Nome' },
                  { id: 'usu_admin', label: 'Admin'},
                  { id: 'dtcriacao', label: 'Data de Criação' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.idusuario}
                      idusuario={row.idusuario}
                      usu_login={row.usu_login}
                      nome={row.nome}
                      usu_admin={row.usu_admin}
                      dtcriacao={row.dtcriacao}
                      selected={selected.indexOf(row.usu_login) !== -1}
                      handleClick={(event) => handleClick(event, row.usu_login)}
                      onDeleteUser={handleDeleteUsuario}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, usuariosArray.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={usuariosArray.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

