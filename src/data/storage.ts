import { Recipe, recipes as builtinRecipes } from './recipes';

const KEYS = {
    PANTRY: 'kondate_pantry',
    CUSTOM_RECIPES: 'kondate_custom_recipes',
    SHOPPING_LIST: 'kondate_shopping_list',
} as const;

export interface PantryItem {
    name: string;
    amount: string;
    unit: string;
    category: string;
    addedAt: string;
    expiresAt?: string; // ISO 8601 date string (yyyy-mm-dd)
}

export interface MenuItem {
    day: string;
    main: Recipe;
    mainLocked?: boolean;
    side: Recipe | null;
    sideLocked?: boolean;
    soup: Recipe | null;
    soupLocked?: boolean;
}

export interface ShoppingItem {
    name: string;
    amount: string;
    unit: string;
    category: string;
    checked: boolean;
}

// === Generic helpers ===
function load<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
}
function save(key: string, data: unknown) {
    localStorage.setItem(key, JSON.stringify(data));
}

// === Pantry ===
export function getPantry(): PantryItem[] { return load(KEYS.PANTRY, []); }
export function savePantry(items: PantryItem[]) { save(KEYS.PANTRY, items); }
export function addPantryItem(item: PantryItem) {
    const pantry = getPantry();
    const existing = pantry.find(p => p.name === item.name);
    if (existing) {
        existing.amount = item.amount;
        existing.unit = item.unit;
        existing.category = item.category;
        existing.expiresAt = item.expiresAt;
    } else {
        pantry.push(item);
    }
    savePantry(pantry);
}
export function updatePantryItem(oldName: string, item: PantryItem) {
    const pantry = getPantry();
    const existingIndex = pantry.findIndex(p => p.name === oldName);
    if (existingIndex >= 0) {
        pantry[existingIndex] = item;
    } else {
        pantry.push(item);
    }
    savePantry(pantry);
}
export function removePantryItem(name: string) {
    savePantry(getPantry().filter(p => p.name !== name));
}

// === Custom Recipes ===
export function getCustomRecipes(): Recipe[] { return load(KEYS.CUSTOM_RECIPES, []); }
export function saveCustomRecipes(recipes: Recipe[]) { save(KEYS.CUSTOM_RECIPES, recipes); }
export function addCustomRecipe(recipe: Recipe) {
    const list = getCustomRecipes();
    list.push({ ...recipe, isCustom: true, id: 'custom-' + Date.now() });
    saveCustomRecipes(list);
}
export function removeCustomRecipe(id: string) {
    saveCustomRecipes(getCustomRecipes().filter(r => r.id !== id));
}
export function getAllRecipes(): Recipe[] {
    return [...builtinRecipes, ...getCustomRecipes()];
}

// === Current Menu ===
export function getCurrentMenu(mealType: 'Breakfast' | 'Lunch' | 'Dinner' = 'Dinner'): MenuItem[] {
    const key = `kondate_current_menu_${mealType.toLowerCase()}`;
    return load(key, []);
}
export function saveCurrentMenu(menu: MenuItem[], mealType: 'Breakfast' | 'Lunch' | 'Dinner' = 'Dinner') {
    const key = `kondate_current_menu_${mealType.toLowerCase()}`;
    save(key, menu);
}

// === Shopping List ===
export function getShoppingList(): ShoppingItem[] { return load(KEYS.SHOPPING_LIST, []); }
export function saveShoppingList(list: ShoppingItem[]) { save(KEYS.SHOPPING_LIST, list); }

// === Pantry Deduction (調理完了 → 在庫引き落とし) ===
export function deductIngredientsFromPantry(menuItem: MenuItem): string[] {
    const pantry = getPantry();
    const deducted: string[] = [];

    const allRecipes = [menuItem.main, menuItem.side, menuItem.soup].filter((r): r is Recipe => !!r);
    for (const recipe of allRecipes) {
        for (const ing of recipe.ingredients) {
            if (ing.category === '調味料') continue;
            const pIdx = pantry.findIndex(p =>
                p.name.includes(ing.name) || ing.name.includes(p.name)
            );
            if (pIdx >= 0) {
                const p = pantry[pIdx];
                const pAmount = parseFloat(p.amount);
                const usedAmount = parseFloat(ing.amount);
                if (!isNaN(pAmount) && !isNaN(usedAmount)) {
                    const remaining = pAmount - usedAmount;
                    if (remaining <= 0) {
                        pantry.splice(pIdx, 1);
                    } else {
                        p.amount = String(remaining);
                    }
                } else {
                    // 数量がパースできない場合は使い切ったとみなして削除
                    pantry.splice(pIdx, 1);
                }
                deducted.push(ing.name);
            }
        }
    }
    savePantry(pantry);
    return deducted;
}

// === Pantry Expiry Helpers ===
export function getExpiringItems(withinDays: number = 3): PantryItem[] {
    const pantry = getPantry();
    const now = new Date();
    const threshold = new Date(now.getTime() + withinDays * 24 * 60 * 60 * 1000);
    return pantry.filter(item => {
        if (!item.expiresAt) return false;
        const expiry = new Date(item.expiresAt);
        return expiry <= threshold;
    });
}
