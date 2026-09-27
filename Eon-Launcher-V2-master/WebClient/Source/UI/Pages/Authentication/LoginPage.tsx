import { useState } from "react";
import { OpenUrl } from "../../../Core/Bridge/Bridge";
import { PlayClick } from "../../../Core/Services/SoundEffects";
import { BrandLogo } from "../../../Core/Configuration/Assets";
import { Project } from "../../../Core/Services/ProjectStore";
import { IsSuccessStatus, MessageForStatus } from "../../../Core/Configuration/LoginMessages";
import { CheckLogin } from "../../../Content/API/Authentication/LoginEndpoint";
import { Frame } from "../../Controls/Shell/Frame";
import { AmbientBackground } from "../../Controls/Shell/AmbientBackground";
import { LoginForm } from "./LoginForm";
import { AccountPicker } from "./AccountPicker";
import type { LoginScreenProps, MessageTone } from "../../../Types/Authentication";
import type { RememberedAccount } from "../../../Core/Configuration/AccountSettings";

export type { LoggedInAccount } from "../../../Types/Authentication";

function GenerateGuestUsername(): string {
  // 8-digit numeric id, e.g. Guest_48213907
  const Id = Math.floor(10_000_000 + Math.random() * 90_000_000);
  return `Guest_${Id}`;
}

export function LoginPage({ RememberMe, InitialStatus = "", OnLoggedIn, RememberedAccounts, OnForgetAccount }: LoginScreenProps) {
  const [Remember, SetRemember] = useState(RememberMe);
  const [Submitting, SetSubmitting] = useState(false);
  const [Message, SetMessage] = useState(MessageForStatus(InitialStatus));
  const [Tone, SetTone] = useState<MessageTone>(InitialStatus ? "error" : "info");
  const [ShowManualForm, SetShowManualForm] = useState(RememberedAccounts.length === 0);
  const [Prefill, SetPrefill] = useState<{ Email: string; Password: string } | null>(null);

  function ChooseAccount(Account: RememberedAccount) {
    SetPrefill({ Email: Account.Email, Password: Account.Password });
    SetShowManualForm(true);
  }

  function UseAnotherAccount() {
    SetPrefill(null);
    SetShowManualForm(true);
  }

  function Fail(Text: string) {
    SetTone("error");
    SetMessage(Text);
    SetSubmitting(false);
  }

  async function Submit(Email: string, Password: string) {
    if (!Email || !Password) return Fail("Please enter both email and password.");
    if (!Email.includes("@")) return Fail("Please enter a valid email address.");

    SetSubmitting(true);
    SetTone("info");
    SetMessage("");

    try {
      const Response = await CheckLogin(Email, Password, Remember);

      if (!IsSuccessStatus(Response.Status)) return Fail(MessageForStatus(Response.Status));

      SetTone("success");
      OnLoggedIn({
        Email: Response.Email ?? Email,
        Password,
        Username: Response.Username ?? "Player",
        SkinUrl: Response.Skin ?? "",
        RememberMe: Remember,
        IsGuest: false,
      });
    } catch (Error) {
      Fail(String(Error));
    }
  }

  function PlayAsGuest() {
    SetTone("success");
    SetMessage("");
    OnLoggedIn({
      Email: "",
      Password: "",
      Username: GenerateGuestUsername(),
      SkinUrl: "",
      RememberMe: false,
      IsGuest: true,
    });
  }

  return (
    <main className="login-screen" onContextMenu={(Event) => Event.preventDefault()}>
      <Frame />
      <AmbientBackground />

      <section className="login-panel">
        <div className="login-box">
          <div className="logo-container">
            <div className="logo">
              <img src={BrandLogo} alt={Project().Name} />
            </div>
            <h1 className="welcome-text">{Project().Name}</h1>
            <p className="subtitle">Sign in to access your account</p>
          </div>

          {ShowManualForm ? (
            <>
              <LoginForm
                key={Prefill?.Email ?? "manual"}
                Remember={Remember}
                Submitting={Submitting}
                OnRememberChange={SetRemember}
                OnSubmit={(Email, Password) => void Submit(Email, Password)}
                OnGuestPlay={PlayAsGuest}
                InitialEmail={Prefill?.Email}
                InitialPassword={Prefill?.Password}
              />

              {RememberedAccounts.length > 0 && (
                <button
                  type="button"
                  className="account-picker-back"
                  onClick={() => { PlayClick(); SetShowManualForm(false); SetPrefill(null); }}
                >
                  &lsaquo; Choose a saved account
                </button>
              )}
            </>
          ) : (
            <AccountPicker
              Accounts={RememberedAccounts}
              OnChoose={ChooseAccount}
              OnForget={OnForgetAccount}
              OnUseAnother={UseAnotherAccount}
            />
          )}

          {Message && <p className={`form-message ${Tone}`}>{Message}</p>}

          <div className="signup-container">
            Don&apos;t have an account?{" "}
            <button type="button" className="signup-link" onClick={() => { PlayClick(); void OpenUrl(Project().CreateAccountURL); }}>
              Sign up
            </button>
          </div>
        </div>
      </section>

      <div className="login-art">
        <div className="art-copy">
          <strong>Alien Invasion.</strong>
          <span>They&rsquo;ve been watching the skies for you. The signal&rsquo;s back, the island&rsquo;s calling, and it&rsquo;s time to come home.</span>
        </div>
      </div>
    </main>
  );
}