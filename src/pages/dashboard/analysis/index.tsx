import { GridContent } from '@ant-design/pro-components';
// import { useRequest } from '@umijs/max';
import { Card, Col, Progress, Row } from 'antd';
import type { FC } from 'react';
import { Suspense, useEffect, useState } from 'react';
import IntroduceRow from './components/IntroduceRow';
import PageLoading from './components/PageLoading';
import type { AnalysisData } from './data.d';
// import { fakeChartData } from './service';

import { countImagesRatio } from '@/services/exercise/exercises';




type AnalysisProps = {
  dashboardAndanalysis: AnalysisData;
  loading: boolean;
};
const Analysis: FC<AnalysisProps> = () => {

  // totalExercises: 0,
  //       exercisesWithImages: 0,
  //       ratio: 0,

  const [totalExercises, setTotalExercises] = useState(0);
  const [exercisesWithImages, setExercisesWithImages] = useState(0);
  const [ratio, setRatio] = useState(0);


  useEffect(() => {
    const fetchImagesRatio = async () => {
      const res = await countImagesRatio();
      console.log("已上传的图片占比",res);
      const result = res.result;
      // setTotalExercises(result.totalExercises);
      // setExercisesWithImages(result.exercisesWithImages);
      // setRatio(result.ratio.toFixed(2) * 100);
    }

    fetchImagesRatio();
  }, [])

  return (
    <GridContent>
      <>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow loading={false} visitData={[]} />
        </Suspense>

        <Row gutter={24}>
          <Col
            xl={12}
            lg={24}
            sm={24}
            xs={24}
            style={{
              marginBottom: 24,
            }}
          >
            <Card title="已经上传图片/视频的动作占比" bordered={false}>
              <Row
                style={{
                  padding: '16px 0',
                }}
              >
                <Col span={8}>
                  <Progress type="dashboard" percent={
                    ratio
                  } format={() => exercisesWithImages + '/' + totalExercises}/>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </>
    </GridContent>
  );
};
export default Analysis;
