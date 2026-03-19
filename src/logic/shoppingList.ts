import { MenuItem, getPantry, PantryItem, ShoppingItem } from '../data/storage';

export function generateShoppingList(menu: MenuItem[]): ShoppingItem[] {
    const pantry = getPantry();
    const pantryNames = pantry.map(p => p.name);

    // Aggregate all ingredients from the menu
    const aggregated = new Map<string, { amount: string; unit: string; category: string }>();

    for (const day of menu) {
        const allRecipes = [day.main, day.side, day.soup].filter(Boolean) as any[];
        for (const recipe of allRecipes) {
            for (const ing of recipe.ingredients) {
                // Skip basic seasonings that most kitchens have
                if (isBasicSeasoning(ing.name)) continue;

                const key = ing.name;
                if (aggregated.has(key)) {
                    // Try to combine amounts
                    const existing = aggregated.get(key)!;
                    existing.amount = combineAmounts(existing.amount, ing.amount);
                } else {
                    aggregated.set(key, { amount: ing.amount, unit: ing.unit, category: ing.category });
                }
            }
        }
    }

    // Remove items that exist in pantry
    const shoppingItems: ShoppingItem[] = [];
    for (const [name, info] of aggregated) {
        const inPantry = pantryNames.some(pn => name.includes(pn) || pn.includes(name));
        if (!inPantry) {
            shoppingItems.push({
                name,
                amount: info.amount,
                unit: info.unit,
                category: info.category,
                checked: false,
            });
        }
    }

    // Sort by category
    const categoryOrder = ['野菜', '肉', '魚介', '豆腐・卵', '乾物・加工品', 'その他', '調味料'];
    shoppingItems.sort((a, b) => {
        const ai = categoryOrder.indexOf(a.category);
        const bi = categoryOrder.indexOf(b.category);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

    return shoppingItems;
}

function isBasicSeasoning(name: string): boolean {
    const basics = ['塩', '砂糖', '醤油', '酒', 'みりん', 'サラダ油', '塩こしょう', '水', '片栗粉', '小麦粉'];
    return basics.includes(name);
}

function combineAmounts(a: string, b: string): string {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (!isNaN(numA) && !isNaN(numB)) {
        return String(numA + numB);
    }
    return `${a} + ${b}`;
}

export function checkedItemsToPantry(items: ShoppingItem[]): PantryItem[] {
    return items
        .filter(item => item.checked)
        .map(item => ({
            name: item.name,
            amount: item.amount,
            unit: item.unit,
            category: item.category,
            addedAt: new Date().toISOString(),
        }));
}
