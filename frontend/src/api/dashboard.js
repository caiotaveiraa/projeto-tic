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

  export const itensEntrada = async () => {
    try {
      const resp = await fetch(`http://localhost:3333/entradasprodutos`);
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

  export const itensSaida = async () => {
    try {
      const resp = await fetch(`http://localhost:3333/saidasprodutos`);
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

  export const ultimosMovimentos = async () => {
    try {
      const resp = await fetch(`http://localhost:3333/ultimosmovimentos`);
      if (resp.ok) {
        const movimentos = await resp.json();
        return movimentos
      }
      console.log('Falha na busca por dados');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };

  export const maioresEstoques = async () => {
    try {
      const resp = await fetch(`http://localhost:3333/produtosmaiorestoque`);
      if (resp.ok) {
        const estoques = await resp.json();
        return estoques
      }
      console.log('Falha na busca por dados');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };

  export const ultimosItensMovimentados = async () => {
    try {
      const resp = await fetch(`http://localhost:3333/ultimositens`);
      if (resp.ok) {
        const ultimositens = await resp.json();
        return ultimositens
      }
      console.log('Falha na busca por dados');
      return null;
    } catch (error) {
      console.log(error);
      return null; // Ou algum valor padrão apropriado em caso de erro
    }
  };