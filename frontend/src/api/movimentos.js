export const buscaMovimentos = async () => {
    try {
      const resp = await fetch(`http://localhost:3333/movimentos`);
      if (resp.ok) {
        const movimentos = await resp.json();
        return movimentos;
      }
      console.log('Falha na busca por dados');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };

  export const deletaMovimento = async (movId) => {
    try {
      const resp = await fetch(`http://localhost:3333/movimentos/delete/${movId}`, {
        method: 'DELETE', // Especifica o método como DELETE
      });
      if (resp.ok) {
        const movimentoApagado = await resp.json();
        return movimentoApagado;
      }
      console.log('Falha ao apagar');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };

  export const novoMovimento = async (dados, insercao) => {
    let verbo
    let url
    if(insercao)
    {
      verbo = 'POST'
      url = 'http://localhost:3333/movimentos/add'
    }
    else
    {
      verbo = 'PUT'
      url = 'http://localhost:3333/movimentos/update'
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
        const movimentoAdicionado = await resp.json();
        return movimentoAdicionado;
      }
  
      console.log('Falha ao adicionar movimento');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };
  