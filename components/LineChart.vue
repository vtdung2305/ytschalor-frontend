<script setup lang="ts">
import { PropType } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
} from 'chart.js'
import { ILineChart } from '@/interfaces/chart'

const plugins = {
  id: 'legendMargin',
  beforeInit(chart: any) {
    // Get reference to the original fit function
    const originalFit = chart.legend.fit

    // Override the fit function
    chart.legend.fit = function fit() {
      // Call original function and bind scope in order to use `this` correctly inside it
      originalFit.bind(chart.legend)()
      // Change the height as suggested in another answers
      this.height += 15
    }
  },
}

ChartJS.register(
  CategoryScale,
  Legend,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  TimeScale,
  TimeSeriesScale,
  plugins
)

const props = defineProps({
  chartData: {
    type: Object as PropType<ILineChart>,
    default: () => {},
  },
  optionChart: {
    type: Object,
    default: () => {},
  },
  year: {
    type: String,
    default: '1y',
  },
})

onMounted(() => {
  const lineContainerBody: any = document.querySelector('.line-container__body')

  const lineContainer: any = document.querySelector('.line-container')

  const lineChart: any = document.getElementById('lineChart')

  lineContainer.style.width = `${lineChart.offsetWidth}px`
  let newWidth = 656

  if (props.year === '3y') {
    newWidth = newWidth + 164 * 2
  } else if (props.year === '5y') {
    newWidth = newWidth + 164 * 4
  }
  if (newWidth > 656) {
    lineContainerBody.style.width = `${newWidth}px`
  }
})

const chartValue = ref(props.chartData)
</script>

<template>
  <div class="line-container">
    <div class="line-container__body">
      <Line ref="line" :data="chartValue" :options="optionChart" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.line-container {
  overflow-x: auto;

  &__body {
    height: 350px;
  }

  &::-webkit-scrollbar {
    -webkit-appearance: none;
    height: 4px;
    display: block;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
}
</style>
