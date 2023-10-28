export const buscaProdutos = async () => {
    try {
      const resp = await fetch(`http://localhost:3333/produtos`);
      if (resp.ok) {
        const produtos = await resp.json();
        return produtos;
      }
      console.log('Falha na busca por dados');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };

  export const deletaProdutos = async (produtoId) => {
    try {
      const resp = await fetch(`http://localhost:3333/produtos/delete/${produtoId}`, {
        method: 'DELETE', // Especifica o método como DELETE
      });
      if (resp.ok) {
        const produtoApagado = await resp.json();
        return produtoApagado;
      }
      console.log('Falha ao apagar');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };

  export const novoProduto = async (dados) => {
    try {
      const resp = await fetch('http://localhost:3333/produtos/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: dados
      });
      if (resp.ok) {
        const produtoAdicionado = await resp.json();
        return produtoAdicionado;
      }
  
      console.log('Falha ao adicionar produto');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };
  