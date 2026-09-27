import { PlayClick } from "../../../Core/Services/SoundEffects";
import type { RememberedAccount } from "../../../Core/Configuration/AccountSettings";

interface AccountPickerProps {
  Accounts: RememberedAccount[];
  OnChoose: (Account: RememberedAccount) => void;
  OnForget: (Email: string) => void;
  OnUseAnother: () => void;
}

export function AccountPicker({ Accounts, OnChoose, OnForget, OnUseAnother }: AccountPickerProps) {
  return (
    <div className="account-picker">
      <p className="account-picker-title">Choose an account</p>

      <div className="account-picker-list">
        {Accounts.map((Entry) => (
          <div key={Entry.Email} className="account-picker-row">
            <button
              type="button"
              className="account-picker-choice"
              onClick={() => { PlayClick(); OnChoose(Entry); }}
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
                <span className="account-picker-email">{Entry.Email}</span>
              </span>
            </button>
            <button
              type="button"
              className="account-picker-remove"
              aria-label={`Forget ${Entry.Username}`}
              onClick={() => { PlayClick(); OnForget(Entry.Email); }}
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="account-picker-other" onClick={() => { PlayClick(); OnUseAnother(); }}>
        Use another account
      </button>
    </div>
  );
}