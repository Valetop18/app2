import { SELECT_PARTIDO } from "../actions/partido.action";
import { FILTERED_PARTIDO_DIPUTADOS } from "../actions/partido.action";

import { PARTIDOS } from "../../data/partidos";
import { DIPUTADOS } from "../../data/diputados";

const initialState = {
  seleccionPartido: "",
  partidos: PARTIDOS,
  diputados: DIPUTADOS,
  partido: "",
  filteredDiputadosPartido: [],
};

const PartidoReducer = (state = initialState, action) => {
  switch (action.type) {
    case FILTERED_PARTIDO_DIPUTADOS:
      return {
        ...state,
        filteredDiputadosPartido: state.diputados.filter(
          (diputadosFilter) => diputadosFilter.partido === action.partidoNM
        ),
        partido: action.partidoNM,
      };
    case SELECT_PARTIDO:
      return {
        ...state,
        seleccionPartido: state.partidos.find(
          (partidosFind) => partidosFind.partido === action.partidoNM
        ),
      };
    default:
      return state;
  }
};

export default PartidoReducer;
