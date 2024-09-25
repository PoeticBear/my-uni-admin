import { create, deleteByIds, fetchMuscles, updateById } from '@/services/muscle/muscles';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, Image, message } from 'antd';
import React, { useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
// import type { UpdateFormValueType } from './components/UpdateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import type { TableListItem, TableListPagination } from './data';

/**
 * 添加肌群数据
 *
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  console.log('handleAdd fields: TableListItem', fields);
  const hide = message.loading('正在添加');
  try {
    await create({
      parent: fields.parent,
      name: fields.name,
      name_cn: fields.name_cn,
      image: fields.image,
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
 * 更新
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType, currentRow?: TableListItem) => {
  const hide = message.loading('正在更新');
  try {
    await updateById(
      { _id: currentRow?._id },
      {
        parent: fields.parent,
        name: fields.name,
        name_cn: fields.name_cn,
        image: fields.image,
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
 * 删除
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
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '父级肌群（身体部位）',
      dataIndex: 'parent',
      valueType: 'text',
      search: false,
      render: (_, record: any) => {
        return record.parent ? record.parent.name_cn : '-'; // 显示父级肌群的名称，如果为空则显示“无父级”
      },
    },
    {
      title: '肌群英文名称',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '肌群中文名称',
      dataIndex: 'name_cn',
      valueType: 'text',
    },
    {
      title: '图片',
      dataIndex: 'image',
      valueType: 'text',
      search: false,
      render: (text) => (
        // <img
        //   src={text} // 使用图片地址
        //   alt="器械图片"
        //   style={{ width: 20, height: 20, objectFit: 'cover' }} // 设置图片样式
        // />

        <Image width={20} src={text?.toString()} />
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setCurrentRow(record);
            handleUpdateModalVisible(true);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={async () => {
            await handleRemove([record]);
            actionRef.current?.reloadAndRest?.();
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
        headerTitle="肌群列表"
        actionRef={actionRef}
        rowKey="_id"
        pagination={{
          pageSize: 100,  // 每页显示 100 行
          showSizeChanger: true,  // 允许用户修改每页显示数量
          pageSizeOptions: ['10', '20', '50', '100', '200'],  // 可选的每页显示数量
        }}
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
          const response = await fetchMuscles({
            name: params.name || '', // 过滤条件：器械英文名称
            name_cn: params.name_cn || '', // 过滤条件：器械中文名称
            current: params.current || 1, // 分页参数：当前页码
            pageSize: 100, // 分页参数：每页条数
          });

          // 返回的数据结构必须符合 ProTable 的要求
          return {
            data: response.result.muscles, // API 返回的实际数据
            total: response.total, // API 返回的总条目数
            success: true, // 请求是否成功
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
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
          const imageUrl = value.image;
          console.log('onSubmit value', value);
          const success = await handleAdd({
            ...value,
            parent: value.parent || null,
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
          const success = await handleUpdate(
            {
              ...value,
              parent: value.parent || null,
              image: value.image,
            },
            currentRow,
          );
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
            title="肌群数据详情"
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
    </PageContainer>
  );
};

export default TableList;
