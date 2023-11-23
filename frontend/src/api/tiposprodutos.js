export const buscaTipos = async () => {
    try {
      const resp = await fetch(`http://localhost:3333/tiposProdutos`);
      if (resp.ok) {
        const unidades = await resp.json();
        return unidades;
      }
      console.log('Falha na busca por dados');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };

  export const deletaTipo = async (tipoId) => {
    try {
      const resp = await fetch(`http://localhost:3333/tiposProdutos/delete/${tipoId}`, {
        method: 'DELETE', // Especifica o método como DELETE
      });
      if (resp.ok) {
        const unidadeApagada = await resp.json();
        return unidadeApagada;
      }
      console.log('Falha ao apagar');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };

  export const novoTipo = async (dados, insercao) => {
    let verbo
    let url
    if(insercao)
    {
      verbo = 'POST'
      url = 'http://localhost:3333/tiposProdutos/add'
    }
    else
    {
      verbo = 'PUT'
      url = 'http://localhost:3333/tiposProdutos/update'
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
        const unidadeAdicionada = await resp.json();
        return unidadeAdicionada;
      }
  
      console.log('Falha ao adicionar unidade');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };
  