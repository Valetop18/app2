import { REPRESENTANTES_PARTIDO } from "../actions/representante.action";

import { DIPUTADOS } from "../../data/diputados";

const initialState = {
  diputados: DIPUTADOS,
  representantePorPartido: [],
  partido: "",
};

const RepresentanteReducer = (state = initialState, action) => {
  switch (action.type) {
    case REPRESENTANTES_PARTIDO:
      return {
        ...state,
        representantePorPartido: state.diputados.filter(
          (representanteFilter) => representanteFilter.partido === action.partidoID
        ),
        partido: action.partidoID,
      };
    default:
      return state;
  }
};

export default RepresentanteReducer;
