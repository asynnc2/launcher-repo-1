import { useEffect, useState } from "react";
import { Invoke } from "../Bridge/Bridge";
import { AccountFromSettings, EmptyAccount, type Account, type RememberedAccount, type StoredSettings } from "../Configuration/AccountSettings";
import { DefaultThemeId, IsValidThemeId, type ThemeId } from "../Configuration/Themes";
import { GetCachedTheme } from "../Services/LauncherStorage";
import { SetSoundEnabled } from "../Services/SoundEffects";
import { TryAutoLogin } from "../Services/AutoLogin";
import type { BootSequence } from "../../Types/Boot";

export function UseBootSequence(): BootSequence {
  const [Booted, SetBooted] = useState(false);
  const [Attempt, SetAttempt] = useState(0);
  const [Stage, SetStage] = useState("Starting up");
  const [Progress, SetProgress] = useState(0);
  const [ErrorMessage, SetErrorMessage] = useState<string | undefined>(undefined);
  const [LoginNotice, SetLoginNotice] = useState("");
  const [LoggedIn, SetLoggedIn] = useState(false);
  const [Account, SetAccount] = useState<Account>(EmptyAccount);
  const [Theme, SetTheme] = useState<ThemeId>(() => {
    const Cached = GetCachedTheme();
    return IsValidThemeId(Cached) ? Cached : DefaultThemeId;
  });
  const [Folder, SetFolder] = useState("");
  const [ShouldOfferTour, SetShouldOfferTour] = useState(false);
  const [RememberedAccounts, SetRememberedAccounts] = useState<RememberedAccount[]>([]);

  useEffect(() => {
      SetErrorMessage(undefined);
      SetStage("Getting things ready");
      SetProgress(10);

      Invoke<StoredSettings>("LoadSettings")
        .then(async (Settings) => {
          SetStage("Applying your settings");
          SetProgress(30);

          const Loaded = AccountFromSettings(Settings);
          SetFolder(Settings?.FortnitePath ?? "");
          SetAccount(Loaded);
          SetRememberedAccounts(Settings?.RememberedAccounts ?? []);
          SetSoundEnabled(Loaded.IsSoundEnabled);
          SetTheme(IsValidThemeId(Settings?.Theme) ? Settings.Theme : DefaultThemeId);

          SetStage("Checking for updates");
          SetProgress(50);
          const Result = await TryAutoLogin(Loaded);
          if (!Result) return;

          SetStage("Signing you in");
          SetProgress(70);

          if (!Result.Signed) {
            SetLoginNotice(Result.Notice);
            return;
          }

          SetAccount((Previous) => ({
            ...Previous,
            Email: Result.Email ?? Previous.Email,
            Username: Result.Username ?? Previous.Username,
            SkinUrl: Result.SkinUrl ?? Previous.SkinUrl,
          }));
          SetLoggedIn(true);
          SetShouldOfferTour(!Settings?.FortnitePath);
        })
        .catch((Error) => SetErrorMessage((Current) => Current ?? String(Error)))
        .finally(() => {
          SetStage("Almost there");
          SetProgress(90);
          SetBooted(true);
        });
  }, [Attempt]);

  function MarkReady() {
    SetStage("Ready");
    SetProgress(100);
  }

  function Retry() {
    SetErrorMessage(undefined);
    SetBooted(false);
    SetAttempt((Value) => Value + 1);
  }

  function ForgetRememberedAccount(Email: string) {
    SetRememberedAccounts((Current) => Current.filter((Entry) => Entry.Email.toLowerCase() !== Email.toLowerCase()));
  }

  // Bridge.RememberAccount() already persists this to disk (see UserSettings.cs),
  // but that write doesn't push anything back into this hook's React state - so
  // without this, a freshly-remembered account only shows up in the picker after
  // a full app restart (next LoadSettings), not if you sign out again in the same
  // session. Mirrors the same de-dupe / most-recent-first / max-3 rule as the C#
  // side so the in-memory list matches what actually ends up on disk.
  function RememberAccountLocally(Entry: RememberedAccount) {
    SetRememberedAccounts((Current) => {
      const Filtered = Current.filter((Existing) => Existing.Email.toLowerCase() !== Entry.Email.toLowerCase());
      return [Entry, ...Filtered].slice(0, 3);
    });
  }

  return {
    Booted, Stage, Progress, ErrorMessage, LoginNotice, LoggedIn, Account, Theme, Folder, ShouldOfferTour, RememberedAccounts,
    SetAccount, SetTheme, SetFolder, SetLoggedIn, MarkReady, Retry, ForgetRememberedAccount, RememberAccountLocally,
  };
}