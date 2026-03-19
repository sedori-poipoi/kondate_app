import './style.css';
import { Recipe } from './data/recipes';
import {
  getPantry, savePantry, addPantryItem, removePantryItem,
  getCurrentMenu, saveCurrentMenu,
  getShoppingList, saveShoppingList,
  getCustomRecipes, addCustomRecipe, removeCustomRecipe,
  getAllRecipes, PantryItem, MenuItem, ShoppingItem, deductIngredientsFromPantry, updatePantryItem
} from './data/storage';
import { generateMenu, replaceMenuItem, generateMenuForIngredient } from './logic/menuGenerator';
import { generateShoppingList, checkedItemsToPantry } from './logic/shoppingList';
import { generateCookingTimeline, getAllIngredientsForDay } from './logic/cookingLogic';
import {
  renderMenuTab, renderPantryTab, renderShoppingTab,
  renderMyRecipeTab, renderRecipeDetail, renderDayDetail,
  formatStepWithIngredients, renderRecipeSelectionModal,
  renderConciergeTab
} from './components';

// ===== State =====
let currentTab = 'menu';
let currentMealType: 'Breakfast' | 'Lunch' | 'Dinner' = 'Dinner';
let currentMood: string = 'おまかせ';
let dayCount: number = 3;
let menu: MenuItem[] = getCurrentMenu(currentMealType);
let shoppingItems: ShoppingItem[] = getShoppingList();
let editingPantryItemName: string | null = null;
let chatHistory: {role: 'user' | 'model', text: string}[] = [];
let isGreetingFetched = false;
let conciergeMode: 'normal' | 'addiction' | 'savings' = 'normal';

// ===== DOM refs =====
const contentMenu = document.getElementById('content-menu')!;
const contentPantry = document.getElementById('content-pantry')!;
const contentShopping = document.getElementById('content-shopping')!;
const contentMyrecipe = document.getElementById('content-myrecipe')!;
const contentConcierge = document.getElementById('content-concierge')!;
const modalOverlay = document.getElementById('modal-overlay')!;
const modalBody = document.getElementById('modal-body')!;
const modalClose = document.getElementById('modal-close')!;

// ===== Tab switching =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = (btn as HTMLElement).dataset.tab!;
    switchTab(tab);
  });
});

function switchTab(tab: string) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', (b as HTMLElement).dataset.tab === tab));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById(`content-${tab}`)!.classList.add('active');
  renderCurrentTab();
}

// ===== Render functions =====
function renderCurrentTab() {
  switch (currentTab) {
    case 'menu': renderMenu(); break;
    case 'pantry': renderPantry(); break;
    case 'shopping': renderShopping(); break;
    case 'myrecipe': renderMyRecipe(); break;
    case 'concierge': renderConcierge(); break;
  }
}

function renderMenu() {
  contentMenu.innerHTML = renderMenuTab(
    menu, dayCount, currentMealType, currentMood,
    handleGenerate, handleRefresh, showRecipeDetail, () => switchTab('shopping')
  );

  // Event: meal type switch
  contentMenu.querySelectorAll('.meal-type-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentMealType = (e.target as HTMLElement).dataset.type as 'Breakfast' | 'Lunch' | 'Dinner';
      menu = getCurrentMenu(currentMealType); // Switch to saved menu for this type
      renderMenu();
    });
  });

  // Event: mood switch
  contentMenu.querySelectorAll('.mood-chip').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentMood = (e.target as HTMLElement).dataset.mood!;
      renderMenu();
    });
  });

  // Event: generate
  document.getElementById('btn-generate')?.addEventListener('click', () => handleGenerate(dayCount));
  // Event: day count +/-
  document.getElementById('days-minus')?.addEventListener('click', () => {
    if (dayCount > 1) { dayCount--; renderMenu(); }
  });
  document.getElementById('days-plus')?.addEventListener('click', () => {
    if (dayCount < 7) { dayCount++; renderMenu(); }
  });
  // Event: go to shopping
  document.getElementById('btn-shopping')?.addEventListener('click', () => {
    shoppingItems = generateShoppingList(menu);
    saveShoppingList(shoppingItems);
    switchTab('shopping');
  });
  // Event: meal item click (show detail)
  let draggedDayIdx: number | null = null;
  let draggedSlot: 'main' | 'side' | 'soup' | null = null;

  contentMenu.querySelectorAll('.meal-item').forEach(item => {
    const el = item as HTMLElement;

    // Drag and Drop implementation
    el.addEventListener('dragstart', (e) => {
      draggedDayIdx = parseInt(el.dataset.day!);
      draggedSlot = el.dataset.slot as 'main' | 'side' | 'soup';
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
      }
      setTimeout(() => el.style.opacity = '0.5', 0);
    });

    el.addEventListener('dragend', () => {
      el.style.opacity = '1';
    });

    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      const targetSlot = el.dataset.slot as 'main' | 'side' | 'soup';
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = draggedSlot === targetSlot ? 'move' : 'none';
      }
    });

    el.addEventListener('drop', (e) => {
      e.preventDefault();
      const targetDayIdx = parseInt(el.dataset.day!);
      const targetSlot = el.dataset.slot as 'main' | 'side' | 'soup';

      if (draggedSlot !== targetSlot) {
        alert('同じカテゴリ（主菜同士、副菜同士など）でのみ入れ替え可能です');
        return;
      }

      if (draggedDayIdx !== null && draggedSlot && (draggedDayIdx !== targetDayIdx)) {
        // Swap
        const temp = menu[targetDayIdx][targetSlot];
        (menu[targetDayIdx][targetSlot] as any) = menu[draggedDayIdx][draggedSlot];
        (menu[draggedDayIdx][draggedSlot] as any) = temp;
        saveCurrentMenu(menu);
        renderMenu();
      }
    });

    el.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.meal-actions')) return; // ボタン群のクリックは無視
      const id = el.dataset.recipeId;
      if (!id || id === 'undefined') return;
      const recipe = getAllRecipes().find(r => r.id === id);
      if (recipe) showRecipeDetail(recipe);
    });
  });

  // Event: select specific meal from list
  contentMenu.querySelectorAll('.meal-select').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const el = btn as HTMLElement;
      const dayIdx = parseInt(el.dataset.day!);
      const slot = el.dataset.slot as 'main' | 'side' | 'soup';
      
      const category = slot === 'main' ? '主菜' : (slot === 'side' ? '副菜' : '汁物');
      let recipes = getAllRecipes().filter(r => r.category === category);
      
      // 主菜の場合は現在の食事タイプに合わせて絞り込み
      if (slot === 'main') {
        recipes = recipes.filter(r => (r.mealType || ['Dinner']).includes(currentMealType));
      }

      modalBody.innerHTML = renderRecipeSelectionModal(recipes, dayIdx, slot);
      modalOverlay.classList.add('active');

      modalBody.querySelectorAll('.recipe-selection-item').forEach(item => {
        item.addEventListener('click', () => {
          const selItem = item as HTMLElement;
          const rId = selItem.dataset.recipeId;
          const selectedRecipe = getAllRecipes().find(r => r.id === rId);
          if (selectedRecipe && menu[dayIdx]) {
            if (slot === 'main') { menu[dayIdx].main = selectedRecipe; menu[dayIdx].mainLocked = true; }
            if (slot === 'side') { menu[dayIdx].side = selectedRecipe; menu[dayIdx].sideLocked = true; }
            if (slot === 'soup') { menu[dayIdx].soup = selectedRecipe; menu[dayIdx].soupLocked = true; }
            saveCurrentMenu(menu, currentMealType);
            renderMenu();
            closeModal();
          }
        });
      });
    });
  });

  // Event: lock single meal
  contentMenu.querySelectorAll('.meal-lock').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const el = btn as HTMLElement;
      const dayIdx = parseInt(el.dataset.day!);
      const slot = el.dataset.slot as 'main' | 'side' | 'soup';
      const m = menu[dayIdx];
      if (slot === 'main') m.mainLocked = !m.mainLocked;
      if (slot === 'side') m.sideLocked = !m.sideLocked;
      if (slot === 'soup') m.soupLocked = !m.soupLocked;
      saveCurrentMenu(menu);
      renderMenu();
    });
  });

  // Event: refresh single meal
  contentMenu.querySelectorAll('.meal-refresh').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const el = btn as HTMLElement;
      const dayIdx = parseInt(el.dataset.day!);
      const slot = el.dataset.slot as 'main' | 'side' | 'soup';
      handleRefresh(dayIdx, slot);
    });
  });

  // Event: day summary (まとめて見る)
  contentMenu.querySelectorAll('.btn-day-summary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dayIdx = parseInt((btn as HTMLElement).dataset.day!);
      if (menu[dayIdx]) showDayDetail(menu[dayIdx]);
    });
  });

  // Event: finish cooking
  contentMenu.querySelectorAll('.btn-finish-cooking').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dayIdx = parseInt((btn as HTMLElement).dataset.day!);
      if (menu[dayIdx]) {
        const deducted = deductIngredientsFromPantry(menu[dayIdx]);
        alert(`調理完了！以下の食材が在庫から引き落とされました：\n${deducted.length ? deducted.join('、 ') : '※対象の在庫はありませんでした'}`);
      }
    });
  });

  // Event: cooking mode
  contentMenu.querySelectorAll('.btn-cooking-mode').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dayIdx = parseInt((btn as HTMLElement).dataset.day!);
      if (menu[dayIdx]) {
        showCookingMode(menu[dayIdx]);
      }
    });
  });
}

function renderPantry() {
  const pantry = getPantry();
  contentPantry.innerHTML = renderPantryTab(pantry);
  // Event: add item
  document.getElementById('btn-add-pantry')?.addEventListener('click', handleAddPantry);
  // Event: enter key on inputs
  ['pantry-name', 'pantry-amount', 'pantry-unit'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') handleAddPantry();
    });
  });
  // Event: remove item
  contentPantry.querySelectorAll('.pantry-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = (btn as HTMLElement).dataset.name!;
      removePantryItem(name);
      renderPantry();
    });
  });
  // Event: edit item
  contentPantry.querySelectorAll('.pantry-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = (btn as HTMLElement).dataset.name!;
      const item = pantry.find(p => p.name === name);
      if (item) {
        editingPantryItemName = name;
        (document.getElementById('pantry-name') as HTMLInputElement).value = item.name;
        (document.getElementById('pantry-amount') as HTMLInputElement).value = item.amount;
        (document.getElementById('pantry-unit') as HTMLInputElement).value = item.unit;
        (document.getElementById('pantry-category') as HTMLSelectElement).value = item.category;
        (document.getElementById('pantry-expires') as HTMLInputElement).value = item.expiresAt || '';
        document.getElementById('btn-add-pantry')!.textContent = '更新';
        document.getElementById('btn-cancel-pantry-edit')!.style.display = 'block';
      }
    });
  });
  // Event: cancel edit
  document.getElementById('btn-cancel-pantry-edit')?.addEventListener('click', () => {
    editingPantryItemName = null;
    (document.getElementById('pantry-name') as HTMLInputElement).value = '';
    (document.getElementById('pantry-amount') as HTMLInputElement).value = '';
    (document.getElementById('pantry-unit') as HTMLInputElement).value = '';
    (document.getElementById('pantry-expires') as HTMLInputElement).value = '';
    document.getElementById('btn-add-pantry')!.textContent = '追加';
    document.getElementById('btn-cancel-pantry-edit')!.style.display = 'none';
  });
  // Event: quick-add chips
  contentPantry.querySelectorAll('.quick-add-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const el = btn as HTMLElement;
      addPantryItem({
        name: el.dataset.name!,
        amount: '1',
        unit: el.dataset.unit!,
        category: el.dataset.category!,
        addedAt: new Date().toISOString(),
      });
      renderPantry();
    });
  });
  // Event: cook from ingredient
  contentPantry.querySelectorAll('.pantry-cook').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const ingredientName = (btn as HTMLElement).dataset.name!;
      const newMenuItem = generateMenuForIngredient(ingredientName);
      menu = [newMenuItem];
      dayCount = 1;
      saveCurrentMenu(menu);
      switchTab('menu');
    });
  });
}

function renderShopping() {
  contentShopping.innerHTML = renderShoppingTab(shoppingItems, menu.length > 0);
  // Event: toggle check
  contentShopping.querySelectorAll('.shopping-item').forEach(item => {
    item.addEventListener('click', () => {
      const name = (item as HTMLElement).dataset.itemName!;
      const idx = shoppingItems.findIndex(i => i.name === name);
      if (idx >= 0) {
        shoppingItems[idx].checked = !shoppingItems[idx].checked;
        saveShoppingList(shoppingItems);
        renderShopping();
      }
    });
  });
  // Event: add checked to pantry
  document.getElementById('btn-add-to-pantry')?.addEventListener('click', () => {
    const pantryItems = checkedItemsToPantry(shoppingItems);
    for (const item of pantryItems) addPantryItem(item);
    shoppingItems = shoppingItems.filter(i => !i.checked);
    saveShoppingList(shoppingItems);
    renderShopping();
  });
  // Event: copy to Keep
  document.getElementById('btn-copy-keep')?.addEventListener('click', () => {
    const groups = new Map<string, ShoppingItem[]>();
    for (const item of shoppingItems) {
      if (!groups.has(item.category)) groups.set(item.category, []);
      groups.get(item.category)!.push(item);
    }

    let text = '🛒 買い物リスト\n';
    for (const [category, catItems] of groups) {
      // 未購入のアイテムだけを抽出
      const uncheckedItems = catItems.filter(item => !item.checked);
      if (uncheckedItems.length === 0) continue;

      text += `【${category}】\n`;
      for (const item of uncheckedItems) {
        text += `${item.name} ${item.amount}${item.unit}\n`;
      }
    }

    text = text.trim();

    navigator.clipboard.writeText(text).then(() => {
      alert('クリップボードに買い物リストをコピーしました！\nGoogle Keepが開いたら「リスト」形式（チェックボックス）で貼り付けるか、貼り付け後にメニューから「チェックボックスを表示」を選んでください。');
      window.open('https://keep.google.com/', '_blank');
    }).catch(err => {
      console.error(err);
      alert('クリップボードへのコピーに失敗しました。');
    });
  });
}

function renderMyRecipe() {
  const customRecipes = getCustomRecipes();
  contentMyrecipe.innerHTML = renderMyRecipeTab(customRecipes);
  // Event: save recipe
  document.getElementById('btn-save-recipe')?.addEventListener('click', handleSaveRecipe);
  
  // Event: AI Import
  document.getElementById('btn-ai-import')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    const urlEl = document.getElementById('ai-import-url') as HTMLInputElement;
    const url = urlEl.value.trim();
    if (!url) {
      alert("読み込みたいレシピや動画のURLを入力してください");
      urlEl.focus();
      return;
    }
    
    // Get GAS API Endpoint from localStorage, ask user if not found
    let endpoint = localStorage.getItem('kondate_gas_endpoint');
    if (!endpoint) {
      // カスタムモーダルでURLを入力させる
      const modalOverlay = document.getElementById('modal-overlay')!;
      const modalBody = document.getElementById('modal-body')!;
      
      modalBody.innerHTML = `
        <h2 class="modal-title">⚙️ API連携設定 (初回のみ)</h2>
        <p style="font-size: 0.9rem; margin-bottom: 16px; line-height: 1.5;">
          さきほどGASでデプロイした<strong>「ウェブアプリのURL」</strong>を貼り付けてください。
        </p>
        <input type="text" id="gas-url-input" class="input" style="width: 100%; margin-bottom: 16px;" placeholder="https://script.google.com/macros/s/..." />
        <button id="btn-save-gas-url" class="btn btn-primary" style="width: 100%; justify-content: center;">保存して自動入力を開始</button>
      `;
      modalOverlay.classList.add('active');
      
      document.getElementById('btn-save-gas-url')?.addEventListener('click', () => {
        const inputUrl = (document.getElementById('gas-url-input') as HTMLInputElement).value.trim();
        if (inputUrl && inputUrl.startsWith('http')) {
          localStorage.setItem('kondate_gas_endpoint', inputUrl);
          modalOverlay.classList.remove('active');
          // 保存後に再度インポート処理を走らせる
          document.getElementById('btn-ai-import')?.click();
        } else {
          alert('正しいURL（https://...）を入力してください');
        }
      });
      return;
    }
    
    const statusEl = document.getElementById('ai-import-status')!;
    statusEl.style.display = 'block';
    statusEl.textContent = '⏳ AIにレシピを解析させています...（長くて十数秒かかります）';
    statusEl.style.color = 'var(--text-muted)';
    
    // 安全装置: ボタンを無効化して連打を防ぐ
    btn.disabled = true;
    const originalBtnText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> 解析中...';
    
    try {
      // GASはGETリクエスト(URLパラメータ方式)が最も確実に動く
      const fetchUrl = endpoint + '?url=' + encodeURIComponent(url);
      const resp = await fetch(fetchUrl, {
        method: 'GET',
        redirect: 'follow'
      });
      
      const text = await resp.text();
      let data: any;
      try {
        data = tryRepairJson(text);
      } catch (err: any) {
        throw new Error(`レスポンスの解析に失敗しました: ${err.message}`);
      }
      if (data.error) throw new Error(data.error);
      
      // Populate form
      (document.getElementById('recipe-name') as HTMLInputElement).value = data.name || '';
      (document.getElementById('recipe-genre') as HTMLSelectElement).value = data.genre || 'その他';
      (document.getElementById('recipe-category') as HTMLSelectElement).value = data.category || 'その他';
      (document.getElementById('recipe-protein') as HTMLSelectElement).value = data.protein || 'なし';
      (document.getElementById('recipe-url') as HTMLInputElement).value = data.sourceUrl || url;
      
      const ingredientsText = (data.ingredients || []).map((i: any) => `${i.name} ${i.amount}${i.unit || ''}`).join('\n');
      (document.getElementById('recipe-ingredients') as HTMLTextAreaElement).value = ingredientsText;
      
      const stepsText = (data.steps || []).map((s: string, idx: number) => `${idx + 1}. ${s}`).join('\n');
      (document.getElementById('recipe-steps') as HTMLTextAreaElement).value = stepsText;
      
      statusEl.textContent = '✅ AI読み込み完了！内容を確認して保存してください。';
      statusEl.style.color = 'var(--color-green)';
    } catch (err: any) {
      console.error(err);
      statusEl.textContent = `❌ エラー: ${err.message}`;
      statusEl.style.color = 'var(--color-red)';
      
      if (err.message.includes('Failed to fetch') || err.message.includes('CORS') || err.message.includes('NetworkError')) {
        if (confirm('通信エラーが発生しました。GAS側のコードが正しいか、またはAPIのURLが間違っていないか確認してください。URLを再設定しますか？')) {
          localStorage.removeItem('kondate_gas_endpoint');
        }
      }
    } finally {
      // 安全装置解除: ボタンを元に戻す
      btn.disabled = false;
      btn.innerHTML = originalBtnText;
    }
  });
  // Event: delete recipe
  contentMyrecipe.querySelectorAll('.delete-recipe').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = (btn as HTMLElement).dataset.id!;
      removeCustomRecipe(id);
      renderMyRecipe();
    });
  });
  // Event: click custom recipe to view detail
  contentMyrecipe.querySelectorAll('.custom-recipe-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).classList.contains('delete-recipe')) return;
      const id = (item as HTMLElement).dataset.recipeId;
      if (!id) return;
      const recipe = getAllRecipes().find(r => r.id === id);
      if (recipe) showRecipeDetail(recipe);
    });
  });
}

// ===== Handlers =====
function handleGenerate(days: number) {
  dayCount = days;
  menu = generateMenu(days, currentMealType, currentMood, menu);
  saveCurrentMenu(menu, currentMealType);
  renderMenu();
}

function handleRefresh(dayIdx: number, slot: 'main' | 'side' | 'soup') {
  menu = replaceMenuItem(menu, dayIdx, slot, currentMealType, currentMood);
  saveCurrentMenu(menu, currentMealType);
  renderMenu();
}

function handleAddPantry() {
  const nameEl = document.getElementById('pantry-name') as HTMLInputElement;
  const amountEl = document.getElementById('pantry-amount') as HTMLInputElement;
  const unitEl = document.getElementById('pantry-unit') as HTMLInputElement;
  const categoryEl = document.getElementById('pantry-category') as HTMLSelectElement;
  const expiresEl = document.getElementById('pantry-expires') as HTMLInputElement;

  const name = nameEl.value.trim();
  if (!name) { nameEl.focus(); return; }

  const itemData = {
    name,
    amount: amountEl.value.trim() || '適量',
    unit: unitEl.value.trim(),
    category: categoryEl.value,
    addedAt: new Date().toISOString(),
    expiresAt: expiresEl.value || undefined,
  };

  if (editingPantryItemName) {
    updatePantryItem(editingPantryItemName, itemData);
    editingPantryItemName = null;
    document.getElementById('btn-add-pantry')!.textContent = '追加';
    document.getElementById('btn-cancel-pantry-edit')!.style.display = 'none';
  } else {
    addPantryItem(itemData);
  }

  nameEl.value = '';
  amountEl.value = '';
  unitEl.value = '';
  expiresEl.value = '';
  renderPantry();
  nameEl.focus();
}

function handleSaveRecipe() {
  const name = (document.getElementById('recipe-name') as HTMLInputElement).value.trim();
  const genre = (document.getElementById('recipe-genre') as HTMLSelectElement).value;
  const category = (document.getElementById('recipe-category') as HTMLSelectElement).value;
  const protein = (document.getElementById('recipe-protein') as HTMLSelectElement).value;
  const ingredientsText = (document.getElementById('recipe-ingredients') as HTMLTextAreaElement).value.trim();
  const stepsText = (document.getElementById('recipe-steps') as HTMLTextAreaElement).value.trim();
  const sourceUrl = (document.getElementById('recipe-url') as HTMLInputElement).value.trim();

  if (!name) {
    alert('レシピ名を入力してください');
    return;
  }

  // Parse ingredients
  const ingredients = ingredientsText.split('\n').filter(l => l.trim()).map(line => {
    const parts = line.trim().split(/\s+/);
    const ingName = parts[0] || '';
    const amount = parts.slice(1).join(' ') || '適量';
    return { name: ingName, amount, unit: '', category: '野菜' as const };
  });

  // Parse steps
  const steps = stepsText.split('\n').filter(l => l.trim()).map(line => {
    return line.trim().replace(/^\d+\.\s*/, '');
  });

  const recipe: Recipe = {
    id: '',
    name,
    genre: genre as any,
    category: category as any,
    protein: protein === 'なし' ? '' : protein,
    servings: 4,
    ingredients,
    steps,
    prepTime: 10,
    cookTime: 15,
    tips: '',
    isCustom: true,
    sourceUrl: sourceUrl || undefined,
  };

  addCustomRecipe(recipe);

  // Clear form
  (document.getElementById('recipe-name') as HTMLInputElement).value = '';
  (document.getElementById('recipe-ingredients') as HTMLTextAreaElement).value = '';
  (document.getElementById('recipe-steps') as HTMLTextAreaElement).value = '';
  (document.getElementById('recipe-url') as HTMLInputElement).value = '';

  renderMyRecipe();
}

/**
 * AIが生成した壊れたJSON（末尾カンマ、マークダウン囲み等）を修復してパースを試みる
 */
function tryRepairJson(text: string): any {
  let cleaned = text.trim();
  
  // 1. マークダウンのコードブロック（```json ... ```）を除去
  cleaned = cleaned.replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/i, '$1');
  
  // 2. 制御文字を除去
  cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // 3. 配列やオブジェクトの末尾にある不要なカンマを除去（再試行）
    // 例: [1, 2,] -> [1, 2]  /  {"a": 1,} -> {"a": 1}
    let repaired = cleaned
      .replace(/,\s*([\]}])/g, '$1') // 末尾カンマ
      .replace(/\]\s*\[/g, '],[')    // 万が一配列が連続していた場合の補完
      .replace(/\}\s*\{/g, '},{');   // オブジェクトが連続していた場合の補完
    
    try {
      return JSON.parse(repaired);
    } catch (innerE) {
      console.error("JSON Repair Failed:", { original: text, repaired });
      throw new Error(`JSONの形式が正しくありません。\n${(innerE as Error).message}`);
    }
  }
}

function showRecipeDetail(recipe: Recipe) {
  modalBody.innerHTML = renderRecipeDetail(recipe);
  modalOverlay.classList.add('active');
}

// ===== Concierge Render =====
function renderConcierge() {
  contentConcierge.innerHTML = renderConciergeTab(getPantry());

  const inputEl = document.getElementById('chat-input') as HTMLInputElement;
  const sendBtn = document.getElementById('btn-chat-send') as HTMLButtonElement;
  const chatArea = document.getElementById('chat-area');

  // 付箋クリックイベント
  document.querySelectorAll('.sticky-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const tag = (e.target as HTMLElement).dataset.tag;
      if (tag) {
        inputEl.value += (inputEl.value ? ' ' : '') + tag;
        inputEl.focus();
      }
    });
  });

  // --- 【NEW】フェーズ3：能動的な挨拶の取得 ---
  if (!isGreetingFetched) {
    getGreeting();
  }

  // --- 【NEW】フェーズ4：モード切り替えイベント ---
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      const mode = target.dataset.mode as typeof conciergeMode;
      if (mode) {
        conciergeMode = mode;
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        target.classList.add('active');
        
        // モードが変わったら挨拶を再取得（任意：今回は再取得する仕様にします）
        const greetingEl = document.getElementById('ai-initial-greeting');
        if (greetingEl) {
          greetingEl.innerHTML = '<span class="spinner" style="border-color:var(--text-primary); border-top-color:transparent; width:14px; height:14px; border-width:2px; display:inline-block; margin-right:4px; vertical-align:middle;"></span> モード切替中...';
        }
        getGreeting(); 
      }
    });
  });

  const formatChatText = (text: string) => {
    // 基本の改行
    let html = text.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
    // 太字
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/＊＊(.*?)＊＊/g, '<strong>$1</strong>');
    
    // 読点(。)のあとなどに改行を挿入して読みやすくする（既に<br>が続いていなければ）
    html = html.replace(/。(\s*)(?!<br>)/g, '。<br><br>');
    html = html.replace(/！(\s*)(?!<br>)/g, '！<br>');
    html = html.replace(/(\d+\.\s)/g, '<br>$1'); // 1. 2. などの前に改行

    return html;
  };

  async function getGreeting() {
    const greetingEl = document.getElementById('ai-initial-greeting');
    if (!greetingEl) return;

    const endpoint = localStorage.getItem('kondate_gas_endpoint');
    if (!endpoint || endpoint.includes('dummy')) return;

    try {
      const hour = new Date().getHours();
      let timeInfo = "昼";
      if (hour >= 5 && hour < 10) timeInfo = "朝";
      else if (hour >= 18 || hour < 5) timeInfo = "夜";

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'get_greeting',
          pantry: getPantry(),
          timeInfo: timeInfo,
          mode: conciergeMode // 【NEW】
        })
      });

      const data = await resp.json();
      if (data.greeting) {
        greetingEl.innerHTML = formatChatText(data.greeting);
        isGreetingFetched = true;
        
        // --- 【NEW】初回挨拶を履歴に追加し、会話の重複を防ぐ ---
        chatHistory.push({ role: 'model', text: data.greeting });
      }
    } catch (err) {
      console.error("Greeting fetch error:", err);
      greetingEl.innerHTML = "今日何食べる〜？<br>冷蔵庫にあるもので、パパッと美味しいもの作りましょうか！";
    }
  }

  const appendMessage = (role: 'user'|'ai', rawText: string) => {
    if (!chatArea) return null;
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${role}-message`;
    
    msgDiv.innerHTML = role === 'ai' 
      ? `<div class="chat-avatar">👩‍🍳</div><div class="chat-bubble">${formatChatText(rawText)}</div>`
      : `<div class="chat-bubble">${formatChatText(rawText)}</div>`;
    
    // 削除ボタン
    const delBtn = document.createElement('button');
    delBtn.className = 'msg-delete-btn';
    delBtn.innerHTML = '🗑️';
    delBtn.title = "このメッセージを履歴から削除";
    delBtn.onclick = () => {
      msgDiv.remove();
      // 履歴配列から削除
      const targetRole = role === 'ai' ? 'model' : 'user';
      const idx = chatHistory.findIndex(h => h.role === targetRole && h.text === rawText);
      if (idx !== -1) chatHistory.splice(idx, 1);
    };
    msgDiv.appendChild(delBtn);

    chatArea.appendChild(msgDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
    return msgDiv;
  };
  
  const sendMessage = async () => {
    const text = inputEl.value.trim();
    if (!text) return;
    
    // UIに追加（ユーザー）
    appendMessage('user', text);
    inputEl.value = '';
    
    let endpoint = localStorage.getItem('kondate_gas_endpoint');
    if (!endpoint || endpoint.includes('dummy')) {
      appendMessage('ai', '⚠️ GASのAPI URLが正しく設定されていません。「マイレシピ」タブの歯車アイコンから、今回デプロイしたURLを設定してください。');
      return;
    }

    const loadingMsg = appendMessage('ai', '<span class="spinner" style="border-color:var(--text-primary); border-top-color:transparent; width:14px; height:14px; border-width:2px; display:inline-block; margin-right:4px; vertical-align:middle;"></span> 考え中...');
    sendBtn.disabled = true;

    try {
      const payload = {
        action: 'chat',
        message: text,
        history: chatHistory,
        pantry: getPantry(),
        mode: conciergeMode // 【NEW】
      };

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain' // CORS回避
        },
        body: JSON.stringify(payload)
      });

      const data = await resp.json();
      if (data.error) throw new Error(data.error);

      // 履歴更新
      chatHistory.push({ role: 'user', text });
      chatHistory.push({ role: 'model', text: data.reply });

      // ローディングメッセージを上書き
      if (loadingMsg) {
        loadingMsg.querySelector('.chat-bubble')!.innerHTML = formatChatText(data.reply);
        
        // 削除ボタンへの参照イベントを更新（rawTextをdata.replyに変更するため）
        const db = loadingMsg.querySelector('.msg-delete-btn') as HTMLButtonElement;
        if (db) {
          db.onclick = () => {
            loadingMsg.remove();
            const idx = chatHistory.findIndex(h => h.role === 'model' && h.text === data.reply);
            if (idx !== -1) chatHistory.splice(idx, 1);
          };
        }
      }
    } catch (err: any) {
      console.error(err);
      if (loadingMsg) {
        loadingMsg.querySelector('.chat-bubble')!.innerHTML = `❌ 通信エラー: ${err.message}`;
      }
    } finally {
      sendBtn.disabled = false;
      if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
    }
  };

  sendBtn?.addEventListener('click', sendMessage);
  inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

function showDayDetail(menuItem: MenuItem) {
  modalBody.innerHTML = renderDayDetail(menuItem);
  modalOverlay.classList.add('active');
}

function showCookingMode(menuItem: MenuItem) {
  const steps = generateCookingTimeline(menuItem);
  const ings = getAllIngredientsForDay(menuItem);

  const ingsHtml = ings.map(i => `
    <div class="ingredient-item">
      <span>${i.name}</span>
      <span class="ingredient-amount">${i.amount}${i.unit}</span>
    </div>
  `).join('');

  const stepsHtml = steps.map((s, idx) => `
    <li class="step-item ${s.isParallel ? 'step-parallel' : ''}">
      <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:2px;">
        <span class="genre-badge" style="background:var(--color-blue); padding:1px 6px;">${s.phase}</span> 
        ${s.fromRecipe} (約${s.estimatedMinutes}分)
      </div>
      <div>${s.isParallel ? '<strong style="color:var(--color-orange)">【並行作業】</strong>' : ''}${formatStepWithIngredients(s.text, s.ingredients)}</div>
    </li>
  `).join('');

  modalBody.innerHTML = `
    <h2 class="modal-title">👩‍🍳 クッキングモード</h2>
    <div class="modal-meta" style="margin-bottom:12px">
      <span>${menuItem.day}曜日の献立を並列で効率よく作ります</span>
    </div>
    <div class="modal-section">
      <h3 class="modal-section-title">🔪 使う材料（3品合計）</h3>
      <div class="ingredient-list">
        ${ingsHtml}
      </div>
    </div>
    <div class="modal-section">
      <h3 class="modal-section-title">⏱️ 統合タイムライン</h3>
      <ol class="step-list">
        ${stepsHtml}
      </ol>
    </div>
  `;
  modalOverlay.classList.add('active');
}

// ===== Modal =====
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
function closeModal() {
  modalOverlay.classList.remove('active');
}

// ===== Init =====
renderMenu();
