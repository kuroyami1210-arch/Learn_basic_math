import { GameSettings, MathOperation, MathQuestion, OperandConfig } from '../types/math';

/**
 * Helper to pick a random integer between min and max inclusive.
 */
export function randomInt(min: number, max: number): number {
  const actualMin = Math.ceil(min);
  const actualMax = Math.floor(max);
  return Math.floor(Math.random() * (actualMax - actualMin + 1)) + actualMin;
}

export function getRangeForScale(scale: string, customMin = 2, customMax = 99): { min: number; max: number } {
  switch (scale) {
    case 'satuan':
      return { min: 2, max: 9 };
    case 'puluhan-kecil':
      return { min: 11, max: 19 };
    case 'puluhan':
      return { min: 10, max: 99 };
    case 'ratusan':
      return { min: 100, max: 999 };
    case 'ribuan':
      return { min: 1000, max: 9999 };
    case 'custom':
    default:
      return { min: Math.min(customMin, customMax), max: Math.max(customMin, customMax) };
  }
}

export function getOperationSymbol(op: MathOperation): string {
  switch (op) {
    case 'multiply':
      return '×';
    case 'add':
      return '+';
    case 'subtract':
      return '−';
    case 'divide':
      return '÷';
  }
}

export function getOperationName(op: MathOperation): string {
  switch (op) {
    case 'multiply':
      return 'Perkalian';
    case 'add':
      return 'Penjumlahan';
    case 'subtract':
      return 'Pengurangan';
    case 'divide':
      return 'Pembagian';
  }
}

/**
 * Generate mental math explanation/shortcut hint for a question.
 */
function generateMultiplicationExplanation(a: number, b: number): string {
  // If either is ending in 5 and squared
  if (a === b && a % 10 === 5) {
    const tens = Math.floor(a / 10);
    return `Trik kuadrat akhiran 5: (${tens} × ${tens + 1}) = ${tens * (tens + 1)}, lalu tambahkan 25 di belakang → ${a * b}`;
  }

  // Multiply by 9
  if (b === 9) {
    return `Trik perkalian 9: (${a} × 10) − ${a} = ${a * 10} − ${a} = ${a * b}`;
  }
  if (a === 9) {
    return `Trik perkalian 9: (${b} × 10) − ${b} = ${b * 10} − ${b} = ${a * b}`;
  }

  // Multiply by 11
  if (b === 11 && a >= 10 && a <= 99) {
    const d1 = Math.floor(a / 10);
    const d2 = a % 10;
    return `Trik perkalian 11: Jumlahkan digit (${d1} + ${d2} = ${d1 + d2}), sisipkan di tengah → ${a * b}`;
  }

  // Multiply by 5
  if (b === 5) {
    return `Trik perkalian 5: Bagi 2 lalu kali 10 (${a} ÷ 2 = ${a / 2} × 10 = ${a * b})`;
  }
  if (a === 5) {
    return `Trik perkalian 5: Bagi 2 lalu kali 10 (${b} ÷ 2 = ${b / 2} × 10 = ${a * b})`;
  }

  // Distributive method for 2-digit multiplication
  if (b >= 11 && b <= 99) {
    const tens = Math.floor(b / 10) * 10;
    const units = b % 10;
    if (units === 0) {
      return `Pecah puluhan: ${a} × ${b} = (${a} × ${b / 10}) × 10 = ${a * b}`;
    }
    return `Metode pecah: (${a} × ${tens}) + (${a} × ${units}) = ${a * tens} + ${a * units} = ${a * b}`;
  }

  return `Perkalian langsung: ${a} × ${b} = ${a * b}`;
}

/**
 * Generate a single math question according to user settings.
 */
export function generateQuestion(settings: GameSettings, index: number): MathQuestion {
  const allowedOps = settings.operations.length > 0 ? settings.operations : (['multiply'] as MathOperation[]);
  const operation = allowedOps[Math.floor(Math.random() * allowedOps.length)];
  const isThreeOperands = settings.numOperands === 3;

  const cfg1: OperandConfig = settings.operands[0] || { scale: 'satuan', min: 2, max: 9 };
  const cfg2: OperandConfig = settings.operands[1] || { scale: 'satuan', min: 2, max: 9 };
  const cfg3: OperandConfig = settings.operands[2] || { scale: 'satuan', min: 2, max: 9 };

  const range1 = getRangeForScale(cfg1.scale, cfg1.min, cfg1.max);
  const range2 = getRangeForScale(cfg2.scale, cfg2.min, cfg2.max);
  const range3 = isThreeOperands ? getRangeForScale(cfg3.scale, cfg3.min, cfg3.max) : { min: 1, max: 1 };

  let num1 = randomInt(range1.min, range1.max);
  let num2 = randomInt(range2.min, range2.max);
  let num3 = isThreeOperands ? randomInt(range3.min, range3.max) : 1;

  let correctAnswer = 0;
  let expressionDisplay = '';
  let explanation = '';

  if (isThreeOperands) {
    // 3 numbers (mainly multiplication or addition for fast math)
    if (operation === 'multiply') {
      correctAnswer = num1 * num2 * num3;
      expressionDisplay = `${num1} × ${num2} × ${num3}`;
      explanation = `Hitung bertahap: (${num1} × ${num2} = ${num1 * num2}) lalu ${num1 * num2} × ${num3} = ${correctAnswer}`;
    } else if (operation === 'add') {
      correctAnswer = num1 + num2 + num3;
      expressionDisplay = `${num1} + ${num2} + ${num3}`;
      explanation = `Jumlahkan bertahap: ${num1} + ${num2} = ${num1 + num2}, lalu + ${num3} = ${correctAnswer}`;
    } else if (operation === 'subtract') {
      // Keep positive
      const total = num1 + num2 + num3;
      correctAnswer = num1;
      expressionDisplay = `${total} − ${num2} − ${num3}`;
      num1 = total;
      explanation = `Pengurangan bertahap: ${total} − ${num2} = ${total - num2}, lalu − ${num3} = ${correctAnswer}`;
    } else {
      // Divide
      const product = num1 * num2 * num3;
      expressionDisplay = `${product} ÷ ${num2} ÷ ${num3}`;
      correctAnswer = num1;
      num1 = product;
      explanation = `Pembagian bertahap: ${product} ÷ ${num2} = ${product / num2}, lalu ÷ ${num3} = ${correctAnswer}`;
    }
    return {
      id: `q-${index}-${Date.now()}-${Math.random()}`,
      numbers: [num1, num2, num3],
      operations: [operation, operation],
      expressionDisplay,
      correctAnswer,
      explanation,
    };
  }

  // 2 Operands
  switch (operation) {
    case 'multiply': {
      correctAnswer = num1 * num2;
      expressionDisplay = `${num1} × ${num2}`;
      explanation = generateMultiplicationExplanation(num1, num2);
      break;
    }
    case 'add': {
      correctAnswer = num1 + num2;
      expressionDisplay = `${num1} + ${num2}`;
      explanation = `Penjumlahan: ${num1} + ${num2} = ${correctAnswer}`;
      break;
    }
    case 'subtract': {
      if (!settings.allowNegative && num1 < num2) {
        // Swap to keep positive
        const temp = num1;
        num1 = num2;
        num2 = temp;
      }
      correctAnswer = num1 - num2;
      expressionDisplay = `${num1} − ${num2}`;
      explanation = `Pengurangan: ${num1} − ${num2} = ${correctAnswer}`;
      break;
    }
    case 'divide': {
      // Integer division guarantee:
      // We want num1 ÷ num2 = quotient (integer)
      // Divisor: num2 (from range 2, min 2)
      // Quotient: Q (from range 1 or reasonable scale)
      const divisor = Math.max(2, num2);
      const quotient = Math.max(1, num1);
      const dividend = divisor * quotient;
      num1 = dividend;
      num2 = divisor;
      correctAnswer = quotient;
      expressionDisplay = `${dividend} ÷ ${divisor}`;
      explanation = `Pembagian bulat: karena ${divisor} × ${quotient} = ${dividend}, maka ${dividend} ÷ ${divisor} = ${quotient}`;
      break;
    }
  }

  return {
    id: `q-${index}-${Date.now()}-${Math.random()}`,
    numbers: [num1, num2],
    operations: [operation],
    expressionDisplay,
    correctAnswer,
    explanation,
  };
}

/**
 * Generate a full set of questions for a game session.
 */
export function generateQuestionList(settings: GameSettings, count: number): MathQuestion[] {
  const questions: MathQuestion[] = [];
  for (let i = 0; i < count; i++) {
    questions.push(generateQuestion(settings, i + 1));
  }
  return questions;
}
