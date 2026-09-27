import type { RememberedAccount } from "../Core/Configuration/AccountSettings";

export interface LoggedInAccount {
  Email: string;
  Password: string;
  Username: string;
  SkinUrl: string;
  RememberMe: boolean;
  IsGuest: boolean;
}

export interface LoginScreenProps {
  RememberMe: boolean;
  InitialStatus?: string;
  OnLoggedIn: (Account: LoggedInAccount) => void;
  RememberedAccounts: RememberedAccount[];
  OnForgetAccount: (Email: string) => void;
}

export type MessageTone = "info" | "error" | "success";