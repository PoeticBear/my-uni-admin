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
        const formValues = {
          ...values,
          image: response.result.gifUrl,
          videos: [response.result.fileUrl], // 上传成功后将新视频的 URL 存入表单
        };
        await onSubmit(formValues);
      } catch (error) {
        console.error('文件上传失败：', error);
      }
    } else {
      await onSubmit(values);
    }
  };

  return (
    <ModalForm
      title="新建训练动作"
      open={modalVisible}
      modalProps={{
        destroyOnClose: true,
        onCancel,
      }}
      onFinish={handleFinish}
      initialValues={{
        ...initialValues,
        // image: initialValues?.image
        //   ? [
        //       {
        //         uid: '-1',
        //         name: 'image.png',
        //         status: 'done',
        //         url: initialValues.image,
        //       },
        //     ]
        //   : [],
        // videos: initialValues?.videos
        //   ? [
        //       {
        //         uid: '-1',
        //         name: 'video.mp4',
        //         status: 'done',
        //         url: initialValues.videos[0],
        //       },
        //     ]
        //   : [],
      }}
    >
      <ProFormText
        label="训练动作中文名称"
        name="name_cn"
        rules={[
          {
            required: true,
            message: '训练动作中文名称为必填项',
          },
        ]}
      />
      <ProFormText label="训练动作英文名称" name="name" />

      {/* <ProFormUploadButton
        title="动作图片"
        label="动作图片"
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

      {/* 视频预览与上传 */}
      <ProFormUploadButton
        title="训练动作视频"
        label="训练动作视频"
        name="upload"
        max={1}
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
          defaultFileList: fileList,
          maxCount: 1,
          beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false; // 防止自动上传
          },
          onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
          },
        }}
      />

      {/* 显示视频预览 */}
      {fileList.length > 0 && (
        <div>
          <video
            src={fileList[0].url} // 使用第一个视频的 URL
            controls
            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
          />
        </div>
      )}
    </ModalForm>
  );
};

export default CreateForm;
