/**
 * Reusable Chart Generator Utility
 * Generates SVG charts for report generation with Nepali language support
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
   * Generate SVG Pie Chart
   */
  static generatePieChart(
    data: ChartData,
    config: ChartConfig = {}
  ): string {
    const {
      width = 600,
      height = 400,
      colors = ChartGenerator.defaultColors,
      showLegend = true,
      showValues = false,
      nepaliNumbers = true
    } = config;

    // Handle empty data
    if (!data || Object.keys(data).length === 0) {
      return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <text x="${width/2}" y="${height/2}" text-anchor="middle" font-family="Noto Sans Devanagari, Arial, sans-serif">
          डेटा उपलब्ध छैन
        </text>
      </svg>`;
    }

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;

    const entries = Object.entries(data);
    const total = entries.reduce((sum, [, item]) => sum + (item.value || 0), 0);

    // Handle zero total
    if (total === 0) {
      return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <text x="${width/2}" y="${height/2}" text-anchor="middle" font-family="Noto Sans Devanagari, Arial, sans-serif">
          डेटा उपलब्ध छैन
        </text>
      </svg>`;
    }

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add styles for Nepali font
    svg += `<style>
      text { font-family: 'Noto Sans Devanagari', Arial, sans-serif; }
      .legend { font-size: 12px; }
      .value { font-size: 10px; fill: white; font-weight: bold; }
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
        
        svg += `<path d="${pathData}" fill="${color}" stroke="white" stroke-width="2"/>`;
        
        currentAngle = endAngle;
      }
    });

    // Add legend - positioned to the right of pie chart with better spacing
    if (showLegend) {
      const legendX = centerX + radius + 25; // Position to the right of pie chart
      const legendY = centerY - (entries.length * 15) / 2; // Center vertically
      
      entries.forEach(([key, item], index) => {
        const value = item.value || 0;
        if (value > 0) {
          const color = item.color || colors[index % colors.length];
          const yPos = legendY + index * 15; // Reduced spacing between items
          
          // Legend color box - smaller size
          svg += `<rect x="${legendX}" y="${yPos - 4}" width="8" height="8" fill="${color}" stroke="black" stroke-width="0.5"/>`;
          
          // Legend text - more compact
          const legendText = `${item.label} (${ChartGenerator.formatNumber(value, nepaliNumbers)})`;
          svg += `<text x="${legendX + 12}" y="${yPos}" dominant-baseline="middle" class="legend">${legendText}</text>`;
        }
      });
    }

    svg += '</svg>';
    return svg;
  }

  /**
   * Generate SVG Bar Chart
   */
  static generateBarChart(
    data: WardData,
    config: ChartConfig = {}
  ): string {
    const {
      width = 800,
      height = 500,
      colors = ChartGenerator.defaultColors,
      showLegend = true,
      nepaliNumbers = true
    } = config;

    // Handle empty data
    if (!data || Object.keys(data).length === 0) {
      return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <text x="${width/2}" y="${height/2}" text-anchor="middle" font-family="Noto Sans Devanagari, Arial, sans-serif">
          डेटा उपलब्ध छैन
        </text>
      </svg>`;
    }

    const margin = { top: 50, right: 50, bottom: 100, left: 70 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const wards = Object.keys(data).sort((a, b) => parseInt(a) - parseInt(b));
    const categories = Array.from(new Set(
      Object.values(data).flatMap(ward => Object.keys(ward))
    ));

    const maxValue = Math.max(...Object.values(data).flatMap(ward => Object.values(ward)));

    // Handle zero max value
    if (maxValue === 0) {
      return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <text x="${width/2}" y="${height/2}" text-anchor="middle" font-family="Noto Sans Devanagari, Arial, sans-serif">
          डेटा उपलब्ध छैन
        </text>
      </svg>`;
    }

    const barWidth = chartWidth / wards.length;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add styles
    svg += `<style>
      text { font-family: 'Noto Sans Devanagari', Arial, sans-serif; }
      .axis { font-size: 12px; }
      .legend { font-size: 12px; }
    </style>`;

    // Draw axes
    svg += `<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + chartHeight}" stroke="black" stroke-width="2"/>`;
    svg += `<line x1="${margin.left}" y1="${margin.top + chartHeight}" x2="${margin.left + chartWidth}" y2="${margin.top + chartHeight}" stroke="black" stroke-width="2"/>`;

    // Draw bars
    wards.forEach((ward, wardIndex) => {
      const wardData = data[ward];
      const x = margin.left + wardIndex * barWidth;
      let currentY = margin.top + chartHeight;

      categories.forEach((category, categoryIndex) => {
        const value = wardData[category] || 0;
        if (value > 0) {
          const barHeight = (value / maxValue) * chartHeight;
          const color = colors[categoryIndex % colors.length];
          
          svg += `<rect x="${x + barWidth * 0.1}" y="${currentY - barHeight}" width="${barWidth * 0.8}" height="${barHeight}" fill="${color}"/>`;
          currentY -= barHeight;
        }
      });

      // Ward labels
      svg += `<text x="${x + barWidth / 2}" y="${margin.top + chartHeight + 20}" text-anchor="middle" class="axis">
        वडा ${ChartGenerator.formatNumber(parseInt(ward), nepaliNumbers)}
      </text>`;
    });

    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = (maxValue / 5) * i;
      const y = margin.top + chartHeight - (i * chartHeight / 5);
      svg += `<text x="${margin.left - 10}" y="${y}" text-anchor="end" class="axis">
        ${ChartGenerator.formatNumber(Math.round(value), nepaliNumbers)}
      </text>`;
      svg += `<line x1="${margin.left - 5}" y1="${y}" x2="${margin.left}" y2="${y}" stroke="black"/>`;
    }

    // Legend
    if (showLegend) {
      const maxItemsPerRow = 4; // Limit items per row to prevent overflow
      const itemSpacing = 150; // Spacing between items
      const rowHeight = 20; // Height between rows
      
      // Calculate layout for multi-row legend
      const totalRows = Math.ceil(categories.length / maxItemsPerRow);
      const legendStartY = height - 50;
      
      categories.forEach((category, index) => {
        const row = Math.floor(index / maxItemsPerRow);
        const col = index % maxItemsPerRow;
        
        // Calculate position for this item
        const itemsInThisRow = Math.min(maxItemsPerRow, categories.length - row * maxItemsPerRow);
        
        // Center this row's items
        const totalRowWidth = itemsInThisRow * itemSpacing;
        const rowStartX = (width - totalRowWidth) / 2;
        
        const x = rowStartX + col * itemSpacing;
        const y = legendStartY + row * rowHeight;
        const color = colors[index % colors.length];
        
        svg += `<rect x="${x}" y="${y - 8}" width="12" height="12" fill="${color}" stroke="black" stroke-width="1"/>`;
        svg += `<text x="${x + 20}" y="${y}" class="legend">${category}</text>`;
      });
    }

    svg += '</svg>';
    return svg;
  }

  /**
   * Generate SVG Population Pyramid
   */
  static generatePopulationPyramid(
    data: PopulationPyramidData,
    config: ChartConfig = {}
  ): string {
    const {
      width = 800,
      height = 600,
      nepaliNumbers = true
    } = config;

    // Handle empty data
    if (!data || Object.keys(data).length === 0) {
      return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <text x="${width/2}" y="${height/2}" text-anchor="middle" font-family="Noto Sans Devanagari, Arial, sans-serif">
          डेटा उपलब्ध छैन
        </text>
      </svg>`;
    }

    const margin = { top: 50, right: 50, bottom: 50, left: 100 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const ageGroups = Object.keys(data);
    const maxValue = Math.max(...Object.values(data).flatMap(group => [group.male || 0, group.female || 0]));

    // Handle zero max value
    if (maxValue === 0) {
      return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <text x="${width/2}" y="${height/2}" text-anchor="middle" font-family="Noto Sans Devanagari, Arial, sans-serif">
          डेटा उपलब्ध छैन
        </text>
      </svg>`;
    }

    const barHeight = chartHeight / ageGroups.length;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add styles
    svg += `<style>
      text { font-family: 'Noto Sans Devanagari', Arial, sans-serif; }
      .axis { font-size: 12px; }
      .center-line { stroke: #333; stroke-width: 2; }
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
      svg += `<text x="${margin.left - 10}" y="${y + barHeight / 2}" text-anchor="end" class="axis">${groupData.label}</text>`;
      
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
    svg += `<rect x="${centerX - 150}" y="${height - 40}" width="12" height="12" fill="#3498db"/>`;
    svg += `<text x="${centerX - 130}" y="${height - 30}" class="axis">पुरुष</text>`;
    svg += `<rect x="${centerX + 50}" y="${height - 40}" width="12" height="12" fill="#e74c3c"/>`;
    svg += `<text x="${centerX + 70}" y="${height - 30}" class="axis">महिला</text>`;

    svg += '</svg>';
    return svg;
  }

  /**
   * Generate Stacked Bar Chart
   */
  static generateStackedBarChart(
    data: WardData,
    config: ChartConfig = {}
  ): string {
    const {
      width = 800,
      height = 500,
      colors = ChartGenerator.defaultColors,
      showLegend = true,
      nepaliNumbers = true
    } = config;

    const margin = { top: 50, right: 50, bottom: 100, left: 70 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const wards = Object.keys(data).sort((a, b) => parseInt(a) - parseInt(b));
    const categories = Array.from(new Set(
      Object.values(data).flatMap(ward => Object.keys(ward))
    ));

    const maxTotal = Math.max(...Object.values(data).map(ward => 
      Object.values(ward).reduce((sum, val) => sum + val, 0)
    ));

    const barWidth = chartWidth / wards.length * 0.8;
    const barSpacing = chartWidth / wards.length * 0.2;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add styles
    svg += `<style>
      text { font-family: 'Noto Sans Devanagari', Arial, sans-serif; }
      .axis { font-size: 12px; }
      .legend { font-size: 12px; }
    </style>`;

    // Draw axes
    svg += `<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + chartHeight}" stroke="black" stroke-width="2"/>`;
    svg += `<line x1="${margin.left}" y1="${margin.top + chartHeight}" x2="${margin.left + chartWidth}" y2="${margin.top + chartHeight}" stroke="black" stroke-width="2"/>`;

    // Draw stacked bars
    wards.forEach((ward, wardIndex) => {
      const wardData = data[ward];
      const x = margin.left + wardIndex * (barWidth + barSpacing) + barSpacing / 2;
      let currentY = margin.top + chartHeight;

      categories.forEach((category, categoryIndex) => {
        const value = wardData[category] || 0;
        if (value > 0) {
          const barHeight = (value / maxTotal) * chartHeight;
          const color = colors[categoryIndex % colors.length];
          
          svg += `<rect x="${x}" y="${currentY - barHeight}" width="${barWidth}" height="${barHeight}" fill="${color}"/>`;
          
          // Add value label if bar is tall enough
          if (barHeight > 15) {
            svg += `<text x="${x + barWidth / 2}" y="${currentY - barHeight / 2}" text-anchor="middle" class="axis" fill="white">
              ${ChartGenerator.formatNumber(value, nepaliNumbers)}
            </text>`;
          }
          
          currentY -= barHeight;
        }
      });

      // Ward labels
      svg += `<text x="${x + barWidth / 2}" y="${margin.top + chartHeight + 20}" text-anchor="middle" class="axis">
        वडा ${ChartGenerator.formatNumber(parseInt(ward), nepaliNumbers)}
      </text>`;
    });

    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = (maxTotal / 5) * i;
      const y = margin.top + chartHeight - (i * chartHeight / 5);
      svg += `<text x="${margin.left - 10}" y="${y}" text-anchor="end" class="axis">
        ${ChartGenerator.formatNumber(Math.round(value), nepaliNumbers)}
      </text>`;
      svg += `<line x1="${margin.left - 5}" y1="${y}" x2="${margin.left}" y2="${y}" stroke="black"/>`;
    }

    // Legend
    if (showLegend) {
      const maxItemsPerRow = 4; // Limit items per row to prevent overflow
      const itemSpacing = 150; // Spacing between items
      const rowHeight = 20; // Height between rows
      
      // Calculate layout for multi-row legend
      const totalRows = Math.ceil(categories.length / maxItemsPerRow);
      const legendStartY = height - 50;
      
      categories.forEach((category, index) => {
        const row = Math.floor(index / maxItemsPerRow);
        const col = index % maxItemsPerRow;
        
        // Calculate position for this item
        const itemsInThisRow = Math.min(maxItemsPerRow, categories.length - row * maxItemsPerRow);
        
        // Center this row's items
        const totalRowWidth = itemsInThisRow * itemSpacing;
        const rowStartX = (width - totalRowWidth) / 2;
        
        const x = rowStartX + col * itemSpacing;
        const y = legendStartY + row * rowHeight;
        const color = colors[index % colors.length];
        
        svg += `<rect x="${x}" y="${y - 8}" width="12" height="12" fill="${color}" stroke="black" stroke-width="1"/>`;
        svg += `<text x="${x + 20}" y="${y}" class="legend">${category}</text>`;
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