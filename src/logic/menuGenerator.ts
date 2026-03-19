import { Recipe } from '../data/recipes';
import { getAllRecipes, getPantry, MenuItem } from '../data/storage';

type Genre = '和食' | '洋食' | '中華' | '韓国';
const GENRES: Genre[] = ['和食', '洋食', '中華', '韓国'];
const PROTEINS = ['鶏', '豚', '魚', '豆腐'];

function getDayLabels(days: number): string[] {
    if (days === 5) return ['月', '火', '水', '木', '金'];
    if (days === 7) return ['月', '火', '水', '木', '金', '土', '日'];
    return Array.from({ length: days }, (_, i) => `Day${i + 1}`);
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function scoreByPantry(recipe: Recipe): number {
    const pantry = getPantry();
    const pantryNames = pantry.map(p => p.name);
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    let score = 0;
    for (const ing of recipe.ingredients) {
        if (ing.category === '調味料') continue; // skip seasonings
        const matchedPantry = pantry.find(p => ing.name.includes(p.name) || p.name.includes(ing.name));
        if (matchedPantry) {
            score += 10;
            // 賞味期限が3日以内の食材を使うレシピを優先
            if (matchedPantry.expiresAt) {
                const expiry = new Date(matchedPantry.expiresAt);
                if (expiry <= threeDaysLater) {
                    score += 20; // 高い優先度
                }
            }
        }
    }
    return score;
}

function pickRecipe(
    pool: Recipe[],
    category: '主菜' | '副菜' | '汁物',
    targetGenre: Genre,
    usedIds: Set<string>,
    mealType: 'Breakfast' | 'Lunch' | 'Dinner',
    mood: string,
    avoidProtein?: string
): Recipe | null {
    let candidates = pool.filter(r =>
        r.category === category &&
        r.genre === targetGenre &&
        !usedIds.has(r.id) &&
        (r.mealType?.includes(mealType)) &&
        (mood === 'おまかせ' || r.tags?.includes(mood)) &&
        (category !== '主菜' || !avoidProtein || r.protein !== avoidProtein)
    );

    if (candidates.length === 0) {
        // Fallback: relax genre but keep mealType and mood
        candidates = pool.filter(r =>
            r.category === category &&
            !usedIds.has(r.id) &&
            (r.mealType?.includes(mealType)) &&
            (mood === 'おまかせ' || r.tags?.includes(mood)) &&
            (category !== '主菜' || !avoidProtein || r.protein !== avoidProtein)
        );
    }

    if (candidates.length === 0) {
        // Fallback 2: relax mood, keep mealType
        candidates = pool.filter(r =>
            r.category === category &&
            !usedIds.has(r.id) &&
            (r.mealType?.includes(mealType)) &&
            (category !== '主菜' || !avoidProtein || r.protein !== avoidProtein)
        );
    }

    if (candidates.length === 0) {
        // Ultimate fallback: ignore constraints except usedIds
        candidates = pool.filter(r => r.category === category && !usedIds.has(r.id));
    }

    if (candidates.length === 0) {
        // Ultimate fallback: ignore all constraints
        candidates = pool.filter(r => r.category === category && !usedIds.has(r.id));
    }

    if (candidates.length === 0) return null;

    // Score by pantry and sort
    const scored = candidates.map(r => ({ recipe: r, score: scoreByPantry(r) + Math.random() * 3 }));
    scored.sort((a, b) => b.score - a.score);
    return scored[0].recipe;
}

export function generateMenu(
    days: number,
    mealType: 'Breakfast' | 'Lunch' | 'Dinner' = 'Dinner',
    mood: string = 'おまかせ',
    existingMenu?: MenuItem[]
): MenuItem[] {
    const clampedDays = Math.max(1, Math.min(7, days));
    const allRecipes = getAllRecipes();
    const dayLabels = getDayLabels(clampedDays);
    const menu: MenuItem[] = [];
    const usedIds = new Set<string>();

    if (existingMenu) {
        for (let i = 0; i < Math.min(clampedDays, existingMenu.length); i++) {
            const ex = existingMenu[i];
            if (ex.mainLocked && ex.main) usedIds.add(ex.main.id);
            if (ex.sideLocked && ex.side) usedIds.add(ex.side.id);
            if (ex.soupLocked && ex.soup) usedIds.add(ex.soup.id);
        }
    }

    const genreSeq: Genre[] = [];
    const shuffledGenres = shuffle(GENRES);
    for (let i = 0; i < clampedDays; i++) {
        genreSeq.push(shuffledGenres[i % GENRES.length]);
    }
    for (let i = 1; i < genreSeq.length; i++) {
        if (genreSeq[i] === genreSeq[i - 1]) {
            const others = GENRES.filter(g => g !== genreSeq[i]);
            genreSeq[i] = others[Math.floor(Math.random() * others.length)];
        }
    }

    // ロックされた主菜がある場合はジャンルを固定
    for (let i = 0; i < clampedDays; i++) {
        const ex = existingMenu?.[i];
        if (ex && ex.mainLocked && ex.main) {
            genreSeq[i] = ex.main.genre;
        }
    }

    let lastProtein = '';

    for (let i = 0; i < clampedDays; i++) {
        const genre = genreSeq[i];
        const exItem = existingMenu?.[i];

        let main = exItem?.mainLocked ? exItem.main : pickRecipe(allRecipes, '主菜', genre, usedIds, mealType, mood, lastProtein);
        if (main) {
            usedIds.add(main.id);
            lastProtein = main.protein;
        }

        let side: Recipe | null = null;
        let soup: Recipe | null = null;

        if (mealType === 'Dinner') {
            side = exItem?.sideLocked ? exItem.side : pickRecipe(allRecipes, '副菜', genre, usedIds, mealType, mood);
            if (side) usedIds.add(side.id);

            soup = exItem?.soupLocked ? exItem.soup : pickRecipe(allRecipes, '汁物', genre, usedIds, mealType, mood);
            if (soup) usedIds.add(soup.id);
        }

        menu.push({
            day: dayLabels[i],
            main: main || allRecipes[0], // fallback if totally empty
            mainLocked: exItem?.mainLocked || false,
            side: side || null,
            sideLocked: exItem?.sideLocked || false,
            soup: soup || null,
            soupLocked: exItem?.soupLocked || false,
        });
    }

    return menu;
}

export function replaceMenuItem(
    menu: MenuItem[],
    dayIndex: number,
    slot: 'main' | 'side' | 'soup',
    mealType: 'Breakfast' | 'Lunch' | 'Dinner' = 'Dinner',
    mood: string = 'おまかせ'
): MenuItem[] {
    const allRecipes = getAllRecipes();
    const usedIds = new Set(menu.flatMap(m => [m.main?.id, m.side?.id, m.soup?.id].filter(Boolean) as string[]));
    const currentItem = menu[dayIndex][slot];
    // currentItemをusedIdsから削除しない（＝再選択させない）
    // もしすでに usedIds.has(currentItem.id) であればそのまま

    const categoryMap = { main: '主菜' as const, side: '副菜' as const, soup: '汁物' as const };
    const genre = menu[dayIndex].main?.genre || '和食';
    const replacement = pickRecipe(allRecipes, categoryMap[slot], genre as Genre, usedIds, mealType, mood);

    if (replacement) {
        const newMenu = [...menu];
        newMenu[dayIndex] = { ...newMenu[dayIndex], [slot]: replacement };
        return newMenu;
    }
    return menu;
}

/**
 * 指定された食材を含む献立を1日分生成する。
 * 指定食材を含むレシピを主菜として最優先で選択する。
 */
export function generateMenuForIngredient(ingredientName: string): MenuItem {
    const allRecipes = getAllRecipes();
    const usedIds = new Set<string>();

    // 指定食材を含むレシピを探す（主菜優先 → 副菜 → 汁物）
    const findRecipeWith = (category: '主菜' | '副菜' | '汁物'): Recipe | null => {
        const candidates = allRecipes.filter(r =>
            r.category === category &&
            !usedIds.has(r.id) &&
            r.ingredients.some(ing => ing.name.includes(ingredientName) || ingredientName.includes(ing.name))
        );
        if (candidates.length > 0) {
            const picked = candidates[Math.floor(Math.random() * candidates.length)];
            return picked;
        }
        return null;
    };

    // まず指定食材を含む主菜を探す
    let main = findRecipeWith('主菜');
    if (!main) {
        // 主菜になければ、ジャンル問わず通常のpickRecipeで選ぶ
        const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
        main = pickRecipe(allRecipes, '主菜', genre, usedIds, 'Dinner', 'おまかせ');
    }
    if (main) usedIds.add(main.id);

    const mainGenre = (main?.genre || '和食') as Genre;

    // 副菜・汁物は指定食材があればそれ優先、なければ通常ロジック
    let side = findRecipeWith('副菜') || pickRecipe(allRecipes, '副菜', mainGenre, usedIds, 'Dinner', 'おまかせ');
    if (side) usedIds.add(side.id);

    let soup = findRecipeWith('汁物') || pickRecipe(allRecipes, '汁物', mainGenre, usedIds, 'Dinner', 'おまかせ');
    if (soup) usedIds.add(soup.id);

    return {
        day: '今日',
        main: main || allRecipes[0],
        side: side,
        soup: soup,
    };
}
