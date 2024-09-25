import { uploadFile } from '@/services/file/file';
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

export type UpdateFormProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
};

export type FormValueType = {
  parent?: string;
  name?: string;
  name_cn?: string;
  image?: string;
} & Partial<TableListItem>;

// export type UpdateFormValueType = {
//   parent?: string | null
//   name?: string;
//   name_cn?: string;
//   image?: string;
// }

const UpdateForm: React.FC<UpdateFormProps> = (props: any) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { onCancel, onSubmit, values } = props;
  console.log('初始化更新数据弹窗，values是啥', values);
  // 根据 props.values.image 初始化 fileList
  useEffect(() => {
    if (values.image) {
      setFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: values.image,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [values.image, props.updateModalVisible]);

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

  const handleFinish = async (formValues: any) => {
    console.log('提交更新，formValues是个啥', formValues);

    const fileObj = formValues.upload ? formValues.upload[0]?.originFileObj : null;
    if (fileObj) {
      const formData = new FormData();
      formData.append('file', fileObj);
      try {
        const response = await uploadFile(formData);
        if (response && response.result && response.result.fileUrl) {
          // 上传成功，处理返回的 URL
          console.log('文件上传成功，访问 URL：', response.result.fileUrl);
        }
        const updatedValues = {
          ...formValues,
          image: response.result.fileUrl, // 将上传的图片 URL 添加到表单中
        };
        await onSubmit(updatedValues);
      } catch (error) {
        console.error('文件上传失败：', error);
      }
    } else {
      console.log('没有特么的修改图片', formValues);
      const updatedValues = {
        ...formValues,
        parent: formValues.parent.value,
        image: values.image,
      };
      console.log('没有特么的修改图片 updatedValues', updatedValues);
      await onSubmit(updatedValues);
    }
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
        ...values,
        parent: values?.parent
          ? { value: values.parent._id, label: values.parent.name_cn }
          : undefined, // 确保是正确的格式
        image: values.image, // 初始化 image
      }}
      onFinish={handleFinish}
    >
      <ProFormSelect
        label="父级肌群（身体部位）"
        name="parent"
        request={getBodyParts}
        fieldProps={{
          labelInValue: true, // 确保选择时返回 label 和 value 对象
        }}
        rules={[
          {
            required: true,
            message: '父级肌群（身体部位）为必填项',
          },
        ]}
      />
      <ProFormText
        label="肌群英文名称"
        name="name"
        rules={[
          {
            required: true,
            message: '肌群英文名称为必填项',
          },
        ]}
      />
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
      <ProFormUploadButton
        title="肌群图片"
        label="肌群图片"
        name="upload"
        max={1}
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
          defaultFileList: [...fileList],
          maxCount: 1,
          beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
          },
          onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
          },
        }}
        // rules={[
        //   {
        //     required: true,
        //     message: '肌群图片为必填项',
        //   },
        // ]}
      />
    </ModalForm>
  );
};

export default UpdateForm;
