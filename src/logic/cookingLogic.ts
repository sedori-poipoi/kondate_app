import { Recipe } from '../data/recipes';
import { MenuItem } from '../data/storage';

export interface CookingStep {
    phase: '下準備' | '調理' | '仕上げ';
    text: string;
    fromRecipe: string; // recipe name
    isParallel: boolean;
    estimatedMinutes: number;
    ingredients: { name: string, amount: string, unit: string }[];
}

/**
 * 3品（主菜・副菜・汁物）の調理手順を統合タイムラインに変換する。
 * - 下準備（切る・準備）→ 調理（加熱・炒め・煮込み）→ 仕上げ（盛り付け）の3フェーズに分類
 * - 待ち時間（煮込み・蒸し焼き中）に別の作業を行う並行指示を自動挿入
 */
export function generateCookingTimeline(menuItem: MenuItem): CookingStep[] {
    const recipes = [
        { label: '主菜', recipe: menuItem.main },
        { label: '副菜', recipe: menuItem.side },
        { label: '汁物', recipe: menuItem.soup },
    ].filter(r => r.recipe) as { label: string; recipe: Recipe }[];

    const allSteps: CookingStep[] = [];

    for (const { label, recipe } of recipes) {
        const totalSteps = recipe.steps.length;
        recipe.steps.forEach((step, i) => {
            const isParallel = step.startsWith('【並行】');
            const cleanStep = step.replace(/^【並行】/, '');
            const phase = classifyPhase(cleanStep, i, totalSteps);

            allSteps.push({
                phase,
                text: cleanStep,
                fromRecipe: `${label}：${recipe.name}`,
                isParallel,
                estimatedMinutes: estimateTime(cleanStep),
                ingredients: recipe.ingredients,
            });
        });
    }

    // フェーズ順（下準備→調理→仕上げ）にソートし、同じフェーズ内では元の順序を維持
    const phaseOrder: Record<string, number> = { '下準備': 0, '調理': 1, '仕上げ': 2 };
    allSteps.sort((a, b) => phaseOrder[a.phase] - phaseOrder[b.phase]);

    return optimizeTimeline(allSteps);
}

function classifyPhase(step: string, index: number, total: number): '下準備' | '調理' | '仕上げ' {
    const prepKeywords = ['切る', '切り', 'みじん切り', '薄切り', '乱切り', 'くし切り', 'ほぐ', 'すりおろ', '水にさら', '塩を振', '片栗粉', 'まぶ', '下味', '混ぜ', '戻し', '準備', '半月切り', '細切り', 'ささがき', '叩', 'ペースト', 'レンジ', '加熱して', '皮をむ'];
    const finishKeywords = ['盛り', '散ら', 'トッピング', '振る', '完成', '出来上がり', '仕上げ'];

    const lowerStep = step;

    // 最後のステップは仕上げ候補
    if (index === total - 1 && finishKeywords.some(k => lowerStep.includes(k))) {
        return '仕上げ';
    }

    // 最初のステップまたはキーワードマッチで下準備
    if (index === 0 || prepKeywords.some(k => lowerStep.includes(k))) {
        // ただし加熱調理を含む場合は調理
        const cookKeywords = ['炒め', '焼く', '焼き', '煮', '蒸し', 'フライパン', '鍋に'];
        if (cookKeywords.some(k => lowerStep.includes(k)) && index > 0) {
            return '調理';
        }
        return '下準備';
    }

    return '調理';
}

function estimateTime(step: string): number {
    // 分数の推定：テキストから数字を抽出
    const timeMatch = step.match(/(\d+)分/);
    if (timeMatch) return parseInt(timeMatch[1]);

    const quickKeywords = ['切る', '切り', '混ぜ', '散ら', '振る'];
    if (quickKeywords.some(k => step.includes(k))) return 2;

    return 5; // デフォルト
}

function optimizeTimeline(steps: CookingStep[]): CookingStep[] {
    const optimized: CookingStep[] = [];
    const prepSteps = steps.filter(s => s.phase === '下準備');
    const cookSteps = steps.filter(s => s.phase === '調理');
    const finishSteps = steps.filter(s => s.phase === '仕上げ');

    // 下準備: 全ての下準備をまとめる
    if (prepSteps.length > 0) {
        optimized.push(...prepSteps);
    }

    // 調理：待ち時間がある工程の後に並行作業を提案
    for (let i = 0; i < cookSteps.length; i++) {
        optimized.push(cookSteps[i]);
        // 煮込み・蒸し焼きなどの待ち時間がある場合
        const waitMatch = cookSteps[i].text.match(/(煮込む|蒸し焼き|煮る|沸か|待つ|ひと煮立ち)/);
        if (waitMatch && i + 1 < cookSteps.length) {
            // 次の工程が別レシピの場合、並行指示を付与
            if (cookSteps[i + 1].fromRecipe !== cookSteps[i].fromRecipe) {
                cookSteps[i + 1] = { ...cookSteps[i + 1], isParallel: true };
            }
        }
    }

    // 仕上げ
    if (finishSteps.length > 0) {
        optimized.push(...finishSteps);
    }

    return optimized;
}

/**
 * 全食材をまとめたチェックリストを生成
 */
export function getAllIngredientsForDay(menuItem: MenuItem): { name: string; amount: string; unit: string; recipe: string }[] {
    const recipes = [
        { label: '主菜', recipe: menuItem.main },
        { label: '副菜', recipe: menuItem.side },
        { label: '汁物', recipe: menuItem.soup },
    ].filter(r => r.recipe) as { label: string; recipe: Recipe }[];

    const result: { name: string; amount: string; unit: string; recipe: string }[] = [];
    for (const { label, recipe } of recipes) {
        for (const ing of recipe.ingredients) {
            result.push({
                name: ing.name,
                amount: ing.amount,
                unit: ing.unit,
                recipe: `${label}：${recipe.name}`,
            });
        }
    }
    return result;
}
