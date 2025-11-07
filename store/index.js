import { configureStore } from '@reduxjs/toolkit'

import SenadorReducer from './reducers/senador.reducer'
import DiputadoReducer from './reducers/diputado.reducer'
import LoginReducer from './reducers/login.reducer'

const store = configureStore({
  reducer: {
    selectSenador: SenadorReducer,
    selectDiputado: DiputadoReducer,
    auth: LoginReducer,
  },
})

export default store