// importa dependência fastify
import Fastify from 'fastify'
// importa a dependência cors
import cors from '@fastify/cors'
//importa as controllers
import { userController } from './routes/userController';
import { supplierController } from './routes/supplierContoller';
import { stockLocationsController } from './routes/stockLocationsController';
import { compositionController } from './routes/compositionController';
import { entryController } from './routes/entryController';
import { entryItemsController } from './routes/entryItemsController';
import { measureUnitController } from './routes/measureUnitController';
import { nfController } from './routes/nfController';
import { nfItemsController } from './routes/nfItemsController';
import { productController } from './routes/productController';
import { productTypeController } from './routes/productTypeController';
import { stockController } from './routes/stockController';

// cria um objeto da classe Fastify
const server = Fastify()
// registra cors no server
server.register(cors)
// registra as rotas

userController(server);
supplierController(server);
stockLocationsController(server)
compositionController(server)
entryController(server)
entryItemsController(server)
measureUnitController(server)
nfController(server)
nfItemsController(server)
productController(server)
productTypeController(server)
stockController(server)

// sobe o servidor e fica ouvindo na porta 3333
server.listen({
    port: 3333
})

.then( () => {
    console.log('HTTP Server running on port 3333')
})