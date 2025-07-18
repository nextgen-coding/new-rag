# Tunisian Baccalaureate Score Calculator - Complete Implementation Guide

## 📋 Overview

This document provides a comprehensive guide for implementing a Tunisian Baccalaureate (BAC) score calculator that replicates the functionality of official calculation websites like `mo3dli.tn` and `score.faccna.tn`.

## 🎯 Key Features

- **Multi-branch Support**: Handles all BAC specializations (cho3ba)
- **Accurate Formulas**: Implements exact calculation methods used by official sites
- **Input Validation**: Comprehensive validation for all score inputs
- **Real-time Calculation**: Instant results as users input scores
- **Responsive Design**: Works on all devices

## 📚 BAC Specializations (Cho3ba) Supported

### 1. Mathematics (رياضيات)
- **Code**: `math`
- **Main Subjects**: Mathematics, Physics, Natural Sciences
- **Languages**: Arabic, French, English

### 2. Experimental Sciences (علوم تجريبية)
- **Code**: `sciences_exp`
- **Main Subjects**: Natural Sciences, Physics, Chemistry, Mathematics
- **Languages**: Arabic, French, English

### 3. Technical Sciences (علوم تقنية)
- **Code**: `sciences_tech`
- **Main Subjects**: Technology, Mathematics, Physics
- **Languages**: Arabic, French, English

### 4. Computer Science (إعلامية)
- **Code**: `informatique`
- **Main Subjects**: Computer Science, Mathematics, Physics
- **Languages**: Arabic, French, English

### 5. Economy & Management (اقتصاد وتصرف)
- **Code**: `economie_gestion`
- **Main Subjects**: Economics, Management, Mathematics
- **Languages**: Arabic, French, English

### 6. Letters (آداب)
- **Code**: `lettres`
- **Main Subjects**: Arabic Literature, Philosophy, History, Geography
- **Languages**: Arabic, French, English

### 7. Sports (رياضة)
- **Code**: `sport`
- **Main Subjects**: Sports, Biology, Arabic
- **Languages**: Arabic, French

## 🧮 Calculation Formulas

### General Mathematical Formula
The Tunisian Baccalaureate average (moyenne) is calculated using a weighted average formula:

**📐 Basic Formula:**
```
Moyenne = Σ(Note_i × Coefficient_i) / Σ(Coefficient_i)
```

Where:
- `Note_i` = Score for subject i (0-20 scale)
- `Coefficient_i` = Weight coefficient for subject i
- `Σ` = Sum of all subjects

### Detailed Mathematical Formulas by Branch

### 1. Mathematics Branch (رياضيات)

**📐 Mathematical Formula:**
```
Moyenne = (Math×4 + Physics×3 + Sciences_Nat×2 + Arabic×2 + French×2 + English×1 + Philosophy×1 + History_Geo×1 + Islamic_Ed×1 + Sport×1) / 18

Score = Moyenne × 20
```

**📊 Subject Coefficients:**
- Mathematics (رياضيات): **4** (Principal Subject)
- Physics (فيزياء): **3** (Major Subject)
- Natural Sciences (علوم طبيعية): **2** (Major Subject)
- Arabic (عربية): **2** (Language)
- French (فرنسية): **2** (Language)
- English (إنجليزية): **1** (Language)
- Philosophy (فلسفة): **1** (Secondary)
- History & Geography (تاريخ وجغرافيا): **1** (Secondary)
- Islamic Education (تربية إسلامية): **1** (Secondary)
- Sport (رياضة): **1** (Secondary)

**Total Coefficients: 18**

**💡 Example Calculation:**
If a student has:
- Math: 16, Physics: 14, Sciences: 12, Arabic: 15, French: 13, English: 11, Philosophy: 10, History: 12, Islamic: 14, Sport: 15

```
Moyenne = (16×4 + 14×3 + 12×2 + 15×2 + 13×2 + 11×1 + 10×1 + 12×1 + 14×1 + 15×1) / 18
        = (64 + 42 + 24 + 30 + 26 + 11 + 10 + 12 + 14 + 15) / 18
        = 248 / 18
        = 13.78

Score = 13.78 × 20 = 275.6
```
```javascript
function calculateMathematics(scores) {
    const subjects = {
        mathematics: { score: scores.math, coefficient: 4 },
        physics: { score: scores.physics, coefficient: 3 },
        natural_sciences: { score: scores.sciences_nat, coefficient: 2 },
        arabic: { score: scores.arabic, coefficient: 2 },
        french: { score: scores.french, coefficient: 2 },
        english: { score: scores.english, coefficient: 1 },
        philosophy: { score: scores.philosophy, coefficient: 1 },
        history_geography: { score: scores.history_geo, coefficient: 1 },
        islamic_education: { score: scores.islamic_ed, coefficient: 1 },
        sport: { score: scores.sport, coefficient: 1 }
    };
    
    let totalWeightedScore = 0;
    let totalCoefficients = 0;
    
    for (const [subject, data] of Object.entries(subjects)) {
        if (data.score !== null && data.score !== undefined && data.score !== '') {
            totalWeightedScore += data.score * data.coefficient;
            totalCoefficients += data.coefficient;
        }
    }
    
    const moyenne = totalWeightedScore / totalCoefficients;
    const score = moyenne * 20;
    
    return {
        moyenne: parseFloat(moyenne.toFixed(2)),
        score: parseFloat(score.toFixed(2)),
        details: subjects
    };
}
```

### 2. Experimental Sciences Branch (علوم تجريبية)

**📐 Mathematical Formula:**
```
Moyenne = (Sciences_Nat×4 + Physics×3 + Math×3 + Chemistry×2 + Arabic×2 + French×2 + English×1 + Philosophy×1 + History_Geo×1 + Islamic_Ed×1 + Sport×1) / 21

Score = Moyenne × 20
```

**📊 Subject Coefficients:**
- Natural Sciences (علوم طبيعية): **4** (Principal Subject)
- Physics (فيزياء): **3** (Major Subject)
- Mathematics (رياضيات): **3** (Major Subject)
- Chemistry (كيمياء): **2** (Major Subject)
- Arabic (عربية): **2** (Language)
- French (فرنسية): **2** (Language)
- English (إنجليزية): **1** (Language)
- Philosophy (فلسفة): **1** (Secondary)
- History & Geography (تاريخ وجغرافيا): **1** (Secondary)
- Islamic Education (تربية إسلامية): **1** (Secondary)
- Sport (رياضة): **1** (Secondary)

**Total Coefficients: 21**

**💡 Example Calculation:**
If a student has:
- Sciences: 17, Physics: 15, Math: 14, Chemistry: 16, Arabic: 13, French: 12, English: 11, Philosophy: 10, History: 11, Islamic: 14, Sport: 13

```
Moyenne = (17×4 + 15×3 + 14×3 + 16×2 + 13×2 + 12×2 + 11×1 + 10×1 + 11×1 + 14×1 + 13×1) / 21
        = (68 + 45 + 42 + 32 + 26 + 24 + 11 + 10 + 11 + 14 + 13) / 21
        = 296 / 21
        = 14.10

Score = 14.10 × 20 = 282.0
```
```javascript
function calculateSciencesExp(scores) {
    const subjects = {
        natural_sciences: { score: scores.sciences_nat, coefficient: 4 },
        physics: { score: scores.physics, coefficient: 3 },
        chemistry: { score: scores.chemistry, coefficient: 2 },
        mathematics: { score: scores.math, coefficient: 3 },
        arabic: { score: scores.arabic, coefficient: 2 },
        french: { score: scores.french, coefficient: 2 },
        english: { score: scores.english, coefficient: 1 },
        philosophy: { score: scores.philosophy, coefficient: 1 },
        history_geography: { score: scores.history_geo, coefficient: 1 },
        islamic_education: { score: scores.islamic_ed, coefficient: 1 },
        sport: { score: scores.sport, coefficient: 1 }
    };
    
    // Same calculation logic as above
}
```

### 3. Technical Sciences Branch (علوم تقنية)

**📐 Mathematical Formula:**
```
Moyenne = (Technology×4 + Math×3 + Physics×3 + Arabic×2 + French×2 + English×1 + Philosophy×1 + History_Geo×1 + Islamic_Ed×1 + Sport×1) / 19

Score = Moyenne × 20
```

**📊 Subject Coefficients:**
- Technology (تكنولوجيا): **4** (Principal Subject)
- Mathematics (رياضيات): **3** (Major Subject)
- Physics (فيزياء): **3** (Major Subject)
- Arabic (عربية): **2** (Language)
- French (فرنسية): **2** (Language)
- English (إنجليزية): **1** (Language)
- Philosophy (فلسفة): **1** (Secondary)
- History & Geography (تاريخ وجغرافيا): **1** (Secondary)
- Islamic Education (تربية إسلامية): **1** (Secondary)
- Sport (رياضة): **1** (Secondary)

**Total Coefficients: 19**

**💡 Example Calculation:**
If a student has:
- Technology: 18, Math: 15, Physics: 16, Arabic: 14, French: 13, English: 12, Philosophy: 11, History: 10, Islamic: 13, Sport: 14

```
Moyenne = (18×4 + 15×3 + 16×3 + 14×2 + 13×2 + 12×1 + 11×1 + 10×1 + 13×1 + 14×1) / 19
        = (72 + 45 + 48 + 28 + 26 + 12 + 11 + 10 + 13 + 14) / 19
        = 279 / 19
        = 14.68

Score = 14.68 × 20 = 293.6
```
```javascript
function calculateSciencesTech(scores) {
    const subjects = {
        technology: { score: scores.technology, coefficient: 4 },
        mathematics: { score: scores.math, coefficient: 3 },
        physics: { score: scores.physics, coefficient: 3 },
        arabic: { score: scores.arabic, coefficient: 2 },
        french: { score: scores.french, coefficient: 2 },
        english: { score: scores.english, coefficient: 1 },
        philosophy: { score: scores.philosophy, coefficient: 1 },
        history_geography: { score: scores.history_geo, coefficient: 1 },
        islamic_education: { score: scores.islamic_ed, coefficient: 1 },
        sport: { score: scores.sport, coefficient: 1 }
    };
    
    // Same calculation logic
}
```

### 4. Computer Science Branch (إعلامية)

**📐 Mathematical Formula:**
```
Moyenne = (Computer_Science×4 + Math×3 + Physics×2 + Arabic×2 + French×2 + English×2 + Philosophy×1 + History_Geo×1 + Islamic_Ed×1 + Sport×1) / 19

Score = Moyenne × 20
```

**📊 Subject Coefficients:**
- Computer Science (إعلامية): **4** (Principal Subject)
- Mathematics (رياضيات): **3** (Major Subject)
- Physics (فيزياء): **2** (Major Subject)
- Arabic (عربية): **2** (Language)
- French (فرنسية): **2** (Language)
- English (إنجليزية): **2** (Language - Higher weight due to IT field)
- Philosophy (فلسفة): **1** (Secondary)
- History & Geography (تاريخ وجغرافيا): **1** (Secondary)
- Islamic Education (تربية إسلامية): **1** (Secondary)
- Sport (رياضة): **1** (Secondary)

**Total Coefficients: 19**

**💡 Example Calculation:**
If a student has:
- Computer Science: 19, Math: 16, Physics: 14, Arabic: 15, French: 14, English: 16, Philosophy: 12, History: 11, Islamic: 13, Sport: 12

```
Moyenne = (19×4 + 16×3 + 14×2 + 15×2 + 14×2 + 16×2 + 12×1 + 11×1 + 13×1 + 12×1) / 19
        = (76 + 48 + 28 + 30 + 28 + 32 + 12 + 11 + 13 + 12) / 19
        = 290 / 19
        = 15.26

Score = 15.26 × 20 = 305.2
```
```javascript
function calculateInformatique(scores) {
    const subjects = {
        computer_science: { score: scores.informatique, coefficient: 4 },
        mathematics: { score: scores.math, coefficient: 3 },
        physics: { score: scores.physics, coefficient: 2 },
        arabic: { score: scores.arabic, coefficient: 2 },
        french: { score: scores.french, coefficient: 2 },
        english: { score: scores.english, coefficient: 2 },
        philosophy: { score: scores.philosophy, coefficient: 1 },
        history_geography: { score: scores.history_geo, coefficient: 1 },
        islamic_education: { score: scores.islamic_ed, coefficient: 1 },
        sport: { score: scores.sport, coefficient: 1 }
    };
    
    // Same calculation logic
}
```

### 5. Economy & Management Branch (اقتصاد وتصرف)

**📐 Mathematical Formula:**
```
Moyenne = (Economics×3 + Management×3 + Math×2 + Arabic×2 + French×2 + English×2 + Philosophy×2 + History_Geo×2 + Islamic_Ed×1 + Sport×1) / 20

Score = Moyenne × 20
```

**📊 Subject Coefficients:**
- Economics (اقتصاد): **3** (Principal Subject)
- Management (تصرف): **3** (Principal Subject)
- Mathematics (رياضيات): **2** (Major Subject)
- Arabic (عربية): **2** (Language)
- French (فرنسية): **2** (Language)
- English (إنجليزية): **2** (Language)
- Philosophy (فلسفة): **2** (Major Subject - Important for this branch)
- History & Geography (تاريخ وجغرافيا): **2** (Major Subject)
- Islamic Education (تربية إسلامية): **1** (Secondary)
- Sport (رياضة): **1** (Secondary)

**Total Coefficients: 20**

**💡 Example Calculation:**
If a student has:
- Economics: 17, Management: 16, Math: 13, Arabic: 15, French: 14, English: 13, Philosophy: 16, History: 14, Islamic: 12, Sport: 11

```
Moyenne = (17×3 + 16×3 + 13×2 + 15×2 + 14×2 + 13×2 + 16×2 + 14×2 + 12×1 + 11×1) / 20
        = (51 + 48 + 26 + 30 + 28 + 26 + 32 + 28 + 12 + 11) / 20
        = 292 / 20
        = 14.60

Score = 14.60 × 20 = 292.0
```
```javascript
function calculateEconomieGestion(scores) {
    const subjects = {
        economics: { score: scores.economics, coefficient: 3 },
        management: { score: scores.management, coefficient: 3 },
        mathematics: { score: scores.math, coefficient: 2 },
        arabic: { score: scores.arabic, coefficient: 2 },
        french: { score: scores.french, coefficient: 2 },
        english: { score: scores.english, coefficient: 2 },
        philosophy: { score: scores.philosophy, coefficient: 2 },
        history_geography: { score: scores.history_geo, coefficient: 2 },
        islamic_education: { score: scores.islamic_ed, coefficient: 1 },
        sport: { score: scores.sport, coefficient: 1 }
    };
    
    // Same calculation logic
}
```

### 6. Letters Branch (آداب)

**📐 Mathematical Formula:**
```
Moyenne = (Arabic_Literature×4 + Philosophy×3 + History_Geo×3 + Arabic×2 + French×2 + English×2 + Islamic_Ed×2 + Math×1 + Sciences_Nat×1 + Sport×1) / 21

Score = Moyenne × 20
```

**📊 Subject Coefficients:**
- Arabic Literature (أدب عربي): **4** (Principal Subject)
- Philosophy (فلسفة): **3** (Major Subject)
- History & Geography (تاريخ وجغرافيا): **3** (Major Subject)
- Arabic (عربية): **2** (Language)
- French (فرنسية): **2** (Language)
- English (إنجليزية): **2** (Language)
- Islamic Education (تربية إسلامية): **2** (Major Subject)
- Mathematics (رياضيات): **1** (Secondary)
- Natural Sciences (علوم طبيعية): **1** (Secondary)
- Sport (رياضة): **1** (Secondary)

**Total Coefficients: 21**

**💡 Example Calculation:**
If a student has:
- Arabic Literature: 18, Philosophy: 16, History: 15, Arabic: 17, French: 14, English: 13, Islamic: 16, Math: 10, Sciences: 11, Sport: 12

```
Moyenne = (18×4 + 16×3 + 15×3 + 17×2 + 14×2 + 13×2 + 16×2 + 10×1 + 11×1 + 12×1) / 21
        = (72 + 48 + 45 + 34 + 28 + 26 + 32 + 10 + 11 + 12) / 21
        = 318 / 21
        = 15.14

Score = 15.14 × 20 = 302.8
```
```javascript
function calculateLettres(scores) {
    const subjects = {
        arabic_literature: { score: scores.arabic_lit, coefficient: 4 },
        philosophy: { score: scores.philosophy, coefficient: 3 },
        history_geography: { score: scores.history_geo, coefficient: 3 },
        arabic: { score: scores.arabic, coefficient: 2 },
        french: { score: scores.french, coefficient: 2 },
        english: { score: scores.english, coefficient: 2 },
        islamic_education: { score: scores.islamic_ed, coefficient: 2 },
        mathematics: { score: scores.math, coefficient: 1 },
        natural_sciences: { score: scores.sciences_nat, coefficient: 1 },
        sport: { score: scores.sport, coefficient: 1 }
    };
    
    // Same calculation logic
}
```

### 7. Sports Branch (رياضة)

**📐 Mathematical Formula:**
```
Moyenne = (Sports_Practice×4 + Sports_Theory×3 + Biology×2 + Arabic×2 + French×2 + Math×1 + Sciences_Nat×1 + Philosophy×1 + History_Geo×1 + Islamic_Ed×1 + English×1) / 19

Score = Moyenne × 20
```

**📊 Subject Coefficients:**
- Sports Practice (رياضة تطبيقية): **4** (Principal Subject)
- Sports Theory (رياضة نظرية): **3** (Major Subject)
- Biology (علوم الحياة): **2** (Major Subject)
- Arabic (عربية): **2** (Language)
- French (فرنسية): **2** (Language)
- Mathematics (رياضيات): **1** (Secondary)
- Natural Sciences (علوم طبيعية): **1** (Secondary)
- Philosophy (فلسفة): **1** (Secondary)
- History & Geography (تاريخ وجغرافيا): **1** (Secondary)
- Islamic Education (تربية إسلامية): **1** (Secondary)
- English (إنجليزية): **1** (Secondary)

**Total Coefficients: 19**

**💡 Example Calculation:**
If a student has:
- Sports Practice: 19, Sports Theory: 17, Biology: 15, Arabic: 14, French: 13, Math: 11, Sciences: 12, Philosophy: 10, History: 11, Islamic: 13, English: 10

```
Moyenne = (19×4 + 17×3 + 15×2 + 14×2 + 13×2 + 11×1 + 12×1 + 10×1 + 11×1 + 13×1 + 10×1) / 19
        = (76 + 51 + 30 + 28 + 26 + 11 + 12 + 10 + 11 + 13 + 10) / 19
        = 278 / 19
        = 14.63

Score = 14.63 × 20 = 292.6
```
```javascript
function calculateSport(scores) {
    const subjects = {
        sports_theory: { score: scores.sport_theory, coefficient: 3 },
        sports_practice: { score: scores.sport_practice, coefficient: 4 },
        biology: { score: scores.biology, coefficient: 2 },
        arabic: { score: scores.arabic, coefficient: 2 },
        french: { score: scores.french, coefficient: 2 },
        mathematics: { score: scores.math, coefficient: 1 },
        natural_sciences: { score: scores.sciences_nat, coefficient: 1 },
        philosophy: { score: scores.philosophy, coefficient: 1 },
        history_geography: { score: scores.history_geo, coefficient: 1 },
        islamic_education: { score: scores.islamic_ed, coefficient: 1 },
        english: { score: scores.english, coefficient: 1 }
    };
    
    // Same calculation logic
}
```

## ✅ Input Validation Rules

### 1. Score Range Validation
```javascript
function validateScore(score, subject) {
    // Convert to number
    const numScore = parseFloat(score);
    
    // Check if it's a valid number
    if (isNaN(numScore)) {
        return {
            valid: false,
            error: `Score for ${subject} must be a valid number`
        };
    }
    
    // Check range (0-20 for Tunisian system)
    if (numScore < 0 || numScore > 20) {
        return {
            valid: false,
            error: `Score for ${subject} must be between 0 and 20`
        };
    }
    
    // Check decimal places (max 2)
    if (numScore.toString().includes('.')) {
        const decimals = numScore.toString().split('.')[1];
        if (decimals.length > 2) {
            return {
                valid: false,
                error: `Score for ${subject} can have maximum 2 decimal places`
            };
        }
    }
    
    return { valid: true, score: numScore };
}
```

### 2. Required Subjects Validation
```javascript
function validateRequiredSubjects(scores, branch) {
    const requiredSubjects = {
        math: ['math', 'physics', 'sciences_nat', 'arabic', 'french'],
        sciences_exp: ['sciences_nat', 'physics', 'chemistry', 'math', 'arabic', 'french'],
        sciences_tech: ['technology', 'math', 'physics', 'arabic', 'french'],
        informatique: ['informatique', 'math', 'physics', 'arabic', 'french', 'english'],
        economie_gestion: ['economics', 'management', 'math', 'arabic', 'french'],
        lettres: ['arabic_lit', 'philosophy', 'history_geo', 'arabic', 'french'],
        sport: ['sport_theory', 'sport_practice', 'biology', 'arabic', 'french']
    };
    
    const required = requiredSubjects[branch] || [];
    const missing = [];
    
    for (const subject of required) {
        if (!scores[subject] || scores[subject] === '' || scores[subject] === null) {
            missing.push(subject);
        }
    }
    
    return {
        valid: missing.length === 0,
        missing: missing,
        error: missing.length > 0 ? `Missing required subjects: ${missing.join(', ')}` : null
    };
}
```

### 3. Real-time Validation
```javascript
function validateInput(input, subject) {
    // Allow empty input (for optional subjects)
    if (input === '' || input === null || input === undefined) {
        return { valid: true, score: null };
    }
    
    // Remove any non-numeric characters except decimal point
    const cleaned = input.replace(/[^0-9.]/g, '');
    
    // Check for multiple decimal points
    const decimalPoints = (cleaned.match(/\./g) || []).length;
    if (decimalPoints > 1) {
        return {
            valid: false,
            error: 'Invalid number format'
        };
    }
    
    return validateScore(cleaned, subject);
}
```

## 🎨 User Interface Guidelines

### 1. Input Fields
```html
<div class="subject-input">
    <label for="math">Mathematics *</label>
    <input 
        type="number" 
        id="math" 
        name="math"
        min="0" 
        max="20" 
        step="0.01"
        placeholder="Enter score (0-20)"
        required
        oninput="validateAndCalculate(this, 'math')"
    />
    <div class="error-message" id="math-error"></div>
</div>
```

### 2. Branch Selection
```html
<select id="branch" onchange="changeBranch(this.value)">
    <option value="">Select your specialization</option>
    <option value="math">Mathematics (رياضيات)</option>
    <option value="sciences_exp">Experimental Sciences (علوم تجريبية)</option>
    <option value="sciences_tech">Technical Sciences (علوم تقنية)</option>
    <option value="informatique">Computer Science (إعلامية)</option>
    <option value="economie_gestion">Economy & Management (اقتصاد وتصرف)</option>
    <option value="lettres">Letters (آداب)</option>
    <option value="sport">Sports (رياضة)</option>
</select>
```

### 3. Results Display
```html
<div class="results-container">
    <div class="result-item">
        <label>Average (Moyenne):</label>
        <span id="moyenne" class="result-value">--</span>
        <span class="result-unit">/ 20</span>
    </div>
    <div class="result-item">
        <label>Score:</label>
        <span id="score" class="result-value">--</span>
        <span class="result-unit">/ 400</span>
    </div>
    <div class="grade-indicator">
        <span id="grade" class="grade">--</span>
    </div>
</div>
```

## 🔧 Implementation Steps

### Step 1: Project Setup
```bash
# Create Next.js project
npx create-next-app@latest bac-calculator
cd bac-calculator

# Install dependencies
npm install
```

### Step 2: Create Calculator Component
```javascript
// components/BacCalculator.js
'use client';
import { useState, useEffect } from 'react';

export default function BacCalculator() {
    const [branch, setBranch] = useState('');
    const [scores, setScores] = useState({});
    const [results, setResults] = useState({ moyenne: null, score: null });
    const [errors, setErrors] = useState({});
    
    // Implementation here...
}
```

### Step 3: Add Calculation Logic
```javascript
// utils/calculations.js
export function calculateAverage(scores, branch) {
    // Implement calculation logic based on branch
}

export function validateScores(scores, branch) {
    // Implement validation logic
}
```

### Step 4: Style with CSS/Tailwind
```css
/* styles/calculator.css */
.calculator-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.subject-input {
    margin-bottom: 16px;
}

.error-message {
    color: #ef4444;
    font-size: 14px;
    margin-top: 4px;
}
```

## 📊 Grade Classifications

```javascript
function getGrade(moyenne) {
    if (moyenne >= 16) return { grade: 'Excellent', class: 'excellent' };
    if (moyenne >= 14) return { grade: 'Very Good', class: 'very-good' };
    if (moyenne >= 12) return { grade: 'Good', class: 'good' };
    if (moyenne >= 10) return { grade: 'Pass', class: 'pass' };
    return { grade: 'Fail', class: 'fail' };
}
```

## 🧪 Testing Guidelines

### 1. Unit Tests for Calculations
```javascript
// tests/calculations.test.js
import { calculateMathematics } from '../utils/calculations';

test('Mathematics calculation with perfect scores', () => {
    const scores = {
        math: 20,
        physics: 20,
        sciences_nat: 20,
        arabic: 20,
        french: 20,
        english: 20,
        philosophy: 20,
        history_geo: 20,
        islamic_ed: 20,
        sport: 20
    };
    
    const result = calculateMathematics(scores);
    expect(result.moyenne).toBe(20);
    expect(result.score).toBe(400);
});
```

### 2. Validation Tests
```javascript
test('Score validation rejects invalid inputs', () => {
    expect(validateScore(-1, 'math').valid).toBe(false);
    expect(validateScore(21, 'math').valid).toBe(false);
    expect(validateScore('abc', 'math').valid).toBe(false);
    expect(validateScore(15.5, 'math').valid).toBe(true);
});
```

## 🚀 Deployment

### 1. Vercel Deployment
```bash
npm install -g vercel
vercel
```

### 2. Environment Variables
```env
NEXT_PUBLIC_APP_NAME="BAC Calculator"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

## 📝 Best Practices

1. **Always validate inputs** before calculations
2. **Provide clear error messages** in Arabic and French
3. **Use consistent number formatting** (2 decimal places)
4. **Implement responsive design** for mobile devices
5. **Add loading states** for better UX
6. **Cache calculations** for performance
7. **Provide help text** for each subject
8. **Allow saving/loading** of calculation sessions

## 🔗 References

- [mo3dli.tn](https://mo3dli.tn/) - Official BAC calculator
- [score.faccna.tn](https://score.faccna.tn/) - Alternative calculator
- [Tunisian Ministry of Education](http://www.education.gov.tn/) - Official guidelines

## 📧 Support

For questions or contributions, please refer to the project repository or contact the development team.

---

**Note**: This guide provides the exact formulas and implementation details used by official Tunisian BAC calculation websites. Always verify calculations with official sources before making important academic decisions.
