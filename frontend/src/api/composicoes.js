export const buscaComposicoes = async () => {
    try {
      const resp = await fetch(`http://localhost:3333/composicao`);
      if (resp.ok) {
        const composicoes = await resp.json();
        return composicoes;
      }
      console.log('Falha na busca por dados');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };

  export const deletaComposicoes = async (compId, produtoId, produtocompId) => {
    try {
      const resp = await fetch(`http://localhost:3333/composicao/delete/${compId}/${produtoId}/${produtocompId}`, {
        method: 'DELETE', // Especifica o método como DELETE
      });
      if (resp.ok) {
        const composicaoapagada = await resp.json();
        return composicaoapagada;
      }
      console.log('Falha ao apagar');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };

  export const novaComposicao = async (dados, insercao) => {
    let verbo
    let url
    if(insercao)
    {
      verbo = 'POST'
      url = 'http://localhost:3333/composicao/add'
    }
    else
    {
      verbo = 'PUT'
      url = 'http://localhost:3333/composicao/update'
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
        const composicaoAdicionada = await resp.json();
        return composicaoAdicionada;
      }
  
      console.log('Falha ao adicionar composição');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };
  