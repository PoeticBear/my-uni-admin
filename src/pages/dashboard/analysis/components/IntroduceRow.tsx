import { InfoCircleOutlined } from '@ant-design/icons';
import { Area, Column } from '@ant-design/plots';
import { Col, Row, Tooltip } from 'antd';
import numeral from 'numeral';
import type { DataItem } from '../data.d';
// import useStyles from '../style.style';
// import Yuan from '../utils/Yuan';
import { ChartCard, Field } from './Charts';
// import Trend from './Trend';


import { countExercises } from '@/services/exercise/exercises';
import { countEquipments } from '@/services/equipment/equipments';
import { countMuscles } from '@/services/muscle/muscles';
import { useEffect, useState } from 'react';


const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};
const IntroduceRow = ({ loading, visitData }: { loading: boolean; visitData: DataItem[] }) => {
  // const { styles } = useStyles();
  const [exerciseSum, setExerciseSum] = useState<number>(0);
  const [equipmentSum, setEquipmentSum] = useState<number>(0);
  const [muscleSum, setMuscleSum] = useState<number>(0);

  useEffect(() => {
    const fetchExerciseSum = async () => {
      const result = await countExercises();
      console.log("动作总数",result);
      setExerciseSum(result.result);
    };

    fetchExerciseSum();

    const fetchEquipmentSum = async () => {
      const result = await countEquipments();
      setEquipmentSum(result.result);
    };

    fetchEquipmentSum();

    const fetchMuscleSum = async () => {
      const result = await countMuscles();
      setMuscleSum(result.result);
    };

    fetchMuscleSum();
  }, []);



  return (
    <Row gutter={24}>
      {/* <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="总销售额"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => <Yuan>126560</Yuan>}
          footer={<Field label="日销售额" value={`￥${numeral(12423).format('0,0')}`} />}
          contentHeight={46}
        >
          <Trend
            flag="up"
            style={{
              marginRight: 16,
            }}
          >
            周同比
            <span className={styles.trendText}>12%</span>
          </Trend>
          <Trend flag="down">
            日同比
            <span className={styles.trendText}>11%</span>
          </Trend>
        </ChartCard>
      </Col> */}

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="动作数量"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={numeral(exerciseSum).format('0,0')}
          footer={<Field label="概念：" value="系统中已录入的动作数量" />}
          contentHeight={46}
        >
          <Area
            xField="x"
            yField="y"
            shapeField="smooth"
            height={46}
            axis={false}
            style={{
              fill: 'linear-gradient(-90deg, white 0%, #975FE4 100%)',
              fillOpacity: 0.6,
              width: '100%',
            }}
            padding={-20}
            data={visitData}
          />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="训练器械"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={numeral(equipmentSum).format('0,0')}
          footer={<Field label="概念：" value="系统中已录入的器械数量" />}
          contentHeight={46}
        >
          <Column
            xField="x"
            yField="y"
            padding={-20}
            axis={false}
            height={46}
            data={visitData}
            scale={{ x: { paddingInner: 0.4 } }}
          />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
          bordered={false}
          title="肌群数量"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={numeral(muscleSum).format('0,0')}
          footer={<Field label="概念：" value="系统中已录入的肌群数量" />}
          // footer={
          //   <div
          //     style={{
          //       whiteSpace: 'nowrap',
          //       overflow: 'hidden',
          //     }}
          //   >
          //     <Trend
          //       flag="up"
          //       style={{
          //         marginRight: 16,
          //       }}
          //     >
          //       周同比
          //       <span className={styles.trendText}>12%</span>
          //     </Trend>
          //     <Trend flag="down">
          //       日同比
          //       <span className={styles.trendText}>11%</span>
          //     </Trend>
          //   </div>
          // }
          contentHeight={46}
        >
          <Column
            xField="x"
            yField="y"
            padding={-20}
            axis={false}
            height={46}
            data={visitData}
            scale={{ x: { paddingInner: 0.4 } }}
          />
          {/* <Progress percent={78} strokeColor={{ from: '#108ee9', to: '#87d068' }} status="active" /> */}
        </ChartCard>
      </Col>
    </Row>
  );
};
export default IntroduceRow;
