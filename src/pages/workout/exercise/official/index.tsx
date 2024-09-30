import { fetchEquipments as fetchEquipmentService } from '@/services/equipment/equipments';
import { fetchExercises as fetchExerciseService, updateById } from '@/services/exercise/exercises';
import {
  fetchBodyPart as fetchBodyPartService,
  fetchChildren as fetchChildrenService,
} from '@/services/muscle/muscles';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Form, List, message, Typography } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data';
import useStyles from './style.style';

dayjs.extend(relativeTime);

const FormItem = Form.Item;
const { Paragraph } = Typography;
// const getKey = (id: string, index: number) => `${id}-${index}`;

interface FetchEquipmentParams {
  name: string;
  name_cn: string;
  current: number;
  pageSize: number;
}

interface FetchExerciseParams {
  name: string;
  name_cn: string;
  bodyPart: string;
  primaryMuscle: string;
  equipment: string;
  difficulty: string;
  current: number;
  pageSize: number;
}

/**
 * 更新训练器械
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType, currentRow?: TableListItem) => {
  const hide = message.loading('正在更新');
  try {
    await updateById(
      { id: currentRow?._id },
      {
        name: fields.name,
        name_cn: fields.name_cn,
        image: fields.image,
        videos: fields.videos,
      },
    );
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败，请重试！');
    return false;
  }
};

const OfficialExercise: FC = () => {
  const { styles } = useStyles();
  /** 更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<TableListItem>();

  const [bodyPartOptions, setBodyPartOptions] = useState<any[]>([]);
  const [primaryMuscleOptions, setPrimaryMuscleOptions] = useState<any[]>([]);
  const [equipmentOptions, setEquipmentOptions] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [filters, setFilters] = useState<FetchExerciseParams>({
    name: '',
    name_cn: '',
    bodyPart: '',
    primaryMuscle: '',
    equipment: '',
    difficulty: '',
    current: 1,
    pageSize: 9999,
  });

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
        const params: FetchEquipmentParams = {
          name: '',
          name_cn: '',
          current: 1,
          pageSize: 9999,
        };

        const response = await fetchEquipmentService(params);
        console.log('设备', response);
        if (response && response.result) {
          setEquipmentOptions(response.result.equipments);
        }
      } catch (error) {}
    };
    fetchBodyPart();
    fetchEquipment();
  }, []);

  useEffect(() => {
    console.log('filters', filters);
    const fetchExercise = async () => {
      try {
        const response = await fetchExerciseService(filters);
        console.log('动作', response);
        if (response && response.result) {
          setExercises(response.result.exercises);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchExercise();
  }, [filters]); // 当 filters 改变时，重新调用获取动作的接口

  // 当选择身体部位时更新肌肉群体
  const handleBodyPartChange = async (value: string | number | undefined) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      bodyPart: value as string, // 更新 bodyPart
    }));

    console.log('选中的身体部位是', value);
    if (!value) {
      setPrimaryMuscleOptions([]);
      return;
    }
    const res = await fetchChildrenService({ id: value as string });
    console.log('肌肉群体数据', res.result);
    setPrimaryMuscleOptions(res.result);
  };

  const handlePrimaryMuscleChange = async (value: string | number | undefined) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      primaryMuscle: value as string, // 更新 primaryMuscle
    }));
  };

  const handleEquipmentChange = (value: string | number | undefined) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      equipment: value as string, // 更新 equipment
    }));
  };

  const handleDifficultyChange = (value: string | number | undefined) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      difficulty: value as string, // 更新 difficulty
    }));
  };

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
            cover={
              <img alt={item.name_cn} src={item.image || 'https://via.placeholder.com/320x180'} />
            }
            onClick={() => {
              setCurrentRow(item); // 设置当前点击的卡片数据
              handleUpdateModalVisible(true); // 打开编辑窗口
            }}
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
    <PageContainer>
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
                <TagSelect onChange={handleBodyPartChange}>
                  {bodyPartOptions.map((bodyPart) => (
                    <TagSelect.Option value={bodyPart._id} key={bodyPart._id}>
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
                <TagSelect onChange={handlePrimaryMuscleChange}>
                  {primaryMuscleOptions.length > 0 ? (
                    primaryMuscleOptions.map((muscle) => (
                      <TagSelect.Option value={muscle._id} key={muscle._id}>
                        {muscle.name_cn}
                      </TagSelect.Option>
                    ))
                  ) : (
                    <TagSelect.Option value="" key="">
                      暂无
                    </TagSelect.Option>
                  )}
                </TagSelect>
              </FormItem>
            </StandardFormRow>

            {/* 筛选条件 - 训练器械 */}
            <StandardFormRow title="训练器械" block style={{ paddingBottom: 8 }}>
              <FormItem name="equipment">
                <TagSelect onChange={handleEquipmentChange}>
                  {equipmentOptions.map((equipment) => (
                    <TagSelect.Option value={equipment._id} key={equipment._id}>
                      {equipment.name_cn}
                    </TagSelect.Option>
                  ))}
                </TagSelect>
              </FormItem>
            </StandardFormRow>

            {/* 筛选条件 - 训练难度 */}
            <StandardFormRow title="训练难度" block style={{ paddingBottom: 8 }}>
              <FormItem name="difficulty">
                <TagSelect onChange={handleDifficultyChange}>
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

      <UpdateForm
        updateModalVisible={updateModalVisible}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        onSubmit={async (value) => {
          const success = await handleUpdate(value, currentRow);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            // if (actionRef.current) {
            //   actionRef.current.reload();
            // }
          }
        }}
        values={currentRow || {}}
      />
    </PageContainer>
  );
};

export default OfficialExercise;
