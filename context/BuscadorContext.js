import React, { createContext, useState } from "react";

export const BuscadorContext = createContext();

export function BuscadorProvider({ children }) {

    const [search, setSearch] = useState('');

    return (
        <BuscadorContext.Provider value = {{ search, setSearch}}>
            {children}
        </BuscadorContext.Provider>
    )
    
}