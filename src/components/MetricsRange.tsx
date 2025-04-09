import { MetricsDateRangeBar, MetricsDateRangeButton } from "./styles"


export const MetricsRange = ({ dateRangeSetter, days }: { dateRangeSetter: (days: number) => void; days: number; }) => {

  const handleDateRange = (days: number) => {
    dateRangeSetter(days)
  }

  return (
    <MetricsDateRangeBar>
      <MetricsDateRangeButton onClick={() => handleDateRange(7)} $active={days === 7} key='7-days'>
        <span>Last 7 days</span>
      </MetricsDateRangeButton>
      <MetricsDateRangeButton onClick={() => handleDateRange(14)} $active={days === 14} key='14-days'>
        <span>Last 14 days</span>
      </MetricsDateRangeButton>
      <MetricsDateRangeButton onClick={() => handleDateRange(30)} $active={days === 30} key='30-days'>
        <span>Last 30 days</span>
      </MetricsDateRangeButton>
    </MetricsDateRangeBar>
  )
}