// exposition-only
const dynImport = () => import("node-fetch");

let esmPromise: ReturnType<typeof dynImport> | undefined;

type FetchType = Awaited<ReturnType<typeof dynImport>>["default"];

export const fetch: FetchType = async (...args) => {
  if (typeof esmPromise === "undefined") {
    esmPromise = import("node-fetch");
  }
  const fetch = (await esmPromise).default;
  return fetch(...args);
}
