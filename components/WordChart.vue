<script setup lang="ts">
import {
  Chart as ChartJS,
  ChartConfiguration,
  Title,
  Tooltip,
  Legend,
  registerables,
  ChartEvent,
} from 'chart.js'

import {
  WordCloudController,
  WordElement,
  WordCloudChart,
} from 'chartjs-chart-wordcloud'

import { PropType } from 'vue'
import { IChartData } from '@/interfaces/chart'
import { WordChartFontSizeEnum } from '@/constants/common'

ChartJS.register(
  WordCloudController,
  WordElement,
  Title,
  Tooltip,
  Legend,
  ...registerables
)

const props = defineProps({
  chartData: {
    type: Array as PropType<IChartData[]>,
    default: () => [],
  },
})

const emit = defineEmits(['on-click'])

const canvasRef = ref()

const fontSize = computed(() => {
  if (props.chartData.length > 10) {
    return WordChartFontSizeEnum.SMALL
  } else if (props.chartData.length < 10 && props.chartData.length > 5) {
    return WordChartFontSizeEnum.MEDIUM
  } else {
    return WordChartFontSizeEnum.LARGE
  }
})

onMounted(() => {
  if (canvasRef.value) {
    const chart = new ChartJS(canvasRef.value.getContext('2d'), {
      type: WordCloudController.id,
      data: {
        labels: props.chartData.map((d) => d.key),
        datasets: [
          {
            label: '',
            data: props.chartData.map((d) => fontSize.value + d.value * 3),
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false, // <-- this option disables tooltips
          },
        },
        // events: ['click'],

        onClick: (e: any) => {
          const points = chart.getElementsAtEventForMode(
            e,
            'nearest',
            { intersect: true },
            true
          )

          if (points.length) {
            const firstPoint = points[0]

            const label = e.chart.data.labels[firstPoint.index]

            const value =
              e.chart.data.datasets[firstPoint.datasetIndex].data[
                firstPoint.index
              ]

            emit('on-click', label)

            // console.log(label, value)
          }
        },
        elements: {
          word: {
            strokeWidth: 1,
            padding: 1,
          },
        },
      },
    })
  }
})
</script>

<template>
  <div>
    <canvas ref="canvasRef" height="532" width="100%"></canvas>
  </div>
</template>

<style lang="scss" scoped></style>
