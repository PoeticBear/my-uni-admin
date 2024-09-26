import { fetchEquipments as fetchEquipmentService } from '@/services/equipment/equipments';
import { fetchExercises as fetchExerciseService } from '@/services/exercise/exercises';
import { fetchBodyPart as fetchBodyPartService } from '@/services/muscle/muscles';
import { Card, Form, List, Typography } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import useStyles from './style.style';

dayjs.extend(relativeTime);

const FormItem = Form.Item;
const { Paragraph } = Typography;
// const getKey = (id: string, index: number) => `${id}-${index}`;

const OfficialExercise: FC = () => {
  const { styles } = useStyles();

  // 定义测试数据
  // const testData = [
  //   {
  //     id: '1',
  //     title: '项目一',
  //     cover: 'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png',
  //     subDescription: '这是项目一的描述。',
  //     updatedAt: new Date(),
  //     members: [
  //       {
  //         avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
  //         name: '张三',
  //       },
  //       {
  //         avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
  //         name: '李四',
  //       },
  //     ],
  //   },
  //   {
  //     id: '2',
  //     title: '项目二',
  //     cover: 'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png',
  //     subDescription: '这是项目二的描述。',
  //     updatedAt: new Date(),
  //     members: [
  //       {
  //         avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
  //         name: '张三',
  //       },
  //       {
  //         avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
  //         name: '李四',
  //       },
  //     ],
  //   },
  // ];

  // 定义身体部位与肌肉群体的映射关系
  // const muscleGroupMap = {
  //   upperBody: ['三角肌', '肱二头肌', '肱三头肌'],
  //   lowerBody: ['股四头肌', '腓肠肌', '臀大肌'],
  //   back: ['斜方肌', '中背', '下背'],
  //   core: ['腹肌', '腹外斜肌'],
  // };

  // useState 管理身体部位和肌肉群体
  // const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  // const [availableMuscleGroups, setAvailableMuscleGroups] = useState<string[]>([]);

  const [bodyPartOptions, setBodyPartOptions] = useState<any[]>([]);
  const [equipmentOptions, setEquipmentOptions] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  useEffect(() => {
    const fetchBodyPart = async () => {
      try {
        const response = await fetchBodyPartService();
        console.log('身体部位', response);
        if (response && response.result) {
          setBodyPartOptions(response.result);
        }
      } catch (error) {}
    };

    const fetchEquipment = async () => {
      try {
        const response = await fetchEquipmentService({
          name: '',
          name_cn: '',
          current: 1,
          pageSize: 9999,
        });
        console.log('设备', response);
        if (response && response.result) {
          setEquipmentOptions(response.result.equipments);
        }
      } catch (error) {}
    };

    const fetchExercise = async () => {
      try {
        const response = await fetchExerciseService({
          name: '',
          name_cn: '',
          bodyPart: '',
          primaryMuscle: '',
          equipment: '',
          difficulty: '',
          current: 1,
          pageSize: 9999,
        });
        console.log('动作', response);
        if (response && response.result) {
          setExercises(response.result.exercises);
        }
      } catch (error) {}
    };

    fetchExercise();
    fetchBodyPart();
    fetchEquipment();
  }, []);

  // // 当选择身体部位时更新肌肉群体
  // const handleBodyPartChange = (value: string) => {
  //   setSelectedBodyPart(value);
  //   setAvailableMuscleGroups(muscleGroupMap[value] || []);
  // };

  // 使用从服务端获取的数据渲染卡片
  const cardList = exercises && (
    <List
      rowKey="_id"
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 4,
        xxl: 4,
      }}
      dataSource={exercises}
      renderItem={(item) => (
        <List.Item>
          <Card
            className={styles.card}
            hoverable
            cover={<img alt={item.name_cn} src={item.image || 'https://via.placeholder.com/320x180'} />}
          >
            <Card.Meta
              title={<a>{item.name_cn}</a>}
              description={
                <Paragraph
                  ellipsis={{
                    rows: 2,
                  }}
                >
                  {item.description || '暂无描述'}
                </Paragraph>
              }
            />
            <div className={styles.cardItemContent}>
              <span>{dayjs(item.updatedAt).fromNow()}</span>
              {/* <div className={styles.avatarList}>
                <AvatarList size="small">
                  {item.primaryMuscles.map((muscle, i) => (
                    <AvatarList.Item key={getKey(muscle, i)} tips={muscle} />
                  ))}
                </AvatarList>
              </div> */}
            </div>
          </Card>
        </List.Item>
      )}
    />
  );

  return (
    <div className={styles.coverCardList}>
      <Card bordered={false}>
        <Form layout="inline">
          {/* 筛选条件 - 身体部位 */}
          <StandardFormRow
            title="身体部位"
            block
            style={{
              paddingBottom: 8,
            }}
          >
            <FormItem name="bodyPart">
              <TagSelect>
                {/* <TagSelect.Option value="upperBody" key="upperBody">
                  上肢
                </TagSelect.Option>
                <TagSelect.Option value="lowerBody" key="lowerBody">
                  下肢
                </TagSelect.Option>
                <TagSelect.Option value="back" key="back">
                  背部
                </TagSelect.Option>
                <TagSelect.Option value="core" key="core">
                  核心
                </TagSelect.Option> */}
                {bodyPartOptions.map((bodyPart) => (
                  <TagSelect.Option value={bodyPart.name} key={bodyPart._id}>
                    {bodyPart.name_cn}
                  </TagSelect.Option>
                ))}
              </TagSelect>
            </FormItem>
          </StandardFormRow>

          {/* 筛选条件 - 肌肉群体（根据身体部位动态更新） */}
          <StandardFormRow
            title="肌肉群体"
            block
            style={{
              paddingBottom: 8,
            }}
          >
            <FormItem name="muscleGroup">
              {/* <TagSelect>
                {availableMuscleGroups.length > 0 ? (
                  availableMuscleGroups.map((muscle) => (
                    <TagSelect.Option value={muscle} key={muscle}>
                      {muscle}
                    </TagSelect.Option>
                  ))
                ) : (
                  <TagSelect.Option disabled key="no-selection">
                    请选择身体部位
                  </TagSelect.Option>
                )}
              </TagSelect> */}
            </FormItem>
          </StandardFormRow>

          {/* 筛选条件 - 训练器械 */}
          <StandardFormRow title="训练器械" block style={{ paddingBottom: 8 }}>
            <FormItem name="equipment">
              <TagSelect>
                {equipmentOptions.map((equipment) => (
                  <TagSelect.Option value={equipment.name} key={equipment._id}>
                    {equipment.name_cn}
                  </TagSelect.Option>
                ))}
              </TagSelect>
            </FormItem>
          </StandardFormRow>

          {/* 筛选条件 - 训练难度 */}
          <StandardFormRow title="训练难度" block style={{ paddingBottom: 8 }}>
            <FormItem name="difficulty">
              <TagSelect>
                <TagSelect.Option value="easy" key="easy">
                  简单
                </TagSelect.Option>
                <TagSelect.Option value="medium" key="medium">
                  中等
                </TagSelect.Option>
                <TagSelect.Option value="hard" key="hard">
                  困难
                </TagSelect.Option>
              </TagSelect>
            </FormItem>
          </StandardFormRow>
        </Form>
      </Card>
      <div className={styles.cardList}>{cardList}</div>
    </div>
  );
};

export default OfficialExercise;
