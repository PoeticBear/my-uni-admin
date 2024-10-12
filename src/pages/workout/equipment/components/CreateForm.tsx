import { uploadFile } from '@/services/file/file';
import { ModalForm, ProFormText, ProFormUploadButton } from '@ant-design/pro-components';
import { UploadFile } from 'antd';
import React, { useState } from 'react';

type CreateFormProps = {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<boolean>;
  initialValues?: any;
};

const CreateForm: React.FC<CreateFormProps> = ({
  modalVisible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleFinish = async (values: any) => {
    console.log('values', values);
    await onSubmit(values);
    // const uploads = values.upload;
    // const uploadItem = uploads ? uploads[0] : null;
    // const fileObj = uploadItem ? uploadItem.originFileObj : null;
    // if (fileObj) {
    //   const formData = new FormData();
    //   formData.append('file', fileObj);
    //   try {
    //     const response = await uploadFile(formData);
    //     if (response && response.result && response.result.fileUrl) {
    //       // 上传成功，处理返回的 URL
    //       console.log('文件上传成功，访问 URL：', response.result.fileUrl);
    //     }
    //     const formValues = {
    //       ...values,
    //       image: response.result.fileUrl, // 将上传的图片 URL 添加到表单中
    //     };
    //     await onSubmit(formValues);
    //   } catch (error) {
    //     console.error('文件上传失败：', error);
    //   }
    // } else {
    //   await onSubmit(values);
    // }
  };

  return (
    <ModalForm
      title="新建训练器械"
      open={modalVisible}
      modalProps={{
        destroyOnClose: true,
        onCancel,
      }}
      onFinish={handleFinish}
      initialValues={{
        ...initialValues,
        image: initialValues?.image
          ? [
              {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: initialValues.image,
              },
            ]
          : [],
      }}
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
      />
      {/* <ProFormUploadButton
        title="器械图片"
        label="器械图片"
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
      /> */}
    </ModalForm>
  );
};

export default CreateForm;
