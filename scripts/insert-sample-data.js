import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample university data for testing
const samplePrograms = [
  {
    universite: 'جامعة تونس',
    gouvernorat: 'تونس',
    institution: 'كلية العلوم الإنسانية والإجتماعية بتونس',
    filiere: 'الآداب واللغات',
    diplome: 'الإجازة في العربية',
    section_bac: 'آداب',
    moyenne_bac: 97.5,
    raw_text: 'جامعة تونس كلية العلوم الإنسانية والإجتماعية بتونس الآداب واللغات الإجازة في العربية آداب'
  },
  {
    universite: 'جامعة تونس',
    gouvernorat: 'تونس',
    institution: 'كلية العلوم الإنسانية والإجتماعية بتونس',
    filiere: 'الآداب واللغات',
    diplome: 'الإجازة في الإنقليزية',
    section_bac: 'آداب',
    moyenne_bac: 96.2,
    raw_text: 'جامعة تونس كلية العلوم الإنسانية والإجتماعية بتونس الآداب واللغات الإجازة في الإنقليزية آداب'
  },
  {
    universite: 'جامعة تونس',
    gouvernorat: 'تونس',
    institution: 'كلية العلوم الإنسانية والإجتماعية بتونس',
    filiere: 'الآداب واللغات',
    diplome: 'الإجازة في الفرنسية',
    section_bac: 'آداب',
    moyenne_bac: 95.8,
    raw_text: 'جامعة تونس كلية العلوم الإنسانية والإجتماعية بتونس الآداب واللغات الإجازة في الفرنسية آداب'
  },
  {
    universite: 'جامعة تونس المنار',
    gouvernorat: 'تونس',
    institution: 'كلية العلوم بتونس',
    filiere: 'الرياضيات والفيزياء والعلوم الطبيعية',
    diplome: 'الإجازة في الرياضيات',
    section_bac: 'رياضيات',
    moyenne_bac: 98.5,
    raw_text: 'جامعة تونس المنار كلية العلوم بتونس الرياضيات والفيزياء والعلوم الطبيعية الإجازة في الرياضيات رياضيات'
  },
  {
    universite: 'جامعة تونس المنار',
    gouvernorat: 'تونس',
    institution: 'كلية العلوم بتونس FSB',
    filiere: 'الرياضيات والفيزياء والعلوم الطبيعية',
    diplome: 'الإجازة في الفيزياء',
    section_bac: 'رياضيات',
    moyenne_bac: 97.2,
    raw_text: 'جامعة تونس المنار كلية العلوم بتونس FSB الرياضيات والفيزياء والعلوم الطبيعية الإجازة في الفيزياء رياضيات'
  },
  {
    universite: 'جامعة تونس المنار',
    gouvernorat: 'تونس',
    institution: 'كلية الطب بتونس',
    filiere: 'الطب',
    diplome: 'دكتوراه في الطب',
    section_bac: 'علوم تجريبية',
    moyenne_bac: 103.5,
    raw_text: 'جامعة تونس المنار كلية الطب بتونس الطب دكتوراه في الطب علوم تجريبية'
  },
  {
    universite: 'جامعة قرطاج',
    gouvernorat: 'بن عروس',
    institution: 'المعهد العالي للتكنولوجيات الطبية والحيوية بتونس',
    filiere: 'التكنولوجيات الطبية',
    diplome: 'الإجازة في التكنولوجيات الطبية',
    section_bac: 'علوم تجريبية',
    moyenne_bac: 92.3,
    raw_text: 'جامعة قرطاج المعهد العالي للتكنولوجيات الطبية والحيوية بتونس التكنولوجيات الطبية الإجازة في التكنولوجيات الطبية علوم تجريبية'
  },
  {
    universite: 'جامعة صفاقس',
    gouvernorat: 'صفاقس',
    institution: 'كلية الهندسة بصفاقس',
    filiere: 'الهندسة',
    diplome: 'شهادة مهندس في الإعلامية',
    section_bac: 'رياضيات',
    moyenne_bac: 101.2,
    raw_text: 'جامعة صفاقس كلية الهندسة بصفاقس الهندسة شهادة مهندس في الإعلامية رياضيات'
  },
  {
    universite: 'جامعة تونس المنار',
    gouvernorat: 'تونس',
    institution: 'كلية العلوم بتونس FSB',
    filiere: 'Prépa Intégrée',
    diplome: 'Cycle Préparatoire Intégré en Sciences et Technologies',
    section_bac: 'رياضيات',
    moyenne_bac: 99.8,
    raw_text: 'جامعة تونس المنار كلية العلوم بتونس FSB Prépa Intégrée Cycle Préparatoire Intégré Sciences Technologies رياضيات prepa integre'
  },
  {
    universite: 'جامعة تونس المنار',
    gouvernorat: 'تونس',
    institution: 'كلية العلوم بتونس FSB',
    filiere: 'علوم الحاسوب',
    diplome: 'الإجازة في علوم الحاسوب والمعلوماتية',
    section_bac: 'رياضيات',
    moyenne_bac: 98.3,
    raw_text: 'جامعة تونس المنار كلية العلوم بتونس FSB علوم الحاسوب الإجازة في علوم الحاسوب والمعلوماتية رياضيات informatique computer science'
  }
];

async function insertSampleData() {
  try {
    console.log('Inserting sample university programs...');
    
    for (const program of samplePrograms) {
      await prisma.universityProgram.create({
        data: program
      });
    }
    
    console.log(`✅ Successfully inserted ${samplePrograms.length} sample programs`);
  } catch (error) {
    console.error('Error inserting sample data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

insertSampleData();
