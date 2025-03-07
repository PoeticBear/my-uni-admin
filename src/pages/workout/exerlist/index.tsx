import { create, deleteByIds, fetchExercises, updateById } from '@/services/exercise/exercises';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, Image, message, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
// import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import type { TableListItem, TableListPagination } from './data';

/**
 * 添加训练动作
 *
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await create({
      name: fields.name,
      name_cn: fields.name_cn,
      serial: fields.serial,
      bodyParts: fields.bodyParts,
      primaryMuscles: fields.primaryMuscles,
      secondaryMuscles: fields.secondaryMuscles,
      equipments: fields.equipments,
      referenceContent: fields.referenceContent,
      // commonMistakes: fields.commonMistakes,
      precautions: fields.precautions,
      suitableFor: fields.suitableFor,
      image: fields.image,
      videos: fields.videos,
    });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败，请重试！');
    return false;
  }
};

/**
 * 更新训练动作
 *
 * @param fields
 */
const handleUpdate = async (fields: any, currentRow?: TableListItem) => {
  const hide = message.loading('正在更新');
  try {
    await updateById(
      { id: currentRow?._id },
      {
        name: fields.name,
        name_cn: fields.name_cn,
        serial: fields.serial,
        bodyParts: fields.bodyParts,
        primaryMuscles: fields.primaryMuscles,
        secondaryMuscles: fields.secondaryMuscles,
        equipments: fields.equipments,
        referenceContent: fields.referenceContent,
        // commonMistakes: fields.commonMistakes,
        precautions: fields.precautions,
        suitableFor: fields.suitableFor,
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

/**
 * 删除训练动作
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  const selectedIds = selectedRows.map((row) => row._id);
  try {
    await deleteByIds({
      ids: selectedIds,
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [videoModalVisible, setVideoModalVisible] = useState<boolean>(false); // 控制视频弹窗显示
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null); // 当前播放的视频URL
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  useEffect(() => {
    const videoElement = document.getElementById('video-player');
    if (videoElement) {
      videoElement.playbackRate = 1.5; // 设置默认播放速率为 1.5 倍
    }
  }, [currentVideoUrl]);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '动作中文名称',
      dataIndex: 'name_cn',
      valueType: 'text',
      width: 200,
    },
    {
      title: '中文名唯一',
      dataIndex: 'isUnique',
      valueType: 'text',
      search: false,
      render: (isUnique: boolean) => (isUnique ? '是' : '否'), // 根据布尔值显示是/否
      filters: [
        {
          text: '是',
          value: true,
        },
        {
          text: '否',
          value: false,
        },
      ],
      onFilter: (value, record) => record.isUnique === value, // 根据传入的 value 过滤 isUnique 字段
    },
    {
      title: '动作英文名称',
      dataIndex: 'name',
      valueType: 'text',
      width: 200,
    },
    {
      title: '动作编号',
      dataIndex: 'serial',
      valueType: 'text',
    },
    {
      title: '身体部位',
      dataIndex: 'bodyParts',
      valueType: 'text',
      search: false,
      render: (bodyParts: Array<{ name_cn: string }> = []) => {
        // 使用 map 提取每个对象的 name_cn 字段并通过逗号拼接

        console.log("bodyParts",bodyParts);
        const names = bodyParts.map((part) => part.name_cn).join(', ');
        return names || '未知部位';
      },
    },
    {
      title: '主要肌肉群',
      dataIndex: 'primaryMuscles',
      valueType: 'text',
      search: false,
      render: (primaryMuscles: Array<{ name_cn: string }> = []) => {
        // 使用 map 提取每个对象的 name_cn 字段并通过逗号拼接
        const names = primaryMuscles.map((part) => part.name_cn).join(', ');
        return names || '[未设置]';
      },
    },
    {
      title: '次要肌肉群',
      dataIndex: 'secondaryMuscles',
      valueType: 'text',
      search: false,
      render: (secondaryMuscles: Array<{ name_cn: string }> = []) => {
        // 使用 map 提取每个对象的 name_cn 字段并通过逗号拼接
        const names = secondaryMuscles.map((part) => part.name_cn).join(', ');
        return names || '[未设置]';
      },
    },
    {
      title: '训练器械',
      dataIndex: 'equipments',
      valueType: 'text',
      search: false,
      render: (equipments: Array<{ name_cn: string }> = []) => {
        // 使用 map 提取每个对象的 name_cn 字段并通过逗号拼接
        const names = equipments.map((part) => part.name_cn).join(', ');
        return names || '未知器械';
      },
    },
    {
      title: '图片',
      dataIndex: 'image',
      valueType: 'text',
      search: false,
      render: (text) =>
        text?.toString().startsWith('http') || text?.toString().startsWith('https') ? (
          <Image width={68} src={text?.toString()} />
        ) : (
          <span style={{ color: 'gray' }}>未上传图片</span> // 图片为空时显示提示文本
        ),
    },
    {
      title: '视频',
      dataIndex: 'videos',
      valueType: 'text',
      search: false,
      render: (videos: string[]) => {
        const videoUrl = videos && videos.length > 0 ? videos[0] : null;
        const isValidUrl =
          videoUrl?.toString().startsWith('http') || videoUrl?.toString().startsWith('https');

        // 如果视频有效，点击文本后显示视频弹窗，否则显示提示文本
        return isValidUrl ? (
          <a
            style={{ color: 'blue', cursor: 'pointer' }} // 样式：蓝色文本、指针样式
            onClick={() => {
              setCurrentVideoUrl(videoUrl); // 设置当前视频URL
              setVideoModalVisible(true); // 打开视频弹窗
            }}
          >
            已上传视频，点击查看
          </a>
        ) : (
          <span style={{ color: 'gray' }}>未上传视频</span> // 当视频为空或地址无效时显示提示文本
        );
      },
      // 新增的筛选项
      filters: [
        {
          text: '未上传视频',
          value: 'noVideo',
        },
      ],
      onFilter: (value, record) => {
        if (value === 'noVideo') {
          // 过滤条件：videos 为空或 videos 长度为 0
          return !record.videos || record.videos.length === 0;
        }
        return true;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            console.log('编辑动作', record);
            setCurrentRow(record);
            handleUpdateModalVisible(true);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={async () => {
            Modal.confirm({
              title: '确认删除',
              content: '确定要删除这个训练动作吗？此操作不可恢复。',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                await handleRemove([record]); // 删除操作
                actionRef.current?.reloadAndRest?.(); // 重新加载数据
              },
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="训练动作列表"
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          // 调用 API 接口，传递过滤参数、分页参数
          const response = await fetchExercises({
            name: params.name || '', // 过滤条件：器械英文名称
            name_cn: params.name_cn || '', // 过滤条件：器械中文名称
            serial: params.serial || '',
            current: params.current || 1, // 分页参数：当前页码
            pageSize: params.pageSize || 50, // 分页参数：每页条数
          });

          console.log("动作列表",response);

          // 返回的数据结构必须符合 ProTable 的要求
          return {
            data: response.data.exercises, // API 返回的实际数据
            total: response.data.total, // API 返回的总条目数
            success: true, // 请求是否成功
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        pagination={{
          pageSizeOptions: ['10', '20', '50', '100', '1000'], // 可选的每页显示数量
          defaultPageSize: 50, // 默认的每页显示数量
          showSizeChanger: true, // 是否可以改变每页显示的数量
          showQuickJumper: true, // 是否可以快速跳页
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <CreateForm
        modalVisible={createModalVisible}
        onCancel={() => handleModalVisible(false)}
        onSubmit={async (value) => {
          console.log('onSubmit value', value);
          const imageUrl = value.image;
          const success = await handleAdd({
            ...value,
            image: imageUrl,
          } as TableListItem);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />
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
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        values={currentRow || {}}
      />
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<TableListItem>
            column={2}
            title="训练动作详情"
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?._id,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>

      {/* 视频播放弹窗 */}
      <Modal
        visible={videoModalVisible}
        title="视频播放"
        footer={null}
        onCancel={() => setVideoModalVisible(false)} // 点击关闭时隐藏弹窗
        width={800} // 设置弹窗宽度
      >
        {currentVideoUrl && (
          <video
            id="video-player"
            src={currentVideoUrl}
            style={{ width: '100%', height: 'auto' }} // 视频全屏显示
            controls // 显示控制按钮
            autoPlay // 自动播放
            loop // 循环播放
          />
        )}
      </Modal>
    </PageContainer>
  );
};

export default TableList;
