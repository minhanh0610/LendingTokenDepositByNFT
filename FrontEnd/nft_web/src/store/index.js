import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState, getGlobalState } = createGlobalState({
  connectedAccount: "",
  contract: null,
  signer: null,
  provider: null,
  duration: "",
  isAdmin: false,
  alert: { show: false, msg: '', color: '' },
  loading: { show: false, msg: '' },
});

const setAlert = (msg, color = "green") => {
  setGlobalState("loading", false);
  setGlobalState("alert", { show: true, msg, color });
  setTimeout(() => {
    setGlobalState("alert", { show: false, msg: "", color });
  }, 6000);
};

const setLoadingMsg = (msg) => {      
  const loading = getGlobalState("loading");
  setGlobalState("loading", { ...loading, msg });
};

export {
  useGlobalState,
  setGlobalState,
  getGlobalState,
  setAlert,
  setLoadingMsg,
};
