import { SENADORES_PARTIDO } from "../actions/senadores.action";

import { SENADORES } from "../../data/senadores";

const initialState = {
  senadores: SENADORES,
  senadoresPorPartido: [],
  partido: "",
};

const SenadoresReducer = (state = initialState, action) => {
  switch (action.type) {
    case SENADORES_PARTIDO:
      return {
        ...state,
        senadoresPorPartido: state.senadores.filter(
          (senadoresFilter) => senadoresFilter.partido === action.partidoID
        ),
        partido: action.partidoID,
      };
    default:
      return state;
  }
};

export default SenadoresReducer;
