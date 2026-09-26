import { createPortal } from "react-dom";
import { PlayClick } from "../../../Core/Services/SoundEffects";
import { CosmeticViewer } from "../../Controls/Viewer/CosmeticViewer";
import { RarityColor, DefaultRarityColor, VBuckIcon } from "../../../Core/Configuration/ShopRarity";
import type { ShopItem } from "../../../Types/Shop";
import type { CosmeticKind } from "../../Controls/Viewer/CosmeticViewer";

interface ShopItemModalProps {
  Item: ShopItem;
  OnConfirm: (Item: ShopItem) => void;
  OnCancel: () => void;
}

function KindForType(Type: string): CosmeticKind {
  if (Type === "Outfit") return "skin";
  if (Type === "Emote" || Type === "Emoji") return "emote";
  return "other";
}

export function ShopItemModal({ Item, OnConfirm, OnCancel }: ShopItemModalProps) {
  const Kind = KindForType(Item.Type);
  const Tint = RarityColor[Item.Rarity] ?? DefaultRarityColor;

  return createPortal(
    <div className="logout-modal-backdrop" role="presentation" onMouseDown={OnCancel}>
      <section
        className="logout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shop-item-confirm-title"
        onMouseDown={(Event) => Event.stopPropagation()}
      >
        <div className="shop-preview-layout">
          <CosmeticViewer Kind={Kind} RarityColor={Tint} />
          <div className="shop-confirm-copy">
            <h2 id="shop-item-confirm-title">{Item.Name}</h2>
            <span className="shop-preview-price">
              <img src={VBuckIcon} alt="" />
              {Item.Price.toLocaleString()}
            </span>
            <p className="shop-preview-note">Open this item&rsquo;s page in your browser for full details.</p>
            <div className="logout-modal-actions">
              <button className="secondary" onClick={() => { PlayClick(); OnCancel(); }}>Cancel</button>
              <button className="play-confirm-button" onClick={() => OnConfirm(Item)}>Open link</button>
            </div>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}