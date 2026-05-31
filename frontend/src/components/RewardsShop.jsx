import React from 'react';

/**
 * RewardsShop – Accordion style shop for cosmetics.
 *
 * Props:
 *   cosmetics: array of cosmetic objects (from COSMETICS_SHOP)
 *   userData: current user data (including points, unlockedCosmetics, equippedCosmetics)
 *   handleUnlockCosmetic: function to unlock a cosmetic
 *   handleEquipCosmetic: function to equip a cosmetic
 */
export default function RewardsShop({ cosmetics, userData, handleUnlockCosmetic, handleEquipCosmetic }) {
  // Group cosmetics by type
  const categories = [
    { type: 'avatarFrame', title: '🖼️ Avatar Frames' },
    { type: 'usernameColor', title: '🎨 Username Colors' },
    { type: 'profileBg', title: '🏞️ Profile Backgrounds' },
    { type: 'profileDecoration', title: '✨ Profile Decorations' },
  ];

  const isUnlocked = (id) => userData.unlockedCosmetics?.includes(id);
  const isEquipped = (type, id) => userData.equippedCosmetics?.[type] === id;

  return (
    <div className="space-y-6">
      {categories.map(({ type, title }) => {
        const items = cosmetics.filter((c) => c.type === type);
        if (items.length === 0) return null;
        return (
          <details key={type} className="group border border-indigo-500/20 rounded-xl bg-zinc-900/30 backdrop-blur-sm overflow-hidden">
            <summary className="cursor-pointer select-none flex items-center justify-between p-4 bg-gradient-to-r from-indigo-800 to-purple-800 text-white">
              <span className="font-semibold text-lg">{title}</span>
              <span className="ri-arrow-down-s-line text-2xl transition-transform duration-300 group-open:rotate-180"></span>
            </summary>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-zinc-800/60 backdrop-blur-sm transition-all duration-300 ease-out max-h-0 opacity-0 overflow-y-auto group-open:max-h-96 group-open:opacity-100">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col items-center p-2 bg-zinc-900 border border-zinc-700 rounded-lg hover:border-indigo-400 transition ${isEquipped(item.type, item.id) ? 'ring-2 ring-indigo-500' : ''}`}
                >
                  {/* Image preview – use styleClass for frames or color backgrounds */}
                  {item.type === 'profileBg' && item.style ? (
                    <div className="w-20 h-20" style={item.style}></div>
                  ) : (
                    <div className={`w-20 h-20 flex items-center justify-center ${item.styleClass || ''}`}> 
                      {/* Show a placeholder if no image */}
                      {item.type === 'avatarFrame' && <span className="text-2xl">🖼️</span>}
                      {item.type === 'usernameColor' && <span className="text-2xl">🎨</span>}
                      {item.type === 'profileDecoration' && <span className="text-2xl">✨</span>}
                    </div>
                  )}
                  <p className="text-sm font-medium mt-2 text-center truncate w-full" title={item.name}>{item.name}</p>
                  <p className="text-xs text-zinc-400 mt-1">Cost: {item.cost}</p>
                  <div className="flex gap-2 mt-2">
                    {isUnlocked(item.id) ? (
                      <button
                        onClick={() => handleEquipCosmetic(item.type, item.id)}
                        className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-xs rounded"
                      >
                        {isEquipped(item.type, item.id) ? 'Equipped' : 'Equip'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnlockCosmetic(item)}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-xs rounded"
                      >
                        Unlock
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}
