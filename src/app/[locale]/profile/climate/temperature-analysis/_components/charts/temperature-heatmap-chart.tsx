"use client";

import dynamic from "next/dynamic";
import { localizeNumber } from "@/lib/utils/localize-number";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface TemperatureHeatmapChartProps {
  heatmapData: Array<{
    year: number;
    month: number;
    monthName: string;
    temperature: number;
    anomaly: number;
    category: 'very_cold' | 'cold' | 'normal' | 'warm' | 'very_warm' | 'hot';
  }>;
  temperatureRange: {
    min: number;
    max: number;
    mean: number;
  };
}

export default function TemperatureHeatmapChart({
  heatmapData,
  temperatureRange,
}: TemperatureHeatmapChartProps) {
  const monthNames = [
    "जन", "फेब", "मार्च", "अप्रिल", "मे", "जुन",
    "जुलाई", "अग", "सेप्ट", "अक्टो", "नोभ", "डिसे"
  ];

  const years = Array.from(new Set(heatmapData.map(d => d.year))).sort();
  
  // Prepare data for ApexCharts heatmap
  const series = years.map(year => ({
    name: year.toString(),
    data: monthNames.map((month, monthIndex) => {
      const data = heatmapData.find(d => d.year === year && d.month === monthIndex + 1);
      return {
        x: month,
        y: data ? data.temperature : null,
        value: data ? data.temperature : null,
        anomaly: data ? data.anomaly : null,
        category: data ? data.category : null
      };
    })
  }));

  const options = {
    chart: {
      type: 'heatmap' as const,
      height: 400,
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '10px',
        colors: ['#fff']
      },
      formatter: function(val: any, opts: any) {
        if (opts.dataPointIndex !== undefined && opts.seriesIndex !== undefined) {
          const dataPoint = series[opts.seriesIndex]?.data[opts.dataPointIndex];
          return dataPoint?.y ? localizeNumber(dataPoint.y.toFixed(0), "ne") : '';
        }
        return '';
      }
    },
    colors: ['#1e3a8a', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#7c2d12'],
    xaxis: {
      categories: monthNames,
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 0,
        enableShades: true,
        colorScale: {
          ranges: [
            {
              from: temperatureRange.min,
              to: temperatureRange.mean - 2,
              color: '#1e3a8a',
              name: 'धेरै चिसो'
            },
            {
              from: temperatureRange.mean - 2,
              to: temperatureRange.mean - 1,
              color: '#3b82f6',
              name: 'चिसो'
            },
            {
              from: temperatureRange.mean - 1,
              to: temperatureRange.mean + 1,
              color: '#10b981',
              name: 'सामान्य'
            },
            {
              from: temperatureRange.mean + 1,
              to: temperatureRange.mean + 2,
              color: '#f59e0b',
              name: 'तातो'
            },
            {
              from: temperatureRange.mean + 2,
              to: temperatureRange.mean + 3,
              color: '#ef4444',
              name: 'धेरै तातो'
            },
            {
              from: temperatureRange.mean + 3,
              to: temperatureRange.max,
              color: '#7c2d12',
              name: 'गर्मी'
            }
          ]
        }
      }
    },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
        // Safety checks for undefined values
        if (seriesIndex === undefined || dataPointIndex === undefined) {
          return '';
        }
        
        const seriesData = series[seriesIndex];
        if (!seriesData || !seriesData.data) {
          return '';
        }
        
        const dataPoint = seriesData.data[dataPointIndex];
        if (!dataPoint || dataPoint.y === null || dataPoint.y === undefined) {
          return '';
        }
        
        const year = years[seriesIndex];
        const month = monthNames[dataPointIndex];
        
        return `
          <div class="bg-background p-3 border shadow-sm rounded-md">
            <p class="font-medium">${year} ${month}</p>
            <p class="text-sm">तापक्रम: ${localizeNumber(dataPoint.y.toFixed(1), "ne")}°C</p>
            ${dataPoint.anomaly !== null && dataPoint.anomaly !== undefined ? 
              `<p class="text-sm">विचलन: ${dataPoint.anomaly > 0 ? '+' : ''}${localizeNumber(dataPoint.anomaly.toFixed(1), "ne")}°C</p>` : ''}
          </div>
        `;
      }
    },
    legend: {
      show: true,
      position: 'bottom' as const,
      labels: {
        colors: ['#666']
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 bg-card">
        <h3 className="text-lg font-medium mb-4">तापक्रम हिटम्याप</h3>
        
        <div className="w-full">
          <Chart
            options={options}
            series={series}
            type="heatmap"
            height={400}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-muted/50 p-3 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">न्यूनतम</p>
          <p className="text-lg font-bold text-blue-600">
            {localizeNumber(temperatureRange.min.toFixed(1), "ne")}°C
          </p>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">औसत</p>
          <p className="text-lg font-bold">
            {localizeNumber(temperatureRange.mean.toFixed(1), "ne")}°C
          </p>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">अधिकतम</p>
          <p className="text-lg font-bold text-red-600">
            {localizeNumber(temperatureRange.max.toFixed(1), "ne")}°C
          </p>
        </div>
      </div>
    </div>
  );
} 