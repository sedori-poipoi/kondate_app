import { Recipe } from './data/recipes';
import { MenuItem, PantryItem, ShoppingItem } from './data/storage';

// ===== Menu Tab =====
export function renderMenuTab(
  menu: MenuItem[],
  dayCount: number,
  mealType: 'Breakfast' | 'Lunch' | 'Dinner',
  mood: string,
  onGenerate: (days: number) => void,
  onRefresh: (dayIdx: number, slot: 'main' | 'side' | 'soup') => void,
  onRecipeClick: (recipe: Recipe) => void,
  onGoShopping: () => void
): string {
  const mealTypeSelector = `
    <div class="meal-type-selector">
      <button class="meal-type-btn ${mealType === 'Breakfast' ? 'active' : ''}" data-type="Breakfast">🌅 朝食</button>
      <button class="meal-type-btn ${mealType === 'Lunch' ? 'active' : ''}" data-type="Lunch">☀️ 昼食</button>
      <button class="meal-type-btn ${mealType === 'Dinner' ? 'active' : ''}" data-type="Dinner">🌙 夕食</button>
    </div>`;

  const moodSelector = `
    <div class="mood-selector">
      <span class="mood-label">今の気分:</span>
      <div class="mood-chips">
        <button class="mood-chip ${mood === 'おまかせ' ? 'active' : ''}" data-mood="おまかせ">😊 おまかせ</button>
        <button class="mood-chip ${mood === 'ガッツリ' ? 'active' : ''}" data-mood="ガッツリ">🥩 ガッツリ</button>
        <button class="mood-chip ${mood === 'アッサリ' ? 'active' : ''}" data-mood="アッサリ">🥗 アッサリ</button>
        <button class="mood-chip ${mood === '時短・力尽き' ? 'active' : ''}" data-mood="時短・力尽き">⏱️ 時短・力尽き</button>
      </div>
    </div>`;

  const dayOptions = `
    <div class="day-selector">
      <button class="day-option-btn" id="days-minus" title="日数を減らす">－</button>
      <span class="day-count-display" id="day-count-display">${dayCount}日分</span>
      <button class="day-option-btn" id="days-plus" title="日数を増やす">＋</button>
    </div>`;

  const cards = menu.length > 0 ? menu.map((m, i) => `
    <div class="day-card" data-genre="${m.main?.genre || ''}" style="animation-delay: ${i * 0.06}s">
      <div class="day-header">
        <span class="day-label">${m.day}</span>
        <div class="day-header-actions">
          <button class="btn-day-summary" data-day="${i}" title="この日の献立をまとめて見る">📋 まとめて見る</button>
          <span class="genre-badge ${m.main?.genre || ''}">${m.main?.genre || ''}</span>
        </div>
      </div>
      <div class="meal-list">
        ${renderMealItem(mealType === 'Dinner' ? '主菜' : 'メイン', m.main, i, 'main', !!m.mainLocked)}
        ${m.side ? renderMealItem('副菜', m.side, i, 'side', !!m.sideLocked) : ''}
        ${m.soup ? renderMealItem('汁物', m.soup, i, 'soup', !!m.soupLocked) : ''}
      </div>
      <div class="day-actions" style="display:flex; gap:8px; margin-top:12px; padding-top:12px; border-top:1px dashed var(--bg-accent); justify-content: flex-end;">
        <button class="btn btn-secondary btn-sm btn-cooking-mode" data-day="${i}" title="3品の並行調理ナビを表示">👩‍🍳 クッキングモード</button>
        <button class="btn btn-primary btn-sm btn-finish-cooking" data-day="${i}" title="このメニューの材料を在庫から減らす">✅ 調理完了</button>
      </div>
    </div>
  `).join('') : `
    <div class="empty-state">
      <span class="empty-state-icon">🍽️</span>
      <p class="empty-state-text">まだ献立がありません<br/>「献立を生成」ボタンで始めましょう！</p>
    </div>`;

  return `
    <div class="menu-control-panel">
      ${mealTypeSelector}
      ${moodSelector}
    </div>
    <div class="action-bar">
      ${dayOptions}
      <button class="btn btn-primary" id="btn-generate">🔄 この条件で生成</button>
      ${menu.length > 0 ? '<button class="btn btn-secondary" id="btn-shopping">🛒 買い物リストを作成</button>' : ''}
    </div>
    <div class="menu-grid">${cards}</div>
  `;
}

function renderMealItem(type: string, recipe: Recipe | null, dayIdx: number, slot: string, isLocked: boolean = false): string {
  if (!recipe) return `<div class="meal-item"><span class="meal-type">${type}</span><span class="meal-name" style="color:var(--text-muted)">—</span></div>`;
  
  const lockedClass = isLocked ? 'locked' : '';
  const lockIcon = isLocked ? '📌' : '📍';
  
  return `
    <div class="meal-item ${lockedClass}" data-recipe-id="${recipe.id}" data-day="${dayIdx}" data-slot="${slot}" draggable="true">
      <span class="meal-type">${type}</span>
      <span class="meal-name">${recipe.name}</span>
      <div class="meal-actions" style="margin-left:auto; display:flex; gap:4px;">
        <button class="meal-btn meal-select" data-day="${dayIdx}" data-slot="${slot}" title="リストから選ぶ">🔍</button>
        <button class="meal-btn meal-refresh" data-day="${dayIdx}" data-slot="${slot}" title="おまかせ入れ替え">🔄</button>
        <button class="meal-btn meal-lock" data-day="${dayIdx}" data-slot="${slot}" title="固定/解除" style="opacity: ${isLocked ? '1' : '0.4'}">${lockIcon}</button>
      </div>
    </div>
  `;
}

// ===== Quick-add preset items =====
const QUICK_ADD_ITEMS: { name: string; category: string; unit: string }[] = [
  { name: '卵', category: '豆腐・卵', unit: 'パック' },
  { name: '牛乳', category: 'その他', unit: '本' },
  { name: '玉ねぎ', category: '野菜', unit: '個' },
  { name: 'にんじん', category: '野菜', unit: '本' },
  { name: 'じゃがいも', category: '野菜', unit: '個' },
  { name: '豆腐', category: '豆腐・卵', unit: '丁' },
  { name: 'もやし', category: '野菜', unit: '袋' },
  { name: 'キャベツ', category: '野菜', unit: '玉' },
  { name: '鶏もも肉', category: '肉', unit: 'g' },
  { name: '豚こま切れ肉', category: '肉', unit: 'g' },
];

// ===== Pantry Tab =====
export function renderPantryTab(pantry: PantryItem[]): string {
  const categories = ['野菜', '肉', '魚介', '豆腐・卵', '乾物・加工品', 'その他'];
  const pantryNames = pantry.map(p => p.name);

  const quickAddChips = QUICK_ADD_ITEMS
    .filter(item => !pantryNames.some(pn => pn.includes(item.name) || item.name.includes(pn)))
    .map(item => `<button class="quick-add-chip" data-name="${item.name}" data-category="${item.category}" data-unit="${item.unit}" title="${item.name}をワンタップ追加">＋ ${item.name}</button>`)
    .join('');

  const form = `
    <h2 class="section-title">🏠 在庫の食材</h2>
    <div class="pantry-form">
      <input class="input input-name" id="pantry-name" placeholder="食材名" />
      <input class="input input-amount" id="pantry-amount" placeholder="数量" />
      <input class="input input-unit" id="pantry-unit" placeholder="単位" />
      <input class="input" type="date" id="pantry-expires" title="賞味期限 (任意)" style="width:130px;" />
      <select class="select" id="pantry-category">
        ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
      </select>
      <div style="display:flex; gap:8px; margin-left:auto;">
        <button class="btn btn-primary btn-sm" id="btn-add-pantry">追加</button>
        <button class="btn btn-secondary btn-sm" id="btn-cancel-pantry-edit" style="display:none;">キャンセル</button>
      </div>
    </div>
    ${quickAddChips ? `
    <div class="quick-add-section">
      <span class="quick-add-label">⚡ ワンタップ追加:</span>
      <div class="quick-add-chips">${quickAddChips}</div>
    </div>` : ''}
  `;

  const list = pantry.length > 0 ? `<div class="pantry-list">
    ${pantry.map(item => {
    let expiryBadge = '';
    if (item.expiresAt) {
      const daysToExpiry = (new Date(item.expiresAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
      if (daysToExpiry < 0) {
        expiryBadge = `<span style="color:var(--color-red);font-size:0.7rem;font-weight:bold;margin-left:8px;">⚠️ 期限切れ</span>`;
      } else if (daysToExpiry <= 3) {
        expiryBadge = `<span style="color:var(--color-orange);font-size:0.7rem;font-weight:bold;margin-left:8px;">⏳ 期限間近</span>`;
      } else {
        expiryBadge = `<span style="color:var(--text-muted);font-size:0.7rem;margin-left:8px;">📅 ${item.expiresAt}</span>`;
      }
    }
    return `
      <div class="pantry-item">
        <span class="pantry-item-category">${item.category}</span>
        <span class="pantry-item-name">${item.name} ${expiryBadge}</span>
        <span class="pantry-item-amount">${item.amount} ${item.unit}</span>
        <div style="display:flex;gap:4px;margin-left:auto;">
          <button class="pantry-cook" data-name="${item.name}" title="この食材で献立を作る" style="border:none;background:none;cursor:pointer;font-size:1.1rem;padding:4px;">🍳</button>
          <button class="pantry-edit" data-name="${item.name}" title="編集" style="border:none;background:none;cursor:pointer;font-size:1.1rem;padding:4px;">✏️</button>
          <button class="pantry-remove" data-name="${item.name}" title="削除">✕</button>
        </div>
      </div>
    `;
  }).join('')}
  </div>` : `
    <div class="empty-state">
      <span class="empty-state-icon">🥬</span>
      <p class="empty-state-text">在庫の食材を登録しておくと<br/>献立生成時に優先的に使われます</p>
    </div>`;

  return form + list;
}

// ===== Shopping List Tab =====
export function renderShoppingTab(items: ShoppingItem[], hasMenu: boolean): string {
  if (!hasMenu) {
    return `
      <h2 class="section-title">🛒 買い物リスト</h2>
      <div class="empty-state">
        <span class="empty-state-icon">📋</span>
        <p class="empty-state-text">まず献立を生成してから<br/>買い物リストを作成しましょう</p>
      </div>`;
  }
  if (items.length === 0) {
    return `
      <h2 class="section-title">🛒 買い物リスト</h2>
      <div class="empty-state">
        <span class="empty-state-icon">✨</span>
        <p class="empty-state-text">すべての食材が在庫にあります！<br/>買い物不要です</p>
      </div>`;
  }

  // Group by category
  const groups = new Map<string, ShoppingItem[]>();
  for (const item of items) {
    if (!groups.has(item.category)) groups.set(item.category, []);
    groups.get(item.category)!.push(item);
  }

  const checkedCount = items.filter(i => i.checked).length;

  let html = `
    <h2 class="section-title">🛒 買い物リスト</h2>
    ${checkedCount > 0 ? `
    <div class="shopping-pantry-banner" id="btn-add-to-pantry">
      <span class="shopping-pantry-banner-icon">📦</span>
      <span class="shopping-pantry-banner-text">チェックした <strong>${checkedCount}品</strong> を在庫に追加する</span>
      <span class="shopping-pantry-banner-arrow">→</span>
    </div>` : ''}
    <div class="action-bar" style="justify-content:space-between; flex-wrap:wrap; gap:8px;">
      <div style="display:flex; gap:8px; align-items:center;">
        <span style="font-size:0.85rem; color:var(--text-secondary);">${checkedCount}/${items.length} 購入済み</span>
      </div>
      <button class="btn btn-primary btn-sm" id="btn-copy-keep" style="background-color:#fbbc04; color:#3c4043; border:none; display:flex; align-items:center; gap:4px;" title="買い物リストをコピーしてGoogle Keepを開きます">
        📋 Keepにコピー
      </button>
    </div>
  `;

  for (const [category, categoryItems] of groups) {
    html += `<div class="shopping-category">
      <div class="shopping-category-title">${category}</div>
      ${categoryItems.map((item, idx) => `
        <div class="shopping-item ${item.checked ? 'checked' : ''}" data-item-name="${item.name}">
          <div class="shopping-checkbox">${item.checked ? '✓' : ''}</div>
          <span class="shopping-item-name">${item.name}</span>
          <span class="shopping-item-amount">${item.amount} ${item.unit}</span>
        </div>
      `).join('')}
    </div>`;
  }

  return html;
}

// ===== Recipe Selection Modal =====
export function renderRecipeSelectionModal(recipes: Recipe[], dayIdx: number, slot: string): string {
  if (recipes.length === 0) {
    return `
      <h2 class="modal-title">レシピを選ぶ</h2>
      <p style="text-align:center; padding: 20px;">表示できるレシピがありません。</p>
    `;
  }

  return `
    <h2 class="modal-title">レシピを選ぶ</h2>
    <div class="recipe-selection-list" style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px; max-height: 60vh; overflow-y: auto;">
      ${recipes.map(r => `
        <div class="recipe-selection-item" data-recipe-id="${r.id}" data-day="${dayIdx}" data-slot="${slot}" style="padding: 12px; border: 1px solid var(--bg-accent); border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: var(--transition);">
          <div>
            <span class="genre-badge ${r.genre}">${r.genre}</span>
            <span style="font-weight: 600; margin-left: 8px;">${r.name}</span>
          </div>
          <span class="btn btn-primary btn-sm" style="padding: 4px 12px; font-size: 0.8rem;">これにする</span>
        </div>
      `).join('')}
    </div>
  `;
}

// ===== My Recipe Tab =====
export function renderMyRecipeTab(customRecipes: Recipe[]): string {
  const genres = ['和食', '洋食', '中華', '韓国', 'その他'];
  const categories = ['主菜', '副菜', '汁物', 'その他'];
  const proteins = ['鶏', '豚', '牛', '魚', '豆腐', 'なし'];

  const form = `
    <h2 class="section-title">📝 マイレシピ登録</h2>
    <div class="recipe-form">
      <div class="form-group" style="background: rgba(72,187,120,0.1); padding: 12px; border-radius: 8px; margin-bottom: 20px; border: 1px solid var(--color-green);">
        <label class="form-label" style="display:flex; align-items:center; gap:4px; margin-bottom:8px;">
          <span>✨</span> <span style="font-weight:700; color:var(--color-green); font-size:0.95rem;">AIでレシピを自動入力</span>
        </label>
        <div style="display: flex; gap: 8px;">
          <input class="input" id="ai-import-url" style="flex:1; border:1px solid #ccc; font-size:0.9rem;" placeholder="URL または レシピを丸ごとコピペして貼り付け" />
          <button class="btn btn-primary" id="btn-ai-import" style="white-space:nowrap;">自動入力</button>
        </div>
        <div id="ai-import-status" style="font-size:0.8rem; margin-top:8px; display:none;"></div>
      </div>
      
      <div class="form-group">
        <label class="form-label">レシピ名 *</label>
        <input class="input" id="recipe-name" style="width:100%" placeholder="例: 鶏むね肉のネギ塩だれ" />
      </div>
      <div class="form-row">
        <div class="form-group" style="flex:1">
          <label class="form-label">ジャンル</label>
          <select class="select" id="recipe-genre" style="width:100%">
            ${genres.map(g => `<option value="${g}">${g}</option>`).join('')}
          </select>
        </div>
        <div class="form-group" style="flex:1">
          <label class="form-label">カテゴリ</label>
          <select class="select" id="recipe-category" style="width:100%">
            ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
        <div class="form-group" style="flex:1">
          <label class="form-label">メインたんぱく源</label>
          <select class="select" id="recipe-protein" style="width:100%">
            ${proteins.map(p => `<option value="${p}">${p}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">材料（4人前）</label>
        <textarea class="textarea" id="recipe-ingredients" placeholder="鶏むね肉 2枚&#10;長ねぎ 2本&#10;ごま油 大さじ1&#10;（1行に1つ: 食材名 分量）"></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">手順</label>
        <textarea class="textarea" id="recipe-steps" placeholder="1. 鶏むね肉をそぎ切りにする&#10;2. ネギを刻む&#10;（1行に1ステップ）"></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">参考URL（YouTube、クックパッド等）</label>
        <input class="input" id="recipe-url" style="width:100%" placeholder="https://..." />
      </div>
      <button class="btn btn-primary" id="btn-save-recipe" style="width:100%;justify-content:center;">💾 レシピを保存</button>
    </div>
  `;

  const list = customRecipes.length > 0 ? `
    <h2 class="section-title" style="margin-top:24px;">📚 登録済みレシピ (${customRecipes.length})</h2>
    ${customRecipes.map(r => `
      <div class="custom-recipe-item" data-recipe-id="${r.id}">
        <span class="custom-recipe-badge" style="background:var(--genre-${genreToKey(r.genre)})">${r.genre}</span>
        <span class="pantry-item-name">${r.name}</span>
        <span style="color:var(--text-muted);font-size:0.78rem">${r.category}</span>
        <button class="btn btn-danger btn-sm delete-recipe" data-id="${r.id}">削除</button>
      </div>
    `).join('')}
  ` : '';

  return form + list;
}

function genreToKey(genre: string): string {
  const map: Record<string, string> = { '和食': 'japanese', '洋食': 'western', '中華': 'chinese', '韓国': 'korean' };
  return map[genre] || 'japanese';
}

// ===== Recipe Detail Modal =====
export function renderRecipeDetail(recipe: Recipe): string {
  return `
    <h2 class="modal-title">${recipe.name}</h2>
    <div class="modal-meta">
      <span class="genre-badge ${recipe.genre}">${recipe.genre}</span>
      <span>⏱ 下準備 ${recipe.prepTime}分</span>
      <span>🍳 調理 ${recipe.cookTime}分</span>
      <span>👥 4人前</span>
    </div>
    <a href="${recipe.sourceUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent('ゆり子のおいしい暮らし ' + recipe.name)}`}" target="_blank" class="source-link">
      ▶ ${recipe.sourceUrl ? '参考動画・レシピを見る' : 'YouTubeでレシピ動画を探す'}
    </a>
    <div class="modal-section">
      <h3 class="modal-section-title">🥗 材料</h3>
      <div class="ingredient-list">
        ${recipe.ingredients.map(ing => `
          <div class="ingredient-item">
            <span>${ing.name}</span>
            <span class="ingredient-amount">${ing.amount} ${ing.unit}</span>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="modal-section">
      <h3 class="modal-section-title">📝 手順</h3>
      <ol class="step-list">
        ${recipe.steps.map(step => `
          <li class="step-item ${step.startsWith('【並行】') ? 'step-parallel' : ''}">${formatStepWithIngredients(step, recipe.ingredients)}</li>
        `).join('')}
      </ol>
    </div>
    ${recipe.tips ? `
    <div class="tip-box">
      <span>💡</span>
      <span>${recipe.tips}</span>
    </div>
    ` : ''}
  `;
}

export function formatStepWithIngredients(stepText: string, ingredients: { name: string, amount: string, unit: string }[]): string {
  let result = stepText;
  const sorted = [...ingredients].sort((a, b) => b.name.length - a.name.length);
  for (const ing of sorted) {
    if (!ing.amount || ing.amount === '適量' || ing.amount === '少々') continue;
    const amountStr = ing.unit ? `${ing.amount}${ing.unit}` : ing.amount;
    const replacement = `${ing.name}(<strong style="color:var(--color-orange);font-weight:600;">${amountStr}</strong>)`;
    const regex = new RegExp(`(${ing.name})(?!\\()`, 'g');
    result = result.replace(regex, replacement);
  }
  return result;
}

// ===== Day Detail (まとめビュー) =====
export function renderDayDetail(menuItem: MenuItem): string {
  const recipes = [
    { label: '🥩 主菜', recipe: menuItem.main },
    { label: '🥗 副菜', recipe: menuItem.side },
    { label: '🍲 汁物', recipe: menuItem.soup },
  ].filter(r => r.recipe);

  const totalPrepTime = recipes.reduce((sum, r) => sum + (r.recipe?.prepTime || 0), 0);
  const totalCookTime = recipes.reduce((sum, r) => sum + (r.recipe?.cookTime || 0), 0);

  // Merge all ingredients
  const allIngredients = new Map<string, { amount: string; unit: string }>();
  for (const { recipe } of recipes) {
    if (!recipe) continue;
    for (const ing of recipe.ingredients) {
      const key = ing.name;
      if (allIngredients.has(key)) {
        const existing = allIngredients.get(key)!;
        const a = parseFloat(existing.amount);
        const b = parseFloat(ing.amount);
        if (!isNaN(a) && !isNaN(b)) existing.amount = String(a + b);
        else existing.amount = `${existing.amount}+${ing.amount}`;
      } else {
        allIngredients.set(key, { amount: ing.amount, unit: ing.unit });
      }
    }
  }

  return `
    <div class="day-detail-header">
      <h2 class="modal-title">${menuItem.day}曜日の献立</h2>
      <div class="modal-meta">
        <span class="genre-badge ${menuItem.main?.genre || ''}">${menuItem.main?.genre || ''}</span>
        <span>⏱ 合計目安 ${totalPrepTime + totalCookTime}分</span>
        <span>👥 4人前</span>
      </div>
    </div>

    <!-- メニュー一覧 -->
    <div class="day-menu-overview">
      ${recipes.map(({ label, recipe }) => `
        <div class="day-menu-chip">
          <span class="chip-label">${label}</span>
          <span class="chip-name">${recipe!.name}</span>
          <a href="${recipe!.sourceUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent('ゆり子のおいしい暮らし ' + recipe!.name)}`}" target="_blank" class="chip-link" title="${recipe!.sourceUrl ? '参考動画を見る' : 'YouTubeで探す'}">▶</a>
        </div>
      `).join('')}
    </div>

    <!-- まとめ材料リスト -->
    <div class="modal-section">
      <h3 class="modal-section-title">🛒 この日の全材料</h3>
      <div class="ingredient-list">
        ${Array.from(allIngredients).map(([name, info]) => `
          <div class="ingredient-item">
            <span>${name}</span>
            <span class="ingredient-amount">${info.amount} ${info.unit}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 各料理の手順 -->
    ${recipes.map(({ label, recipe }) => `
      <div class="modal-section day-recipe-section">
        <h3 class="modal-section-title">${label}：${recipe!.name}</h3>
        <a href="${recipe!.sourceUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent('ゆり子のおいしい暮らし ' + recipe!.name)}`}" target="_blank" class="source-link source-link-sm">▶ ${recipe!.sourceUrl ? '参考動画・レシピを見る' : 'YouTubeでレシピ動画を探す'}</a>
        <ol class="step-list">
          ${recipe!.steps.map(step => `
            <li class="step-item ${step.startsWith('【並行】') ? 'step-parallel' : ''}">${formatStepWithIngredients(step, recipe!.ingredients)}</li>
          `).join('')}
        </ol>
        ${recipe!.tips ? `<div class="tip-box"><span>💡</span><span>${recipe!.tips}</span></div>` : ''}
      </div>
    `).join('')}
  `;
}

// ===== AI Concierge Tab =====
export function renderConciergeTab(pantry: PantryItem[]): string {
  return `
    <div class="concierge-container">
      <div class="concierge-mode-selector">
        <button class="mode-btn active" data-mode="normal">🍵 通常</button>
        <button class="mode-btn" data-mode="addiction">💎 甘やかし</button>
        <button class="mode-btn" data-mode="savings">🔥 節約鬼</button>
      </div>
      <div class="chat-area" id="chat-area">
        <div class="chat-message ai-message">
          <div class="chat-avatar">👩‍🍳</div>
          <div class="chat-bubble" id="ai-initial-greeting">
            <span class="spinner" style="border-color:var(--text-primary); border-top-color:transparent; width:14px; height:14px; border-width:2px; display:inline-block; margin-right:4px; vertical-align:middle;"></span>
            なぎさんの状況を確認中...
          </div>
        </div>
      </div>
      
      <div class="sticky-area">
        <div class="sticky-header">付箋（ふせん）でパパッと相談</div>
        <div class="sticky-chips" id="concierge-sticky-chips">
          ${(() => {
            const pantryChips = pantry.slice(0, 3).map(item => ({ tag: item.name, label: `🥬 ${item.name}` }));
            const fixedChips = [
              { tag: '15分で', label: '⏱️ 15分で' },
              { tag: '子供が喜ぶ', label: '👦 子供が喜ぶ' },
              { tag: 'お祝い', label: '🎉 お祝い' }
            ];
            return [...pantryChips, ...fixedChips].map(c => `
              <button class="sticky-chip" data-tag="${c.tag}">${c.label}</button>
            `).join('');
          })()}
        </div>
        <div class="chat-input-area">
          <input type="text" id="chat-input" class="input chat-input" placeholder="メッセージを入力...">
          <button id="btn-chat-send" class="btn btn-primary btn-chat-send">送信</button>
        </div>
      </div>
    </div>
  `;
}
