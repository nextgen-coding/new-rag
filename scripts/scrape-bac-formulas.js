import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Web scraper for score.faccna.tn to extract calculation formulas
async function scrapeBacCalculationFormulas() {
  let browser;
  
  try {
    console.log('🚀 Starting Puppeteer browser...');
    browser = await puppeteer.launch({ 
      headless: false, // Set to true for production
      devtools: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set user agent to avoid blocking
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    console.log('🌐 Navigating to score.faccna.tn...');
    await page.goto('https://score.faccna.tn/', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    console.log('📄 Page loaded successfully');
    
    // Wait for the page to be fully loaded
    await page.waitForTimeout(3000);
    
    // Get all specialization buttons/links
    const specializations = await page.evaluate(() => {
      const sections = [];
      
      // Look for section buttons or links
      const sectionElements = document.querySelectorAll('a[href*="#"], button, .section, .cho3ba, .specialization');
      
      sectionElements.forEach(element => {
        const text = element.textContent?.trim();
        const href = element.getAttribute('href');
        
        if (text && (
          text.includes('MATHÉMATIQUES') ||
          text.includes('SCIENCES EXP') ||
          text.includes('TECHNIQUE') ||
          text.includes('ÉCONOMIE') ||
          text.includes('INFORMATIQUE') ||
          text.includes('SPORT') ||
          text.includes('LETTRES') ||
          text.includes('رياضيات') ||
          text.includes('علوم تجريبية') ||
          text.includes('تقنية') ||
          text.includes('اقتصاد') ||
          text.includes('إعلامية') ||
          text.includes('رياضة') ||
          text.includes('آداب')
        )) {
          sections.push({
            text: text,
            href: href,
            className: element.className,
            id: element.id
          });
        }
      });
      
      return sections;
    });
    
    console.log('🎯 Found specializations:', specializations);
    
    const formulas = {};
    
    // Try to extract calculation formulas for each specialization
    for (const spec of specializations) {
      try {
        console.log(`🔍 Exploring specialization: ${spec.text}`);
        
        if (spec.href && spec.href.startsWith('#')) {
          // If it's an anchor link, scroll to it
          await page.evaluate((href) => {
            const element = document.querySelector(href);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, spec.href);
          
          await page.waitForTimeout(2000);
        } else if (spec.href && spec.href.startsWith('http')) {
          // If it's a full URL, navigate to it
          await page.goto(spec.href, { waitUntil: 'networkidle2' });
          await page.waitForTimeout(3000);
        } else {
          // Try clicking the element
          await page.click(spec.className ? `.${spec.className}` : `#${spec.id}`);
          await page.waitForTimeout(3000);
        }
        
        // Extract formula information from the current view
        const formulaInfo = await page.evaluate(() => {
          const formulas = [];
          
          // Look for formula-related content
          const formulaElements = document.querySelectorAll(
            'script, .formula, .calculation, .coefficient, input[type="number"], .subject, .matiere, .معامل, .مادة'
          );
          
          formulaElements.forEach(element => {
            if (element.tagName === 'SCRIPT') {
              const scriptContent = element.textContent;
              if (scriptContent.includes('coefficient') || 
                  scriptContent.includes('معامل') ||
                  scriptContent.includes('moyenne') ||
                  scriptContent.includes('معدل') ||
                  scriptContent.includes('calculate') ||
                  scriptContent.includes('احسب')) {
                formulas.push({
                  type: 'script',
                  content: scriptContent.substring(0, 1000) // Limit content
                });
              }
            } else {
              formulas.push({
                type: 'element',
                tag: element.tagName,
                text: element.textContent?.trim().substring(0, 200),
                className: element.className,
                id: element.id
              });
            }
          });
          
          return formulas;
        });
        
        if (formulaInfo.length > 0) {
          formulas[spec.text] = formulaInfo;
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${spec.text}:`, error.message);
      }
    }
    
    // Extract any JavaScript calculation functions
    console.log('🔧 Extracting JavaScript calculation functions...');
    const jsFormulas = await page.evaluate(() => {
      const scripts = [];
      document.querySelectorAll('script').forEach(script => {
        const content = script.textContent;
        if (content && (
          content.includes('function') &&
          (content.includes('moyenne') || content.includes('معدل') || 
           content.includes('score') || content.includes('سكور') ||
           content.includes('calculate') || content.includes('احسب'))
        )) {
          scripts.push(content);
        }
      });
      return scripts;
    });
    
    // Get page source to analyze offline
    const pageSource = await page.content();
    
    // Save results
    const results = {
      timestamp: new Date().toISOString(),
      specializations: specializations,
      formulas: formulas,
      jsFormulas: jsFormulas,
      pageSource: pageSource.substring(0, 50000) // Limit size
    };
    
    const outputPath = path.join(process.cwd(), 'data', 'bac-formulas.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    
    console.log('✅ Scraping completed!');
    console.log(`📁 Results saved to: ${outputPath}`);
    console.log(`🎯 Found ${specializations.length} specializations`);
    console.log(`🔧 Found ${jsFormulas.length} JavaScript formulas`);
    
    return results;
    
  } catch (error) {
    console.error('💥 Scraping error:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the scraper
scrapeBacCalculationFormulas()
  .then(results => {
    console.log('🎉 Scraping successful!');
    console.log('Summary:', {
      specializations: results.specializations.length,
      formulas: Object.keys(results.formulas).length,
      jsFormulas: results.jsFormulas.length
    });
  })
  .catch(error => {
    console.error('❌ Scraping failed:', error);
  });
