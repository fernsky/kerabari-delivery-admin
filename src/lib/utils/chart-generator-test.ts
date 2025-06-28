/**
 * Test file for ChartGenerator
 * Demonstrates the updated pie chart and bar chart functionality
 */

import { ChartGenerator, ChartData, WardData } from './chart-generator';

// Test data for pie chart
const pieChartData: ChartData = {
  'HINDU': { value: 500, label: 'हिन्दू', color: '#FF6B35' },
  'BUDDHIST': { value: 300, label: 'बौद्ध', color: '#F7931E' },
  'KIRANT': { value: 200, label: 'किरात', color: '#1f77b4' },
  'CHRISTIAN': { value: 100, label: 'क्रिश्चियन', color: '#2ca02c' },
  'ISLAM': { value: 50, label: 'इस्लाम', color: '#17becf' }
};

// Test data for bar chart
const barChartData: WardData = {
  '1': { 'HINDU': 120, 'BUDDHIST': 80, 'KIRANT': 60 },
  '2': { 'HINDU': 150, 'BUDDHIST': 90, 'CHRISTIAN': 30 },
  '3': { 'HINDU': 100, 'BUDDHIST': 70, 'KIRANT': 50, 'ISLAM': 20 },
  '4': { 'HINDU': 130, 'BUDDHIST': 60, 'CHRISTIAN': 40 },
  '5': { 'HINDU': 110, 'BUDDHIST': 85, 'KIRANT': 45 }
};

// Test data for stacked bar chart
const stackedBarChartData: WardData = {
  '1': { 'Male': 200, 'Female': 180, 'Other': 20 },
  '2': { 'Male': 220, 'Female': 190, 'Other': 15 },
  '3': { 'Male': 180, 'Female': 170, 'Other': 25 },
  '4': { 'Male': 240, 'Female': 210, 'Other': 30 },
  '5': { 'Male': 190, 'Female': 175, 'Other': 18 }
};

// Test data for population pyramid
const populationPyramidData = {
  '0-4': { male: 150, female: 140, label: '०-४' },
  '5-9': { male: 160, female: 155, label: '५-९' },
  '10-14': { male: 170, female: 165, label: '१०-१४' },
  '15-19': { male: 180, female: 175, label: '१५-१९' },
  '20-24': { male: 190, female: 185, label: '२०-२४' },
  '25-29': { male: 200, female: 195, label: '२५-२९' },
  '30-34': { male: 180, female: 175, label: '३०-३४' },
  '35-39': { male: 160, female: 155, label: '३५-३९' },
  '40-44': { male: 140, female: 135, label: '४०-४४' },
  '45-49': { male: 120, female: 115, label: '४५-४९' },
  '50+': { male: 300, female: 280, label: '५०+' }
};

export function testChartGenerator() {
  console.log('Testing ChartGenerator...\n');

  // Test 1: Pie Chart (no labels on slices, legend positioned to the right)
  console.log('1. Generating Pie Chart...');
  const pieChartSvg = ChartGenerator.generatePieChart(pieChartData, {
    width: 600,
    height: 400,
    showValues: false, // No labels on pie slices
    showLegend: true,
    nepaliNumbers: true
  });
  console.log('✓ Pie chart generated successfully');
  console.log('  - No value labels on pie slices');
  console.log('  - Legend positioned to the right of chart');
  console.log('  - Compact legend with smaller elements');
  console.log('  - No title (removed as requested)\n');

  // Test 2: Bar Chart (centered multi-row legend)
  console.log('2. Generating Bar Chart...');
  const barChartSvg = ChartGenerator.generateBarChart(barChartData, {
    width: 800,
    height: 500,
    showLegend: true,
    nepaliNumbers: true
  });
  console.log('✓ Bar chart generated successfully');
  console.log('  - Centered multi-row legend');
  console.log('  - Better spacing and organization');
  console.log('  - No title (removed as requested)\n');

  // Test 3: Stacked Bar Chart
  console.log('3. Generating Stacked Bar Chart...');
  const stackedBarChartSvg = ChartGenerator.generateStackedBarChart(stackedBarChartData, {
    width: 800,
    height: 500,
    showLegend: true,
    nepaliNumbers: true
  });
  console.log('✓ Stacked bar chart generated successfully');
  console.log('  - No title (removed as requested)\n');

  // Test 4: Population Pyramid
  console.log('4. Generating Population Pyramid...');
  const populationPyramidSvg = ChartGenerator.generatePopulationPyramid(populationPyramidData, {
    width: 800,
    height: 600,
    nepaliNumbers: true
  });
  console.log('✓ Population pyramid generated successfully');
  console.log('  - No title (removed as requested)\n');

  // Test 5: SVG to Data URL conversion
  console.log('5. Testing SVG to Data URL conversion...');
  const dataUrl = ChartGenerator.svgToDataUrl(pieChartSvg);
  console.log('✓ SVG converted to data URL successfully');
  console.log(`  - Data URL length: ${dataUrl.length} characters\n`);

  console.log('All tests completed successfully!');
  console.log('\nKey improvements made:');
  console.log('- Removed value labels from pie chart slices for cleaner appearance');
  console.log('- Improved legend positioning (right side for pie charts, centered for bar charts)');
  console.log('- Added multi-row legend support for bar charts');
  console.log('- Smaller, more compact legend elements');
  console.log('- Better spacing and organization');
  console.log('- Completely removed chart titles as requested');

  return {
    pieChartSvg,
    barChartSvg,
    stackedBarChartSvg,
    populationPyramidSvg,
    dataUrl
  };
}

// Export test data for use in other files
export {
  pieChartData,
  barChartData,
  stackedBarChartData,
  populationPyramidData
}; 