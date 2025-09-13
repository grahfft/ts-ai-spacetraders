import React, { createContext, useContext, useMemo, useReducer } from 'react';

export type AgentSection = 'summary' | 'contracts' | 'ships';

interface AgentDetailsState {
  section: AgentSection;
  openShipSymbol: string | null;
}

type AgentDetailsAction =
  | { type: 'setSection'; section: AgentSection }
  | { type: 'requestOpenShip'; symbol: string }
  | { type: 'consumeOpenShip' };

const initialState: AgentDetailsState = {
  section: 'summary',
  openShipSymbol: null,
};

function reducer(state: AgentDetailsState, action: AgentDetailsAction): AgentDetailsState {
  switch (action.type) {
    case 'setSection':
      return { ...state, section: action.section };
    case 'requestOpenShip':
      return { ...state, section: 'ships', openShipSymbol: action.symbol };
    case 'consumeOpenShip':
      return { ...state, openShipSymbol: null };
    default:
      return state;
  }
}

interface AgentDetailsContextValue extends AgentDetailsState {
  setSection: (section: AgentSection) => void;
  requestOpenShip: (symbol: string) => void;
  consumeOpenShip: () => void;
}

const AgentDetailsContext = createContext<AgentDetailsContextValue | undefined>(undefined);

export function AgentDetailsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo<AgentDetailsContextValue>(() => ({
    section: state.section,
    openShipSymbol: state.openShipSymbol,
    setSection: (section) => dispatch({ type: 'setSection', section }),
    requestOpenShip: (symbol) => dispatch({ type: 'requestOpenShip', symbol }),
    consumeOpenShip: () => dispatch({ type: 'consumeOpenShip' }),
  }), [state.section, state.openShipSymbol]);
  return <AgentDetailsContext.Provider value={value}>{children}</AgentDetailsContext.Provider>;
}

export function useAgentDetails(): AgentDetailsContextValue {
  const ctx = useContext(AgentDetailsContext);
  if (!ctx) throw new Error('useAgentDetails must be used within AgentDetailsProvider');
  return ctx;
}

export default AgentDetailsProvider;


