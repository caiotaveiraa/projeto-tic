import { faker } from '@faker-js/faker';
import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { getNomeUsuario } from 'src/api/nomeusuario';
import { quantidadenf, quantidadeTipos, quantidadeProdutos, quantidadeMovimentos } from 'src/api/dashboard';

import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppConversionRates from '../app-conversion-rates';

// ----------------------------------------------------------------------

export default function AppView() {
  const [infoCarregadas, setInfoCarregadas] = useState(false)
  const [quantProdutos, setQuantProdutos] = useState(0)
  const [quantNf, setQuantNf] = useState(0)
  const [quantMovimentos, setQuantMovimentos] = useState(0)
  const [quantTipos, setQuantTipos] = useState([]);
  const account = getNomeUsuario()

  async function carregarInformacoes() {
    try {
      const produtos = await quantidadeProdutos();
      setQuantProdutos(produtos)
      const nf = await quantidadenf()
      setQuantNf(nf)
      const movimentos = await quantidadeMovimentos()
      setQuantMovimentos(movimentos)
      const tipos = await quantidadeTipos();
      setQuantTipos(tipos)
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

  // FILTRA OS TIPOS DE PRODUTOS QUE TEM QUANTIDADE 0 PARA NAO APARECEREM NO GRAFICO
  const tiposProdutosFiltrados = quantTipos.filter((tipoProduto) => tipoProduto.quantidade > 0);

  // CRIA O VETOR QUE TERÁ OS DADOS DE QUANTIDADES POR TIPOS DE PRODUTOS
  const chartData = tiposProdutosFiltrados.map((tipoProduto) => ({
    label: tipoProduto.nometipprod,
    value: tipoProduto.quantidade,
  }));

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
            title="Produtos"
            total={quantProdutos}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Bug Reports"
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Tipos de Produtos"
            chart={{
              series: chartData,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppConversionRates
            title="Conversion Rates"
            subheader="(+43%) than last year"
            chart={{
              series: [
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppNewsUpdate
            title="News Update"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: faker.person.jobTitle(),
              description: faker.commerce.productDescription(),
              image: `/assets/images/covers/cover_${index + 1}.jpg`,
              postedAt: faker.date.recent(),
            }))}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppOrderTimeline
            title="Order Timeline"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: [
                '1983, orders, $4220',
                '12 Invoices have been paid',
                'Order #37745 from September',
                'New order placed #XF-2356',
                'New order placed #XF-2346',
              ][index],
              type: `order${index + 1}`,
              time: faker.date.past(),
            }))}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
