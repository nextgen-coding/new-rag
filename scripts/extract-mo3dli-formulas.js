// Script to analyze mo3dli.tn JavaScript calculations
import puppeteer from 'puppeteer';

const sections = [
  { name: 'Mathématiques', url: 'https://mo3dli.tn/bac%20math%C3%A9matiques.html' },
  { name: 'Sciences Exp', url: 'https://mo3dli.tn/bac%20sciences%20exp.html' },
  { name: 'Technique', url: 'https://mo3dli.tn/bac%20technique.html' },
  { name: 'Économie Gestion', url: 'https://mo3dli.tn/bac%20%C3%A9conomie%20gestion.html' },
  { name: 'Informatique', url: 'https://mo3dli.tn/bac%20informatique.html' },
  { name: 'Sport', url: 'https://mo3dli.tn/bac%20sport.html' },
  { name: 'Lettres', url: 'https://mo3dli.tn/bac%20lettres.html' }
];

async function extractCalculationFormulas() {
  console.log('🚀 Starting JavaScript extraction from mo3dli.tn...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const formulas = {};
  
  try {
    for (const section of sections) {
      console.log(`\n📊 Analyzing ${section.name}...`);
      
      const page = await browser.newPage();
      await page.goto(section.url, { waitUntil: 'networkidle2' });
      
      // Extract all JavaScript code from the page
      const jsCode = await page.evaluate(() => {
        const scripts = Array.from(document.scripts);
        const inlineScripts = scripts
          .filter(script => !script.src && script.innerHTML.trim())
          .map(script => script.innerHTML);
        
        // Also get any onclick handlers or embedded JS
        const elements = Array.from(document.querySelectorAll('*'));
        const eventHandlers = elements
          .filter(el => el.onclick || el.getAttribute('onclick'))
          .map(el => el.onclick ? el.onclick.toString() : el.getAttribute('onclick'));
        
        return {
          inlineScripts,
          eventHandlers,
          // Get form structure
          inputs: Array.from(document.querySelectorAll('input')).map(input => ({
            id: input.id,
            name: input.name,
            placeholder: input.placeholder,
            type: input.type
          })),
          buttons: Array.from(document.querySelectorAll('button')).map(btn => ({
            text: btn.textContent.trim(),
            onclick: btn.onclick ? btn.onclick.toString() : btn.getAttribute('onclick')
          }))
        };
      });
      
      formulas[section.name] = jsCode;
      
      // Try to find specific calculation functions
      const calculationFunctions = await page.evaluate(() => {
        // Look for common calculation patterns
        const windowProps = Object.getOwnPropertyNames(window).filter(prop => 
          typeof window[prop] === 'function' && 
          (prop.includes('calcul') || prop.includes('moyenne') || prop.includes('score'))
        );
        
        const functions = {};
        windowProps.forEach(prop => {
          try {
            functions[prop] = window[prop].toString();
          } catch (e) {
            functions[prop] = 'Could not access function';
          }
        });
        
        return functions;
      });
      
      if (Object.keys(calculationFunctions).length > 0) {
        formulas[section.name].calculationFunctions = calculationFunctions;
      }
      
      console.log(`✅ ${section.name} analysis complete`);
      await page.close();
    }
    
  } catch (error) {
    console.error('❌ Error during extraction:', error);
  } finally {
    await browser.close();
  }
  
  // Save the extracted formulas
  const fs = await import('fs');
  fs.writeFileSync('mo3dli-formulas.json', JSON.stringify(formulas, null, 2));
  console.log('\n💾 Formulas saved to mo3dli-formulas.json');
  
  // Print summary
  console.log('\n📋 Summary:');
  Object.keys(formulas).forEach(section => {
    console.log(`${section}:`);
    console.log(`  - Inline scripts: ${formulas[section].inlineScripts.length}`);
    console.log(`  - Event handlers: ${formulas[section].eventHandlers.length}`);
    console.log(`  - Inputs: ${formulas[section].inputs.length}`);
    console.log(`  - Buttons: ${formulas[section].buttons.length}`);
    if (formulas[section].calculationFunctions) {
      console.log(`  - Calculation functions: ${Object.keys(formulas[section].calculationFunctions).length}`);
    }
  });
  
  return formulas;
}

extractCalculationFormulas().catch(console.error);
