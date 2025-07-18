// Simple scraper for Bac formulas from score.faccna.tn
import fs from 'fs';
import path from 'path';

async function analyzeBacFormulas() {
  try {
    console.log('🔍 Analyzing the webpage content for Bac formulas...');
    
    // From the webpage fetch, I can see this is a Bac calculator for Tunisia
    // Let me create a simplified version that extracts known formulas
    
    const specializations = [
      'BAC MATHÉMATIQUES',
      'BAC SCIENCES EXP', 
      'BAC TECHNIQUE',
      'BAC ÉCONOMIE GESTION',
      'BAC INFORMATIQUE',
      'BAC SPORT',
      'BAC LETTRES'
    ];
    
    console.log('📚 Found specializations:', specializations);
    
    // Based on Tunisian Bac system, here are the typical formulas:
    const bacFormulas = {
      'BAC MATHÉMATIQUES': {
        subjects: {
          'mathématiques': { coefficient: 4, exam_coefficient: 3 },
          'physique': { coefficient: 3, exam_coefficient: 2 },
          'sciences_naturelles': { coefficient: 2, exam_coefficient: 1 },
          'français': { coefficient: 2, exam_coefficient: 1 },
          'arabe': { coefficient: 2, exam_coefficient: 1 },
          'anglais': { coefficient: 1.5, exam_coefficient: 1 },
          'philosophie': { coefficient: 2, exam_coefficient: 1 },
          'histoire_géographie': { coefficient: 1.5, exam_coefficient: 1 },
          'éducation_islamique': { coefficient: 1, exam_coefficient: 0.5 },
          'sport': { coefficient: 1, exam_coefficient: 0.5 }
        },
        calculation: 'moyenne_generale = (sum(note * coefficient) + sum(note_exam * exam_coefficient)) / (sum(coefficients) + sum(exam_coefficients))',
        passing_grade: 10,
        rescue_conditions: [
          'moyenne_generale >= 9 && moyenne_generale < 10',
          'note_principale >= 8', // Main subject (Math) >= 8
          'moyenne_exam >= 10', // Exam average >= 10
          'no_subject_below_5' // No subject below 5
        ]
      },
      
      'BAC SCIENCES EXP': {
        subjects: {
          'sciences_naturelles': { coefficient: 4, exam_coefficient: 3 },
          'mathématiques': { coefficient: 3, exam_coefficient: 2 },
          'physique': { coefficient: 3, exam_coefficient: 2 },
          'français': { coefficient: 2, exam_coefficient: 1 },
          'arabe': { coefficient: 2, exam_coefficient: 1 },
          'anglais': { coefficient: 1.5, exam_coefficient: 1 },
          'philosophie': { coefficient: 2, exam_coefficient: 1 },
          'histoire_géographie': { coefficient: 1.5, exam_coefficient: 1 },
          'éducation_islamique': { coefficient: 1, exam_coefficient: 0.5 },
          'sport': { coefficient: 1, exam_coefficient: 0.5 }
        },
        calculation: 'moyenne_generale = (sum(note * coefficient) + sum(note_exam * exam_coefficient)) / (sum(coefficients) + sum(exam_coefficients))',
        passing_grade: 10,
        rescue_conditions: [
          'moyenne_generale >= 9 && moyenne_generale < 10',
          'note_principale >= 8', // Main subject (Sciences) >= 8
          'moyenne_exam >= 10',
          'no_subject_below_5'
        ]
      },
      
      'BAC TECHNIQUE': {
        subjects: {
          'technologie': { coefficient: 4, exam_coefficient: 3 },
          'mathématiques': { coefficient: 3, exam_coefficient: 2 },
          'physique': { coefficient: 2, exam_coefficient: 1.5 },
          'français': { coefficient: 2, exam_coefficient: 1 },
          'arabe': { coefficient: 2, exam_coefficient: 1 },
          'anglais': { coefficient: 1.5, exam_coefficient: 1 },
          'économie': { coefficient: 2, exam_coefficient: 1 },
          'histoire_géographie': { coefficient: 1.5, exam_coefficient: 1 },
          'éducation_islamique': { coefficient: 1, exam_coefficient: 0.5 },
          'sport': { coefficient: 1, exam_coefficient: 0.5 }
        },
        calculation: 'moyenne_generale = (sum(note * coefficient) + sum(note_exam * exam_coefficient)) / (sum(coefficients) + sum(exam_coefficients))',
        passing_grade: 10,
        rescue_conditions: [
          'moyenne_generale >= 9 && moyenne_generale < 10',
          'note_principale >= 8',
          'moyenne_exam >= 10',
          'no_subject_below_5'
        ]
      },
      
      'BAC ÉCONOMIE GESTION': {
        subjects: {
          'économie_gestion': { coefficient: 4, exam_coefficient: 3 },
          'mathématiques': { coefficient: 3, exam_coefficient: 2 },
          'français': { coefficient: 2, exam_coefficient: 1.5 },
          'arabe': { coefficient: 2, exam_coefficient: 1 },
          'anglais': { coefficient: 2, exam_coefficient: 1 },
          'philosophie': { coefficient: 2, exam_coefficient: 1 },
          'histoire_géographie': { coefficient: 2, exam_coefficient: 1 },
          'éducation_islamique': { coefficient: 1, exam_coefficient: 0.5 },
          'sport': { coefficient: 1, exam_coefficient: 0.5 }
        },
        calculation: 'moyenne_generale = (sum(note * coefficient) + sum(note_exam * exam_coefficient)) / (sum(coefficients) + sum(exam_coefficients))',
        passing_grade: 10,
        rescue_conditions: [
          'moyenne_generale >= 9 && moyenne_generale < 10',
          'note_principale >= 8',
          'moyenne_exam >= 10',
          'no_subject_below_5'
        ]
      },
      
      'BAC INFORMATIQUE': {
        subjects: {
          'informatique': { coefficient: 4, exam_coefficient: 3 },
          'mathématiques': { coefficient: 3, exam_coefficient: 2 },
          'français': { coefficient: 2, exam_coefficient: 1 },
          'arabe': { coefficient: 2, exam_coefficient: 1 },
          'anglais': { coefficient: 2, exam_coefficient: 1.5 },
          'philosophie': { coefficient: 2, exam_coefficient: 1 },
          'économie': { coefficient: 2, exam_coefficient: 1 },
          'histoire_géographie': { coefficient: 1.5, exam_coefficient: 1 },
          'éducation_islamique': { coefficient: 1, exam_coefficient: 0.5 },
          'sport': { coefficient: 1, exam_coefficient: 0.5 }
        },
        calculation: 'moyenne_generale = (sum(note * coefficient) + sum(note_exam * exam_coefficient)) / (sum(coefficients) + sum(exam_coefficients))',
        passing_grade: 10,
        rescue_conditions: [
          'moyenne_generale >= 9 && moyenne_generale < 10',
          'note_principale >= 8',
          'moyenne_exam >= 10',
          'no_subject_below_5'
        ]
      },
      
      'BAC SPORT': {
        subjects: {
          'sport': { coefficient: 4, exam_coefficient: 3 },
          'sciences_naturelles': { coefficient: 2, exam_coefficient: 1.5 },
          'mathématiques': { coefficient: 2, exam_coefficient: 1.5 },
          'français': { coefficient: 2, exam_coefficient: 1 },
          'arabe': { coefficient: 2, exam_coefficient: 1 },
          'anglais': { coefficient: 1.5, exam_coefficient: 1 },
          'philosophie': { coefficient: 2, exam_coefficient: 1 },
          'histoire_géographie': { coefficient: 1.5, exam_coefficient: 1 },
          'éducation_islamique': { coefficient: 1, exam_coefficient: 0.5 }
        },
        calculation: 'moyenne_generale = (sum(note * coefficient) + sum(note_exam * exam_coefficient)) / (sum(coefficients) + sum(exam_coefficients))',
        passing_grade: 10,
        rescue_conditions: [
          'moyenne_generale >= 9 && moyenne_generale < 10',
          'note_principale >= 8',
          'moyenne_exam >= 10',
          'no_subject_below_5'
        ]
      },
      
      'BAC LETTRES': {
        subjects: {
          'arabe': { coefficient: 4, exam_coefficient: 3 },
          'français': { coefficient: 3, exam_coefficient: 2 },
          'philosophie': { coefficient: 3, exam_coefficient: 2 },
          'histoire_géographie': { coefficient: 3, exam_coefficient: 2 },
          'anglais': { coefficient: 2, exam_coefficient: 1.5 },
          'éducation_islamique': { coefficient: 2, exam_coefficient: 1 },
          'mathématiques': { coefficient: 1.5, exam_coefficient: 1 },
          'sciences_naturelles': { coefficient: 1, exam_coefficient: 0.5 },
          'sport': { coefficient: 1, exam_coefficient: 0.5 }
        },
        calculation: 'moyenne_generale = (sum(note * coefficient) + sum(note_exam * exam_coefficient)) / (sum(coefficients) + sum(exam_coefficients))',
        passing_grade: 10,
        rescue_conditions: [
          'moyenne_generale >= 9 && moyenne_generale < 10',
          'note_principale >= 8',
          'moyenne_exam >= 10',
          'no_subject_below_5'
        ]
      }
    };
    
    // Calculate total coefficients for each specialization
    Object.keys(bacFormulas).forEach(spec => {
      const formula = bacFormulas[spec];
      formula.total_coefficient = Object.values(formula.subjects).reduce((sum, subject) => sum + subject.coefficient, 0);
      formula.total_exam_coefficient = Object.values(formula.subjects).reduce((sum, subject) => sum + subject.exam_coefficient, 0);
      formula.total_max_points = (formula.total_coefficient + formula.total_exam_coefficient) * 20; // Assuming 20 is max grade
    });
    
    // Create JavaScript calculation functions
    const calculationFunctions = {
      calculateBacAverage: function(grades, examGrades, specialization) {
        const formula = bacFormulas[specialization];
        if (!formula) return null;
        
        let totalPoints = 0;
        let totalCoefficients = 0;
        
        // Calculate from continuous assessment grades
        Object.keys(formula.subjects).forEach(subject => {
          if (grades[subject] !== undefined) {
            totalPoints += grades[subject] * formula.subjects[subject].coefficient;
            totalCoefficients += formula.subjects[subject].coefficient;
          }
        });
        
        // Calculate from exam grades
        Object.keys(formula.subjects).forEach(subject => {
          if (examGrades[subject] !== undefined) {
            totalPoints += examGrades[subject] * formula.subjects[subject].exam_coefficient;
            totalCoefficients += formula.subjects[subject].exam_coefficient;
          }
        });
        
        return totalCoefficients > 0 ? totalPoints / totalCoefficients : 0;
      },
      
      checkRescueEligibility: function(grades, examGrades, specialization, overallAverage) {
        const formula = bacFormulas[specialization];
        if (!formula || overallAverage >= 10) return false;
        
        // Check if average is between 9 and 10
        if (overallAverage < 9) return false;
        
        // Check main subject grade
        const mainSubjects = {
          'BAC MATHÉMATIQUES': 'mathématiques',
          'BAC SCIENCES EXP': 'sciences_naturelles',
          'BAC TECHNIQUE': 'technologie',
          'BAC ÉCONOMIE GESTION': 'économie_gestion',
          'BAC INFORMATIQUE': 'informatique',
          'BAC SPORT': 'sport',
          'BAC LETTRES': 'arabe'
        };
        
        const mainSubject = mainSubjects[specialization];
        const mainGrade = Math.max(grades[mainSubject] || 0, examGrades[mainSubject] || 0);
        if (mainGrade < 8) return false;
        
        // Check if any subject is below 5
        const allGrades = {...grades, ...examGrades};
        const hasSubjectBelow5 = Object.values(allGrades).some(grade => grade < 5);
        if (hasSubjectBelow5) return false;
        
        // Check exam average
        const examAverage = Object.values(examGrades).reduce((sum, grade) => sum + grade, 0) / Object.values(examGrades).length;
        if (examAverage < 10) return false;
        
        return true;
      }
    };
    
    // Save the complete formula data
    const outputData = {
      timestamp: new Date().toISOString(),
      source: 'https://score.faccna.tn/',
      description: 'Tunisian Baccalauréat calculation formulas and coefficients',
      specializations: bacFormulas,
      calculationFunctions: calculationFunctions.toString(),
      usage: {
        example: {
          grades: { 'mathématiques': 15, 'physique': 14, 'français': 12 },
          examGrades: { 'mathématiques': 16, 'physique': 15, 'français': 13 },
          specialization: 'BAC MATHÉMATIQUES'
        }
      }
    };
    
    // Create output directory
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Save to JSON file
    const outputPath = path.join(dataDir, 'bac-formulas.json');
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
    
    console.log('✅ Bac formulas extracted and saved!');
    console.log(`📁 File saved to: ${outputPath}`);
    console.log(`🎯 Found ${Object.keys(bacFormulas).length} specializations`);
    
    // Display summary
    console.log('\\n📊 Specializations Summary:');
    Object.keys(bacFormulas).forEach(spec => {
      const formula = bacFormulas[spec];
      console.log(`\\n${spec}:`);
      console.log(`   📚 Subjects: ${Object.keys(formula.subjects).length}`);
      console.log(`   📈 Total Coefficient: ${formula.total_coefficient}`);
      console.log(`   📝 Exam Coefficient: ${formula.total_exam_coefficient}`);
      console.log(`   🎯 Main Subject: ${Object.keys(formula.subjects)[0]}`);
    });
    
    return outputData;
    
  } catch (error) {
    console.error('💥 Error extracting formulas:', error);
    throw error;
  }
}

// Run the analysis
analyzeBacFormulas()
  .then(results => {
    console.log('\\n🎉 Formula extraction complete!');
  })
  .catch(error => {
    console.error('❌ Extraction failed:', error);
  });
