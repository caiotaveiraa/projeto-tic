export const buscaUsuarios = async () => {
    try {
      const resp = await fetch(`http://localhost:3333/usuarios`);
      if (resp.ok) {
        const usuarios = await resp.json();
        return usuarios;
      }
      console.log('Falha na busca por dados');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };

  export const deletaUsuario = async (usuarioId) => {
    try {
      const resp = await fetch(`http://localhost:3333/usuarios/delete/${usuarioId}`, {
        method: 'DELETE', // Especifica o método como DELETE
      });
      if (resp.ok) {
        const usuarioApagado = await resp.json();
        return usuarioApagado;
      }
      console.log('Falha ao apagar');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };