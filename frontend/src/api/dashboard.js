export const quantidadeProdutos = async () => {
    try {
      const resp = await fetch(`http://localhost:3333/quantidadeprodutos`);
      if (resp.ok) {
        const quantidade = await resp.json();
        return quantidade
      }
      console.log('Falha na busca por dados');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };

  export const quantidadeMovimentos = async () => {
    try {
      const resp = await fetch(`http://localhost:3333/quantidademovimentos`);
      if (resp.ok) {
        const quantidade = await resp.json();
        return quantidade
      }
      console.log('Falha na busca por dados');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };

  export const quantidadenf = async () => {
    try {
      const resp = await fetch(`http://localhost:3333/quantidadenf`);
      if (resp.ok) {
        const quantidade = await resp.json();
        return quantidade
      }
      console.log('Falha na busca por dados');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };

  export const quantidadeTipos = async () => {
    try {
      const resp = await fetch(`http://localhost:3333/quantidadestipos`);
      if (resp.ok) {
        const quantidade = await resp.json();
        return quantidade
      }
      console.log('Falha na busca por dados');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };