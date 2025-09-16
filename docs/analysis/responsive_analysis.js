const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function analyzeResponsiveness() {
  console.log('🚀 Starting TrendlyAI Tools Page Responsive Design Analysis...');
  
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'responsive_screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: false, // Set to false to see the browser for debugging
    slowMo: 1000 // Add delay to see interactions
  });

  const results = {
    issues: [],
    screenshots: [],
    recommendations: []
  };

  // Test different viewport sizes
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 }, // iPhone SE
    { name: 'Mobile Large', width: 414, height: 896 }, // iPhone XR
    { name: 'Tablet Portrait', width: 768, height: 1024 }, // iPad Portrait
    { name: 'Tablet Landscape', width: 1024, height: 768 }, // iPad Landscape
    { name: 'Desktop Small', width: 1024, height: 768 },
    { name: 'Desktop Medium', width: 1440, height: 900 }, // Our target desktop size
    { name: 'Desktop Large', width: 1920, height: 1080 }
  ];

  try {
    for (const viewport of viewports) {
      console.log(`📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})...`);
      
      const page = await browser.newPage();
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Navigate to tools page
      console.log('🌐 Navigating to tools page...');
      await page.goto('http://localhost:3000/tools', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Wait for content to load
      await page.waitForSelector('.max-w-7xl', { timeout: 10000 });
      await page.waitForTimeout(2000); // Allow animations to complete
      
      // Take full page screenshot
      const screenshotPath = path.join(screenshotsDir, `tools_${viewport.name.toLowerCase().replace(' ', '_')}_${viewport.width}x${viewport.height}.png`);
      await page.screenshot({ 
        path: screenshotPath, 
        fullPage: true,
        animations: 'disabled' // Disable animations for consistent screenshots
      });
      
      results.screenshots.push({
        viewport: viewport.name,
        dimensions: `${viewport.width}x${viewport.height}`,
        path: screenshotPath
      });
      
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
      
      // Analyze specific responsive issues
      const issues = await analyzeViewportIssues(page, viewport);
      results.issues.push(...issues);
      
      await page.close();
    }
    
    // Generate analysis report
    await generateAnalysisReport(results);
    
  } catch (error) {
    console.error('❌ Error during analysis:', error.message);
    results.issues.push({
      type: 'Analysis Error',
      description: error.message,
      severity: 'high'
    });
  } finally {
    await browser.close();
  }
  
  return results;
}

async function analyzeViewportIssues(page, viewport) {
  const issues = [];
  
  try {
    // Check for horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);
    
    if (bodyWidth > windowWidth) {
      issues.push({
        viewport: viewport.name,
        type: 'Horizontal Overflow',
        description: `Page content (${bodyWidth}px) exceeds viewport width (${windowWidth}px)`,
        severity: 'high',
        actualWidth: bodyWidth,
        expectedWidth: windowWidth
      });
    }
    
    // Check control panel responsiveness
    const controlPanel = await page.$('.grid.grid-cols-1.md\\:grid-cols-10');
    if (controlPanel) {
      const controlPanelBox = await controlPanel.boundingBox();
      
      // Check if controls stack properly on mobile
      if (viewport.width < 768) {
        const controlItems = await page.$$('.grid.grid-cols-1.md\\:grid-cols-10 > div');
        for (let i = 0; i < controlItems.length; i++) {
          const itemBox = await controlItems[i].boundingBox();
          if (itemBox.width < 200) { // Minimum usable width for form controls
            issues.push({
              viewport: viewport.name,
              type: 'Control Width Too Small',
              description: `Control panel item ${i + 1} width (${Math.round(itemBox.width)}px) is too small for mobile interaction`,
              severity: 'medium',
              element: `Control item ${i + 1}`,
              actualWidth: Math.round(itemBox.width),
              recommendedWidth: 200
            });
          }
        }
      }
    }
    
    // Check tools grid layout
    const toolsGrid = await page.$('#tools-grid');
    if (toolsGrid) {
      const gridBox = await toolsGrid.boundingBox();
      const toolCards = await page.$$('#tools-grid .stagger-animation');
      
      if (toolCards.length > 0) {
        // Check card sizes
        for (let i = 0; i < Math.min(3, toolCards.length); i++) {
          const cardBox = await toolCards[i].boundingBox();
          
          // Check minimum card width
          const minCardWidth = viewport.width < 768 ? 280 : 300;
          if (cardBox.width < minCardWidth) {
            issues.push({
              viewport: viewport.name,
              type: 'Card Too Narrow',
              description: `Tool card ${i + 1} width (${Math.round(cardBox.width)}px) is below recommended minimum`,
              severity: 'medium',
              element: `Tool card ${i + 1}`,
              actualWidth: Math.round(cardBox.width),
              recommendedWidth: minCardWidth
            });
          }
          
          // Check card height consistency
          if (i > 0) {
            const prevCardBox = await toolCards[i-1].boundingBox();
            const heightDiff = Math.abs(cardBox.height - prevCardBox.height);
            if (heightDiff > 20) {
              issues.push({
                viewport: viewport.name,
                type: 'Inconsistent Card Heights',
                description: `Card height varies by ${Math.round(heightDiff)}px between cards ${i} and ${i+1}`,
                severity: 'low',
                heightDifference: Math.round(heightDiff)
              });
            }
          }
        }
        
        // Check grid columns at different breakpoints
        const expectedCols = getExpectedGridColumns(viewport.width);
        const actualCols = await page.evaluate(() => {
          const grid = document.getElementById('tools-grid');
          if (grid) {
            const computedStyle = window.getComputedStyle(grid);
            const gridCols = computedStyle.gridTemplateColumns;
            return gridCols.split(' ').length;
          }
          return 0;
        });
        
        if (actualCols !== expectedCols) {
          issues.push({
            viewport: viewport.name,
            type: 'Incorrect Grid Layout',
            description: `Grid shows ${actualCols} columns but should show ${expectedCols} at ${viewport.width}px`,
            severity: 'medium',
            actualColumns: actualCols,
            expectedColumns: expectedCols
          });
        }
      }
    }
    
    // Check touch target sizes (minimum 48px for accessibility)
    const touchTargets = await page.$$('button, a, input, select, .cursor-pointer');
    for (let i = 0; i < Math.min(10, touchTargets.length); i++) {
      const targetBox = await touchTargets[i].boundingBox();
      if (targetBox && (targetBox.width < 48 || targetBox.height < 48)) {
        const tagName = await touchTargets[i].evaluate(el => el.tagName.toLowerCase());
        const className = await touchTargets[i].evaluate(el => el.className);
        
        issues.push({
          viewport: viewport.name,
          type: 'Touch Target Too Small',
          description: `${tagName} element with class "${className.substring(0, 50)}..." is ${Math.round(targetBox.width)}x${Math.round(targetBox.height)}px (minimum 48x48px required)`,
          severity: 'medium',
          element: `${tagName}[${i}]`,
          actualSize: `${Math.round(targetBox.width)}x${Math.round(targetBox.height)}`,
          requiredSize: '48x48'
        });
      }
    }
    
    // Check text readability
    const headings = await page.$$('h1, h2, h3, h4, h5, h6');
    for (const heading of headings) {
      const fontSize = await heading.evaluate(el => {
        const computedStyle = window.getComputedStyle(el);
        return parseFloat(computedStyle.fontSize);
      });
      
      const minFontSize = viewport.width < 768 ? 16 : 18;
      if (fontSize < minFontSize) {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        issues.push({
          viewport: viewport.name,
          type: 'Text Too Small',
          description: `${tagName} font size (${Math.round(fontSize)}px) is below recommended minimum for readability`,
          severity: 'low',
          actualSize: `${Math.round(fontSize)}px`,
          recommendedSize: `${minFontSize}px`
        });
      }
    }
    
  } catch (error) {
    issues.push({
      viewport: viewport.name,
      type: 'Analysis Error',
      description: `Error analyzing ${viewport.name}: ${error.message}`,
      severity: 'high'
    });
  }
  
  return issues;
}

function getExpectedGridColumns(width) {
  // Based on the CSS: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  if (width < 768) return 1; // mobile
  if (width < 1024) return 2; // tablet
  return 3; // desktop
}

async function generateAnalysisReport(results) {
  const reportPath = path.join(__dirname, 'responsive_analysis_report.md');
  
  let report = `# TrendlyAI Tools Page - Responsive Design Analysis Report
Generated: ${new Date().toISOString()}

## Executive Summary
- **Total Issues Found**: ${results.issues.length}
- **High Severity**: ${results.issues.filter(i => i.severity === 'high').length}
- **Medium Severity**: ${results.issues.filter(i => i.severity === 'medium').length}  
- **Low Severity**: ${results.issues.filter(i => i.severity === 'low').length}
- **Screenshots Captured**: ${results.screenshots.length}

## Screenshots
`;

  results.screenshots.forEach(screenshot => {
    report += `### ${screenshot.viewport} (${screenshot.dimensions})\n`;
    report += `![${screenshot.viewport}](${path.basename(screenshot.path)})\n\n`;
  });

  report += `## Issues by Severity

### 🔴 High Severity Issues
`;

  const highIssues = results.issues.filter(i => i.severity === 'high');
  if (highIssues.length === 0) {
    report += `No high severity issues found.\n\n`;
  } else {
    highIssues.forEach((issue, index) => {
      report += `#### ${index + 1}. ${issue.type} - ${issue.viewport}\n`;
      report += `**Description**: ${issue.description}\n`;
      if (issue.actualWidth) report += `**Actual Width**: ${issue.actualWidth}px | **Expected**: ${issue.expectedWidth}px\n`;
      report += `\n`;
    });
  }

  report += `### 🟡 Medium Severity Issues
`;

  const mediumIssues = results.issues.filter(i => i.severity === 'medium');
  if (mediumIssues.length === 0) {
    report += `No medium severity issues found.\n\n`;
  } else {
    mediumIssues.forEach((issue, index) => {
      report += `#### ${index + 1}. ${issue.type} - ${issue.viewport}\n`;
      report += `**Description**: ${issue.description}\n`;
      if (issue.actualWidth) report += `**Actual Width**: ${issue.actualWidth}px | **Recommended**: ${issue.recommendedWidth}px\n`;
      if (issue.actualColumns) report += `**Actual Columns**: ${issue.actualColumns} | **Expected**: ${issue.expectedColumns}\n`;
      if (issue.actualSize) report += `**Actual Size**: ${issue.actualSize} | **Required**: ${issue.requiredSize}\n`;
      report += `\n`;
    });
  }

  report += `### 🔵 Low Severity Issues
`;

  const lowIssues = results.issues.filter(i => i.severity === 'low');
  if (lowIssues.length === 0) {
    report += `No low severity issues found.\n\n`;
  } else {
    lowIssues.forEach((issue, index) => {
      report += `#### ${index + 1}. ${issue.type} - ${issue.viewport}\n`;
      report += `**Description**: ${issue.description}\n`;
      if (issue.actualSize) report += `**Actual Size**: ${issue.actualSize} | **Recommended**: ${issue.recommendedSize}\n`;
      report += `\n`;
    });
  }

  report += `## Recommended Fixes

### CSS Improvements
\`\`\`css
/* Fix control panel responsiveness */
@media (max-width: 767px) {
  .control-panel-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .control-panel-grid > div {
    min-width: 200px;
  }
}

/* Ensure minimum touch target sizes */
button, a, input, select {
  min-width: 48px;
  min-height: 48px;
  touch-action: manipulation;
}

/* Improve card grid responsiveness */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .tools-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

/* Ensure consistent card heights */
.tool-card {
  height: 288px; /* Fixed height: h-72 equivalent */
  display: flex;
  flex-direction: column;
}
\`\`\`

### Accessibility Improvements
- Ensure all interactive elements meet minimum 48px touch target size
- Improve text contrast ratios for better readability
- Add proper focus management for keyboard navigation
- Implement ARIA labels for screen readers

### Performance Optimizations
- Use CSS Grid \`auto-fit\` for more flexible responsive layouts
- Consider CSS Container Queries for component-level responsiveness
- Optimize image loading with proper \`sizes\` attributes

## Next Steps
1. **Priority 1**: Fix high severity horizontal overflow issues
2. **Priority 2**: Address touch target sizes for mobile usability
3. **Priority 3**: Implement consistent grid column behavior
4. **Priority 4**: Optimize text sizes for different viewports

---
*Report generated by TrendlyAI Responsive Design Analysis Tool*
`;

  fs.writeFileSync(reportPath, report, 'utf8');
  console.log(`📊 Analysis report saved to: ${reportPath}`);
  
  return reportPath;
}

// Run the analysis
if (require.main === module) {
  analyzeResponsiveness()
    .then((results) => {
      console.log('✅ Responsive analysis complete!');
      console.log(`📊 Found ${results.issues.length} issues across all viewports`);
      console.log(`📸 Captured ${results.screenshots.length} screenshots`);
    })
    .catch((error) => {
      console.error('❌ Analysis failed:', error);
      process.exit(1);
    });
}

module.exports = { analyzeResponsiveness };