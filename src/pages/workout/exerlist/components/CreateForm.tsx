import { fetchEquipments } from '@/services/equipment/equipments';
import { uploadFile } from '@/services/file/file';
import { fetchBodyPart, fetchMuscles } from '@/services/muscle/muscles';
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
}) => {
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

  const handleFinish = async (values: any) => {
    console.log('新增动作数据', values);
    let formValues = {
      ...values,
      bodyParts: values.bodyParts ? values.bodyParts.map((item: any) => item.value) : [],
      primaryMuscles: values.primaryMuscles
        ? values.primaryMuscles.map((item: any) => item.value)
        : [],
      secondaryMuscles: values.secondaryMuscles
        ? values.secondaryMuscles.map((item: any) => item.value)
        : [],
      equipments: values.equipments ? values.equipments.map((item: any) => item.value) : [],
      image: '',
      videos: [],
    };

    console.log('新增动作数据formValues', formValues);

    // 处理上传文件逻辑
    const uploads = values.upload;
    const uploadItem = uploads ? uploads[0] : null;
    const fileObj = uploadItem ? uploadItem.originFileObj : null;
    if (fileObj) {
      const formData = new FormData();
      formData.append('file', fileObj);
      try {
        const response = await uploadFile(formData);
        if (response && response.result && response.result.fileUrl) {
          console.log('文件上传成功，访问 URL：', response.result.fileUrl);
        }
        formValues = {
          ...values,
          image: response.result.gifUrl,
          videos: [response.result.fileUrl],
        };
        await onSubmit(formValues);
      } catch (error) {
        console.error('文件上传失败：', error);
      }
    } else {
      await onSubmit(formValues);
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
            request={getBodyParts}
            placeholder="请选择身体部位"
            fieldProps={{
              labelInValue: true,
              mode: 'multiple',
            }}
          />
        </Col>
        <Col span={8}>
          <ProFormSelect
            label="主要肌肉群"
            name="primaryMuscles"
            request={getPrimaryMuscles}
            fieldProps={{
              labelInValue: true,
              mode: 'multiple',
            }}
            placeholder="请选择主要肌肉群"
          />
        </Col>
        <Col span={8}>
          <ProFormSelect
            label="次要肌肉群"
            name="secondaryMuscles"
            request={getPrimaryMuscles}
            fieldProps={{
              labelInValue: true,
              mode: 'multiple',
            }}
            placeholder="请选择次要肌肉群"
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <ProFormSelect
            label="训练器械"
            name="equipments"
            request={getEquipments}
            fieldProps={{
              labelInValue: true,
              mode: 'multiple',
            }}
            placeholder="请选择训练器械"
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
