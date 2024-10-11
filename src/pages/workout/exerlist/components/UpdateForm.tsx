import { uploadFile } from '@/services/file/file';
import { ModalForm, ProFormText, ProFormUploadButton } from '@ant-design/pro-components';
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
  name?: string;
  name_cn?: string;
  image?: string;
} & Partial<TableListItem>;

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { onCancel, onSubmit, values } = props;

  useEffect(() => {
    // 如果有视频，则初始化 fileList
    if (values.videos && values.videos.length > 0) {
      const videoFileList = values.videos.map((videoUrl, index) => ({
        uid: `${index}`, // 唯一标识符
        name: `video-${index}.mp4`, // 假设视频是 mp4 格式
        status: 'done',
        url: videoUrl,
      }));
      setFileList(videoFileList);
    } else {
      setFileList([]);
    }
  }, [values.videos, props.updateModalVisible]);

  useEffect(() => {
    const videoElement = document.getElementById('video-player');
    if (videoElement) {
      videoElement.playbackRate = 1.5; // 设置默认播放速率为 1.5 倍
    }
  }, [fileList]);

  const handleFinish = async (values: any) => {
    const uploads = values.upload;
    const uploadItem = uploads ? uploads[0] : null;
    const fileObj = uploadItem ? uploadItem.originFileObj : null;
    if (fileObj) {
      const formData = new FormData();
      formData.append('file', fileObj);
      formData.append('fileName',values.name)
      try {
        const response = await uploadFile(formData);

        console.log('上传文件信息：', response)

        if (response && response.result && response.result.fileUrl) {
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
      title="编辑训练动作"
      open={props.updateModalVisible}
      modalProps={{
        destroyOnClose: true,
        onCancel,
      }}
      initialValues={{
        ...values,
        name: values.name,
        name_cn: values.name_cn,
        videos: values.videos,
      }}
      onFinish={handleFinish}
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
          id="video-player"
            src={fileList[0].url} // 使用第一个视频的 URL
            controls
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            autoPlay
            loop
          />
        </div>
      )}
    </ModalForm>
  );
};

export default UpdateForm;
