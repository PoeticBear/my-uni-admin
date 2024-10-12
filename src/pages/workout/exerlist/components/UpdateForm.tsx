import { uploadFile } from '@/services/file/file';
import { fetchBodyPart, fetchMuscles } from '@/services/muscle/muscles';
import { fetchEquipments } from '@/services/equipment/equipments';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { Col, Row, UploadFile } from 'antd';
import React, { useEffect, useState } from 'react';

type UpdateFormProps = {
  updateModalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<boolean>;
  values: Partial<any>;
  bodyPartsOptions: { label: string; value: string }[];
  primaryMusclesOptions: { label: string; value: string }[];
  secondaryMusclesOptions: { label: string; value: string }[];
  equipmentsOptions: { label: string; value: string }[];
};

const UpdateForm: React.FC<UpdateFormProps> = ({
  updateModalVisible,
  onCancel,
  onSubmit,
  values,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    // 如果已有视频，则初始化 fileList
    if (values.videos && values.videos.length > 0) {
      const videoFileList = values.videos.map((videoUrl, index) => ({
        uid: `${index}`,
        name: `video-${index}.mp4`,
        status: 'done',
        url: videoUrl,
      }));
      setFileList(videoFileList);
    } else {
      setFileList([]);
    }
  }, [values.videos, updateModalVisible]);

  const handleFinish = async (formValues: any) => {
    const uploads = formValues.upload;
    const uploadItem = uploads ? uploads[0] : null;
    const fileObj = uploadItem ? uploadItem.originFileObj : null;

    if (fileObj) {
      const formData = new FormData();
      formData.append('file', fileObj);
      try {
        const response = await uploadFile(formData);
        if (response && response.result && response.result.fileUrl) {
          formValues.image = response.result.gifUrl;
          formValues.videos = [response.result.fileUrl]; // 上传成功后将视频 URL 存入表单
        }
      } catch (error) {
        console.error('文件上传失败：', error);
      }
    }

    await onSubmit(formValues);
  };

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

  const getPrimaryMuscles = async () => {
    try {
      const response = await fetchMuscles({
        name: '', // 过滤条件：器械英文名称
        name_cn: '', // 过滤条件：器械中文名称
        current: 1, // 分页参数：当前页码
        pageSize: 100, // 分页参数：每页条数
      });
      console.log('getPrimaryMuscles', response);
      if (response && response.result) {
        const primaryMuscles = response.result.muscles.filter((item: any) => item.parent !== null);

        const options = primaryMuscles.map((item: any) => ({
          label: item.name_cn, // 显示中文名称
          value: item._id, // 对应的数据_id
        }));
        return options;
      }
    } catch (error) {}
  };

  const getEquipments = async () => {
    try {
      const response = await fetchEquipments({
        name: '', // 过滤条件：器械英文名称
        name_cn: '', // 过滤条件：器械中文名称
        current: 1, // 分页参数：当前页码
        pageSize: 100, // 分页参数：每页条数
      });
      console.log('getEquipments', response);
      if (response && response.result) {
        const equipments = response.result.equipments.filter((item: any) => item.parent !== null);
        const options = equipments.map((item: any) => ({
          label: item.name_cn, // 显示中文名称
          value: item._id, // 对应的数据_id
        }));
        return options;
      }
    } catch (error) {}
  };

  return (
    <ModalForm
      title="编辑训练动作"
      open={updateModalVisible}
      modalProps={{
        destroyOnClose: true,
        onCancel,
      }}
      onFinish={handleFinish}
      initialValues={{
        ...values,
        bodyParts: values.bodyParts,
        primaryMuscles: values.primaryMuscles,
        secondaryMuscles: values.secondaryMuscles,
        equipments: values.equipments,
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
            request={getBodyParts}
            placeholder="请选择身体部位"
            fieldProps={
              {
                labelInValue: true,
              }
            }
          />
        </Col>
        <Col span={8}>
          <ProFormSelect
            label="主要肌肉群"
            name="primaryMuscles"
            // options={primaryMusclesOptions}
            placeholder="请选择主要肌肉群"
            request={getPrimaryMuscles}
            fieldProps={
              {
                labelInValue: true,
              }
            }
          />
        </Col>
        <Col span={8}>
          <ProFormSelect
            label="次要肌肉群"
            name="secondaryMuscles"
            // options={secondaryMusclesOptions}
            placeholder="请选择次要肌肉群"
            request={getPrimaryMuscles}
            fieldProps={
              {
                labelInValue: true,
              }
            }
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <ProFormSelect
            label="训练器械"
            name="equipments"
            // options={equipmentsOptions}
            placeholder="请选择训练器械"
            request={getEquipments}
            fieldProps={
              {
                labelInValue: true,
              }
            }
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
              // defaultFileList: fileList,
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
        </Col>
      </Row>

      {fileList.length > 0 && (
        <Row>
          <Col span={24}>
            <div>
              <video
                id="video-player"
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

export default UpdateForm;
