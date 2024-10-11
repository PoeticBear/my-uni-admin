import { uploadFile } from '@/services/file/file';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { Col, Row, UploadFile } from 'antd';
import React, { useState } from 'react';

type CreateFormProps = {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<boolean>;
  initialValues?: any;
  bodyPartsOptions: { label: string; value: string }[]; // 传入的身体部位选项
  primaryMusclesOptions: { label: string; value: string }[];
  secondaryMusclesOptions: { label: string; value: string }[];
  equipmentsOptions: { label: string; value: string }[]; // 传入的训练器械选项
};

const CreateForm: React.FC<CreateFormProps> = ({
  modalVisible,
  onCancel,
  onSubmit,
  initialValues,
  bodyPartsOptions,
  primaryMusclesOptions,
  secondaryMusclesOptions,
  equipmentsOptions,
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
      }}
    >
      <Row gutter={24}>
        <Col span={8}>
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
        </Col>
        <Col span={8}>
          <ProFormText label="训练动作英文名称" name="name" />
        </Col>
        <Col span={8}>
          <ProFormText label="动作编号" name="serial" />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <ProFormSelect
            label="身体部位"
            name="bodyParts"
            options={bodyPartsOptions}
            placeholder="请选择身体部位"
          />
        </Col>
        <Col span={8}>
          <ProFormSelect
            label="主要肌肉群"
            name="primaryMuscles"
            options={primaryMusclesOptions}
            placeholder="请选择主要肌肉群"
          />
        </Col>
        <Col span={8}>
          <ProFormSelect
            label="次要肌肉群"
            name="secondaryMuscles"
            options={secondaryMusclesOptions}
            placeholder="请选择次要肌肉群"
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <ProFormSelect
            label="训练器械"
            name="equipments"
            options={equipmentsOptions}
            placeholder="请选择训练器械"
          />
        </Col>
        <Col span={8}>
          <ProFormTextArea label="常见错误" name="commonMistakes" placeholder="请输入常见错误" />
        </Col>
        <Col span={8}>
          <ProFormTextArea label="注意事项" name="precautions" placeholder="请输入注意事项" />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <ProFormTextArea label="适合人群" name="suitableFor" placeholder="请输入适合人群" />
        </Col>
        <Col span={12}>
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
                return false;
              },
              onRemove: (file) => {
                const index = fileList.indexOf(file);
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);
                setFileList(newFileList);
              },
            }}
          />
        </Col>
      </Row>

      {fileList.length > 0 && (
        <Row>
          <Col span={24}>
            <div>
              <video
                src={fileList[0].url}
                controls
                style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
              />
            </div>
          </Col>
        </Row>
      )}
    </ModalForm>
  );
};

export default CreateForm;
