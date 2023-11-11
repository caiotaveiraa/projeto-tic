export const buscaFornecedor = async () => {
    try {
      const resp = await fetch(`http://localhost:3333/fornecedor`);
      if (resp.ok) {
        const fornecedores = await resp.json();
        return fornecedores;
      }
      console.log('Falha na busca por dados');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };

  export const deletaFornecedor = async (fornecedorId) => {
    try {
      const resp = await fetch(`http://localhost:3333/fornecedor/delete/${fornecedorId}`, {
        method: 'DELETE', // Especifica o método como DELETE
      });
      if (resp.ok) {
        const fornecedorApagado = await resp.json();
        return fornecedorApagado;
      }
      console.log('Falha ao apagar');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };

  export const novoFornecedor = async (dados, insercao) => {
    let verbo
    let url
    if(insercao)
    {
      verbo = 'POST'
      url = 'http://localhost:3333/fornecedor/add'
    }
    else
    {
      verbo = 'PUT'
      url = 'http://localhost:3333/fornecedor/update'
    }
    try {
      const resp = await fetch(url, {
        method: verbo,
        headers: {
          'Content-Type': 'application/json',
        },
        body: dados
      });
      if (resp.ok) {
        const fornecedorAdicionado = await resp.json();
        return fornecedorAdicionado;
      }
  
      console.log('Falha ao adicionar unidade');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };
  