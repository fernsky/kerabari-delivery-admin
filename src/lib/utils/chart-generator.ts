/**
 * Reusable Chart Generator Utility
 * Generates SVG charts for report generation with Nepali language support
 * Optimized for A4 paper printing
 */

export interface ChartData {
  [key: string]: {
    value: number;
    label: string;
    color?: string;
  };
}

export interface WardData {
  [wardNumber: string]: {
    [category: string]: number;
  };
}

export interface PopulationPyramidData {
  [ageGroup: string]: {
    male: number;
    female: number;
    other?: number;
    label: string;
  };
}

export interface ChartConfig {
  width?: number;
  height?: number;
  colors?: string[];
  showLegend?: boolean;
  showValues?: boolean;
  nepaliNumbers?: boolean;
  legendHeight?: number; // New option for legend height adjustment
  maxBarWidth?: number; // New option for maximum bar width
}

export class ChartGenerator {
  private static nepaliDigits = {
    '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
    '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
  };

  private static defaultColors = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
  ];

  private static convertToNepali(num: number): string {
    // Handle undefined, null, or NaN values
    if (num === undefined || num === null || isNaN(num)) {
      return '०';
    }
    
    return num.toString().replace(/[0-9]/g, (digit) => 
      ChartGenerator.nepaliDigits[digit as keyof typeof ChartGenerator.nepaliDigits]
    );
  }

  private static formatNumber(num: number, nepali: boolean = true): string {
    // Handle undefined, null, or NaN values
    if (num === undefined || num === null || isNaN(num)) {
      return nepali ? '०' : '0';
    }
    
    return nepali ? ChartGenerator.convertToNepali(num) : num.toString();
  }

  /**
   * Generate SVG Pie Chart - Optimized for A4 printing
   */
  static generatePieChart(
    data: ChartData,
    config: ChartConfig = {}
  ): string {
    const {
      width = 500,
      height = 350,
      colors = ChartGenerator.defaultColors,
      showLegend = true,
      showValues = false,
      nepaliNumbers = true
    } = config;

    // Handle empty data
    if (!data || Object.keys(data).length === 0) {
      return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <text x="${width/2}" y="${height/2}" text-anchor="middle" font-family="Noto Sans Devanagari, Arial, sans-serif" font-size="14">
          डेटा उपलब्ध छैन
        </text>
      </svg>`;
    }

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4; // Smaller radius to make room for legend

    const entries = Object.entries(data);
    const total = entries.reduce((sum, [, item]) => sum + (item.value || 0), 0);

    // Handle zero total
    if (total === 0) {
      return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <text x="${width/2}" y="${height/2}" text-anchor="middle" font-family="Noto Sans Devanagari, Arial, sans-serif" font-size="14">
          डेटा उपलब्ध छैन
        </text>
      </svg>`;
    }

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add styles for Nepali font - no background
    svg += `<style>
      text { font-family: 'Noto Sans Devanagari', Arial, sans-serif; }
      .legend { font-size: 11px; }
      .value { font-size: 9px; fill: white; font-weight: bold; }
    </style>`;

    // Generate pie slices
    let currentAngle = -90; // Start from top
    entries.forEach(([key, item], index) => {
      const value = item.value || 0;
      if (value > 0) {
        const angle = (value / total) * 360;
        const endAngle = currentAngle + angle;
        
        const startX = centerX + radius * Math.cos((currentAngle * Math.PI) / 180);
        const startY = centerY + radius * Math.sin((currentAngle * Math.PI) / 180);
        const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
        const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
        
        const largeArcFlag = angle > 180 ? 1 : 0;
        const color = item.color || colors[index % colors.length];
        
        const pathData = `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
        
        svg += `<path d="${pathData}" fill="${color}" stroke="white" stroke-width="1"/>`;
        
        currentAngle = endAngle;
      }
    });

    // Add legend - positioned on the right side of the pie chart
    if (showLegend) {
      const legendStartX = centerX + radius + 25; // Position legend to the right of pie chart
      const legendStartY = centerY - (entries.length * 20) / 2; // Center legend vertically
      
      entries.forEach(([key, item], index) => {
        const value = item.value || 0;
        if (value > 0) {
          const color = item.color || colors[index % colors.length];
          const y = legendStartY + index * 20;
          
          // Legend color box
          svg += `<rect x="${legendStartX}" y="${y - 6}" width="12" height="12" fill="${color}"/>`;
          
          // Legend text - more compact
          const legendText = `${item.label} (${ChartGenerator.formatNumber(value, nepaliNumbers)})`;
          svg += `<text x="${legendStartX + 18}" y="${y + 4}" font-family="Arial, sans-serif" font-size="11" fill="black" text-anchor="start">${legendText}</text>`;
        }
      });
    }

    svg += '</svg>';
    return svg;
  }

  /**
   * Generate SVG Bar Chart - Optimized for A4 printing with proper scaling
   */
  static generateBarChart(
    data: WardData,
    config: ChartConfig = {}
  ): string {
    const {
      width = 800,
      height = 600, // Increased height for better proportions
      colors = ChartGenerator.defaultColors,
      showLegend = true,
      nepaliNumbers = true,
      legendHeight = 80, // Reduced legend height to reduce gap
      maxBarWidth = 60   // Increased bar width for better visibility
    } = config;

    // Handle empty data
    if (!data || Object.keys(data).length === 0) {
      return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <text x="${width/2}" y="${height/2}" text-anchor="middle" font-family="Noto Sans Devanagari, Arial, sans-serif" font-size="14">
          डेटा उपलब्ध छैन
        </text>
      </svg>`;
    }

    const wards = Object.keys(data).sort((a, b) => parseInt(a) - parseInt(b));
    const categories = Array.from(new Set(
      Object.values(data).flatMap(ward => Object.keys(ward))
    ));

    // Calculate maximum total value per ward for proper scaling (for stacked bars)
    const maxTotalValue = Math.max(...Object.values(data).map(ward => 
      Object.values(ward).reduce((sum, value) => sum + value, 0)
    ));

    // Handle zero max value
    if (maxTotalValue === 0) {
      return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <text x="${width/2}" y="${height/2}" text-anchor="middle" font-family="Noto Sans Devanagari, Arial, sans-serif" font-size="14">
          डेटा उपलब्ध छैन
        </text>
      </svg>`;
    }

    // Calculate margins - adjusted to prevent truncation
    const margin = { 
      top: 40, 
      right: 30, // Reduced right margin
      bottom: 80 + legendHeight, // Reduced bottom margin
      left: 60  // Reduced left margin
    };
    
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Calculate optimal bar width to use maximum available space
    const availableWidth = chartWidth;
    const optimalBarWidth = Math.min(availableWidth / Math.max(wards.length, 1), maxBarWidth);
    const totalBarWidth = wards.length * optimalBarWidth;
    const startX = margin.left + (chartWidth - totalBarWidth) / 2 + 10; // Reduced offset to 10px

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add styles - no background
    svg += `<style>
      text { font-family: 'Noto Sans Devanagari', Arial, sans-serif; }
      .axis { font-size: 11px; }
      .legend { font-size: 10px; }
    </style>`;

    // Draw axes
    svg += `<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + chartHeight}" stroke="black" stroke-width="1"/>`;
    svg += `<line x1="${margin.left}" y1="${margin.top + chartHeight}" x2="${margin.left + chartWidth}" y2="${margin.top + chartHeight}" stroke="black" stroke-width="1"/>`;

    // Draw bars with proper scaling based on total value per ward
    wards.forEach((ward, wardIndex) => {
      const wardData = data[ward];
      const x = startX + wardIndex * optimalBarWidth;
      let currentY = margin.top + chartHeight;

      // Calculate total for this ward
      const wardTotal = Object.values(wardData).reduce((sum, value) => sum + value, 0);

      categories.forEach((category, categoryIndex) => {
        const value = wardData[category] || 0;
        if (value > 0) {
          // Scale bar height based on maximum total value across all wards
          const barHeight = (value / maxTotalValue) * chartHeight;
          const color = colors[categoryIndex % colors.length];
          
          // Use wider bars with less padding for better appearance
          svg += `<rect x="${x + optimalBarWidth * 0.1}" y="${currentY - barHeight}" width="${optimalBarWidth * 0.8}" height="${barHeight}" fill="${color}"/>`;
          currentY -= barHeight;
        }
      });

      // Ward labels - straight labels for better readability
      svg += `<text x="${x + optimalBarWidth / 2}" y="${margin.top + chartHeight + 25}" text-anchor="middle" class="axis">
        वडा ${ChartGenerator.formatNumber(parseInt(ward), nepaliNumbers)}
      </text>`;
    });

    // Y-axis labels with proper scaling based on max total value
    const yAxisSteps = 5;
    for (let i = 0; i <= yAxisSteps; i++) {
      const value = (maxTotalValue / yAxisSteps) * i;
      const y = margin.top + chartHeight - (i * chartHeight / yAxisSteps);
      svg += `<text x="${margin.left - 8}" y="${y}" text-anchor="end" class="axis">
        ${ChartGenerator.formatNumber(Math.round(value), nepaliNumbers)}
      </text>`;
      svg += `<line x1="${margin.left - 5}" y1="${y}" x2="${margin.left}" y2="${y}" stroke="black"/>`;
    }

    // Legend - positioned closer to chart with better spacing
    if (showLegend) {
      const maxItemsPerRow = 3; // Reduced from 4 to 3 items per row
      const itemSpacing = 120; // Reduced spacing between legend items
      const rowHeight = 20; // Reduced row height
      
      const totalRows = Math.ceil(categories.length / maxItemsPerRow);
      const legendStartY = height - legendHeight + 15; // Reduced top margin for legend
      
      // Calculate total width of legend items to center the container
      const totalLegendWidth = Math.min(categories.length, maxItemsPerRow) * itemSpacing;
      const legendContainerStartX = margin.left + (chartWidth - totalLegendWidth) / 2;
      
      categories.forEach((category, index) => {
        const row = Math.floor(index / maxItemsPerRow);
        const col = index % maxItemsPerRow;
        
        // Left-align legend items within the centered container
        const x = legendContainerStartX + col * itemSpacing;
        const y = legendStartY + row * rowHeight;
        const color = colors[index % colors.length];
        
        // Legend color box - removed border
        svg += `<rect x="${x}" y="${y - 6}" width="12" height="12" fill="${color}"/>`;
        
        // Legend text - left-aligned within the container with smaller font
        svg += `<text x="${x + 18}" y="${y + 4}" font-family="Arial, sans-serif" font-size="10" fill="black" text-anchor="start">${category}</text>`;
      });
    }

    svg += '</svg>';
    return svg;
  }

  /**
   * Generate SVG Population Pyramid - Optimized for A4 printing
   */
  static generatePopulationPyramid(
    data: PopulationPyramidData,
    config: ChartConfig = {}
  ): string {
    const {
      width = 600,
      height = 450,
      nepaliNumbers = true
    } = config;

    // Handle empty data
    if (!data || Object.keys(data).length === 0) {
      return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <text x="${width/2}" y="${height/2}" text-anchor="middle" font-family="Noto Sans Devanagari, Arial, sans-serif" font-size="14">
          डेटा उपलब्ध छैन
        </text>
      </svg>`;
    }

    const margin = { top: 30, right: 40, bottom: 40, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const ageGroups = Object.keys(data);
    const maxValue = Math.max(...Object.values(data).flatMap(group => [group.male || 0, group.female || 0]));

    // Handle zero max value
    if (maxValue === 0) {
      return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <text x="${width/2}" y="${height/2}" text-anchor="middle" font-family="Noto Sans Devanagari, Arial, sans-serif" font-size="14">
          डेटा उपलब्ध छैन
        </text>
      </svg>`;
    }

    const barHeight = chartHeight / ageGroups.length;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add styles - no background
    svg += `<style>
      text { font-family: 'Noto Sans Devanagari', Arial, sans-serif; }
      .axis { font-size: 10px; }
      .center-line { stroke: #333; stroke-width: 1; }
    </style>`;

    const centerX = width / 2;

    // Draw center line
    svg += `<line x1="${centerX}" y1="${margin.top}" x2="${centerX}" y2="${margin.top + chartHeight}" class="center-line"/>`;

    // Draw bars
    ageGroups.forEach((ageGroup, index) => {
      const groupData = data[ageGroup];
      const y = margin.top + index * barHeight;
      
      // Male bars (left side)
      const maleValue = groupData.male || 0;
      const maleWidth = (maleValue / maxValue) * (chartWidth / 2);
      if (maleValue > 0) {
        svg += `<rect x="${centerX - maleWidth}" y="${y + barHeight * 0.1}" width="${maleWidth}" height="${barHeight * 0.8}" fill="#3498db"/>`;
      }
      
      // Female bars (right side)
      const femaleValue = groupData.female || 0;
      const femaleWidth = (femaleValue / maxValue) * (chartWidth / 2);
      if (femaleValue > 0) {
        svg += `<rect x="${centerX}" y="${y + barHeight * 0.1}" width="${femaleWidth}" height="${barHeight * 0.8}" fill="#e74c3c"/>`;
      }
      
      // Age group labels
      svg += `<text x="${margin.left - 5}" y="${y + barHeight / 2}" text-anchor="end" class="axis">${groupData.label}</text>`;
      
      // Value labels
      if (maleValue > 0) {
        svg += `<text x="${centerX - maleWidth / 2}" y="${y + barHeight / 2}" text-anchor="middle" class="axis" fill="white">
          ${ChartGenerator.formatNumber(maleValue, nepaliNumbers)}
        </text>`;
      }
      if (femaleValue > 0) {
        svg += `<text x="${centerX + femaleWidth / 2}" y="${y + barHeight / 2}" text-anchor="middle" class="axis" fill="white">
          ${ChartGenerator.formatNumber(femaleValue, nepaliNumbers)}
        </text>`;
      }
    });

    // Legend
    svg += `<rect x="${centerX - 120}" y="${height - 30}" width="10" height="10" fill="#3498db"/>`;
    svg += `<text x="${centerX - 105}" y="${height - 22}" class="axis">पुरुष</text>`;
    svg += `<rect x="${centerX + 30}" y="${height - 30}" width="10" height="10" fill="#e74c3c"/>`;
    svg += `<text x="${centerX + 45}" y="${height - 22}" class="axis">महिला</text>`;

    svg += '</svg>';
    return svg;
  }

  /**
   * Generate Stacked Bar Chart - Optimized for A4 printing with proper scaling
   */
  static generateStackedBarChart(
    data: WardData,
    config: ChartConfig = {}
  ): string {
    const {
      width = 700,
      height = 400,
      colors = ChartGenerator.defaultColors,
      showLegend = true,
      nepaliNumbers = true,
      legendHeight = 60,
      maxBarWidth = 45
    } = config;

    const margin = { top: 30, right: 30, bottom: 80 + legendHeight, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const wards = Object.keys(data).sort((a, b) => parseInt(a) - parseInt(b));
    const categories = Array.from(new Set(
      Object.values(data).flatMap(ward => Object.keys(ward))
    ));

    const maxTotal = Math.max(...Object.values(data).map(ward => 
      Object.values(ward).reduce((sum, val) => sum + val, 0)
    ));

    // Calculate optimal bar width to use maximum available space
    const availableWidth = chartWidth;
    const optimalBarWidth = Math.min(availableWidth / wards.length, maxBarWidth);
    const totalBarWidth = wards.length * optimalBarWidth;
    const startX = margin.left + (chartWidth - totalBarWidth) / 2 + 10; // Reduced offset to 10px

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add styles - no background
    svg += `<style>
      text { font-family: 'Noto Sans Devanagari', Arial, sans-serif; }
      .axis { font-size: 10px; }
      .legend { font-size: 9px; }
    </style>`;

    // Draw axes
    svg += `<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + chartHeight}" stroke="black" stroke-width="1"/>`;
    svg += `<line x1="${margin.left}" y1="${margin.top + chartHeight}" x2="${margin.left + chartWidth}" y2="${margin.top + chartHeight}" stroke="black" stroke-width="1"/>`;

    // Draw stacked bars with proper scaling
    wards.forEach((ward, wardIndex) => {
      const wardData = data[ward];
      const x = startX + wardIndex * optimalBarWidth;
      let currentY = margin.top + chartHeight;

      categories.forEach((category, categoryIndex) => {
        const value = wardData[category] || 0;
        if (value > 0) {
          // Scale bar height based on maximum total
          const barHeight = (value / maxTotal) * chartHeight;
          const color = colors[categoryIndex % colors.length];
          
          svg += `<rect x="${x}" y="${currentY - barHeight}" width="${optimalBarWidth}" height="${barHeight}" fill="${color}"/>`;
          
          // Add value label if bar is tall enough
          if (barHeight > 12) {
            svg += `<text x="${x + optimalBarWidth / 2}" y="${currentY - barHeight / 2}" text-anchor="middle" class="axis" fill="white">
              ${ChartGenerator.formatNumber(value, nepaliNumbers)}
            </text>`;
          }
          
          currentY -= barHeight;
        }
      });

      // Ward labels - straight labels for better readability
      svg += `<text x="${x + optimalBarWidth / 2}" y="${margin.top + chartHeight + 25}" text-anchor="middle" class="axis">
        वडा ${ChartGenerator.formatNumber(parseInt(ward), nepaliNumbers)}
      </text>`;
    });

    // Y-axis labels with proper scaling
    const yAxisSteps = 5;
    for (let i = 0; i <= yAxisSteps; i++) {
      const value = (maxTotal / yAxisSteps) * i;
      const y = margin.top + chartHeight - (i * chartHeight / yAxisSteps);
      svg += `<text x="${margin.left - 5}" y="${y}" text-anchor="end" class="axis">
        ${ChartGenerator.formatNumber(Math.round(value), nepaliNumbers)}
      </text>`;
      svg += `<line x1="${margin.left - 3}" y1="${y}" x2="${margin.left}" y2="${y}" stroke="black"/>`;
    }

    // Legend - positioned closer to chart with better spacing
    if (showLegend) {
      const maxItemsPerRow = 3; // Reduced from 4 to 3 items per row
      const itemSpacing = 120; // Reduced spacing between legend items
      const rowHeight = 20; // Reduced row height
      
      const totalRows = Math.ceil(categories.length / maxItemsPerRow);
      const legendStartY = height - legendHeight + 15; // Reduced top margin for legend
      
      // Calculate total width of legend items to center the container
      const totalLegendWidth = Math.min(categories.length, maxItemsPerRow) * itemSpacing;
      const legendContainerStartX = margin.left + (chartWidth - totalLegendWidth) / 2;
      
      categories.forEach((category, index) => {
        const row = Math.floor(index / maxItemsPerRow);
        const col = index % maxItemsPerRow;
        
        // Left-align legend items within the centered container
        const x = legendContainerStartX + col * itemSpacing;
        const y = legendStartY + row * rowHeight;
        const color = colors[index % colors.length];
        
        // Legend color box - removed border
        svg += `<rect x="${x}" y="${y - 6}" width="12" height="12" fill="${color}"/>`;
        
        // Legend text - left-aligned within the container with smaller font
        svg += `<text x="${x + 18}" y="${y + 4}" font-family="Arial, sans-serif" font-size="9" fill="black" text-anchor="start">${category}</text>`;
      });
    }

    svg += '</svg>';
    return svg;
  }

  /**
   * Convert SVG to data URL for embedding in HTML
   */
  static svgToDataUrl(svg: string): string {
    const base64 = btoa(unescape(encodeURIComponent(svg)));
    return `data:image/svg+xml;base64,${base64}`;
  }
} 