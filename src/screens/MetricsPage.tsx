import { useState, useEffect, Fragment, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchItems } from "../config/statsigConfig";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebaseConfig';
import { fetchMetrics } from "../config/awsConfig";
import { ResponsiveLine } from "@nivo/line";
import { BackButton, ChartWrapper, MetricsEventTable, MetricsEventTableContainer, MetricsEventTableHeader, PageContainer, PageHeader, StyledRightButton } from "../components/styles";
import { MetricsRange } from "../components/MetricsRange";
import moment from "moment";
import { ToolTip } from "../components/ToolTip";
import { Icon } from "../components/Icon";

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
  const navigate = useNavigate();
  const { name, metric } = useParams() as { name: string, metric?: string };

  const [selectedMetric, setSelectedMetric] = useState<string>();

  const [user] = useAuthState(auth);

  const [items, setItems] = useState<string[]>([]);
  const [days, setDays] = useState<number>(7);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const dataSource = useRef([] as DataSourceRecord[]);

  // Load in items - eventually this should go in a store
  useEffect(() => {
    const fetchedItems = fetchItems(name);
    setItems(fetchedItems);
  }, []);

  useEffect(() => {
    fetchMetrics(name, user?.uid as string).then((response) => {
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

      dataSource.current = datasource;

      const reponseMetrics = response.filter((metric: Metric) => {
        return !moment(metric.date, 'YYYY-MM-DD').isBefore(minDate);
      });
      reponseMetrics.sort((a: Metric, b: Metric) => {
        const aVal = moment(`${a.date} ${a.hour}`, 'YYYY-MM-DD H').unix();
        const bVal = moment(`${b.date} ${b.hour}`, 'YYYY-MM-DD H').unix();
        return aVal - bVal
      }) as Metric[]

      setMetrics(reponseMetrics);
    })
  }, [name, items.length, days, user?.uid]);

  return (
    <PageContainer>
      <BackButton onClick={() => navigate(`/items/${name}`)}>
        <Icon name="chevron_left" size={48} />
      </BackButton>
      <StyledRightButton onClick={() => navigate('/')}>
        <Icon name="home" size={48} />
      </StyledRightButton>
      <PageHeader>{name} Metrics</PageHeader>
      <MetricsRange dateRangeSetter={setDays} days={days} />
      {dataSource.current.length > 0 ? (
        <ChartWrapper>
          <ResponsiveLine
            colors={{ scheme: 'set3' }}
            data={dataSource.current}
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
        </ChartWrapper>) : null}
      <MetricsEventTableContainer>
        {items.sort().map((item) => {
          const itemMetrics = metrics.filter((metric) => metric.event === item)
          return (
            <Fragment key={item}>
              <MetricsEventTableHeader onClick={() => selectedMetric !== item ? setSelectedMetric(item) : setSelectedMetric('')}>{`${item} (${itemMetrics.length})`}</MetricsEventTableHeader>
              {selectedMetric === item ? (
                <MetricsEventTable>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Date</th>
                      <th>Event</th>
                      <th>Comment</th>
                    </tr>
                  </thead>
                  <tbody>

                    {itemMetrics.map((metric) => {
                      return (
                        <tr key={metric.id}>
                          <td>{metric.name}</td>
                          <td>{moment(`${metric.date} ${metric.hour}`, 'YYYY-MM-DD h').format('MMM D ha')}</td>
                          <td>{metric.event}</td>
                          <td>{metric.comment}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </MetricsEventTable>
              ) : null}
            </Fragment>
          )
        })}
      </MetricsEventTableContainer>
    </PageContainer>
  )
}