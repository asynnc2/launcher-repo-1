import { useState } from "react";
import { PlayClick } from "../../../Core/Services/SoundEffects";
import type { RememberedAccount } from "../../../Core/Configuration/AccountSettings";

interface AccountPickerProps {
  Accounts: RememberedAccount[];
  OnChoose: (Account: RememberedAccount) => void;
  OnForget: (Email: string) => void;
  OnUseAnother: () => void;
  Submitting: boolean;
}

export function AccountPicker({ Accounts, OnChoose, OnForget, OnUseAnother, Submitting }: AccountPickerProps) {
  // Tracks which specific row was clicked, so only that row shows "Signing
  // in..." rather than every row at once while the request is in flight.
  const [PendingEmail, SetPendingEmail] = useState<string | null>(null);

  function Choose(Entry: RememberedAccount) {
    if (Submitting) return;
    PlayClick();
    SetPendingEmail(Entry.Email);
    OnChoose(Entry);
  }

  return (
    <div className="account-picker">
      <p className="account-picker-title">Choose an account</p>

      <div className="account-picker-list">
        {Accounts.map((Entry) => {
          const IsPending = Submitting && PendingEmail === Entry.Email;
          return (
            <div key={Entry.Email} className="account-picker-row">
              <button
                type="button"
                className="account-picker-choice"
                disabled={Submitting}
                onClick={() => Choose(Entry)}
              >
                {Entry.SkinUrl ? (
                  <img className="account-picker-avatar" src={Entry.SkinUrl} alt="" />
                ) : (
                  <span className="account-picker-avatar account-picker-avatar-fallback">
                    {Entry.Username.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="account-picker-labels">
                  <span className="account-picker-username">{Entry.Username}</span>
                  <span className={`account-picker-email${IsPending ? " pending" : ""}`}>
                    {IsPending ? "Signing in..." : Entry.Email}
                  </span>
                </span>
              </button>
              <button
                type="button"
                className="account-picker-remove"
                aria-label={`Forget ${Entry.Username}`}
                disabled={Submitting}
                onClick={() => { PlayClick(); OnForget(Entry.Email); }}
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>

      <button type="button" className="account-picker-other" disabled={Submitting} onClick={() => { PlayClick(); OnUseAnother(); }}>
        Use another account
      </button>
    </div>
  );
}