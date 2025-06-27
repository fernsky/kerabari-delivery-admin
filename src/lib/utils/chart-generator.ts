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
  title?: string;
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
    return num.toString().replace(/[0-9]/g, (digit) => 
      ChartGenerator.nepaliDigits[digit as keyof typeof ChartGenerator.nepaliDigits]
    );
  }

  private static formatNumber(num: number, nepali: boolean = true): string {
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
      title = '',
      colors = ChartGenerator.defaultColors,
      showLegend = true,
      showValues = true,
      nepaliNumbers = true
    } = config;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;

    const entries = Object.entries(data);
    const total = entries.reduce((sum, [, item]) => sum + item.value, 0);

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add styles for Nepali font
    svg += `<style>
      text { font-family: 'Noto Sans Devanagari', Arial, sans-serif; }
      .title { font-size: 18px; font-weight: bold; }
      .legend { font-size: 12px; }
      .value { font-size: 10px; fill: white; font-weight: bold; }
    </style>`;

    // Add title
    if (title) {
      svg += `<text x="${centerX}" y="25" text-anchor="middle" class="title">${title}</text>`;
    }

    // Generate pie slices
    let currentAngle = -90; // Start from top
    entries.forEach(([key, item], index) => {
      const angle = (item.value / total) * 360;
      const endAngle = currentAngle + angle;
      
      const startX = centerX + radius * Math.cos((currentAngle * Math.PI) / 180);
      const startY = centerY + radius * Math.sin((currentAngle * Math.PI) / 180);
      const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
      const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      const color = item.color || colors[index % colors.length];
      
      const pathData = `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
      
      svg += `<path d="${pathData}" fill="${color}" stroke="white" stroke-width="2"/>`;
      
      // Add value labels
      if (showValues) {
        const labelAngle = currentAngle + angle / 2;
        const labelX = centerX + (radius * 0.7) * Math.cos((labelAngle * Math.PI) / 180);
        const labelY = centerY + (radius * 0.7) * Math.sin((labelAngle * Math.PI) / 180);
        const percentage = ((item.value / total) * 100).toFixed(1);
        
        svg += `<text x="${labelX}" y="${labelY}" text-anchor="middle" class="value">
          ${ChartGenerator.formatNumber(item.value, nepaliNumbers)} (${ChartGenerator.formatNumber(parseFloat(percentage), nepaliNumbers)}%)
        </text>`;
      }
      
      currentAngle = endAngle;
    });

    // Add legend
    if (showLegend) {
      const legendX = width - 200;
      let legendY = 50;
      
      entries.forEach(([key, item], index) => {
        const color = item.color || colors[index % colors.length];
        svg += `<rect x="${legendX}" y="${legendY - 8}" width="12" height="12" fill="${color}"/>`;
        svg += `<text x="${legendX + 20}" y="${legendY}" class="legend">${item.label} (${ChartGenerator.formatNumber(item.value, nepaliNumbers)})</text>`;
        legendY += 20;
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
      title = '',
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

    const maxValue = Math.max(...Object.values(data).flatMap(ward => Object.values(ward)));
    const barWidth = chartWidth / wards.length;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add styles
    svg += `<style>
      text { font-family: 'Noto Sans Devanagari', Arial, sans-serif; }
      .title { font-size: 18px; font-weight: bold; }
      .axis { font-size: 12px; }
      .legend { font-size: 12px; }
    </style>`;

    // Add title
    if (title) {
      svg += `<text x="${width / 2}" y="25" text-anchor="middle" class="title">${title}</text>`;
    }

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
      const legendX = margin.left;
      let legendY = height - 50;
      
      categories.forEach((category, index) => {
        const color = colors[index % colors.length];
        const x = legendX + (index * 150);
        svg += `<rect x="${x}" y="${legendY - 8}" width="12" height="12" fill="${color}"/>`;
        svg += `<text x="${x + 20}" y="${legendY}" class="legend">${category}</text>`;
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
      title = '',
      nepaliNumbers = true
    } = config;

    const margin = { top: 50, right: 50, bottom: 50, left: 100 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const ageGroups = Object.keys(data);
    const maxValue = Math.max(...Object.values(data).flatMap(group => [group.male, group.female]));
    const barHeight = chartHeight / ageGroups.length;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add styles
    svg += `<style>
      text { font-family: 'Noto Sans Devanagari', Arial, sans-serif; }
      .title { font-size: 18px; font-weight: bold; }
      .axis { font-size: 12px; }
      .center-line { stroke: #333; stroke-width: 2; }
    </style>`;

    // Add title
    if (title) {
      svg += `<text x="${width / 2}" y="25" text-anchor="middle" class="title">${title}</text>`;
    }

    const centerX = width / 2;

    // Draw center line
    svg += `<line x1="${centerX}" y1="${margin.top}" x2="${centerX}" y2="${margin.top + chartHeight}" class="center-line"/>`;

    // Draw bars
    ageGroups.forEach((ageGroup, index) => {
      const groupData = data[ageGroup];
      const y = margin.top + index * barHeight;
      
      // Male bars (left side)
      const maleWidth = (groupData.male / maxValue) * (chartWidth / 2);
      svg += `<rect x="${centerX - maleWidth}" y="${y + barHeight * 0.1}" width="${maleWidth}" height="${barHeight * 0.8}" fill="#3498db"/>`;
      
      // Female bars (right side)
      const femaleWidth = (groupData.female / maxValue) * (chartWidth / 2);
      svg += `<rect x="${centerX}" y="${y + barHeight * 0.1}" width="${femaleWidth}" height="${barHeight * 0.8}" fill="#e74c3c"/>`;
      
      // Age group labels
      svg += `<text x="${margin.left - 10}" y="${y + barHeight / 2}" text-anchor="end" class="axis">${groupData.label}</text>`;
      
      // Value labels
      svg += `<text x="${centerX - maleWidth / 2}" y="${y + barHeight / 2}" text-anchor="middle" class="axis" fill="white">
        ${ChartGenerator.formatNumber(groupData.male, nepaliNumbers)}
      </text>`;
      svg += `<text x="${centerX + femaleWidth / 2}" y="${y + barHeight / 2}" text-anchor="middle" class="axis" fill="white">
        ${ChartGenerator.formatNumber(groupData.female, nepaliNumbers)}
      </text>`;
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
      title = '',
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
      .title { font-size: 18px; font-weight: bold; }
      .axis { font-size: 12px; }
      .legend { font-size: 12px; }
    </style>`;

    // Add title
    if (title) {
      svg += `<text x="${width / 2}" y="25" text-anchor="middle" class="title">${title}</text>`;
    }

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
      const legendX = margin.left;
      let legendY = height - 50;
      
      categories.forEach((category, index) => {
        const color = colors[index % colors.length];
        const x = legendX + (index * 150);
        svg += `<rect x="${x}" y="${legendY - 8}" width="12" height="12" fill="${color}"/>`;
        svg += `<text x="${x + 20}" y="${legendY}" class="legend">${category}</text>`;
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