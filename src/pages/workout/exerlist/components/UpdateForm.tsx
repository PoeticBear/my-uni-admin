import { fetchEquipments } from '@/services/equipment/equipments';
import { fetchBodyPart, fetchMuscles } from '@/services/muscle/muscles';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { Col, Row, UploadFile } from 'antd';
import React, { useEffect, useState } from 'react';
import { uploadFile } from '@/services/file/file';

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
  const [bodyParts, setBodyParts] = useState<{ label: string; value: string }[]>([]);
  const [primaryMuscles, setPrimaryMuscles] = useState<{ label: string; value: string }[]>([]);
  const [secondaryMuscles, setSecondaryMuscles] = useState<{ label: string; value: string }[]>([]);
  const [equipments, setEquipments] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const videoElement = document.getElementById('video-player');
    if (videoElement) {
      videoElement.playbackRate = 1.5; // 设置默认播放速率为 1.5 倍
    }
  }, [values]);


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

    // 将 bodyParts 转换为 label 和 value 格式
    if (values.bodyParts && values.bodyParts.length > 0) {
      const formattedBodyParts = values.bodyParts.map((part: any) => ({
        label: part.name_cn,
        value: part._id,
      }));
      setBodyParts(formattedBodyParts);
    } else {
      setBodyParts([]);
    }

    // 将 primaryMuscles 转换为 label 和 value 格式
    if (values.primaryMuscles && values.primaryMuscles.length > 0) {
      const formattedPrimaryMuscles = values.primaryMuscles.map((item: any) => ({
        label: item.name_cn,
        value: item._id,
      }));
      setPrimaryMuscles(formattedPrimaryMuscles);
    } else {
      setPrimaryMuscles([]);
    }

    if (values.secondaryMuscles && values.secondaryMuscles.length > 0) {
      const formattedSecondaryMuscles = values.secondaryMuscles.map((item: any) => ({
        label: item.name_cn,
        value: item._id,
      }));
      setSecondaryMuscles(formattedSecondaryMuscles);
    } else {
      setSecondaryMuscles([]);
    }

    if (values.equipments && values.equipments.length > 0) {
      const formattedEquipments = values.equipments.map((part: any) => ({
        label: part.name_cn,
        value: part._id,
      }));
      setEquipments(formattedEquipments);
    } else {
      setEquipments([]);
    }
  }, [values.videos, updateModalVisible]);

  // 提交
  const handleFinish = async (values: any) => {
    console.log('更新动作数据', values);
    let formValues = {
      ...values,
      bodyParts: values.bodyParts.map((item: any) => item.value),
      primaryMuscles: values.primaryMuscles.map((item: any) => item.value),
      secondaryMuscles: values.secondaryMuscles.map((item: any) => item.value),
      equipments: values.equipments.map((item: any) => item.value),
    };

    // 处理上传文件逻辑
    const uploads = values.upload;
    const uploadItem = uploads ? uploads[0] : null;
    const fileObj = uploadItem ? uploadItem.originFileObj : null;
    if (fileObj) {
      const formData = new FormData();
      formData.append('file', fileObj);
      try {
        const response = await uploadFile(formData);
        if (response && response.data && response.data.fileUrl) {
          console.log('文件上传成功，访问 URL：', response.data.fileUrl);
        }
        formValues = {
          ...formValues,
          image: response.data.gifUrl,
          videos: [response.data.fileUrl],
        };
        await onSubmit(formValues);
      } catch (error) {
        console.error('文件上传失败：', error);
      }
    } else {
      await onSubmit(formValues);
    }
  };

  const getBodyParts = async () => {
    try {
      const response = await fetchBodyPart();
      if (response && response) {
        const options = response.data.map((item: any) => ({
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
      if (response && response.data) {
        const primaryMuscles = response.data.muscles.filter((item: any) => item.parent !== null);
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
      if (response && response.data) {
        const equipments = response.data.equipments.filter((item: any) => item.parent !== null);
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
        bodyParts: bodyParts,
        equipments: equipments,
        primaryMuscles: primaryMuscles,
        secondaryMuscles: secondaryMuscles,
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
            fieldProps={{
              labelInValue: true,
              mode: 'multiple',
              defaultValue: bodyParts,
            }}
          />
        </Col>
        <Col span={8}>
          <ProFormSelect
            label="主要肌肉群"
            name="primaryMuscles"
            placeholder="请选择主要肌肉群"
            request={getPrimaryMuscles}
            fieldProps={{
              labelInValue: true,
              mode: 'multiple',
              defaultValue: primaryMuscles,
            }}
          />
        </Col>
        <Col span={8}>
          <ProFormSelect
            label="次要肌肉群"
            name="secondaryMuscles"
            placeholder="请选择次要肌肉群"
            request={getPrimaryMuscles}
            fieldProps={{
              labelInValue: true,
              mode: 'multiple',
              defaultValue: secondaryMuscles,
            }}
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <ProFormSelect
            label="训练器械"
            name="equipments"
            placeholder="请选择训练器械"
            request={getEquipments}
            fieldProps={{
              labelInValue: true,
              mode: 'multiple',
              defaultValue: equipments,
            }}
          />
        </Col>
        <Col span={8}>
          <ProFormTextArea label="训练要点" name="referenceContent" placeholder="请输入训练要点" />
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
                autoPlay
                loop
              />
            </div>
          </Col>
        </Row>
      )}
    </ModalForm>
  );
};

export default UpdateForm;
