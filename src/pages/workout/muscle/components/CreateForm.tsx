import { uploadFile } from '@/services/file/file';
import { fetchBodyPart } from '@/services/muscle/muscles';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { UploadFile } from 'antd';
import React, { useState } from 'react';

type CreateFormProps = {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<boolean>;
  initialValues?: any;
};

const CreateForm: React.FC<CreateFormProps> = ({ modalVisible, onCancel, onSubmit }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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
    console.log('新增肌群数据', values);

    let formValues = {
      name_cn: values.name_cn,
      parent: values.parent?.value,
      name: values.name,
    };

    const uploads = values.upload;
    const uploadItem = uploads ? uploads[0] : null;
    const fileObj = uploadItem ? uploadItem.originFileObj : null;
    if (fileObj) {
      const formData = new FormData();
      formData.append('file', fileObj);
      try {
        const response = await uploadFile(formData);
        if (response && response.result && response.result.fileUrl) {
          // 上传成功，处理返回的 URL
          console.log('文件上传成功，访问 URL：', response.result.fileUrl);
        }
        formValues = {
          ...formValues,
          image: response.result.fileUrl,
        };
        await onSubmit(formValues);
      } catch (error) {
        console.error('文件上传失败：', error);
      }
    } else {
      formValues = {
        ...formValues,
        image: "",
      };
      await onSubmit(formValues);
    }
  };

  return (
    <ModalForm
      title="新建肌群数据"
      open={modalVisible}
      modalProps={{
        destroyOnClose: true,
        onCancel,
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
        // options={bodyPartOptions}
        request={getBodyParts}
        fieldProps={{
          labelInValue: true, // 确保选择时返回 label 和 value 对象
        }}
        // rules={[
        //   {
        //     required: true,
        //     message: '父级肌群（身体部位）为必填项',
        //   },
        // ]}
      />
      <ProFormText
        label="肌群英文名称"
        name="name"
        // rules={[
        //   {
        //     required: true,
        //     message: '肌群英文名称为必填项',
        //   },
        // ]}
      />
      <ProFormUploadButton
        title="肌群图片"
        label="肌群图片"
        max={1}
        name="upload"
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
          beforeUpload: (file) => {
            console.log('执行了beforeUpload');
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

export default CreateForm;
