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
  image_front?: string;
  image_back?: string;
} & Partial<TableListItem>;

const UpdateForm: React.FC<UpdateFormProps> = (props: any) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [frontFileList, setFrontFileList] = useState<UploadFile[]>([]);
  const [backFileList, setBackFileList] = useState<UploadFile[]>([]);
  const { onCancel, onSubmit, values } = props;
  console.log('传入弹窗：', values);

  useEffect(() => {
    // 初始化所有图片列表
    const initFileList = (url: string) => url ? [{
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: url,
    }] : [];

    setFileList(initFileList(values.image));
    setFrontFileList(initFileList(values.image_front));
    setBackFileList(initFileList(values.image_back));
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
      image: values.thumbnail?.[0]?.url || '',
      image_front: values.thumbnail_front?.[0]?.url || '',
      image_back: values.thumbnail_back?.[0]?.url || '',
    };

    // 处理所有图片上传
    const uploadFields = ['thumbnail', 'thumbnail_front', 'thumbnail_back'];
    const imageFields = ['image', 'image_front', 'image_back'];
    const fileLists = [fileList, frontFileList, backFileList];

    for (let i = 0; i < uploadFields.length; i++) {
      const thumbnail = values[uploadFields[i]];
      const uploadItem = thumbnail ? thumbnail[0] : null;
      const fileObj = uploadItem?.originFileObj;

      if (fileObj) {
        const formData = new FormData();
        formData.append('file', fileObj);
        try {
          const response = await uploadFile(formData);
          console.log('上传文件响应', response);
          if (response && response.data && response.data.fileUrl) {
            formValues[imageFields[i]] = response.data.fileUrl;
          }
        } catch (error) {
          console.error(`${imageFields[i]} 上传失败：`, error);
        }
      } else if (fileLists[i].length === 0) {
        formValues[imageFields[i]] = '';
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
        thumbnail: values.image ? [{
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: values.image,
        }] : [],
        thumbnail_front: values.image_front ? [{
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: values.image_front,
        }] : [],
        thumbnail_back: values.image_back ? [{
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: values.image_back,
        }] : [],
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
            setFileList([]);
          },
        }}
      />

      <ProFormUploadButton
        title="正面图片"
        label="正面图片"
        name="thumbnail_front"
        max={1}
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
          defaultFileList: frontFileList,
          maxCount: 1,
          beforeUpload: (file) => {
            setFrontFileList([file]);
            return false;
          },
          onRemove: () => {
            setFrontFileList([]);
          },
        }}
      />

      <ProFormUploadButton
        title="背面图片"
        label="背面图片"
        name="thumbnail_back"
        max={1}
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
          defaultFileList: backFileList,
          maxCount: 1,
          beforeUpload: (file) => {
            setBackFileList([file]);
            return false;
          },
          onRemove: () => {
            setBackFileList([]);
          },
        }}
      />
    </ModalForm>
  );
};

export default UpdateForm;
