import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { getNomeUsuario } from 'src/api/nomeusuario';
import {
  itensSaida,
  quantidadenf,
  itensEntrada,
  maioresEstoques,
  quantidadeTipos,
  ultimosMovimentos,
  quantidadeMovimentos,
  ultimosItensMovimentados,
} from 'src/api/dashboard';

import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppConversionRates from '../app-conversion-rates';

// ----------------------------------------------------------------------

export default function AppView() {
  const [infoCarregadas, setInfoCarregadas] = useState(false)
  const [quantNf, setQuantNf] = useState(0)
  const [quantMovimentos, setQuantMovimentos] = useState(0)
  const [quantItensEntrada, setQuantItensEntrada] = useState([])
  const [quantItensSaida, setQuantItensSaida] = useState([])
  const [quantTipos, setQuantTipos] = useState([]);
  const [movimentos, setMovimentos] = useState([]);
  const [estoqueProdutos, setEstoqueProdutos] = useState([])
  const [ultimosItens, setUltimosItens] = useState([])
  const account = getNomeUsuario()

  async function carregarInformacoes() {
    try {
      const entradas = await itensEntrada()
      setQuantItensEntrada(entradas)
      const saidas = await itensSaida()
      setQuantItensSaida(saidas)
      const nf = await quantidadenf()
      setQuantNf(nf)
      const totalmovimentos = await quantidadeMovimentos()
      setQuantMovimentos(totalmovimentos)
      const tipos = await quantidadeTipos();
      setQuantTipos(tipos)
      const ultMovimentos = await ultimosMovimentos()
      setMovimentos(ultMovimentos)
      const estoques = await maioresEstoques()
      setEstoqueProdutos(estoques)
      const ultitens = await ultimosItensMovimentados()
      setUltimosItens(ultitens)
      setInfoCarregadas(true);
    } catch (erro) {
      console.error("Ocorreu um erro:", erro);
    }
  }

  useEffect(() => {
    if (!infoCarregadas) {
      carregarInformacoes();
    }
  }, [infoCarregadas]);

  const totalsaida = quantItensSaida.length > 0 ? quantItensSaida[0].quantidade : 0;
  const totalentrada = quantItensEntrada.length > 0 ? quantItensEntrada[0].quantidade : 0;


  // FILTRA OS TIPOS DE PRODUTOS QUE TEM QUANTIDADE 0 PARA NAO APARECEREM NO GRAFICO
  const tiposProdutosFiltrados = quantTipos.filter((tipoProduto) => tipoProduto.quantidade > 0);

  // CRIA O VETOR QUE TERÁ OS DADOS DE QUANTIDADES POR TIPOS DE PRODUTOS
  const tiposEmEstoque = tiposProdutosFiltrados.map((tipoProduto) => ({
    label: tipoProduto.nometipprod,
    value: tipoProduto.quantidade,
  }));

  const ultimosItensData = ultimosItens.map((movimento, index) => ({
    id: movimento.id,
    title: movimento.title,
    description: movimento.description,
    image: `/assets/images/covers/cover_${index+1}.jpg`,
  }));

  const last6Movimentos = movimentos.slice(-6); // Pega as últimas 6 movimentações

  const movimentosList = last6Movimentos.map((movimento) => {
    // Crie uma nova data ajustando o fuso horário para UTC
    const dataUTC = new Date(movimento.dtinc);
    dataUTC.setMinutes(dataUTC.getMinutes() + dataUTC.getTimezoneOffset());

    return {
      id: `movimento${movimento.idmovimento}`, // Cria um ID único para cada movimento
      title: `Movimentação Código #${movimento.idmovimento}`,
      type: 'movimento',
      time: dataUTC, // Use a data ajustada
    };
  });

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Olá, {account.displayName}
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Movimentações"
            total={quantMovimentos}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="NFs Cadstradas"
            total={quantNf}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Itens Inseridos"
            total={totalentrada}
            color="warning"
            icon={
              <img
                alt="icon"
                src="/assets/icons/glass/ic_glass_buy.png"
                style={{
                  filter: 'url(#filtro-verde)',
                }}
              />
            }
          />
          <svg height="0" width="0">
            <defs>
              <filter id="filtro-verde">
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
                />
              </filter>
            </defs>
          </svg>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Itens Retirados"
            total={totalsaida}
            color="warning"
            icon={
              <img
                alt="icon"
                src="/assets/icons/glass/ic_glass_buy.png"
                style={{
                  filter: 'url(#filtro-vermelho)',
                }}
              />
            }
          />
          <svg height="0" width="0">
            <defs>
              <filter id="filtro-vermelho">
                <feColorMatrix
                  type="matrix"
                  values="1 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
                />
              </filter>
            </defs>
          </svg>
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Tipos de Produtos em Estoque"
            chart={{
              series: tiposEmEstoque,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppConversionRates
            title="Produtos com Maior Estoque"
            subheader=""
            chart={{
              series: estoqueProdutos.map(item => ({
                label: item.label,
                value: item.value,
              })),
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppNewsUpdate
            title="Últimos Itens Movimentados"
            list={ultimosItensData}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppOrderTimeline
            title="Últimas movimentações"
            list={movimentosList}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
