'use client';

import { useState } from 'react';

const SPECIALIZATIONS = {
  'mathematics': {
    name: 'Mathématiques',
    nameAr: 'رياضيات',
    subjects: {
      math: { name: 'Mathématiques', coefficient: 4, nameAr: 'رياضيات' },
      physics: { name: 'Sciences Physiques', coefficient: 4, nameAr: 'علوم فيزيائية' },
      arabic: { name: 'Arabe', coefficient: 2, nameAr: 'عربية' },
      french: { name: 'Français', coefficient: 2, nameAr: 'فرنسية' },
      english: { name: 'Anglais', coefficient: 1, nameAr: 'إنجليزية' },
      philosophy: { name: 'Philosophie', coefficient: 2, nameAr: 'فلسفة' },
      history: { name: 'Histoire-Géographie', coefficient: 1, nameAr: 'تاريخ وجغرافيا' },
      computer: { name: 'Informatique', coefficient: 1, nameAr: 'إعلامية' },
      sport: { name: 'Sport', coefficient: 1, nameAr: 'رياضة' }
    }
  },
  'experimental_sciences': {
    name: 'Sciences Expérimentales',
    nameAr: 'علوم تجريبية',
    subjects: {
      svt: { name: 'Sciences de la Vie et de la Terre', coefficient: 4, nameAr: 'علوم الحياة والأرض' },
      physics: { name: 'Sciences Physiques', coefficient: 4, nameAr: 'علوم فيزيائية' },
      math: { name: 'Mathématiques', coefficient: 3, nameAr: 'رياضيات' },
      arabic: { name: 'Arabe', coefficient: 2, nameAr: 'عربية' },
      french: { name: 'Français', coefficient: 2, nameAr: 'فرنسية' },
      english: { name: 'Anglais', coefficient: 1, nameAr: 'إنجليزية' },
      philosophy: { name: 'Philosophie', coefficient: 2, nameAr: 'فلسفة' },
      history: { name: 'Histoire-Géographie', coefficient: 1, nameAr: 'تاريخ وجغرافيا' },
      sport: { name: 'Sport', coefficient: 1, nameAr: 'رياضة' }
    }
  },
  'technical': {
    name: 'Sciences Techniques',
    nameAr: 'علوم تقنية',
    subjects: {
      tech: { name: 'Technologie', coefficient: 4, nameAr: 'تكنولوجيا' },
      math: { name: 'Mathématiques', coefficient: 4, nameAr: 'رياضيات' },
      physics: { name: 'Sciences Physiques', coefficient: 3, nameAr: 'علوم فيزيائية' },
      arabic: { name: 'Arabe', coefficient: 2, nameAr: 'عربية' },
      french: { name: 'Français', coefficient: 2, nameAr: 'فرنسية' },
      english: { name: 'Anglais', coefficient: 1, nameAr: 'إنجليزية' },
      philosophy: { name: 'Philosophie', coefficient: 2, nameAr: 'فلسفة' },
      history: { name: 'Histoire-Géographie', coefficient: 1, nameAr: 'تاريخ وجغرافيا' },
      sport: { name: 'Sport', coefficient: 1, nameAr: 'رياضة' }
    }
  },
  'economics': {
    name: 'Économie et Gestion',
    nameAr: 'اقتصاد وتصرف',
    subjects: {
      economics: { name: 'Économie et Gestion', coefficient: 4, nameAr: 'اقتصاد وتصرف' },
      math: { name: 'Mathématiques', coefficient: 3, nameAr: 'رياضيات' },
      arabic: { name: 'Arabe', coefficient: 3, nameAr: 'عربية' },
      french: { name: 'Français', coefficient: 2, nameAr: 'فرنسية' },
      english: { name: 'Anglais', coefficient: 2, nameAr: 'إنجليزية' },
      philosophy: { name: 'Philosophie', coefficient: 2, nameAr: 'فلسفة' },
      history: { name: 'Histoire-Géographie', coefficient: 2, nameAr: 'تاريخ وجغرافيا' },
      computer: { name: 'Informatique', coefficient: 1, nameAr: 'إعلامية' },
      sport: { name: 'Sport', coefficient: 1, nameAr: 'رياضة' }
    }
  },
  'computer_science': {
    name: 'Sciences de l\'Informatique',
    nameAr: 'علوم الإعلامية',
    subjects: {
      computer: { name: 'Informatique', coefficient: 4, nameAr: 'إعلامية' },
      math: { name: 'Mathématiques', coefficient: 4, nameAr: 'رياضيات' },
      physics: { name: 'Sciences Physiques', coefficient: 2, nameAr: 'علوم فيزيائية' },
      arabic: { name: 'Arabe', coefficient: 2, nameAr: 'عربية' },
      french: { name: 'Français', coefficient: 2, nameAr: 'فرنسية' },
      english: { name: 'Anglais', coefficient: 2, nameAr: 'إنجليزية' },
      philosophy: { name: 'Philosophie', coefficient: 2, nameAr: 'فلسفة' },
      history: { name: 'Histoire-Géographie', coefficient: 1, nameAr: 'تاريخ وجغرافيا' },
      sport: { name: 'Sport', coefficient: 1, nameAr: 'رياضة' }
    }
  },
  'sport': {
    name: 'Sport',
    nameAr: 'رياضة',
    subjects: {
      sport: { name: 'Sport', coefficient: 4, nameAr: 'رياضة' },
      arabic: { name: 'Arabe', coefficient: 3, nameAr: 'عربية' },
      french: { name: 'Français', coefficient: 2, nameAr: 'فرنسية' },
      english: { name: 'Anglais', coefficient: 1, nameAr: 'إنجليزية' },
      philosophy: { name: 'Philosophie', coefficient: 2, nameAr: 'فلسفة' },
      history: { name: 'Histoire-Géographie', coefficient: 2, nameAr: 'تاريخ وجغرافيا' },
      math: { name: 'Mathématiques', coefficient: 2, nameAr: 'رياضيات' },
      physics: { name: 'Sciences Physiques', coefficient: 2, nameAr: 'علوم فيزيائية' },
      svt: { name: 'Sciences de la Vie et de la Terre', coefficient: 2, nameAr: 'علوم الحياة والأرض' }
    }
  },
  'letters': {
    name: 'Lettres',
    nameAr: 'آداب',
    subjects: {
      arabic: { name: 'Arabe', coefficient: 4, nameAr: 'عربية' },
      french: { name: 'Français', coefficient: 3, nameAr: 'فرنسية' },
      philosophy: { name: 'Philosophie', coefficient: 3, nameAr: 'فلسفة' },
      history: { name: 'Histoire-Géographie', coefficient: 3, nameAr: 'تاريخ وجغرافيا' },
      english: { name: 'Anglais', coefficient: 2, nameAr: 'إنجليزية' },
      math: { name: 'Mathématiques', coefficient: 1, nameAr: 'رياضيات' },
      physics: { name: 'Sciences Physiques', coefficient: 1, nameAr: 'علوم فيزيائية' },
      sport: { name: 'Sport', coefficient: 1, nameAr: 'رياضة' }
    }
  }
};

export default function Calculator() {
  const [selectedSpecialization, setSelectedSpecialization] = useState('mathematics');
  const [grades, setGrades] = useState({});
  const [result, setResult] = useState(null);

  const calculateAverage = () => {
    const specialization = SPECIALIZATIONS[selectedSpecialization];
    let totalPoints = 0;
    let totalCoefficients = 0;
    const subjectResults = {};

    Object.entries(specialization.subjects).forEach(([subjectKey, subject]) => {
      const grade = parseFloat(grades[subjectKey]) || 0;
      const points = grade * subject.coefficient;
      totalPoints += points;
      totalCoefficients += subject.coefficient;
      
      subjectResults[subjectKey] = {
        grade,
        coefficient: subject.coefficient,
        points,
        name: subject.name,
        nameAr: subject.nameAr
      };
    });

    const average = totalPoints / totalCoefficients;
    
    setResult({
      average: average.toFixed(2),
      totalPoints: totalPoints.toFixed(2),
      totalCoefficients,
      subjectResults,
      specialization: specialization.name
    });
  };

  const handleGradeChange = (subjectKey, value) => {
    const numValue = parseFloat(value);
    if (numValue >= 0 && numValue <= 20) {
      setGrades(prev => ({
        ...prev,
        [subjectKey]: value
      }));
    }
  };

  const resetForm = () => {
    setGrades({});
    setResult(null);
  };

  const currentSpecialization = SPECIALIZATIONS[selectedSpecialization];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🧮 Calculateur de Moyenne Bac
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Calculez votre moyenne du baccalauréat selon votre spécialisation
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {/* Specialization Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choisissez votre spécialisation:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(SPECIALIZATIONS).map(([key, spec]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedSpecialization(key);
                    resetForm();
                  }}
                  className={`p-3 text-left rounded-lg border-2 transition-all ${
                    selectedSpecialization === key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                  }`}
                >
                  <div className="font-medium text-sm">{spec.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{spec.nameAr}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Grades Input */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Notes pour: {currentSpecialization.name} ({currentSpecialization.nameAr})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(currentSpecialization.subjects).map(([subjectKey, subject]) => (
                <div key={subjectKey} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {subject.name} ({subject.nameAr})
                    <span className="text-blue-600 dark:text-blue-400 ml-1">
                      [Coef: {subject.coefficient}]
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.01"
                    value={grades[subjectKey] || ''}
                    onChange={(e) => handleGradeChange(subjectKey, e.target.value)}
                    placeholder="Note sur 20"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={calculateAverage}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Calculer la Moyenne
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Réinitialiser
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                📊 Résultats pour {result.specialization}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {result.average}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Moyenne Générale</div>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {result.totalPoints}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Points</div>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {result.totalCoefficients}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Coefficients</div>
                </div>
              </div>

              {/* Subject Breakdown */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  Détail par matière:
                </h4>
                <div className="space-y-2">
                  {Object.entries(result.subjectResults).map(([subjectKey, subject]) => (
                    <div key={subjectKey} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                      <div className="flex-1">
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {subject.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          ({subject.nameAr})
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {subject.grade}/20 × {subject.coefficient} = {subject.points.toFixed(2)} pts
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grade Assessment */}
              <div className="mt-4 p-4 rounded-lg bg-white dark:bg-gray-700">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  🎯 Évaluation:
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {parseFloat(result.average) >= 16 && (
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Excellent! Vous avez une très bonne moyenne.
                    </span>
                  )}
                  {parseFloat(result.average) >= 14 && parseFloat(result.average) < 16 && (
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      Très bien! Bonne moyenne.
                    </span>
                  )}
                  {parseFloat(result.average) >= 12 && parseFloat(result.average) < 14 && (
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                      Bien! Moyenne satisfaisante.
                    </span>
                  )}
                  {parseFloat(result.average) >= 10 && parseFloat(result.average) < 12 && (
                    <span className="text-orange-600 dark:text-orange-400 font-medium">
                      Passable. Vous pouvez vous améliorer.
                    </span>
                  )}
                  {parseFloat(result.average) < 10 && (
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      Insuffisant. Il faut travailler davantage.
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
            💡 Entrez vos notes sur 20 pour chaque matière. Le calcul se fait automatiquement selon les coefficients officiels.
          </div>
        </div>
      </div>
    </div>
  );
}
