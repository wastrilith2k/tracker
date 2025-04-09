import { PointTooltipProps } from '@nivo/line';
import { BasicTooltip } from '@nivo/tooltip';

export const ToolTip = (props: PointTooltipProps) => {
  const { serieId, serieColor } = props.point;
  const { yFormatted } = props.point.data;
  const id = `${serieId}: ${yFormatted}`;
  return (
    <BasicTooltip id={id} enableChip color={serieColor} />
  )
}