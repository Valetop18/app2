import { SELECT_PARTIDO_SENADO } from "../actions/partidoSenado.action";
import { FILTERED_PARTIDO_SENADORES } from "../actions/partidoSenado.action";

import { PARTIDOS } from "../../data/partidos";
import { SENADORES } from "../../data/senadores";

const initialState = {
  seleccionPartido: "",
  partidos: PARTIDOS,
  senadores: SENADORES,
  partido: "",
  filteredSenadoresPartido: [],
};

const PartidoSenadoReducer = (state = initialState, action) => {
  switch (action.type) {
    case FILTERED_PARTIDO_SENADORES:
      return {
        ...state,
        filteredSenadoresPartido: state.senadores.filter(
          (senadoresFilter) => senadoresFilter.partido === action.partidoNM
        ),
        partido: action.partidoNM,
      };
    case SELECT_PARTIDO_SENADO:
      return {
        ...state,
        seleccionPartidoSenado: state.partidos.find(
          (partidosFind) => partidosFind.partido === action.partidoNM
        ),
      };
    default:
      return state;
  }
};

export default PartidoSenadoReducer;
