import { Session } from "next-auth";
interface SessionExtended extends Session {
  accessToken?: string;
}

export type { SessionExtended };
