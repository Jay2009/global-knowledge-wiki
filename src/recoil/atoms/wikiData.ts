import { IWikiObjArr } from "@/types/iRctHookForm";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

// const localStorage =
//   typeof window !== "undefined" ? window.localStorage : undefined;

const { persistAtom } = recoilPersist({
  key: "recoil-persist",
  storage: typeof window === "undefined" ? undefined : localStorage,
});

export const wikiAtom = atom<IWikiObjArr>({
  key: "wikiAtomKey",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
