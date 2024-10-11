import { uploadFile } from '@/services/file/file';
import { ModalForm, ProFormText, ProFormUploadButton } from '@ant-design/pro-components';
import { UploadFile,Upload} from 'antd';
import React, { useEffect, useState } from 'react';
import type { TableListItem } from '../data';


export type UpdateFormProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
};

export type FormValueType = {
  name?: string;
  name_cn?: string;
  image?: string;
} & Partial<TableListItem>;

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  console.log('这里可以看数据吗？', props);

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { onCancel, onSubmit, values } = props;

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

  const handleFinish = async (values: any) => {
    const fileObj = values.upload[0].originFileObj;
    if (fileObj) {
      const formData = new FormData();
      formData.append('file', fileObj);
      try {
        const response = await uploadFile(formData);
        if (response && response.result && response.result.fileUrl) {
          // 上传成功，处理返回的 URL
          console.log('文件上传成功，访问 URL：', response.result.fileUrl);
        }
        const formValues = {
          ...values,
          image: response.result.fileUrl, // 将上传的图片 URL 添加到表单中
        };
        await onSubmit(formValues);
      } catch (error) {
        console.error('文件上传失败：', error);
      }
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
        image: values.image, // 初始化 image
      }}
      onFinish={handleFinish}
    >
      <ProFormText
        label="训练器械中文名称"
        name="name_cn"
        rules={[
          {
            required: true,
            message: '训练器械中文名称为必填项',
          },
        ]}
      />
      <ProFormText
        label="训练器械英文名称"
        name="name"
        // rules={[
        //   {
        //     required: true,
        //     message: '训练器械英文名称为必填项',
        //   },
        // ]}
      />
      <ProFormUploadButton
        title="器械图片"
        label="器械图片"
        name="upload"
        max={1}
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
          defaultFileList:[...fileList],
          maxCount:1,
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
        //     message: '训练器械图片为必填项',
        //   },
        // ]}
      />
    </ModalForm>
  );
};

export default UpdateForm;
