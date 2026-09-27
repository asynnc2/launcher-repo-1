import type { Account, RememberedAccount } from "../Core/Configuration/AccountSettings";
import type { ThemeId } from "../Core/Configuration/Themes";

export interface BootSequence {
  Booted: boolean;
  Stage: string;
  Progress: number;
  ErrorMessage: string | undefined;
  LoginNotice: string;
  LoggedIn: boolean;
  Account: Account;
  Theme: ThemeId;
  Folder: string;
  ShouldOfferTour: boolean;
  RememberedAccounts: RememberedAccount[];
  SetAccount: (Value: Account) => void;
  SetTheme: (Value: ThemeId) => void;
  SetFolder: (Value: string) => void;
  SetLoggedIn: (Value: boolean) => void;
  MarkReady: () => void;
  Retry: () => void;
  ForgetRememberedAccount: (Email: string) => void;
}