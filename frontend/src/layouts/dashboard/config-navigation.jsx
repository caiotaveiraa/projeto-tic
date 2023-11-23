import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Movimentações',
    path: '/entry',
    icon: icon('ic_cart'),
  },
  {
    title: 'Nfe',
    path: '/nf',
    icon: icon('ic_user'),
  },
  {
    title: 'produtos',
    path: '/product',
    icon: icon('ic_cart'),
  },
  {
    title: 'composições',
    path: '/composition',
    icon: icon('ic_cart'),
  },
  {
    title: 'tipos de produtos',
    path: '/producttype',
    icon: icon('ic_cart'),
  },
  {
    title: 'unidades de medida',
    path: '/measureunit',
    icon: icon('ic_cart'),
  },
  {
    title: 'locais de Estoque',
    path: '/stocklocation',
    icon: icon('ic_cart'),
  },
  {
    title: 'fornecedores',
    path: '/supplier',
    icon: icon('ic_user'),
  },
  {
    title: 'usuários',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'relatórios',
    path: '/Relatorios',
    icon: icon('ic_lock'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  /*
  {
    title: 'product',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
  */
];

export default navConfig;
