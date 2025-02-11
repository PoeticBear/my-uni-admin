import { fetchBodyPart } from '@/services/muscle/muscles';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { UploadFile } from 'antd';
import React, { useEffect, useState } from 'react';
import type { TableListItem } from '../data';
import { uploadFile } from '@/services/file/file';

export type UpdateFormProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
};

export type FormValueType = {
  name_cn?: string;
  parent?: string;
  name?: string;
  image?: string;
} & Partial<TableListItem>;

const UpdateForm: React.FC<UpdateFormProps> = (props: any) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { onCancel, onSubmit, values } = props;
  console.log('传入弹窗：', values);

  useEffect(() => {
    if (values.image) {
      // 如果 image 是 URL 字符串，构造一个符合要求的 fileList 数组
      setFileList([
        {
          uid: '-1', // 每个文件必须有唯一的 uid
          name: 'image.png', // 文件名可以根据需要设定
          status: 'done', // 表示文件上传已完成
          url: values.image, // 现有图片的 URL
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [values, props.updateModalVisible]);

  /**
   * 获取所有身体部位
   * @returns
   */
  const getBodyParts = async () => {
    try {
      const response = await fetchBodyPart();
      if (response && response.result) {
        const options = response.result.map((item: any) => ({
          label: item.name_cn, // 显示中文名称
          value: item._id, // 对应的数据_id
        }));
        return options;
      }
    } catch (error) {}
  };

  const handleFinish = async (values: any) => {
    console.log('handleFinish:', values);

    let formValues = {
      name_cn: values.name_cn,
      parent: values.parent ? values.parent.value : undefined,
      name: values.name,
      image: values.thumbnail[0]?.url || '',  // 初始默认值为上传图片的 URL，如果没有上传，设置为空字符串
    };

    // 检查是否有新的文件上传
    const thumbnail = values.thumbnail;
    const uploadItem = thumbnail ? thumbnail[0] : null;
    const fileObj = uploadItem ? uploadItem.originFileObj : null;

    console.log('fileObj', fileObj);
    // 如果有新上传的文件
    if (fileObj) {
      const formData = new FormData();
      formData.append('file', fileObj);
      try {
        const response = await uploadFile(formData);
        console.log('上传文件响应', response);
        if (response && response.data && response.data.fileUrl) {
          // 上传成功，处理返回的 URL
          console.log('文件上传成功，访问 URL：', response.data.fileUrl);
          formValues.image = response.data.fileUrl;  // 更新图片 URL
        }
      } catch (error) {
        console.error('文件上传失败：', error);
      }
    } else {
      // 如果没有新的文件上传并且图片已被删除
      if (fileList.length === 0) {
        formValues.image = '';  // 清空图片字段
      }
    }

    await onSubmit(formValues);
  };


  return (
    <ModalForm
      title="编辑训练器械"
      open={props.updateModalVisible}
      modalProps={{
        destroyOnClose: true,
        onCancel,
      }}
      initialValues={{
        name_cn: values.name_cn,
        parent: values?.parent
          ? { value: values.parent._id, label: values.parent.name_cn }
          : undefined,
        name: values.name || '',
        thumbnail: values.image
          ? [
              {
                uid: '-1', // 必须的唯一 uid
                name: 'image.png', // 默认图片名称
                status: 'done', // 状态设置为完成
                url: values.image, // 当前图片的 URL
              },
            ]
          : [],
      }}
      onFinish={handleFinish}
    >
      <ProFormText
        label="肌群中文名称"
        name="name_cn"
        rules={[
          {
            required: true,
            message: '肌群中文名称为必填项',
          },
        ]}
      />
      <ProFormSelect
        label="父级肌群（身体部位）"
        name="parent"
        request={getBodyParts}
        fieldProps={{
          labelInValue: true, // 确保选择时返回 label 和 value 对象
        }}
      />
      <ProFormText label="肌群英文名称" name="name" />

      <ProFormUploadButton
        title="肌群图片"
        label="肌群图片"
        name="thumbnail"
        max={1}
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
          defaultFileList: fileList,
          maxCount: 1,
          beforeUpload: (file) => {
            setFileList([file]);
            return false;
          },
          onRemove: () => {
            setFileList([]);  // 更新 fileList 状态
          },
        }}
      />
    </ModalForm>
  );
};

export default UpdateForm;
