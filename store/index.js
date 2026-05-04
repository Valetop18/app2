import { configureStore } from '@reduxjs/toolkit'

import SenadorReducer from './reducers/senador.reducer'
import DiputadoReducer from './reducers/diputado.reducer'
import LoginReducer from './reducers/login.reducer'
import RepresentanteReducer from './reducers/representante.reducer'
import PartidoSenadoReducer from './reducers/partidoSenado.reducer'
import SenadoresReducer from './reducers/senadores.reducer'

const store = configureStore({
  reducer: {
    selectSenador: SenadorReducer,
    selectDiputado: DiputadoReducer,
    auth: LoginReducer,
    selectRepresentante: RepresentanteReducer,
    selectSenadorPartido: PartidoSenadoReducer,
    selecccionSenadores: SenadoresReducer
  },
})

export default store