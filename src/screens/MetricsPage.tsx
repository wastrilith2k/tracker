import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchItems } from "../config/statsigConfig";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebaseConfig';
import { fetchMetrics } from "../config/awsConfig";
import { ResponsiveLine } from "@nivo/line";
import { ChartWrapper, MetricsEventTableWrapper } from "../components/styles";
import { MetricsRange } from "../components/MetricsRange";
import moment from "moment";
import { ToolTip } from "../components/ToolTip";

type Point = {
  x: string;
  y: number;
}
type DataSourceRecord = {
  id: string;
  data: Point[];
}

type Metric = {
  id: string;
  comment: string;
  event: string;
  date: string;
  hour: string;
  name: string;
}

export const MetricsPage = () => {
  const { name, metric } = useParams() as { name: string, metric?: string };

  const [selectedMetric, setSelectedMetric] = useState<string>();

  const [user] = useAuthState(auth);

  const [items, setItems] = useState<string[]>([]);
  const [days, setDays] = useState<number>(7);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceRecord[]>([]);

  // Load in items - eventually this should go in a store
  useEffect(() => {
    const fetchedItems = fetchItems(name);
    setItems(fetchedItems);
  }, []);

  useEffect(() => {
    const metrics = fetchMetrics(name, user?.uid as string).then((response) => {
      // Convert response to dataSource format
      let minDate = moment().subtract(days, 'days').format('YYYY-MM-DD');
      let maxDate = moment().format('YYYY-MM-DD');

      const dateRangeTemplate: string[] = [];
      let currentDate = moment(minDate);
      while (currentDate.isBefore(maxDate)) {
        dateRangeTemplate.push(currentDate.format('YYYY-MM-DD'));
        currentDate.add(1, 'days');
      }
      // Add the last date
      dateRangeTemplate.push(currentDate.format('YYYY-MM-DD'));

      // Create empty data source
      const datasource = items.map((item, idx) => {
        return {
          id: item,
          data: dateRangeTemplate.map((date) => {
            return {
              x: date,
              y: 0
            }
          })
        } as DataSourceRecord
      });

      // Fill in data source
      for (const item of response) {
        const eventIdx = datasource.findIndex((data) => data.id === item.event);
        if (eventIdx > -1) {
          const dateIdx = datasource[eventIdx].data.findIndex((data) => data.x === item.date);
          if (dateIdx > -1) {
            datasource[eventIdx].data[dateIdx].y += 1;
          }
        }
      }

      setDataSource(datasource);
      setMetrics(response.sort((a: Metric, b: Metric) => {
        const aVal = moment(`${a.date} ${a.hour}`, 'YYYY-MM-DD h');
        const bVal = moment(`${b.date} ${b.hour}`, 'YYYY-MM-DD h');
        return aVal > bVal
      }) as Metric[]);
    })
  }, [name, items.length, days, user?.uid]);

  return (
    <div>
      <h1>{name} Metrics</h1>
      <MetricsRange dateRangeSetter={setDays} days={days} />

      <ChartWrapper>
        <ResponsiveLine
          colors={{ scheme: 'set3' }}
          data={dataSource}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickRotation: -45,
            legend: 'Date',
            legendOffset: 40,
            legendPosition: 'middle',
            truncateTickAt: 0,
            format: (value) => {
              const date = moment(value, 'YYYY-MM-DD');
              return date.format('MMM D');
            }

          }}
          axisLeft={{
            tickRotation: 0,
            legend: 'Count',
            legendOffset: -40,
            legendPosition: 'middle',
            truncateTickAt: 0
          }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabel="data.yFormatted"
          pointLabelYOffset={-12}
          enableTouchCrosshair={true}
          useMesh={true}
          tooltip={ToolTip}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              onClick: (e) => {
                console.log('Clicked legend:', e);
              },
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        />
      </ChartWrapper>
      {items.map((item) => {
        return (
          <div key={item}>
            <h2 onClick={() => setSelectedMetric(item)}>{item}</h2>
            {selectedMetric === item ? (<MetricsEventTableWrapper>
              <table>
                {metrics.filter((metric) => metric.event === item).map((metric) => {
                  return (
                    <tr key={metric.id}>
                      <td>{metric.name}</td>
                      <td>{metric.date}</td>
                      <td>{metric.hour}</td>
                      <td>{metric.event}</td>
                      <td>{metric.comment}</td>
                    </tr>
                  )
                })}
              </table>
            </MetricsEventTableWrapper>) : null}
          </div>
        )
      })}
    </div>
  )
}